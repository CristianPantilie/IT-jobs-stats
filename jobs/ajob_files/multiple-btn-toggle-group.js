/*
 Calin Buzatu - multiple-btn-toggle-group custom component
 Check styleguide for more details
 */
$(function() {
  var $el = $('.multiple-btn-toggle-group');

  $el.each(function() {
    var $btnGroup = $(this),
      $btn = $btnGroup.find('.ebtn');

    $btn.on('click', function() {
      $btn.removeClass('active');
      $(this).addClass('active');
    });
  });
});