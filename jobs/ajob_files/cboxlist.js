/*!
 *  Checkbox List
 *
 */
;(function ( $, window, document, undefined ) {

    $.fn.cboxlist = function (options) {

        // Icons - material icons
        var icon = {
            checked: "&#xE834;",
            unchecked: "&#xE835;"
        };

        // Establish our default settings
        var settings = $.extend({
            show_selections     : true,
            custom_scrollbar    : true,
            selections_limit     : 0,     // maximum number of allowed selected items ( 0 means unlimited )

            // HTML templates
            tpl: {
                selection : '<div class="cbox_list__selection"><i class="material-icons">'+ icon.checked +'</i></div>'
            }

        }, options);

        function escape_id(id_string) {
            return id_string.replace( /([\:\.\[\],]+)/g, "" );
        }

        function add_scrollbar ($list) {

            if ( $.isFunction($.fn.perfectScrollbar) ) {

                if ( ! $('html').hasClass('lt-ie9') ) {

                    $list.perfectScrollbar({
                        swipePropagation: false
                    });
                }

            }

            return;
        }

        function init ($list, $selections, show_selections) {

            var counter = 0, value, name, label_text;

            $list.find('input[type="checkbox"]').each(function(){

                var $this = $(this);
                if ( $this.prop('checked') ) {
                    counter++;
                    $this.parent().addClass('checked');
                    if (show_selections) {
                        value = $this.val();
                        name = $this.attr('name');
                        label_text = $this.next().text();
                        add_selection($selections, name, value, label_text);
                    }

                }

            });
            return counter;
        }

        function update_selections_message($selections, counter) {

            if (counter) {
                $selections.find('.info--empty').removeClass('visible');
                $selections.find('.info--selected').addClass('visible');
            } else {
                $selections.find('.info--selected').removeClass('visible');
                $selections.find('.info--empty').addClass('visible');
            }

        }

        function add_selection ($selections, input_name, input_value, label_text) {

            var $selection;

            $selection = $(settings.tpl.selection).append( label_text );

            // try to add a unique id to the selection
            var selection_id = "selection-" + input_name.toLowerCase() + "-" + input_value;
            selection_id = escape_id(selection_id);
            $selection.attr("id", selection_id );

            $selections.append($selection);

            return;
        }

        function remove_selection ($selections, input_name, input_value) {

            var selection_id = "selection-" + input_name.toLowerCase() + "-" + input_value;
            selection_id = escape_id(selection_id);

            $selections.find('#' + selection_id).remove();

            return;
        }

        function click_selection () {

            var $selection = $(this),
                selection_id = $selection.attr('id'),
                input_value = selection_id.split("-")[2];

            var $list = $selection.parent().siblings('.cbox-list__data'),
                $input = $list.find('input[value="'+ input_value +'"]');

            $input.trigger('click');

            return;
        }

        function remove_all_selections ($selections) {
            $selections.find('.cbox_list__selection').remove();
            update_selections_message($selections, 0);
        }

        this.reset = function () {
            var $widget = $(this),
                $list = $widget.find('.cbox-list__data'),
                $selections = $widget.find('.cbox-list__selections'),
                show_selections = settings.show_selections;

            $list.find('input[type="checkbox"]').each(function(){
                var $this = $(this);

                if ( $this.prop('checked') ) {
                    $this.parent().removeClass('checked');
                    $this.prop('checked', false);
                }
            });
            if (show_selections) {
                remove_all_selections($selections);
            }

            $widget.data('selections_count', 0);

            return 0;
        };

        this.each(function () {
            var $widget = $(this),
                $list = $widget.find('.cbox-list__data'),
                show_selections = settings.show_selections,
                $selections = $widget.find('.cbox-list__selections'),
                $widget_data = $widget.data(),
                selectionsAction = {
                    $element: $selections.find('.info--selected'),
                    update: function() {
                        this.$element.find('span').html($widget_data.selections_count);
                    },
                    blink: function() {
                        this.$element.fadeIn(100).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100, function() {
                            $(this).attr('style','');
                        });
                    }
                };

            if( settings.custom_scrollbar && !$list.hasClass('cbox-list__data--no-scroll') ) {
                add_scrollbar($list);
            }

            $widget_data.selections_count = init($list, $selections, show_selections);

            update_selections_message($selections, $widget_data.selections_count);

            // Show counter for selections on plugin init
            selectionsAction.update();

            $list.on('click', 'input[type="checkbox"]', function() {
                var $this = $(this),
                    value = $this.val(),
                    name = $this.attr('name'),
                    label_text;

                if ( $this.prop('checked') ) {

                    if ( settings.selections_limit && $widget_data.selections_count >= settings.selections_limit ) {
                        $this.prop('checked', false);
                        // console.log( 'Limit reached' );

                        var scrollableElementSelector = '';

                        if (!$selections.visible()) {
                            if ($('body').hasClass('modalOpen')) {
                                // cboxlist from edit_objective modal
                                scrollableElementSelector = '#fancybox-lock';
                            }
                            else if ($('body').hasClass('has-modal')) {
                                // cboxlist from ejobs locuri-de-munca filters
                                scrollableElementSelector = '#search';
                            }
                            else {
                                // cboxlist from create account user step4 page
                                scrollableElementSelector = 'html,body';
                            }

                            $(scrollableElementSelector).animate({
                                scrollTop: $selections.offset().top
                            }, 500, function() {
                                // Blink counter of selections
                                selectionsAction.blink();
                            });
                        }
                        else {
                            // Blink counter of selections
                            selectionsAction.blink();
                        }

                        return false;
                    }

                    $this.parent().addClass('checked');

                    $widget_data.selections_count++;

                    if ( show_selections  ) {
                        update_selections_message($selections, $widget_data.selections_count);
                        label_text = $this.next().text();
                        add_selection($selections, name, value, label_text);
                    }

                } else {

                    $this.parent().removeClass('checked');

                    $widget_data.selections_count--;

                    if ( show_selections  ) {
                        update_selections_message($selections, $widget_data.selections_count);
                        label_text = $this.next().text();
                        remove_selection($selections, name, value);
                    }

                }

                // Show counter for selections on click
                selectionsAction.update();

            });

            if ( show_selections ) {
                $selections.on('click', '.cbox_list__selection', click_selection);
            }

        });

        return this;
    };

})(jQuery);
