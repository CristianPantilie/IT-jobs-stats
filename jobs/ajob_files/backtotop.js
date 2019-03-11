var backToTop = {

    $btn: $('#back-to-top'),
    $body: $('body'),

    add_waypoint: function() {

        var self = this;

        self.$body.waypoint(function(direction) {
            if (direction === 'down') {
                self.$btn.addClass('is-visible');
            } else {
                self.$btn.removeClass('is-visible');
            }
        }, {
            offset: '-100%'
        });

    },

    click_handler: function() {

        var self = this;

        self.$btn.on('click', function(e){

            $('html,body').animate({
                scrollTop: 0
            }, 500);

            return false;
        });

    },

    init: function() {

        if ( this.$btn.length ) {
            this.add_waypoint();
            this.click_handler();
        }

    },
};

$(document).ready(function() {
    backToTop.init();
});

