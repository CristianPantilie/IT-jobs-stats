var eloader = {

    cookie_name: 'eloader',
    $el: $('.eloader'),
    $progress_el: $('.eloader__circle__progress'),

    detect_animation: function() {

        var s = document.body || document.documentElement;

        this.s = s.style,
        this.prefixAnimation = '';

        if ( this.s.WebkitAnimation == '' )   this.prefixAnimation  = '-webkit-';
        if ( this.s.MozAnimation == '' )      this.prefixAnimation  = '-moz-';
        if ( this.s.OAnimation == '' )        this.prefixAnimation  = '-o-';

    },

    hide: function() {

        var self = this;

        self.$el.addClass('animated fadeOut');

        self.set_cookie();

        self.$el.on('webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend', function(e) {

            if ( e.originalEvent.animationName == 'fadeOut' ) {
                self.$el.addClass('is-hidden');
            }

        });

        if ( ( self.prefixAnimation == '' && !( 'animation' in self.s ) ) ) {
            self.$el.addClass('is-hidden');
        }

    },

    set_cookie: function() {
        $.cookie('eloader', 'showed', { path: '/' });
    },

    init: function() {

        var self = this;

        if ( self.$el.length ) {

            if ( $('html').hasClass('lt-ie9') ) {
                return false;
            }

            self.detect_animation();

            self.$progress_el.on('webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend', function() {
                self.hide();
            });

            // daca animatia s-a terminat inainte de a 'lega' evenimentul 'animationend', apelam functia hide dupa 2.5 secunde
            setTimeout(function() {
                if ( !self.$el.hasClass('fadeOut') ) {
                    self.hide();
                }
            }, 3100);

            if ( ( self.prefixAnimation == '' && !( 'animation' in self.s ) ) ) {
                self.hide();
            }
        }

    }
};

$(document).ready(function() {
    eloader.init();
});