// Extend qtip defaults
$.fn.qtip.defaults = $.extend(true, {}, $.fn.qtip.defaults, {
    style:{
        tip: {
            corner: true,
            width: 20,
            height: 10,
            offset: 0,
            border: 0
        }
    }
});

var qtip_responsive = {
    position: {
        viewport: $(window),      // Ensure tooltip doesn't go out of bounds
        adjust: {
            method: 'shift flip'  // http://qtip2.com/plugins#viewport.adjustmethod
        }
    }
};

var qtip_position = {
    "left center":{
        position:{
            my:'right center',
            at:'left center'
        }
    },
    "right center":{
        position:{
            my:'left center',
            at:'right center'
        }
    },
    "top center":{
        position:{
            my:'bottom center',
            at:'top center'
        }
    },
    "bottom center":{
        position:{
            my:'top center',
            at:'bottom center'
        }
    }
};

var qtip_type = {
    "light":{
        style:{
            classes:    'qtip-ejbs',
            tip: {
                border: 1
            }
        }
    },
    "dark":{
        style:{
            classes:    'qtip-ejbs-dark'
        }
    }
};