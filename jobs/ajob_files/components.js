function edropdown(selector) {

    if ( Modernizr.touch && jRes.getBreakpoint() != 'desktop-up' ) {

        $(selector).find('.edropdown-toggle').on('click', function(){
            var $active_dropdown = $(this).parent('.edropdown');
            if ( $active_dropdown.hasClass('open') ) {
                $active_dropdown.removeClass('open');
            } else {
                $('.edropdown').removeClass('open');
                $active_dropdown.addClass('open');
            }
        });

        $('html').on('click', function(e) {
            if ( $( e.target ).closest('.edropdown.open').length === 0 ) {
                $('.edropdown').removeClass('open');
            }
        });

    } else {

        $(selector).hoverIntent({
            over: function() {
                $(this).addClass('open');
            },
            out: function() {
                $(this).removeClass('open');
            },
            timeout: 350
        });

    }

}

$(document).ready(function() {

    // alerts
    $('.alert .close').on('click', function(event) {
        event.preventDefault();
        var $alert = $(this).closest('.alert');
        var dismissURL = $(this).data('url');
        if (dismissURL != '') {
            $.get(dismissURL, function(data) {
                $alert.hide();
            });
        } else {
            $alert.hide();
        }
        return false;
    });

    // dropdowns
    $('.drop-toggle.hover-intent').hoverIntent({
        over: function() {
            $(this).addClass('active');
        },
        out: function() {
            $(this).removeClass('active');
        },
        timeout: 250
    });

    edropdown('.edropdown');

});