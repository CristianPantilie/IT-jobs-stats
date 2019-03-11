;(function($) {

  $.fn.unveil = function(threshold, callback) {

    var th = threshold || '150%',
        retina = window.devicePixelRatio > 1,
        attrib = retina? "data-src-retina" : "data-src";

    this.each(function() {
      var $element = $(this);
      var source = $element.attr(attrib);
      source = source || $element.data("src");

      var waypoint_img = new Waypoint({
        element: $element,
        handler: function() {
            var image = new Image();
            image.onload = function() {
                $element.attr('src', source);
                $element.addClass('unveil-loaded');
            };
            image.src = source;
            this.destroy();
        },
        offset: th
      });

    });

    return this;

  };

})(window.jQuery);


/*
 *  Lazy load background
*/
;(function($) {

  $.fn.unveil_bg = function(threshold) {

    var th = threshold || '100%',
        retina = window.devicePixelRatio > 1,
        attrib = retina? "data-bg-retina" : "data-bg";

    this.each(function() {
      var $element = $(this);
      var bg_source = $element.attr(attrib);
      bg_source = bg_source || $element.data("bg");

      var waypoint_bg = new Waypoint({
        element: $element,
        handler: function() {
            $element.css('background-image', 'url("'+ bg_source +'")');
            this.destroy();
        },
        offset: th
      });

    });

    return this;

  };

})(window.jQuery);