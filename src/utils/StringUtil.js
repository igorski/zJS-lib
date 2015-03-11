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
var StringUtil = module.exports =
{
    /**
     * Capitalize the first letter of string
     *
     * @public
     * @param   {string}    string
     * @return  String
     */
    capitalizeFirst: function( string )
    {
        return string.charAt( 0 ).toUpperCase() + string.slice( 1);
    },

    /**
     * Tests if the given object is a string
     *
     * @public
     * @param {*} object
     */
    isString : function( object )
    {
        return Object.prototype.toString.call( /** @type {Object} */ ( object )) == "[object String]";
    },

    /**
     * Determines whether or not the given value has text. A string has text when it is not <code>null</code>
     * and it has a length greater than 0 after trimming.
     *
     * @public
     * @param {string|null|undefined} value the String to test
     * @return {boolean}
     */
    hasText : function( value )
    {
        return value != null && StringUtil.trim( value ).length > 0;
    },

    /**
     * Determines whether a given string contains the given value
     *
     * @param {string} string
     * @param {string} value
     * @return {boolean}
     */
    contains : function( string, value )
    {
        if ( !StringUtil.hasText( string ) && StringUtil.hasText( value ))
        {
            return false;
        }
        return string.indexOf( value ) > - 1;
    },

    /**
     * Convert string to Boolean.
     *
     * @public
     * @param {string} string the String to convert to a boolean value
     * @return {boolean}
     */
    stringToBoolean : function( string )
    {
        if ( typeof string !== "string" ) {
            return false;
        }
        return ( string.toLowerCase() == "true" || string.toLowerCase() == "1" );
    },

    /**
     * Removes whitespace from the front and the end of the specified string.
     *
     * @public
     * @param {string} input The String whose beginning and ending whitespace will
     * will be removed.
     *
     * @return {string} A String with whitespace removed from the beginning and end
     */
    trim : function ( input )
    {
        return StringUtil.ltrim( StringUtil.rtrim( input ));
    },

    /**
     * Removes whitespace from the front of the specified string.
     *
     * @public
     * @param input The String whose beginning whitespace will will be removed.
     * @return {string} A String with whitespace removed from the beginning
     */
    ltrim : function( input )
    {
        var size = input.length;

        for ( var i = 0; i < size; i++ )
        {
            if ( input.charCodeAt( i ) > 32 )
            {
                return input.substring( i );
            }
        }
        return "";
    },

    /**
     * Removes whitespace from the end of the specified string.
     *
     * @public
     * @param {string} input The String whose ending whitespace will will be removed.
     * @return {string} A String with whitespace removed from the end
     */
    rtrim : function( input )
    {
        var size = input.length;

        for( var i = size; i > 0; i-- )
        {
            if( input.charCodeAt( i - 1 ) > 32)
            {
                return input.substring( 0, i );
            }
        }
        return "";
    },

    /**
     * determines whether a character or string
     * of characters is in uppercase
     *
     * @param {string} input
     */
    isUpperCase : function( input )
    {
        if ( input.length === 1 )
        {
            return input == input.toUpperCase();
        }
        else
        {
            var i = input.length;

            while ( i-- )
            {
                var character = input.charAt( i );

                if ( character != character.toUpperCase()) {
                    return false;
                }
            }
        }
        return true;
    },

    /**
     * truncate a string in case it exceeds the given length
     *
     * @public
     *
     * @param {string} input the input string to truncate if it exceeds the given length
     * @param {number} maxLength maximum length the input string may occupy
     * @param {string=} delimiter optional suffix to append to the string if it is
     *                  indeed truncated, defaults to ...
     *
     * @return {string}
     */
    truncate : function( input, maxLength, delimiter )
    {
        delimiter  = delimiter || "...";
        maxLength -= delimiter.length;

        if ( input.length > maxLength  ) {
            return input.substring( 0, maxLength - delimiter.length ) + delimiter;
        }
        return input;
    },

    /**
     * @public
     * @param {number} input
     * @param {number} desiredLength
     * @param {string=} filler
     */
    numberToFixedString: function( input, desiredLength, filler )
    {
        var filler = filler || "0";
        var result = input.toString();
        var integralPart = result.indexOf(".") > -1 ? result.split(".")[0] : result;
        var decimalPart = result.indexOf(".") > -1 ? result.split(".")[1] : "";
        while ( integralPart.length < desiredLength )
        {
            integralPart = "0" + integralPart;
        }
        return integralPart + ( decimalPart != "" ? "." : "" ) + decimalPart;
    },

    camelCase : function( aString )
    {
        return String( aString ).replace(/\-([a-z])/g, function( all, match ) {
            return match.toUpperCase();
        });
    }
};
