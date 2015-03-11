/**
 * The MIT License (MIT)
 *
 * Igor Zinken 2012 - 2015 - http://www.igorski.nl
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
module.exports = Sprite;

var Inheritance     = require( "./Inheritance" );
var Event           = require( "./Event" );
var EventDispatcher = require( "./EventDispatcher" );
var EventHandler    = require( "./EventHandler" );
var DOM             = require( "./DOM" );
var Style           = require( "./Style" );
var ArrayUtil       = require( "./utils/ArrayUtil" );

/**
 * A wrapper providing a convenient API to manage a DOM element, provides
 * Event handling and "display list"s
 *
 * extends a basic EventTarget for dispatching events
 *
 * @constructor
 *
 * @param {string|Element|Node|Window|HTMLDocument=} aElement when String: this function will create an element in the
 *                                   DOM with the String as tag name.
 *                                   when HTMLElement: this function will bind the Sprite class to the existing
 *                                   HTMLElement (for use when connecting existing HTML templates with the framework)
 * @param {Object=} aProperties      optional properties for the HTML Element ( eg: id, class, etc. )
 * @param {string=} aContent         optional body content of this Sprite (innerHTML)
 *
 * @extends {EventDispatcher}
 */
function Sprite( aElement, aProperties, aContent )
{
    aProperties    = aProperties || {};
    var domElement = "div";

    if ( aElement && typeof aElement !== "object" )
    {
        domElement = /** @type {string} */ ( aElement);
    }

    /* creates HTML element of requested tag type in the DOM */

    if ( !aElement || typeof aElement === "string" )
    {
        this._element = document.createElement( domElement );
    }
    else
    {
        this._element = /** @type {Element} */ ( aElement );
    }

    Object.keys( aProperties ).forEach( function( key )
    {
        this._element.setAttribute( key, aProperties[ key ]);

    }.bind( this ));


    if ( aContent )
    {
        this.setContent( aContent );
    }
    this._children = [];

    Inheritance.super( this );

    this._eventHandler = new EventHandler(); // separate handler for DOM Events
}

Inheritance.extend( Sprite, EventDispatcher );

/* class constants */

/** @public @const @type {string} */ Sprite.INITIALIZED;
/** @public @const @type {string} */ Sprite.ADDED_TO_STAGE;
/** @public @const @type {string} */ Sprite.REMOVED_FROM_STAGE;

/* class variables */

/**
 *  the child elements attached to this Object / ""display list""
 *
 *  @protected
 *  @type {Array.<Sprite>}
 */
Sprite.prototype._children;

/**
 * stores a reference to the containing Sprite
 *
 * @protected
 * @type {Sprite}
 */
Sprite.prototype._parent;

/**
 * whether dispatched events must traverse via this Sprites
 * parent(s) through the ""display list""
 *
 * @protected
 * @type {boolean}
 */
Sprite.prototype._useEventBubbling = false;

/**
 * whether the init method has been executed
 *
 * @protected
 * @type {boolean}
 */
Sprite.prototype.initialized = false;

/**
 * the HTML element representing this Object in the DOM
 *
 * @protected
 * @type {Element}
 */
Sprite.prototype._element;

/**
 * @private
 * @type {EventHandler}
 */
Sprite.prototype._eventHandler;

/**
 * wrapped handlers for all DOM events attached to this Sprite's
 * element (cached for memory cleanup / removal purposes)
 *
 * @private
 * @type {Array.<{ type: string, fn: !Function, orgfn: !Function }>}
 */
Sprite.prototype._proxiedHandlers;

/* public methods */

/**
 * Listen for Events with type of given aType and execute
 * given callback aHandler
 *
 * @override
 * @public
 *
 * @param {string} aType The type of the event to listen for.
 * @param {Function|Object} aHandler The function to handle the event. The
 *        handler can also be an object that implements the handleEvent method
 *        which takes the event object as argument.
 */
Sprite.prototype.addEventListener = function( aType, aHandler )
{
    // if aType is a DOM Event we register it onto this
    // Sprites _element using the _eventHandler

    if ( this.isDOMEvent( aType ))
    {
        var self = this;

        // wrap the callback invocation to reference the Sprite, NOT the DOM node as its target

        var proxiedHandler = function( e )
        {
            var event      = new Event( aType );
            event.target   = self;
            event.srcEvent = e;

            aHandler( event );
        };

        if ( this._proxiedHandlers == null ) {
            this._proxiedHandlers = [];
        }

        this._proxiedHandlers.push({ type : aType, fn : proxiedHandler, orgfn : aHandler });
        this._eventHandler.addEventListener( this._element, aType, proxiedHandler );
    }
    else
    {
        // non-DOM Event, invoke base class method
        Inheritance.super( this, "addEventListener", aType, aHandler );
    }
};

/**
 * Remove listeners for Events with type of given aType
 *
 * @override
 * @public
 *
 * @param {string} aType The type of the event to listen for.
 * @param {Function|Object} aHandler The function to handle the event. The
 *     handler can also be an object that implements the handleEvent method
 *     which takes the event object as argument.
 */
Sprite.prototype.removeEventListener = function( aType, aHandler )
{
    // if this was a DOM Event (registered unto this Sprites _element)
    // we remove it from the _eventHandler

    if ( this.isDOMEvent( aType ) && this._proxiedHandlers )
    {
        var i = this._proxiedHandlers.length;

        while ( i-- )
        {
            var handler = this._proxiedHandlers[ i ];

            if ( handler.type === aType && handler.orgfn === aHandler )
            {
                this._eventHandler.removeEventListener( this._element, aType );
                this._proxiedHandlers.splice( i, 1 );
                return;
            }
        }
    }
    else {
        // non-DOM Event, invoke base class method
        Inheritance.super( this, "removeEventListener", aType );
    }
};

/**
 * broadcast a given Event
 *
 * @override
 * @public
 *
 * @param aEvent {Event} the Event to dispatch
 */
Sprite.prototype.dispatchEvent = function( aEvent )
{
    Inheritance.super( this, "dispatchEvent", aEvent );

    // Event bubbling ?
    if ( this._useEventBubbling && this._parent ) {
        this._parent.dispatchEvent( aEvent );
    }
};

/**
 * when adding an event listener, the Sprite class queries this function whether the
 * request function is a DOM function. If it is, the listener should be added to the
 * Sprite's _element instead of the Sprite Class itself
 *
 * @protected
 *
 * @param {string} aEventName
 * @return {boolean}
 */
Sprite.prototype.isDOMEvent = function( aEventName )
{
    var domEvents = Event.DOM_EVENTS, i = domEvents.length;

    while ( i-- )
    {
        if ( domEvents[ i ] === aEventName )
            return true;
    }
    return false;
};

/**
 * retrieve the HTML Element representing this Sprite
 * in the document
 *
 * @override
 * @public
 *
 * @return {Element}
 */
Sprite.prototype.getElement = function()
{
    return this._element;
};

/**
 * set this content (innerHTML) of this Sprite's
 * HTML element
 *
 * @public
 *
 * @param {string} aContent
 */
Sprite.prototype.setContent = function( aContent )
{
    this._element.innerHTML = aContent;
};

/**
 * retrieve an attribute from this Sprites element
 *
 * @public
 *
 * @param {string} aAttributeName
 * @return {string}
 */
Sprite.prototype.getAttribute = function( aAttributeName )
{
    return this._element.getAttribute( aAttributeName );
};

/**
 * set an attribute unto this Sprites element
 *
 * @public
 *
 * @param {string} aAttributeName
 * @param {string} aAttributeValue
 */
Sprite.prototype.setAttribute = function( aAttributeName, aAttributeValue )
{
    this._element.setAttribute( aAttributeName, aAttributeValue );
};

/**
 * removes an attribute from this Sprites element
 *
 * @public
 *
 * @param {string} aAttributeName
 */
Sprite.prototype.removeAttribute = function( aAttributeName )
{
    this._element.removeAttribute( aAttributeName );
};

/**
 * retrieve a data attribute from this Sprites element, NOTE : "data-"-prefix
 * is prepended automatically to the attribute name
 *
 * @public
 *
 * @param {string} aDataAttributeName
 * @return {string}
 */
Sprite.prototype.getDataAttribute = function( aDataAttributeName )
{
    return this.getAttribute( "data-" + aDataAttributeName );
};

/**
 * set a data attribute unto this Sprites element, NOTE : "data-"-prefix
 * is prepended automatically to the attribute name
 *
 * @public
 *
 * @param {string} aDataAttributeName
 * @param {string} aAttributeValue
 */
Sprite.prototype.setDataAttribute = function( aDataAttributeName, aAttributeValue )
{
    this._element.setAttribute( "data-" + aDataAttributeName, aAttributeValue );
};

/**
 * set a reference to the parent sprite containing this one, optionally enable
 * dispatched Events to bubble down to the parent
 *
 * @override
 * @public
 *
 * @param {Sprite} aParent
 * @param {boolean=} aUseEventBubbling whether we want to use event bubbling
 *                   which will dispatch this Sprites events through to the parent
 */
Sprite.prototype.setParent = function( aParent, aUseEventBubbling )
{
    this._parent = aParent;

    if ( aUseEventBubbling ) {
        this.setEventBubbling( aUseEventBubbling );
    }
};

/**
 * @public
 * @return {Sprite} parent
 */
Sprite.prototype.getParent = function()
{
    return this._parent;
};

/**
 * get a child of this Sprite by its index in the "display list"
 /
 * @public
 *
 * @param {number} aIndex of the object in the "display list"
 * @return {Sprite} the referenced object
 */
Sprite.prototype.getChildAt = function( aIndex )
{
    return this._children[ aIndex ];
};

/**
 * remove a child from this object's "display list" at the given index
 *
 * @public
 * @param {number} aIndex of the object to remove
 *
 * @return {Sprite} the removed child
 */
Sprite.prototype.removeChildAt = function( aIndex )
{
    return this.removeChild( this.getChildAt( aIndex ));
};

/**
 * @public
 *
 * @param {Sprite} aSprite
 * @return {number}
 */
Sprite.prototype.getChildIndex = function( aSprite )
{
    return ArrayUtil.getItemIndex( this._children, aSprite );
};

/**
 * swap the order of the given sprites
 *
 * @public
 *
 * @param {Sprite} aSprite1
 * @param {Sprite} aSprite2
 */
Sprite.prototype.swapChildren = function( aSprite1, aSprite2 )
{
    if ( this.getChildIndex( aSprite1 ) > this.getChildIndex( aSprite2 ) )
    {
        this.addChildBefore( aSprite1, aSprite2 );
    }
    else {
        this.addChildBefore( aSprite2, aSprite1 );
    }
};

/**
 * @public
 * @return {number} the amount of children in this objects "display list"
 */
Sprite.prototype.numChildren = function()
{
    return this._children.length;
};

/**
 * @public
 *
 * @return {Array.<Sprite>}
 */
Sprite.prototype.getChildren = function()
{
    return this._children;
};

/**
 * check whether a given display object is present in this object's "display list"
 *
 * @public
 * @param {Sprite} child
 * @return {boolean}
 */
Sprite.prototype.contains = function( child )
{
    var i = this.numChildren();

    while( i-- )
    {
        if ( this._children[ i ] == child ) {
            return true;
        }
    }
    return false;
};

/**
 * appends an HTML element to this element, use only when
 * appended elements don't need Sprite functions
 *
 * @param  {Element} aElement
 * @return {Sprite} this object - for chaining purposes
 *
 * @public
 */
Sprite.prototype.addElement = function( aElement )
{
    this._element.appendChild( aElement);
    return this;
};

/**
 * removes an HTML element from this element
 *
 * @public
 *
 * @param {Element} aElement
 */
Sprite.prototype.removeElement = function( aElement )
{
    this._element.removeChild( aElement);
    return this;
};

/**
 * append a Sprite to the ""display list"" of this Sprite, this will
 * effectively append the Child sprites Element as the child
 * of this Sprites Element
 *
 * @public
 *
 * @param {Sprite} aChild
 * @return {Sprite} this object - for chaining purposes
 */
Sprite.prototype.addChild = function( aChild )
{
    this._element.appendChild( aChild.getElement());

    aChild.setParent( this, this._useEventBubbling );
    this._children.push( aChild);
    aChild.onAddedToStage();

    // if the current Sprite uses Event bubbling, make
    // sure the sub children of the added child also bubble

    if ( this._useEventBubbling )
    {
        var i = aChild.numChildren();

        while ( i-- )
        {
            var subChild = aChild.getChildAt( i );
            subChild.setEventBubbling( true );
        }
    }
    return this;
};

/**
 * append a Sprite to this Sprites ""display list"", at a definitive
 * index (will also affect HTML element ordering)
 *
 * @public
 *
 * @param {Sprite} aChild
 * @param {number} aIndex
 *
 * @return {Sprite} this object - for chaining purposes
 */
Sprite.prototype.addChildAt = function( aChild, aIndex )
{
    var parent = this._element;
    parent.insertBefore( aChild.getElement(), parent.childNodes[ aIndex ]);

    aChild.setParent( this, this._useEventBubbling );
    this._children.splice( aIndex, 0, aChild );
    aChild.onAddedToStage();

    return this;
};

/**
 * @public
 *
 * @param {Sprite} aChild
 * @param {Sprite} aRefNode
 *
 * @return {Sprite} this object - for chaining purposes
 */
Sprite.prototype.addChildBefore = function( aChild, aRefNode )
{
    var theIndex = this.getChildIndex( aRefNode );
    return this.addChildAt( aChild, theIndex );
};

/**
 * @public
 *
 * @param {Sprite} aChild
 * @return {Sprite} this object - for chaining purposes
 */
Sprite.prototype.prependChild = function( aChild )
{
    var parent = this._element;
    parent.insertBefore( aChild.getElement(), parent.childNodes[ 0 ]);

    aChild.setParent( this, this._useEventBubbling );
    this._children.unshift( aChild );
    aChild.onAddedToStage();

    return this;
};

/**
 * @public
 * @param {Sprite} aChild the child to remove from this Objects "display list"
 *
 * @return {Sprite} the removed child
 */
Sprite.prototype.removeChild = function( aChild )
{
    aChild.setParent( null );

    if ( aChild.getElement().parentNode === this._element )
    {
        this._element.removeChild( aChild.getElement());
        aChild.onRemovedFromStage();
    }

    // update children array

    var i = this._children.length, dlc;

    while ( i-- )
    {
        dlc = this._children[ i ];

        if ( dlc === aChild )
        {
            this._children.splice( i, 1 );
            break;
        }
    }
    return aChild;
};

/**
 * @public
 *
 * @param {Sprite} aChild
 * @return {boolean}
 */
Sprite.prototype.hasChild = function( aChild )
{
    return this._children.indexOf( aChild ) !== -1;
};

/**
 * retrieve the x- and y coordinate for this Sprites HTML element
 * (relative to the document)
 *
 * @public
 *
 * @return {{ x: number, y:number }}
 */
Sprite.prototype.getCoordinate = function()
{
    return DOM.getElementCoordinates( this._element, true );
};

/**
 * retrieves a Rectangle for this Sprite HTML elements current
 * coordinates and dimensions
 *
 * @public
 *
 * @return {{
 *             x: number, y:number, width: number, height: number
 *         }}
 */
Sprite.prototype.getRectangle = function()
{
    var coords     = this.getCoordinate();
    var dimensions = this.getDimensions();

    return { x: coords.x, y: coords.y, width: dimensions.width, height: dimensions.height };
};

/**
 * retrieves the width and height of this Sprites HTML element
 *
 * @public
 * @return {{ width: number, height: number }}
 */
Sprite.prototype.getDimensions = function()
{
    return DOM.getElementSize( this._element);
};

/**
 * Get computed style from element.
 *
 * @public
 * @param {string} styleRule
 * @return {string} style value
 */
Sprite.prototype.getStyle = function( styleRule )
{
    return Style.getStyle( this._element, styleRule );
};

/**
 * Set style on element
 *
 * @public
 * @param {string} styleRule
 * @param {string|number|boolean} value
 */
Sprite.prototype.setStyle = function( styleRule, value )
{
    Style.setStyle( this._element, styleRule, value );
};

/**
 * set multiple styles on element defined in Object:
 * {
 *     'rule': 'value'
 * }
 *
 * @public
 *
 * @param {Object} styleDefinitions
 */
Sprite.prototype.setStyles = function( styleDefinitions )
{
    for ( var i in styleDefinitions )
    {
        if ( styleDefinitions.hasOwnProperty( i )) {
            this.setStyle( i, styleDefinitions[ i ]);
        }
    }
};

/**
 * Add a CSS class to the element
 *
 * @public
 *
 * @param {string} className
 */
Sprite.prototype.addClass = function( className )
{
    DOM.addClass( this._element, className );
};

/**
 * remove a CSS className from the element, can also be a list of multiple
 * arguments to remove multiple classes in one go
 *
 * @public
 *
 * @param {string} className
 * @param {...string} var_args
 */
Sprite.prototype.removeClass = function( className, var_args )
{
    if ( !var_args )
    {
        this._element.classList.remove( className );
    }
    else
    {
        var i = arguments.length;

        while ( i-- )
        {
            this._element.classList.remove( arguments[ i ] );
        }
    }
};

/**
 * query whether the HTML element has a specific class name
 *
 * @public
 *
 * @param {string} className the class to test for
 * @return {boolean}
 */
Sprite.prototype.hasClass = function( className )
{
    return DOM.hasClass( this._element, className );
};

/**
 * toggle visibility ( display property, removes element from
 * rendering in the DOM and blocks firing of events )
 *
 * @public
 * @param {string=} aDisplayPropertyValue optional, a value for the display property
 *                  defaults to "block", see http://www.w3schools.com/cssref/pr_class_display.asp
 *                  for full list of optional values
 */
Sprite.prototype.show = function( aDisplayPropertyValue )
{
    var visiblityProperty = "display";

    if ( typeof aDisplayPropertyValue !== "string" )
    {
        aDisplayPropertyValue = "block";
    }

    if ( this._element ) {
        this.setStyle( visiblityProperty, aDisplayPropertyValue );
    }
};

/**
 * @public
 */
Sprite.prototype.hide = function()
{
    var visiblityProperty = "display";

    if ( this._element ) {
       this.setStyle( visiblityProperty, "none" );
    }
};

/**
 * whether to use Event bubbling (Events dispatched over this
 * Sprite will bubble down the "display list" to its parent)
 *
 * @public
 * @param {boolean} aValue
 */
Sprite.prototype.setEventBubbling = function( aValue )
{
    this._useEventBubbling = aValue;
};

/* event handlers */

/**
 * invoked after this Sprite has been added to the ""display list""
 *
 * @public
 */
Sprite.prototype.onAddedToStage = function()
{
    if ( !this.initialized )
    {
        this.init();
    }

    // notify this sprites children they're visible again
    var i = this._children.length;
    while ( i-- )
    {
        this._children[ i ].onAddedToStage();
    }

    // broadcast an added Event
    this.dispatchEvent( new Event( Sprite.ADDED_TO_STAGE ));
};

/**
 * invoked after this Sprite has been removed from the ""display list""
 * @public
 */
Sprite.prototype.onRemovedFromStage = function()
{
    // notify this sprites children they're now invisible
    var i = this._children.length;
    while ( i-- )
    {
        this._children[ i ].onRemovedFromStage();
    }

    // broadcast removed Event
    this.dispatchEvent( new Event( Sprite.REMOVED_FROM_STAGE ));
};

/**
 * @public
 *
 * @param {boolean=} deep optional whether to use a deep clone, defaults to false *
 * @return {Sprite}
 */
Sprite.prototype.clone = function( deep )
{
    var deepClone = typeof deep === "boolean" ? deep : false;
    var result    = new Sprite( this._element.cloneNode( deepClone ));

    // Cycle through children
    for ( var i = 0; i < this.numChildren(); ++i )
    {
        var child = this.getChildAt( i );
        if ( child instanceof Sprite )
        {
            var clonedChild = child.clone( deepClone );
            result.addChild( clonedChild );
        }
    }
    return result;
};

/* protected methods */

/**
 * invoked when the Sprite is first added to the "display list"
 *
 * @protected
 */
Sprite.prototype.init = function()
{
    /** override in sub class
     * don't forget invoking a super call ( via Inheritance.super( this, "init" ) ... )
     * so the initializationComplete call is fired, preventing double initialization
     * when adding / removing a Sprite
     */
    this.initializationComplete();
};

/**
 * @protected
 */
Sprite.prototype.initializationComplete = function()
{
    this.initialized = true;
    this.dispatchEvent( new Event( Sprite.INITIALIZED ));
};

/**
 * @override
 * @protected
 */
Sprite.prototype.disposeInternal = function()
{
    this._eventHandler.dispose();

    // remove from the "display list" in case element still has a parent

    if ( this._parent ) {
        this._parent.removeChild( this );
    }

    // dispose the children of the child
    var i = this.numChildren();

    while ( i-- )
    {
        var theChild = this._children[ i ];

        this.removeChild( theChild );
        theChild.dispose();
    }
    this._children = [];

    this.initialized = false;

    Inheritance.super( this, "disposeInternal" );
};
