var cookieNotice = {
  init: function () {
    var openPopup = 'cookie--action-settings';
    var acceptAllBtn = 'cookie--action-accept';
    var activateAllCookiesBtn = 'cookie--action-all-cookies';
    var cancelBtn = 'cookie--action-cancel';
    var cancelXBtn = '#fancybox-lock .fancybox-close';
    var saveBtn = 'cookie--action-save';
    var activateGeolocation = 'action--activate-geolocation-cookie';

    // init Switch status
    switchStatus.init();

    // Check activate/deactivate all cookies
    cookieNotice.checkActivateAllCookies();

    // Page cookies for user
    cookieNotice.pageCookies();

    // Activate toggle
    cookieNotice.switchToggle();

    // Open modal/popup cookie settings
    $(document).on('click', '.' + openPopup, function () {
      cookieNotice.openPopup();
    });

    // Close modal/popup cookie settings
    $(document).on('click', '.' + cancelBtn + ', ' + cancelXBtn, function () {
      cookieNotice.closePopup();
    });

    // Save modal/popup cookie settings
    $(document).on('click', '.' + saveBtn, function (e) {
      e.preventDefault();
      cookieNotice.saveCookies(null, e);
    });

    // Activate all cookies from modal/popup settings
    $(document).on('click', '.' + activateAllCookiesBtn, function (e) {
      e.preventDefault();
      cookieNotice.activateAllCookies(e);
    });

    // Accept all cookies
    $(document).on('click', '.' + acceptAllBtn, function (e) {
      e.preventDefault();
      cookieNotice.acceptAllCookies(e);
    });

    // Activate geolocation cookie
    $(document).on('click', '.' + activateGeolocation, function (e) {
      e.preventDefault();
      cookieNotice.activateGeolocationCookie(e);
    });
  },
  openPopup: function () {
    $.fancybox('#cookie-notice .cookie--popup-settings', {
      wrapCSS: 'cookie--wrap-settings',
      width: '100%',
      maxWidth: 600,
      fitToView: false,
      overlay: {
        closeClick: false,
      },
      beforeLoad: function () {
        cookieNotice.checkCookies();
        cookieNotice.stickyActionFoot();
        $(window).bind('mousewheel DOMMouseScroll MozMousePixelScroll wheel scroll onscroll', function () {
          cookieNotice.stickyActionFoot();
        });
      },
      afterShow: function () {
        cookieNotice.stickyActionFoot();
      },
      beforeClose: function () {
        // Remove sticky from foot action
        $('.cookie-notice--foot--sticky').remove();
      },
    });
  },
  stickyActionFoot: function () {
    var self = $(this);
    var classFootSticky = 'cookie-notice--foot--sticky';
    var classFoot = 'cookie-notice--foot';
    self.$popupSettings = $('.cookie--popup-settings');

    if ($(window).height() < self.$popupSettings.height()) {
      if (self.$popupSettings.find('.foot').offset().top > $(window).height()) {
        // Sticky action
        if (!$('.' + classFoot).hasClass(classFootSticky)) {
          self.$popupSettings.find('.foot')
            .clone()
            .addClass(classFoot)
            .addClass(classFootSticky)
            .removeClass('foot')
            .insertAfter('#fancybox-lock')
            .css('visibility', 'visible');
          self.$popupSettings.find('.foot').css('visibility', 'hidden');
        }
      } else {
        // No sticky action
        if ($('.' + classFoot).hasClass(classFootSticky)) {
          $('.' + classFoot).remove();
          self.$popupSettings.find('.foot').css('visibility', 'visible');
        }
      }
    }
  },
  closePopup: function () {
    var saveBtn = 'cookie--action-save';

    $('.switch-status').removeClass('checked-status').find('.checked').removeClass('checked').find('input').prop('checked', false);
    $('.' + saveBtn).addClass('disabled');
    $.fancybox.close();
  },
  switchToggle: function () {
    $toggle = $('#cookie-notice .ui-jquery-switch-toggle');
    $toggle.checkToggler({
      labelOn: 'Active',
      labelOff: 'Inactive',
    });
  },
  activateAllCookies: function (e) {
    var event = e || window.event;
    var element = ((window.event) ? (event.srcElement) : (e.currentTarget));
    var text = element.innerText;

    $('.cookie--popup-settings input, .page-section#cookies .cookies-form input').each(function () {
      var btn = $(this).parents('.btn');
      if (element.getAttribute('data-init') === 'activate') {
        if (btn.hasClass('switch-status__activ')) {
          btn.trigger('click');
        }
      } else {
        if (btn.hasClass('switch-status__inactiv')) {
          btn.trigger('click');
        }
      }
    });

    if (element.getAttribute('data-init') === 'activate') {
      element.setAttribute('data-init', 'deactivate');
    } else {
      element.setAttribute('data-init', 'activate');
    }
    element.innerText = element.getAttribute('data-deactivate');
    element.setAttribute('data-deactivate', text);
  },
  checkActivateAllCookies: function () {
    this.actionActivateAllCookies('.cookie--popup-settings');
    if ($('body').hasClass('page-cookies')) {
      this.actionActivateAllCookies('.page-section#cookies');
    }
  },
  actionActivateAllCookies: function (parentClass) {
    var element = $(parentClass).find('.cookie--action-all-cookies');
    var text = $.trim(element.text());
    var activateAll = true;
    var deactivateAll = true;

    $(parentClass).find('input').each(function () {
      var btn = $(this).parents('.btn.checked');
      if (btn.hasClass('switch-status__inactiv')) {
        activateAll = false;
      }
      if (btn.hasClass('switch-status__activ')) {
        deactivateAll = false;
      }
    });
    if (activateAll === true && deactivateAll === false) {
      element.text(element.attr('data-deactivate'));
      element.attr('data-deactivate', text);
      if (element.attr('data-init') === 'activate') {
        element.attr('data-init', 'deactivate');
      } else {
        element.attr('data-init', 'activate');
      }
    }
  },
  checkCookies: function () {
    $.ajax('/ajax/cookies', {
      type: 'GET',
      dataType: 'json'
    }).done(function (response) {
      if (response !== null) {
        cookieNotice.populateCookies(response);
      }
    });
  },
  populateCookies: function (response) {
    $('.cookie--popup-settings input').each(function () {
      // Regex for data attribute
      var regExp = /\[(.*)\]/;
      var name = $(this).attr('name');
      var matches = name.match(regExp);
      if (matches !== null) {
        var key = matches.pop();
        if (response[key] === 'off') {
          var btn = $(this).parents('.btn');
          if (btn.hasClass('switch-status__inactiv')) {
            btn.trigger('click');
          }
        } else if (response[key] === 'on') {
          var btn = $(this).parents('.btn');
          if (btn.hasClass('switch-status__activ')) {
            btn.trigger('click');
          }
        }
      }
    });
    cookieNotice.checkActivateAllCookies();

    // Activate btn save
    cookieNotice.changeStateForBtnSave();
  },
  saveCookies: function (params, e) {
    var self = $(this);
    var target = e.target || window.event.target;
    var $form = $('.cookie--popup-settings__form');
    if (self.data('requestRunning')) {
      return;
    }
    self.data('requestRunning', true);
    cookieNotice.notAllowedCancel();
    target.classList.add('eloading');

    if (cookieNotice.typeAction($form.serializeArray(), params) === 'noneAcceptedModal' || cookieNotice.typePerformanceGA($form.serializeArray()) === false) { // Send data before disabling
      // send before any change on ajax, problems occurred on "none accepted" (GTM)
      cookieNotice.sendDataLayer($form.serializeArray(), params);
      // Delay for collecting GTM
      setTimeout(function () {
        $.ajax('/ajax/cookies', {
          type: 'POST',
          data: (params) ? $.extend($form.serializeObject(), params) : $form.serialize(),
          dataType: 'json'
        }).done(function (response) {
          if (response !== null) {
            self.data('requestRunning', false);
            location.href = cookieNotice.urlAddParameter(location.href, 'cookies', '1');
          }
        });
      }, 200);

    } else { // Send data after enabling
      $.ajax('/ajax/cookies', {
        type: 'POST',
        data: (params) ? $.extend($form.serializeObject(), params) : $form.serialize(),
        dataType: 'json'
      }).done(function (response) {
        if (response !== null) {
          cookieNotice.sendDataLayer($form.serializeArray(), params);
          // Delay for collecting GTM
          setTimeout(function () {
            self.data('requestRunning', false);
            location.href = cookieNotice.urlAddParameter(location.href, 'cookies', '1');
          }, 200);
        }
      });
    }

  },
  acceptAllCookies: function (e) {
    cookieNotice.saveCookies({'action': 'acceptAllCookies'}, e);
  },
  notAllowedCancel: function () {
    $('.cookie--action-cancel, .cookie--action-all-cookies, .fancybox-close, .checked-status .btn').css('pointer-events', 'none').css('cursor', 'not-allowed');
  },
  allowedCancel: function () {
    $('.cookie--action-cancel, .cookie--action-all-cookies, .fancybox-close, .checked-status .btn').css('pointer-events', '').css('cursor', 'pointer');
  },
  activateGeolocationCookie: function (e) {
    cookieNotice.saveCookies({'cookies[functional_geolocation]': 'on'}, e);
  },
  urlAddParameter: function (url, param, value) {
    var hash = {};
    var parser = document.createElement('a');
    parser.href = url;
    var parameters = parser.search.split(/\?|&/);
    for (var i = 0; i < parameters.length; i++) {
      if (!parameters[i])
        continue;

      var ary = parameters[i].split('=');
      hash[ary[0]] = ary[1];
    }
    hash[param] = value;
    var list = [];
    Object.keys(hash).forEach(function (key) {
      list.push(key + '=' + hash[key]);
    });
    parser.search = '?' + list.join('&');
    return parser.href;
  },
  sendDataLayer: function (form, params) {
    var cookiesFollowed = {};
    $.each(form, function (key, value) {
      cookiesFollowed[value.name] = value.value;
    });

    // Send all data
    if (cookieNotice.typeAction(form, params) === 'allAccepted') {
      dataLayer.push({'event': 'cookies1', 'cookiesPreference': 'all accepted'});
    } else if (form.length == 9) { // count input form
      if (cookieNotice.typeAction(form, params) === 'allAcceptedModal') {
        dataLayer.push({'event': 'cookies1', 'cookiesPreference': 'all accepted modal'});
      } else if (cookieNotice.typeAction(form, params) === 'partlyAcceptedModal') {
        dataLayer.push({'event': 'cookies', 'cookiesFollowed': cookiesFollowed});
      } else if (cookieNotice.typeAction(form, params) === 'noneAcceptedModal') {
        dataLayer.push({'event': 'cookies1', 'cookiesPreference': 'none accepted'});
      }
    } else {
      dataLayer.push({'event': 'cookies', 'cookiesFollowed': cookiesFollowed});
    }
  },
  typeAction: function (form, params) {
    var gaActive = true;
    var allActive = true;
    var allNotActive = true;
    $.each(form, function (key, value) {
      if (value.value === 'off') {
        allActive = false;
      }
      if (value.value === 'on') {
        allNotActive = false;
      }
      if (value.name === 'cookies[performance_ga]' && value.value === 'off') {
        gaActive = false;
      }
    });

    if (params != null && params.action === 'acceptAllCookies') {
      return 'allAccepted';
    } else if (form.length == 9) { // count input form
      if (params == null && allActive === true && allNotActive === false) {
        return 'allAcceptedModal';
      } else if (params == null && allActive === false && allNotActive === false) {
        return 'partlyAcceptedModal';
      } else if (params == null && allActive === false && allNotActive === true) {
        return 'noneAcceptedModal';
      }
    } else {
      return 'partlyAcceptedModal';
    }
  },
  typePerformanceGA: function (form) {
    var gaActive = true;
    $.each(form, function (key, value) {
      if (value.name === 'cookies[performance_ga]' && value.value === 'off') {
        gaActive = false;
      }
    });
    return gaActive;
  },
  changeStateForBtnSave: function () {
    $(document).on('change', '.cookie--popup-settings__form .switch-status, .cookies-form .switch-status', function (e) {
      e.preventDefault();
      cookieNotice.disabledStateForBtnSave(true);
      $(this).off(e);
    });
    cookieNotice.disabledStateForBtnSave();
  },
  disabledStateForBtnSave: function (removeDisabled) {
    var saveBtn = 'cookie--action-save';
    var saveBtnOnPage = '#cookies .page-section-save .user-btn';
    if (removeDisabled) {
      $('.' + saveBtn + ', #cookies .page-section-save .user-btn').removeClass('disabled');
    } else {
      $('.' + saveBtn + ', ' + saveBtnOnPage).addClass('disabled');
    }
  },
  pageCookies: function () {
    if ($('body').hasClass('page-cookies')) {
      cookieNotice.changeStateForBtnSave();
    }
  },
};

$(window).load(function () {
  cookieNotice.init();
});
