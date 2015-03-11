/**
 * The MIT License (MIT)
 *
 * Igor Zinken 2015 - http://www.igorski.nl
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of
 * this software and associated documentation files (the "Software"), to deal in
 * the Software without restriction, including without limitation the rights to
 * use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
 * the Software, and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
 * FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
 * IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */
var DOM    = require( "../DOM" );
var Sprite = require( "../Sprite" );

var fullscreenUtil = module.exports =
{
    /**
     * query whether the current device / browser
     * supports the fullscreen mode
     *
     * @public
     * @return {boolean}
     */
    isSupported : function()
    {
        var doc = document.documentElement;

        return doc[ "requestFullscreen" ] ||
               doc[ "webkitRequestFullScreen" ] ||
               doc[ "mozRequestFullScreen" ];
    },

    /**
     * query whether the application is currently running fullscreen
     *
     * @public
     * @return {boolean}
     */
    getFullscreen : function()
    {
        if ( !fullscreenUtil.isSupported() ) {
            return false;
        }
        return ( document[ "fullScreenElement" ] && document[ "fullScreenElement" ] !== null ) ||
               ( document[ "mozFullScreen" ] || document[ "webkitIsFullScreen" ]);
    },

    /**
     * set the fullscreen mode
     *
     * NOTE : this MUST be invoked as a short running user-generated event handler
     * as it might otherwise be blocked by browsers (that's you, Firefox), in other words
     * attach the click handler directly to this function, like so :
     *
     * someElement.addEventListener( goog.events.EventType.CLICK, function( e ) {
     *     fullscreenUtil.setFullscreen();
     * });
     *
     * @public
     * @param {Element=} optElement optional element to display in fullscreen mode, when
     *                   none is given, the entire document will be fullscreen
     */
    setFullscreen : function( optElement )
    {
        optElement = optElement || document.documentElement;

        if ( fullscreenUtil.isSupported() && !fullscreenUtil.getFullscreen())
        {
            if ( optElement[ "requestFullscreen" ] )
            {
                optElement[ "requestFullscreen" ]();
            }
            else if ( optElement[ "webkitRequestFullScreen" ] )
            {
                optElement[ "webkitRequestFullScreen" ]();
            }
            else if ( optElement[ "mozRequestFullScreen" ] )
            {
                optElement[ "mozRequestFullScreen" ]();
            }
            DOM.addClass( document.body, "is-fullscreen" );
        }
    },

    /**
     * return from the fullscreen mode
     *
     * @public
     */
    unsetFullscreen : function()
    {
        if ( document[ "cancelFullScreen" ] )
        {
            document[ "cancelFullScreen" ]();
        }
        else if ( document[ "webkitCancelFullScreen" ])
        {
            document[ "webkitCancelFullScreen" ]();
        }
        else if ( document[ "mozCancelFullScreen" ] )
        {
            document[ "mozCancelFullScreen" ]();
        }
        DOM.removeClass( document.body, "is-fullscreen" );
    },

    /**
     * create a button to toggle the fullscreen mode, with inline click handler
     * NOTE : this returns null if fullscreen mode isn't supported
     *
     * @public
     *
     * @return {Sprite|null}
     */
    createButton : function()
    {
        if ( fullscreenUtil.isSupported() )
        {
            var fullscreenBtn = new Sprite( "a", { "class" : "fullscreen-btn",
                                                   "href"  : 'javascript:void(0)' },
                                                   '<i class="icon-fullscreen"></i>' );

            // inline handler required to overcome block

            fullscreenBtn.addEventListener( "click", function( e )
            {
                if ( !fullscreenUtil.getFullscreen() ) {
                    fullscreenUtil.setFullscreen();
                }
                else {
                    fullscreenUtil.unsetFullscreen();
                }
            });
            return fullscreenBtn;
        }
        return null;
    }
};
