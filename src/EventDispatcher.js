/**
 * The MIT License (MIT)
 *
 * Igor Zinken 2011 - 2015 - http://www.igorski.nl
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
module.exports = EventDispatcher;

var Inheritance = require( "./Inheritance" );
var Disposable  = require( "./Disposable" );
var Event       = require( "./Event" );

function EventDispatcher()
{
    this._eventMap = [];
}

Inheritance.extend( EventDispatcher, Disposable );

/* class properties */

/** @protected @type {Array.<Object>} */ EventDispatcher.prototype._eventMap;

/* public methods */

/**
 * listen for an Event with type aType, and execute given aCallback
 * when the Event is fired
 *
 * @public
 *
 * @param {string} aType
 * @param {!Function} aCallback
 */
EventDispatcher.prototype.addEventListener = function( aType, aCallback )
{
    if ( !this.hasEventListener( aType ))
    {
        this._eventMap.push({ "name"     : aType,
                              "callback" : aCallback
        });
    }
};

/**
 * remove the registered listener for an Event with
 * type of given aType
 *
 * @public
 *
 * @param {string} aType
 * @return {boolean}
 */
EventDispatcher.prototype.removeEventListener = function( aType )
{
    if ( this.hasEventListener( aType ))
    {
        this._eventMap.splice( this._findListenerByType( aType ), 1 );
        return true;
    }
    return false;
};

/**
 * whether a listener has been registered for an Event
 * with a type of given aType
 *
 * @public
 * @return {boolean}
 */
EventDispatcher.prototype.hasEventListener = function( aType )
{
    return this._findListenerByType( aType ) > -1;
};

/**
 * broadcast a given Event
 *
 * @public
 *
 * @param aEvent {Event} the Event to dispatch
 */
EventDispatcher.prototype.dispatchEvent = function( aEvent )
{
    /**
     * on first dispatch ( no "target" set, we reference this Object
     * as the Events target ), bubbling Events will pass this onto
     * the "currentTarget"-property */

    if ( !aEvent.target )
    {
        aEvent.target = this;
    }
    else {
        aEvent.currentTarget = this;
    }

    var theIndex = this._findListenerByType( aEvent.type );

    if ( theIndex > -1 )
        this._eventMap[ theIndex ].callback( aEvent );
};

/* private methods */

/**
 * internal function to lookup listeners
 *
 * @private
 *
 * @param {string} aType
 * @return {number}
 */
EventDispatcher.prototype._findListenerByType = function( aType )
{
    if ( !( this._eventMap instanceof Array )) {
        throw new Error( "EventDispatcher has nog event map (forgot Inheritance.super() in constructor?)" );
    }

    var i = this._eventMap.length;

    while ( i-- )
    {
        if ( this._eventMap[ i ].name === aType )
            return i;
    }
    return -1;
};
