/*!
 *  some jquery functions used within the project
 */

/*!
 *  offsetting an html anchor to adjust for fixed header
 */
;(function($) {

    $.adjustAnchor = function(options) {

        var settings = $.extend({
            animateSpeed: 400,
            fixedElementHeight: $('#header').height()
        }, options);

        var anchor = window.location.hash;

        if ( $(anchor).length > 0 ) {

            $('html, body')
                .stop()
                .animate({
                    scrollTop: $(anchor).offset().top - settings.fixedElementHeight
                }, settings.animateSpeed);

        }

    };

})(jQuery);


/*!
    Animates element's number to new number
    Parameters:
        stop (number): number to stop on
        percents (boolean): turn percents on/off (default is true)
        duration (number): how long in ms (default is 1000)
        ease (string): type of easing (default is "swing", others are avaiable from jQuery's easing plugin
    Examples:
        $("#div").animateNumbers(1234, 500, "linear"); // half second linear
        $("#div").animateNumbers(1234, 2000); // two second swing
        $("#div").animateNumbers(4321); // one second swing
    This fully expects an element containing an integer
    If the number is within copy then separate it with a span and target the span
 */
;(function($) {

    $.fn.animateNumbers = function(stop, percent, duration, ease) {

        return this.each(function() {
            var $this = $(this);
            var start = parseInt($this.text().replace(/,/g, ""), 10);
                 percent = (percent === undefined) ? true : percent;
            $({value: start}).animate({value: stop}, {
                duration: duration === undefined ? 1000 : duration,
                easing: ease === undefined ? "swing" : ease,
                step: function() {
                    $this.text(Math.floor(this.value) + (percent === true ? "%" : "") );
                },
                complete: function() {
                   if (parseInt($this.text(), 10) !== stop) {
                       $this.text(stop + (percent === true ? "%" : "") );
                   }
                }
            });
        });

    };

})(jQuery);


/*!
 *
 *  Scroll page to a specific element.
 *
 *  Parameters:
 *      target: A selector (id or class).
 *      options: An oject with additional options to pass to the method.
 *          duration - a number determining how long the animation will run.
 *          offsetTop - a number that defines additional spacing above scroll target.
 *      complete: A function to call once the animation is complete.
 *  Example:
 *      $("#div").scrollTo('.footer-nav', {duration: 400, offsetTop: 100}, function(){
 *          alert('callback function triggered!');
 *      });
 */
;(function($) {

    $.fn.scrollTo = function( target, options, callback ) {

        var settings = $.extend({
            duration: 400,
            offsetTop: 50
        }, options);

        return this.each(function() {

            if ( $(target).length === 0 ) return;

            var callbackTriggered = false;

            $('html, body').stop().animate({
                scrollTop: $(target).offset().top - parseInt(settings.offsetTop, 10)
            }, parseInt(settings.duration, 10), function() {
                if (typeof callback == 'function') {
                    if( !callbackTriggered ) {
                        callback.call(this);
                        callbackTriggered = true;
                    }
                }
            });

        });

    };

})(jQuery);


/*!
 *  Serialize Form to JSON
 */
;(function($) {

    $.fn.serializeObject = function() {
        var o = {};
        var a = this.serializeArray();
        $.each(a, function() {
            if (o[this.name]) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };

})(jQuery);


/*!
 * Simple jQuery Equal Heights
 *
 * Copyright (c) 2013 Matt Banks
 * Dual licensed under the MIT and GPL licenses.
 * Uses the same license as jQuery, see:
 * http://docs.jquery.com/License
 *
 * @version 1.5.1
 */
;(function($) {

    $.fn.equalHeights = function(options) {
        var maxHeight = 0,
            $this = $(this),
            equalHeightsFn = function() {
                var height = $(this).innerHeight();

                if ( height > maxHeight ) { maxHeight = height; }
            };
        options = options || {};

        $this.each(equalHeightsFn);

        if(options.wait) {
            var loop = setInterval(function() {
                if(maxHeight > 0) {
                    clearInterval(loop);
                    return $this.css('height', maxHeight);
                }
                $this.each(equalHeightsFn);
            }, 100);
        } else {
            return $this.css('height', maxHeight);
        }
    };

})(jQuery);


/*!
 * hideShowPassword
 *
 * The plugin works in any browser that supports resetting the type attribute of <input> elements
 * (pretty much everything newer than IE8).
 * The plugin should fall back gracefully in cases where this is not supported.
 *
 */
;(function($) {

    $.fn.hideShowPassword = function () {

        // material icons
        var icon_on = '&#xE8F4;',
            icon_off = '&#xE8F5;';

        var canSetInputAttribute = (function () {
            var body = document.body,
            input = document.createElement('input'),
            result = true;
            input = body.appendChild(input);
            try {
                input.setAttribute('type', 'text');
            } catch (e) {
                result = false;
            }
            body.removeChild(input);
            return result;
        }());

        var is_supported = canSetInputAttribute;

        return this.each(function() {

            var $wrapper = $(this),
                $input = $wrapper.find('.hideShowPassword-input'),
                $btn = $wrapper.find('.hideShowPassword-toggle');

            if (is_supported) {

                $btn.attr("tabIndex", -1);

                $btn.on('click', function() {
                    if ( $input.attr("type") == "password" ) {
                        $input.attr("type", "text");
                        $btn.find('i').html(icon_off);
                    } else {
                        $input.attr("type", "password");
                        $btn.find('i').html(icon_on);
                    }
                });

            } else {

                $btn.hide();

            }

        });

    };

})(jQuery);


/*!
 * Detecting CSS Animation and Transition End with JavaScript
 *
 * http://osvaldas.info/detecting-css-animation-transition-end-with-javascript
 *
 * Example:
 *      $element.addClass('has-animation').onCSSAnimationEnd( function() { ... });
 *      $element.addClass('has-transition').onCSSTransitionEnd( function() { ... });
 *
 */

;( function( $, window, document, undefined ) {

    var s = document.body || document.documentElement,
        s = s.style,
        prefixAnimation = '',
        prefixTransition = '';

    if( s.WebkitAnimation == '' )   prefixAnimation  = '-webkit-';
    if( s.MozAnimation == '' )      prefixAnimation  = '-moz-';
    if( s.OAnimation == '' )        prefixAnimation  = '-o-';

    if( s.WebkitTransition == '' )  prefixTransition = '-webkit-';
    if( s.MozTransition == '' )     prefixTransition = '-moz-';
    if( s.OTransition == '' )       prefixTransition = '-o-';

    $.fn.extend({

        onCSSAnimationEnd: function( callback ) {

            this.each(function () {
                var $this = $(this);
                $this.one( 'webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend', callback );
                if( ( prefixAnimation == '' && !( 'animation' in s ) ) || $this.css( prefixAnimation + 'animation-duration' ) == '0s' ) callback();
            });

            return this;
        },

        onCSSTransitionEnd: function( callback ) {

            this.each(function () {
                var $this = $(this);
                $this.one( 'webkitTransitionEnd mozTransitionEnd oTransitionEnd otransitionend transitionend', callback );
                if( ( prefixTransition == '' && !( 'transition' in s ) ) || $this.css( prefixTransition + 'transition-duration' ) == '0s' ) callback();
            });

            return this;
        }

    });

})( jQuery, window, document );

$(document).ready(function() {
    setTimeout(function(){
        $('body').addClass('animation-ready');
    }, 500);
});

/*!
    Switches status
    Start event: switchStatus.init();
 */
;(function ($) {
  $(document).on('click', '.switch-status .btn', function () {
    if (!$(this).hasClass('checked')) {
      $(this).parents('.switch-status').addClass('checked-status').find('.btn').removeClass('checked');
      $(this).addClass('checked');
    }
  });
  switchStatus = {
    init: function () {
      $('.switch-status .btn').each(function () {
        if ($(this).find('input').is(':checked')) {
          $(this).trigger('click');
        }
      });
    }
  };
})(jQuery);

/*!
    Change site language
 */
;(function ($) {
  $(document).on('click', 'UL.language-menu .menu-item-language A', function () {
    if (!$(this).hasClass('active')) {
        // Remove setLang parameter if in order
        if (-1 !== location.href.indexOf('setlang=')) {
            var URLComponents = location.href.split('setlang=');
            if (2 === URLComponents.length) {
                newURL = URLComponents[0].substring(0, URLComponents[0].length - 1);
            }
        }
        else {
            newURL = location.href;
        }
        // Add current setlang parameter
        if (-1 !== newURL.indexOf('?')) {
            newURL += '&'+ $(this).data("href").substring(0, $(this).data("href").length);
        }
        else {
            newURL += '?'+ $(this).data("href");
        }
        location.href = newURL;
        return true;
    }
    else {
        return false;
    }
  });
})(jQuery);
