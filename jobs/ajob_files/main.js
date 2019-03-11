$.extend(true, $.fancybox.defaults, {
    // Effects
    openEffect  : 'none',
    closeEffect : 'none',
    // Size
    padding     : 0,
    margin      : [30, 16, 30, 16],   // space between viewport and the box
    minWidth    : 270,
    width       : 'auto',
    height      : 'auto',
    maxWidth    : '90%',            // responsive width + some space left and right
    fitToView   : false,
    autoSize    : false,
    // HTML templates
    tpl       : {
        closeBtn: '<a title="Închide" class="fancybox-item fancybox-close" href="javascript:;"><i class="material-icons">&#xE5CD;</i></a>'
    }
});

// responsive breakpoints
var jRes = jRespond([
    {
        label: 'phone-small-down',
        enter: 0,
        exit: 479
    },
    {
        label: 'phone-only',
        enter: 480,
        exit: 767
    },
    {
        label: 'tablet-only',
        enter: 768,
        exit: 1007
    },
    {
        label: 'desktop-up',
        enter: 1008,
        exit: 10000
    }
]);

// user input regex
var user_input_regex = /[^a-zA-Z0-9\s(\)\[\]_\.\,\!\?\-\+\#\:\;\/]/i;


// TO DO: spargerea acestui cod in componente separate (js/layout/) at some point
//
$(document).ready(function() {

    // Header headroom.js plugin
    if ($('body').hasClass('fixed-header')) {

        // Declaring variables
        var $headerEl = $('header#header'),
            headerHeight = $headerEl.height() + 10,
            headroom  = new Headroom($headerEl[0]),
            exceptElements = typeof($('.sidemenu-user,.tableHead')[0]);

        // Condition when headroom.js gets initialised
        if (exceptElements == 'undefined') {
            headroom.offset = headerHeight;
            headroom.init();
        }

    }

    // Menu toggle
    $('.nav-toggle').on('click', function() {
        var btn = $(this);
        if(btn.hasClass('active')) {
            $.fancybox.close();

        } else {
        var menus,
            $overlay_menu;

        if ( jRes.getBreakpoint() == 'phone-small-down' || jRes.getBreakpoint() == 'phone-only' ) {
            menus = ['.main-menu', '.account-menu', '#nav-toggle', '.login-menu', '.language-menu'];
        } else {
            menus = ['.main-menu', '.login-menu', '#nav-toggle', '.language-menu'];
        }

        $overlay_menu = $("<div class='overlay-menu'><span></span></div>");

        $.each( menus , function(i, menu) {
            $overlay_menu.append( $(menu).clone()  );
        });

        $overlay_menu.find('.edropdown').each(function() {
            btn.removeClass('edropdown');
        });

        $.fancybox( $overlay_menu, {
            closeBtn: false,
            wrapCSS     : 'fancybox-transparent',
            overlay     : {
                closeClick: false,
            },
            beforeLoad: function() {
                btn.addClass('active');
                $('body').addClass('overlay-menu-open');
            },
            beforeClose: function() {
                btn.removeClass('active');

                    $('body').removeClass('overlay-menu-open');
            }
        });
        }
        return false;
    });

    // Sticky header
    $('.hero-index').waypoint(function(direction) {
        if (direction == 'down') {
            $('body').removeClass('transparent-header');
        } else {
            $('body').addClass('transparent-header');
        }
    }, { offset: -1 });

    // Footer toggle
    $('.footer-toggle .toggle').on('click', function(){
        var $this = $(this);

        if ( $('.footer-toggle').hasClass('is-opened') ) {
            $('.footer-toggle').removeClass('is-opened');
            $('.footer-nav, .footer-copyright').addClass('hidden-phone');
        } else {
            $('.footer-toggle').addClass('is-opened');
            $('.footer-nav, .footer-copyright').removeClass('hidden-phone');
            $this.scrollTo('.footer-nav', { duration: 400, offsetTop: ($('#header').height() + 50) });
        }

    });

    // Export candidate data link
    $('.gdpr-DownloadDataBtn a').on('click', function() {
        var $this = $(this);
        document.location = '/user/export';
        return false;
    });

    // Box confidential
    var confidentialBox = $('.ejbs_notice_confidential');
    var _changeInterval = null;
    $('.ejbs_button_confidential').on('click', function(){
        confidentialBox.fadeIn();
    });

    $('#save-companyName').keyup(function(){
       clearInterval(_changeInterval);
       _changeInterval = setInterval(function(){
           if($('#save-companyName').val() !== 'CONFIDENTIAL') {
               confidentialBox.fadeOut();
               clearInterval(_changeInterval);
           }
       }, 1500);
    });

    $('.ejobs_alerts_tutorial_switch').click(function(e)
    {
        e.preventDefault();

        var button = $(this).html(),
            ro = ['Vezi cum să creezi alerte de căutări salvate', 'Închide tutorialul'],
            en = ['How do I create saved search notifications?', 'Close tutorial'],
            tutorial = $('.ejobs_alerts_tutorial'),
            use = null;

        tutorial.toggle();
        if(ro.indexOf(button) > -1) {
            use = ro;
        } else {
            use = en;
        }

        return (button == use[1]) ? $(this).html(use[0]) : $(this).html(use[1]);
    });
});

