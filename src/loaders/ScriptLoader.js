/**
 * The MIT License (MIT)
 *
 * Igor Zinken 2013 - 2015 - http://www.igorski.nl
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
var ScriptLoader = module.exports =
{
    /**
     * @public
     *
     * @param {String} filename path to script (local or remote)
     * @param {!Function} successHandler callback to fire after script has loaded successfully
     * @param {!Function} errorHandler callback to fire when script fails to load (e.g. not found,
     *                    no internet connection, etc.)
     */
    load: function( filename, successHandler, errorHandler )
    {
        if ( !document.getElementsByTagName || !document.createElement )
        {
            return;
        }
        var loaded    = false;
        var scriptTag = document.createElement( "script" );

        scriptTag.setAttribute( "type", "text/javascript" );
        scriptTag.setAttribute( "async", "true" );
        scriptTag.setAttribute( "src", filename );

         // IE, incl. IE9 (9 supports both onload and onreadystatechange so it might fire the callback twice!!)
        if ( scriptTag.readyState )
        {
            scriptTag.onreadystatechange = function()
            {
                if ( scriptTag.readyState == "loaded" || scriptTag.readyState == "complete" )
                {
                    scriptTag.onreadystatechange = null;

                    if ( typeof successHandler === "function" ) {
                        successHandler();
                    }
                }
            };
        }
        else {
            scriptTag.onload  = successHandler;
            scriptTag.onerror = errorHandler;
        }
        document.getElementsByTagName( "head" )[ 0 ].appendChild( scriptTag );
    }
};
