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
var Style = require( "./Style" );

var DOM = module.exports =
{
    /**
     * Add a CSS class to given element
     *
     * @public
     *
     * @param {Element} element
     * @param {string} className
     */
    addClass : function( element, className )
    {
        element.classList.add( className );
    },

    /**
     * remove a CSS className from given element, can also be a list of multiple
     * arguments to remove multiple classes in one go
     *
     * @public
     *
     * @param {Element} element
     * @param {string} className
     * @param {...string} var_args
     */
    removeClass : function( element, className, var_args )
    {
        if ( !var_args )
        {
            element.classList.remove( className );
        }
        else
        {
            var i = arguments.length;

            while ( i-- )
            {
                element.classList.remove( arguments[ i ] );
            }
        }
    },

    /**
     * query whether given HTML element has a specific class name
     *
     * @public
     *
     * @param {Element} element
     * @param {string} className the class to test for
     * @return {boolean}
     */
    hasClass : function( element, className )
    {
        return element.classList.contains( className );
    },

    /**
     * retrieve the x- and y-coordinates of a given element
     *
     * @public
     *
     * @param {Element} aElement
     * @param {boolean=} aAbsolute optional, when true the position relative
     *                   to the document will be calculated, defaults to false
     *
     * @return {{ x: number, y: number }}
     */
    getElementCoordinates : function( aElement, aAbsolute )
    {
        var theElement = /** @type {Element} */ ( aElement );

        var left = 0;
        var top  = 0;

        if ( aAbsolute )
        {
            while ( theElement.offsetParent )
            {
                left      += theElement.offsetLeft;
                top       += theElement.offsetTop;
                theElement = theElement.offsetParent;
            }
        }

        left += theElement.offsetLeft;
        top  += theElement.offsetTop;

        return { x : left, y : top };
    },

    /**
     * @public
     *
     * @param {Element} aElement
     * @return {{ width: number, height: number }}
     */
    getElementSize : function( aElement )
    {
        /**
         * Gets the height and with of an element when the display is not none.
         */
        function getSizeWithDisplay( element )
        {
            return { width : element.offsetWidth, height : element.offsetHeight };
        }

        if ( Style.getStyle( aElement, "display" ) !== "none" ) {
            return getSizeWithDisplay( aElement );
        }

        var style = aElement.style;
        var originalDisplay = style.display;
        var originalVisibility = style.visibility;
        var originalPosition = style.position;

        style.visibility = 'hidden';
        style.position = 'absolute';
        style.display = 'inline';

        var size = getSizeWithDisplay( aElement );

        style.display    = originalDisplay;
        style.position   = originalPosition;
        style.visibility = originalVisibility;

        return size;
    },

    /**
     * @public
     * @return {number}
     */
    getAvailableViewportX : function()
    {
        if ( !window.navigator.userAgent.indexOf( "MSIE" ) > -1 )
            return window.innerWidth;
        else
            return document.documentElement.clientWidth;
    },

    /**
     * @public
     * @return {number}
     */
    getAvailableViewportY : function()
    {
        if ( !window.navigator.userAgent.indexOf( "MSIE" ) > -1 )
            return window.innerHeight;
        else
            return document.documentElement.clientHeight;
    }
};
