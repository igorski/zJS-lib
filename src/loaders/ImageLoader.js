/**
 * The MIT License (MIT)
 *
 * Igor Zinken 2014 - 2015 - http://www.igorski.nl
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
var EventHandler = require( "../EventHandler" );

module.exports =
{
    /**
     * @public
     *
     * @param {string}    aSource either base64 encoded bitmap data or (web)path
     *                    to an image file
     * @param {!Function=} aCallback callback handler to execute when Image has
     *                    finished loading and its contents are ready, the loaded
     *                    HTMLImageElement will be returned as its argument
     * @param {Image=}    aOptImage optional HTMLImageElement in case we'd like to
     *                    add a listener to an existing DOM element
     *
     * @return {Image} return Image with attached load handler
     */
    load : function( aSource, aCallback, aOptImage )
    {
        var out = aOptImage || new Image();

        var loadHandler = function( e )
        {
            // clean up listener
            handler.dispose();

            if ( typeof aCallback === "function" )
            {
                aCallback( out );    // invoke callback
            }
        };

        var handler = new EventHandler();
        handler.addEventListener( out, "load", loadHandler );

        // load the image
        out.src = aSource;

        return out;
    }
};
