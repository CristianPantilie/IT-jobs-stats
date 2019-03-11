/**
* Fancybox.dialog - jQuery plugin to Fancybox (http://fancyapps.com/fancybox/)
*
* Extension of jQuery fancybox to display classics modals popups
*
* Inspired by: https://github.com/jbdemonte/fancybox.message
**/

;(function($, undefined) {
    "use strict";

    var ns = "fancybox-dialog";

    if (!$.fancybox) {
        console.log('$.fancybox.dialog error: Fancybox must be loaded first!');
        return false;
    }

    // create a dom object
    function $e(suffix, cl) {
        return $(document.createElement(cl||"div")).addClass(ns+suffix);
    }

    // create the content of the fancybox dialog
    function newDialog(data) {

        var $dialog = $e("");

        // icons
        if ( data.icons !== false ) {
            switch (data.type) {
                case 'success':
                    $dialog.append( $e("__icon", "span").html(data.icons.success) );
                    break;
                case 'error':
                    $dialog.append( $e("__icon", "span").html(data.icons.error) );
                    break;
                case 'info':
                    $dialog.append( $e("__icon", "span").html(data.icons.info) );
                    break;
                case 'warning':
                    $dialog.append( $e("__icon", "span").html(data.icons.warning) );
                    break;
                case 'closebtn':
                    $dialog.append('<a href="javascript:;" id="closebtn">' + data.icons.closebtn + '</a>');
                    break;
                default:
                    // Do nothing
                    break;
            }
        }

        // title
        $dialog.append($e("__title", "h2").html(data.title || ""));

        // content
        $dialog.append($e("__content").html(data.text || ""));

        // buttons
        var $buttons = data.buttons !== false ? $e("__buttons") : false;

        if ($buttons) {

            if (data.buttons && $.isArray(data.buttons)) {
                $.each(data.buttons, function(i, b) {
                    $buttons.append(b);
                });
            }

            $dialog.append($buttons);

        }

        return $dialog;
    }

    // Plugin definition
    $.fancybox.dialog = function() {

        // Fancybox dialog defaults
        var defaults = $.fancybox.dialog.defaults;

        var options = arguments[0];

        if ( typeof options === 'undefined' ) {
            console.log('$.fancybox.dialog error: Fancybox.dialog expects at least one argument!');
            return false;
        }

        var params = {};

        switch (typeof options) {

            // Ex: $.fancybox.dialog("Oops...", "Something went wrong!", "info");
            case'string':

                params.title = options;
                params.text = arguments[1];
                params.type = arguments[2];
                break;

            // Ex: $.fancybox.dialog({
            //     title: "Error!",
            //     text: "Here's my error dialog!",
            //     title: "error"
            // });
            case 'object':

                // if (options.title === undefined) {
                //     console.log('$.fancybox.dialog error: Fancybox.dialog "title" argument is missing!');
                //     return false;
                // }
                params = $.extend({}, options);
                break;

            default:
                console.log('$.fancybox.dialog error: Unexpected type of argument! Expected "string" or "object", got "' + typeof options + '"');
                return false;

        }

        var settings = $.extend(true, {}, defaults, params);

        // console.log( 'Settings are: ' + settings.toSource() );

        // if ( settings.title === '' ) {
        //     console.log('$.fancybox.dialog error: Fancybox.dialog "title" argument can not be empty!');
        //     return false;
        // }


        // create buttons in dom and add into the array buttons
        var buttons = settings.buttons !== false ? [] : false;

        if (buttons) {

            $.each(settings.buttons, function(i, button) {

                var button_name = button.id.charAt(0).toUpperCase() + button.id.slice(1);

                var $b = $e("__button " + button.classes, "button").attr({"type" : "button", "id" : button.domId}).html(button.label);

                $b.on('click', function () {

                    if ( button.close !== false ) {
                        $.fancybox.close();
                    }

                    // callback function
                    if (typeof settings["on"+button_name] === "function") {
                        settings["on"+button_name].call( this, $b  );
                    }

                });

                buttons.push( $b );

            });

        }

        // Create the dom content of the fancybox
        var $dialog = newDialog({
            title:      settings.title,
            text:       settings.text,
            type:       settings.type,
            icons:      settings.icons,
            buttons:    buttons
        });


        // Add custom classes defined by the user
        if (settings.customClass) {
            $dialog.addClass(settings.customClass);
        }


        // Add classes based on dialog type - 'success', 'error', 'info', 'warning'
        if (settings.type) {
            $dialog.addClass(ns + "--" + settings.type);
        }

        //  Build fancybox
        var fancyboxOptions = $.extend( {content: $dialog, padding: 0}, settings.fancyboxOptions );
        $.fancybox(fancyboxOptions);

    };


    // Confirm shortcode function
    $.fancybox.dialog.confirm = function(title, text, okLabel, cancelLabel, callback) {
        $.fancybox.dialog({
            title: title,
            text: text,
            type: 'warning',
            buttons: [
                {
                    id: 'cancel',
                    label: cancelLabel,
                    classes: 'ebtn ebtn--outline-secondary-dark',
                    close: true
                },
                {
                    id: 'ok',
                    label: okLabel,
                    classes: 'ebtn ebtn--flat-secondary',
                    close: false
                }
            ],
            onOk: callback
        });
    };


    // Plugin defaults - added as a property on our plugin function.
    $.fancybox.dialog.defaults = {
        title:              '',     // The title of the dialog. | required
        text:               '',     // The description for the dialog. | optional
        type:               '',     // The type of the dialog: will show a corresponding icon  + will add a custom class. Predefined values are: 'success', 'error', 'info', 'warning'
        customClass:        '',     // A custom CSS class for the dialog.
        buttons:            [       // An array of buttons that will be shown in the dialog. False if you don't want buttons.
            {
                id:         'ok',
                label:      'OK',
                classes:    'ebtn ebtn--outline-secondary-dark',
                close:      true
            }
        ],
        fancyboxOptions:    {      // Options for the default fancybox behaviour: http://fancyapps.com/fancybox/#docs
            wrapCSS:        'fancybox-transparent',
            modal:          true
        },
        icons:          {           // Html code for the icons that are showed within the dialog
            closebtn:   '<i class="material-icons">&#xE14C;</i>',
            success:    '<i class="material-icons">&#xE86C;</i>',
            error:      '<i class="material-icons">&#xE888;</i>',
            info:       '<i class="material-icons">&#xE88F;</i>',
            warning:    '<i class="material-icons">&#xE001;</i>'
        }
    };


    $('body').on('click', '.fancybox-dialog--with-close-btn a#closebtn', function() {
      $.fancybox.close();
    });

})(jQuery);