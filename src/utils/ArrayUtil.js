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
var Disposable = require( "../Disposable" );
var StringUtil = require( "./StringUtil" );

var ArrayUtil = module.exports =
{
    /**
     * Determines whether or not the given collection contains any items.
     *
     * @public
     *
     * @param {Array.<*>} collection the Array to test.
     * @return {boolean}
     */
    hasLength : function( collection )
    {
        return collection !== null && collection.length > 0;
    },

    /**
     * queries whether a specific item is present in a given array collection
     *
     * @public
     *
     * @param {Array.<*>} arrayCollection
     * @param {*} item
     * @return {boolean}
     */
    hasItem : function( arrayCollection, item )
    {
        return ArrayUtil.getItemIndex( arrayCollection, item ) > -1;
    },

    /**
     * @public
     *
     * @param {Array.<*>} expected
     * @param {Array.<*>} actual
     *
     * @return {boolean}
     */
    equals : function( expected, actual )
    {
        if ( expected == null && actual == null )
        {
            return true;
        }

        if ( expected == null || actual == null )
        {
            return false;
        }

        if ( expected.length != actual.length )
        {
            return false;
        }

        for ( var i = 0, l = expected.length; i < l; ++i )
        {
            var item = expected[ i ];

            // check by using equals-method if item is IComparable

            if ( "equals" in item )
            {
                if ( !item[ "equals" ]( actual[ i ]))
                {
                    return false;
                }
            }
            else
            {
                // check by reference

                if ( item != actual[ i ])
                {
                    return false;
                }
            }
        }
        return true;
    },

    /**
     * checks whether the provided arrays all contain the exact same items in terms of content only, not necessarily in order of appearance
     *
     * @public
     *
     * @param {...Array.<*>} var_args
     * @return {boolean}
     */
    containSameItems: function( var_args )
    {
        var result = arguments.length > 1;

        if ( result )
        {
            var sampleArray = /** @type {Array.<*>} */ ( arguments[ 0 ] );
            if ( !( sampleArray instanceof Array ) ) return false;

            for ( var i = 1; i < arguments.length; i++ )
            {
                var currentArray = /** @type {Array.<*>} */ ( arguments[ i ].slice() );
                if ( !( currentArray instanceof Array ) ) {
                    return false;
                }
                result = sampleArray.length == currentArray.length;

                if ( result )
                {
                    var copySample = /** @type {Array.<*>} */ ( sampleArray.slice() );

                    while ( result && copySample.length > 0 && currentArray.length > 0 )
                    {
                        var item  = /** @type {Object} */ ( currentArray.pop() );
                        var index = copySample.indexOf( item );

                        if ( index == -1 ) {
                            result = false;
                        }
                        else {
                            copySample.splice( index, 1 );
                        }

                        if ( !result )
                        {
                            // Red alert! Try with EQUALS
                            for ( var j = 0; j < copySample.length; j++ )
                            {
                                var compare = copySample[ j ];
                                var equalsResult = false;

                                try
                                {
                                    equalsResult = compare[ "equals" ]( item );
                                }
                                catch( error ) {
                                    equalsResult = false;
                                }

                                if ( equalsResult )
                                {
                                    copySample.splice( j, 1 );
                                    result = true;      // Cancel red alert, found a match, we can go on.
                                    break;
                                }
                            }
                        }
                        if ( !result ) {
                            break;
                        }
                    }
                }
                if ( !result ) {
                    break;
                }
            }
        }
        return result;
    },

    /**
     * copies an Arraycollection by value instead of by reference
     *
     * @public
     *
     * @param {Array.<*>} value
     * @return {Array.<*>}
     */
    copy : function( value )
    {
        var copy = [];

        if ( value && value.length > 0 )
        {
            copy = copy.concat( value );
        }
        return copy;
    },

    /**
     * @public
     *
     * @param {Array.<*>} value
     * @return {Array.<*>}
     */
    clone : function( value )
    {
        var returnValue = null;

        if ( value != null )
        {
            returnValue = [];

            for ( var i = 0, l = value.length; i < l; ++i )
            {
                var item = value[ i ];

                if ( "clone" in item )
                {
                    returnValue.push( item[ "clone" ]() );
                }
                else
                {
                    // just copy the reference
                    returnValue.push( item );
                }
            }
        }
        return returnValue;
    },

    /**
     * concatenate multiple Arrays into a single Array
     * @public
     *
     * @param {...Array.<*>} var_args
     * @return {Array.<*>}
     */
    concat : function( var_args )
    {
        var concatenated = [];

        for ( var i = 0, l = arguments.length; i < l; ++i )
        {
            var collection = arguments[ i ];

            if ( collection == null ) {
                continue;
            }

            var length = collection.length;

            for ( var j = 0; j < length; j++ )
            {
                concatenated.push( collection[ j ]);
            }
        }
        return concatenated;
    },

    /**
     * concatenate multiple Arrays into a single Array
     * but with the additional check of omitting pushing
     * the same Objects twice
     *
     * @public
     *
     * @param {...Array.<*>} var_args
     * @return {Array.<*>}
     */
    concatNoDuplicates : function( var_args )
    {
        var concatenated = [];

        for ( var i = 0, l = arguments.length; i < l; ++i )
        {
            var collection = /** @type {Array.<*>} */ ( arguments[ i ] );

            if ( collection == null ) {
                continue;
            }

            var length = collection.length;

            for ( var j = 0; j < length; j++ )
            {
                if ( ArrayUtil.getItemIndex( concatenated, collection[ j ] ) == -1 )
                {
                    concatenated.push( collection[ j ]);
                }
            }
        }
        return concatenated;
    },

    /**
     * retrieve the numerical index of a specified item
     * within an ArrayCollection
     *
     * @public
     *
     * @param {Array.<*>} arrayCollection
     * @param {*} item
     * @return {number}
     */
    getItemIndex : function( arrayCollection, item )
    {
        for ( var i = 0, l = arrayCollection.length; i < l; ++i )
        {
            if ( arrayCollection[ i ] == item )
            {
                return i;
            }
        }
        return -1;
    },

    /**
     * push a new item to the collection at a specific index, shifting
     * all existing items further back
     *
     * @public
     *
     * @param {Array.<*>} arrayCollection
     * @param {*} item
     * @param {number} index
     */
    setItemAtIndex : function( arrayCollection, item, index )
    {
        if ( arrayCollection.length > index )
        {
            var remainder = arrayCollection.splice( index );

            arrayCollection[ index ] = item;
            arrayCollection.push.apply( arrayCollection, remainder );
        }
        else {
            arrayCollection[ index ] = item;
        }
    },

    /**
     * add an item to a given array collection, by first checking whether
     * it wasn't yet present (prevents double listing of the same Object reference)
     *
     * @public
     *
     * @param {Array.<*>} arrayCollection
     * @param {*} item
     *
     * @return {boolean}
     */
    setItemIfNotPresent : function( arrayCollection, item )
    {
        if ( !ArrayUtil.hasItem( arrayCollection, item ))
        {
            arrayCollection.push( item );
            return true;
        }
        return false;
    },

    /**
     * remove an item from a given array collection
     * returns success state (when false, item wasn't present in collection)
     *
     * @public
     *
     * @param {Array.<*>} arrayCollection
     * @param {*} item to remove from the arrayCollection
     * @return {boolean}
     */
    removeItem : function( arrayCollection, item )
    {
        var i = arrayCollection.length;

        while ( i-- )
        {
            if ( arrayCollection[ i ] == item )
            {
                ArrayUtil.removeItemAt( arrayCollection, i );
                return true;
            }
        }
        return false;
    },

    /**
     * remove an item at a specific index from a given array collection
     * returns success state (when false, index was out of collection bounds)
     *
     * @public
     *
     * @param {Array.<*>} arrayCollection
     * @param {number} index
     * @return {boolean}
     */
    removeItemAt : function( arrayCollection, index )
    {
        if ( arrayCollection.length >= ( index + 1 ))
        {
            arrayCollection.splice( index, 1 );
            return true;
        }
        return false;
    },

    /**
     * make sure a given Object is an Array, if it is not
     * its contents are wrapped in an Array / empty Array is returned
     *
     * @public
     *
     * @param {*} aObject
     * @return {Array.<*>}
     */
    assertArray : function( aObject )
    {
        if ( !( aObject instanceof Array ))
        {
            aObject = [ aObject ];
        }
        return aObject;
    },

    /**
     * query whether the contents of a given array collection
     * are all of the given type
     *
     * @public
     *
     * @param {Array.<*>} arrayCollection
     * @param {Function|Object} type
     * @return {boolean}
     */
    allItemsOfType : function( arrayCollection, type )
    {
        if ( ArrayUtil.hasLength( arrayCollection ))
        {
            for ( var i = 0, l = arrayCollection.length; i < l; ++i )
            {
                if ( !( arrayCollection[ i ] instanceof type )) {
                    return false;
                }
            }
            return true;
        }
        return true;
    },

    /**
     * clears the contents of an array collection and invokes the
     * dispose()-method on all items extending the Disposable
     *
     * @public
     *
     * @param {Array.<*>} arrayCollection
     */
    clearAndDisposeItems : function( arrayCollection )
    {
        var i = arrayCollection.length;

        while ( i-- )
        {
            var item = arrayCollection[ i ];

            if ( item instanceof Disposable )
            {
                /** @type {Disposable} */ ( item ).dispose();
            }
            arrayCollection.splice( i, 1 );
        }
    },

    /**
     * sorts the contents of an Array either alphabetically or numerically
     *
     * @public
     * @suppress {checkTypes}
     *
     * @param {Array.<*>} collection
     * @param {string} fieldName
     * @param {boolean=} isNumeric optional, whether fieldName value is numeric
     *                   defaults to false (which uses alphabetical sorting)
     */
    sort : function( collection, fieldName, isNumeric )
    {
        if ( isNumeric )
        {
            return collection.sort( function( x, y )
            {
                return x[ fieldName ] < y[ fieldName ]
            });
        }
        else
        {
            return collection.sort( function( x, y )
            {
                return x[ fieldName ] > y[ fieldName ]
            });
        }
    },


    /**
     * @public
     *
     * @param {Array} collection
     * @return {*}
     */
    randomItemFrom: function( collection )
    {
        return collection[ Math.floor( Math.random() * collection.length ) ];
    },

    /**
     * A collection of convenience conversion methods
     *
     * @typedef {{
     *              fromDelimitedStringToNumbers: Function
     *          }}
     */
    convert:
    {
        /**
         * @public
         * @param {string}      aCollectionString the string representing a collection with specified delimiter
         * @param {string=}     aDelimiter optional delimiter, defaults to ","
         * @param {boolean=}    aOmitNonNumericEntries optional, instructs to ignore non-convertible entries, defaults to false
         * @return {Array.<number>}
         */
        fromDelimitedStringToNumbers: function ( aCollectionString, aDelimiter, aOmitNonNumericEntries )
        {
            var result = [];
            if ( StringUtil.hasText(aCollectionString))
            {
                var delimiter       = aDelimiter || ",";
                var ignoreNaN       = aOmitNonNumericEntries || false;
                var splitCollection = aCollectionString.split( delimiter );

                if(splitCollection.length == 1)
                {
                    // Only one entry
                    result.push( aCollectionString );
                }
                else
                {
                    // Convert multiple entries
                    while ( splitCollection.length > 0 )
                    {
                        var entry = /** @type {string} */ ( splitCollection.shift() );
                        var converted = parseFloat( entry );
                        if ( isNaN( converted ) && ignoreNaN ) continue;
                        result.push( converted );
                    }
                }
            }
            return result;
        }
    }
};
