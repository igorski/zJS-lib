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
module.exports = Event;

/**
 * @constructor
 *
 * @param {string} aType
 * @param {*=} aOptValue
 */
function Event( aType, aOptValue )
{
    this.type  = aType;
    this.value = aOptValue;
}

/* class properties */

/**
 * the type identifying this Event
 *
 * @public
 * @type {string}
 */
Event.prototype.type;

/**
 * optional value associated with the Event
 *
 * @public
 * @type {*}
 */
Event.prototype.value;

/**
 * this property described the target where this
 * Event originated from
 *
 * @public
 * @type {Object}
 */
Event.prototype.target;

/**
 * if event bubbling is enabled on this events target, this
 * property will describe the last target that has dispatched this
 * Event as it propagated through the targets parents
 *
 * @public
 * @type {Object}
 */
Event.prototype.currentTarget;

/**
 * if this Event acts as a wrapper for a DOM Event, this
 * property will hold a reference to the DOM Event that
 * triggered the Event
 *
 * @public
 * @type {Event}
 */
Event.prototype.srcEvent;

/* class cosntants */

/**
 * a list of Events that can be registered onto DOM Elements
 * while the Event class can also be used to broadcast custom Event
 * types, this list can identify Events that are broadcast via
 * the DOM (should have the DOM Event stored in the "srcEvent"-property)
 *
 * @public
 *
 * @const
 * @type {Array.<string>}
 */
Event.DOM_EVENTS = [
    // mouse events
    'click',
    'dblclick',
    'mousedown',
    'mouseup',
    'mouseover',
    'mouseout',
    'mousemove',
    'selectstart', // IE, Safari, Chrome

    // Key events
    'keypress',
    'keydown',
    'keyup',

    // Focus
    'blur',
    'focus',
    'deactivate', // IE only
    'change',
    'select',
    'submit',
    'input',
    'propertychange', // IE only

    // Drag and drop
    'dragstart',
    'drag',
    'dragenter',
    'dragover',
    'dragleave',
    'drop',
    'dragend',

    // touch events.
    'touchstart',
    'touchmove',
    'touchend',
    'touchcancel',

    // Misc
    'beforeunload',
    'contextmenu',
    'error',
    'help',
    'load',
    'losecapture',
    'readystatechange',
    'resize',
    'scroll',
    'unload',

    'hashchange',
    'pagehide',
    'pageshow',
    'popstate',


    'online',
    'offline',
    'message',
    'connect'
];
