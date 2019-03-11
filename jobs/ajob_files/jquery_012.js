 /*!
 *
 * jQuery UI Autocomplete customization
 *
 */

(function( $, undefined ) {

	$.widget( "ui.autocompleteHomepage", $.ui.autocomplete, {

		// extend default options
		options: {
			delay: 100,
			offsetTop: "+15",
			position: {
				my: "center top",
				at: "center bottom"
			},
			showOnFocus: false,				// display dropdown list on focus if autocomplete input is empty (works only if minLength is 0)
			autoFocusSingleMatch: false,	// if dropdown list has just one item, set focus to it
			clearButton: true,				// allow input clearing

			open: function(){
				$(this).data("uiAutocompleteHomepage").menu.element.addClass('opened');
			},
			close: function(){
				$(this).data("uiAutocompleteHomepage").menu.element.removeClass('opened');
			}
		},

		_create: function() {

			var self = this;

			// add offsets
			self.options.position.my += self.options.offsetTop;

			// Invoke the parent widget's method.
			self._super();

			if ( self.options.clearButton ) {

				self.clearElement = $("<a>")
									.attr( "href","javascript:;" )
									.attr( "tabindex", "-1" )
									.addClass( "ui-autocomplete-clear" )
									.html( "<i class='material-icons'>&#xE5CD;</i>" )
									.appendTo( self.element.parent() );

				self._on( self.clearElement, {
					click: function() {
						self.element.val('').focus();
						self.clearElement.hide();
					}
				});

				// show clearButton
				if( self.element.val()!=="" ) {
					self.clearElement.show();
				}

			}

			self._on( self.element, {
				// display dropdown list on focus if autocomplete input is empty
				focus: function() {
					if( self.options.showOnFocus && self.element.val()==="" ) {
						self.element.autocompleteHomepage("search", "");
					}
				},
				// allow input clearing
				input: function() {
					if( self.options.clearButton ) {
						if ( self.element.val()!=="" ) {
							self.clearElement.show();
						}else{
							self.clearElement.hide();
						}
					}
				}
			});

			// set tabindex for autocomplete list
			self.menu.element.attr("tabindex", "-1");

			self._on( self.menu.element, {
				menuselect: function() {
					if( self.options.clearButton ) {
						self.clearElement.show();
					}
				}
			});

			// close dropdown list on window resize
			$(window).on('resize', function () {
				self._close();
			});
		},

		_suggest: function(items) {
			// Invoke the parent widget's method.
			this._super(items);

			//try to set focus if single result
			if( this.options.autoFocusSingleMatch && items.length==1 ) {
				this.menu.next();
			}
		}
	});

}(jQuery));