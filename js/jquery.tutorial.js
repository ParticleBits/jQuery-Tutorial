/*!
 * jQuery Tutorial Plugin
 * version: 1.0 (2001-Jun-25)
 * author: Mike Gioia (mike [at] particlebits [dot] com)
 * url: 
 * @requires jQuery v1.4 or later
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
;(function($) {

/**
 * Initialize the tutorial and start it up
 * 
 * Location options can take any of the following:
 *   tl: top left
 *   tc: top center
 *   tr: top right
 *   ml: middle left
 *   mr: middle right
 *   bl: bottom left
 *   bc: bottom center
 *   br: bottom right
 */
$.fn.tutorial = function( options ) 
{
    // fast fail if nothing selected
    //
    if ( ! this.length ) {
        return this;
    }
    
    // default options
    //
    options = $.extend( true, {
        location:           'tl',
        width:              320,
        opacity:            0.4,
        bounce:             false
    }, options );
    
                
    // if the guide isn't hidden, hide it now. enable the options.
    //
    var id = this.attr( 'id' );
    this.hide();
    this.css( 'width', options.width );
                
    // loop through the guide wrapper and set up each content div.
    // their data-target attribute should point to the element on the page
    // they would like to target, and their data-arrow attribute should
    // be the location code for the arrow. if none is set then the
    // default settings option is used. if no data-target attribute is 
    // set then do not display any arrow.
    //
    var count = 0;
    this.find( 'div' ).each( function() {
        var $this = $(this);
        count++;
        $this.hide();
        $this.data( 'properties', {
            target: ( $this.attr( 'data-target' ) ) ? $this.attr( 'data-target' ) : null,
            arrow: ( $this.attr( 'data-arrow' ) ) ? $this.attr( 'data-arrow' ) : settings.arrow
        });
    });
            
    this.data( 'count', count );
    this.data( 'index', 1 );
    this.data( 'options', options );
   
    // show the tutorial and create the overlay
    //
    $( 'body' ).prepend( '<div id="' + id + '-overlay" class="tutorial-overlay"></div>' );
    $('#tutorial-overlay').hide();
    $('#tutorial-overlay').css( { opacity: options.opacity } );
    $('#tutorial-overlay').show();
    
    // create the cancel button and the finished button
    //
    this.append( '<a id="' + id + '-done" class="tutorial-button" href="javascript:void(0);">Done!</a>' );
    
    $( '#' + id + '-done' ).click( function() {
        $('#' + id).tutorialCancel(); 
    });
    
    this.append( '<a id="' + id + '-cancel" class="tutorial-cancel" href="javascript:void(0);">X</a>' );
    
    $( '#' + id + '-cancel' ).click( function() {
        $('#' + id).tutorialCancel(); 
    });
    
    // create the next/prev buttons if count is more than 1
    //
    if ( this.data( 'count' ) > 1 ) {
        this.append( '<a id="' + id + '-next" class="tutorial-button" type="button" href="javascript:void(0);">Next</a>' );
        this.append( '<a id="' + id + '-prev" class="tutorial-button" type="button" href="javascript:void(0);">Prev</a>' );
    
        $( '#' + id + '-prev' ).click( function() {
            $('#' + id).tutorialPrev();
        }).hide();
        
        $( '#' + id + '-next' ).click( function() {
            $('#' + id).tutorialNext(); 
        });
        
        $( '#' + id + '-done' ).hide();
    }
    
    // start the tutorial
    //
    this.show();
    
    $.tutorialShowStep( this, this.data( 'index' ) );
}; 
// end $.fn.tutorial

$.fn.tutorialPrev = function()
{
    if ( this.data( 'index' ) <= 1 ) {
        this.data( 'index', this.data( 'count' ) );
    }
    else {
        this.data( 'index', this.data( 'index' ) - 1 );
    }
    
    $('#' + this.attr( 'id' ) + '-next' ).show();
    
    if ( this.data( 'index' ) <= 1 ) {
        $('#' + this.attr( 'id' ) + '-prev' ).hide();
    }
    
    if ( this.data( 'index' ) < this.data( 'count' ) ) {
        $('#' + this.attr( 'id' ) + '-done' ).hide();
    }
    
    $.tutorialShowStep( this, this.data( 'index' ) );
    
}; // end $.fn.tutorialNext

$.fn.tutorialNext = function()
{
    if ( this.data( 'index' ) >= this.data( 'count' ) ) {
        this.data( 'index', 1 );
    }
    else {
        this.data( 'index', this.data( 'index' ) + 1 );
    }
    
    $('#' + this.attr( 'id' ) + '-prev' ).show();
    
    if ( this.data( 'index' ) >= this.data( 'count' ) ) {
        $('#' + this.attr( 'id' ) + '-next' ).hide();
        $('#' + this.attr( 'id' ) + '-done' ).show();
    }
    
    $.tutorialShowStep( this, this.data( 'index' ) );
    
}; // end $.fn.tutorialPrev

$.fn.tutorialCancel = function()
{
    this.hide();
    $( '#' + this.attr( 'id' ) + '-overlay' ).remove();
    $( '.tutorial-arrow' ).remove();
    $( '.tutorial-button' ).remove();
    $( '#' + this.attr( 'id' ) + '-cancel' ).remove();
    
}; // end $.fn.tutorialCancel

/**
 * Display a step in the tutorial
 */
$.tutorialShowStep = function( el, index )
{
    el.find( 'div' ).hide();
    $( '.tutorial-arrow' ).remove();
    options = el.data( 'options' );
    
    
    var step = el.find( 'div:nth-child(' + index + ')' );
    var target = step.attr( 'data-target' );
    var arrow = step.attr( 'data-arrow' );
    
    if ( ! target ) {
        return this;
    }
    
    step.show();
    
    var targetTop = $(target).offset().top;
    var targetLeft = $(target).offset().left;
    var windowHeight = $(window).height();
    
    // compute the scroll to value, we want a little padding at the bottom
    // of the page (about 100px)
    //
    $("html, body").animate({ scrollTop: targetTop + 100 - windowHeight }, 500);

    // if we have an arrow add that to the DOM wherever they specified. we
    // need to compute the offset of based on their location preference.
    //
    if ( arrow ) {
        var arrowImg = $( "<div><div/>").attr( 'id', 'tutorial-arrow-' + index ).addClass( 'tutorial-arrow ' + arrow );

        switch ( arrow ) {
            case 'tl':
            case 'tc':
            case 'tr':
                var offsetTop = 48;
                var offsetLeft = ( $(target).outerWidth() / 2 ) - 24;
                var bounceTop = targetTop - offsetTop - $(target).outerHeight();
                var bounceDistance = 20;
                break;
            case 'ml':
            case 'mr':
            case 'bl':
            case 'bc':
            case 'br':
                var offsetTop = $(target).outerHeight() * -1;
                var offsetLeft = ( $(target).outerWidth() / 2 ) - 24;
                var bounceTop = targetTop - offsetTop;
                var bounceDistance = 20;
                break;
        }
        
        arrowImg.offset({ top: targetTop - offsetTop, left: targetLeft + offsetLeft });
        $( 'body' ).prepend( arrowImg );
        
        if ( options.bounce ) {
            $.tutorialBounce( $('#tutorial-arrow-' + index ), 500, bounceTop, bounceDistance );
        }
    }
}; 
// end $.tutorialShowStep 

$.tutorialBounce = function( el, speed, top, distance )
{
    if ( ! el.length ) {
        return false; 
    }
    el.css( { top: top } );
    el.animate(
        { 'top': top + distance },
        {
            duration: speed,
            complete: function() {
                el.css( { top: top + distance } );
                el.animate(
                    { 'top': top },
                    {
                        duration: speed,
                        complete: function() {
                            $.tutorialBounce( el, speed, top, distance );
                        }
                    }
                ); // end up animate    
            }
        }
    ); // end down animate
};

})(jQuery);
