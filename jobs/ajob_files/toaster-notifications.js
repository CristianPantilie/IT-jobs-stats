/**
 * Created by calin.buzatu on 03-Jan-18.
 */
(function($) {
  $.toasterNotifications = function(options, callback) {
    if (typeof(options) == 'undefined' || typeof(options.elementID) == 'undefined') {
      console.log('WARNING! toasterNotifications plugin isn\'t initialised properly! elementID is missing!');
      return false;
    }

    var plugin = this,
      defaultSettings = {
        timer: {
          delay: 0,
          error: 2500,
          complete: 2500
        }
      },
      settings = $.extend(defaultSettings, options),
      $element = $('#'+options.elementID);

    // Plugin functions
    plugin.hide = function () {
      $('.toaster-notifications').removeClass('is-visible');
      $element.find('.notification').removeClass('is-visible');
    },

    plugin.show = function (type) {
      clearTimeout(window.toasterNotifications);

      switch (type) {

        case 'loading':
          // Disable timeout
          settings.timer.delay = 0;
          var $showElement = $element.find('.notification-loading');
          break;

        case 'error':
          // Set delay to timer.error
          settings.timer.delay = settings.timer.error;
          var $showElement = $element.find('.notification-error');
          break;

        case 'chooser':
          // Disable timeout
          settings.timer.delay = 0;
          var $showElement = $element.find('.notification-chooser');
          break;

        default:
          // Set delay to timer.complete
          settings.timer.delay = settings.timer.complete;
          var $showElement = $element.find('.notification-complete');
        }

        // Show desired notification
        $element.addClass('is-visible');
        $showElement.addClass('is-visible');

        // If delay is equal to 0, show notification without timeout
        if (settings.timer.delay === 0) {
          return false;
        }

        // After time ends, hide again the notification
        window.toasterNotifications = setTimeout(function () {
          plugin.hide();

          // Call here the plugin callback
          if (typeof(callback) == 'function') {
            callback.call(this);
          }

        }, settings.timer.delay);

      };

    //  Hide all notifications
    plugin.hide();

    // Hide notification on click
    $element.on('click',function () {
      plugin.hide();
    });

    return plugin;
  }
}(jQuery));