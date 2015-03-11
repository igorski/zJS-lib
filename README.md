# zjslib...

...is a small library of utilities providing wrappers for DOM manipulation, a easily disposable listener interface as well
as patterns that aid in a OOP-style of programming.

## requirements

zjslib is written for node.js projects and uses CommonJS to resolve its dependencies. You can use a tool like Browserify to
build the code for use in a webbrowser.

## DOM

Provides utilities for working with DOM contents, e.g. calculate positions, dimensions, etc.

## Disposable

Provide an interface prototype that functions as the outline for any kind of Object that should have its own cleanup routine.
A use case would be an Object that attaches a lot of listeners that need to be removed when the Object is to be dismissed, avoiding
memory leaks.

The prototype provides a "public method" :

    dispose()

Which will invoke its "internal" :

    disposeInternal()

handler, which should be overridden in your derived prototypes to include custom cleanup logic.

## Event

A wrapper for an Event dispatched by a Sprite (see below). This wrapper provides a reference to the Sprite, as well as the
DOM Element that first dispatched the Event (if the Event was a DOM event, such as mouse / touch events, etc.)

## EventDispatcher

An Object that can register itself to listen to Events, as well as broadcast them. EventDispatcher is also _Disposable_ and
as such can instantly clean up its listeners when invoking the _dispose()_-method.

Its methods are :

    addEventListener( aType, aCallback );

listen to events of given type (String) aType and execute given (Function) aCallback when the Event is dispatched. Note that
only ONE unique callback can be registered for each unique event type. If you wish to execute multiple callbacks for a single
event wrap these in a single function, or consider changing your design pattern!

    removeEventListener( aType );

removes the previously registered listener for an event with given type (String) aType.

    hasEventListener( aType );

returns boolean true/false if a listener for given type (String) aType has been registered.

    dispatchEvent( aEvent );

broadcast given (Event) aEvent to all listeners.

## EventHandler

A wrapper that can listen to Events broadcast by multiple different EventDispatchers / DOM Elements. EventHandler is also _Disposable_ and
can as such instantly clean up all registered listeners of all elements when invoking the _dispose()_-method.

Its methods are :

    addEventListener( aElement, aType, aCallback );

listen to events of given type (String) aType, broadcast by given (Element|EventDispatcher) aElement and execute given (Function)
aCallback when the Event is dispatched. Note that only ONE unique callback can be registered for each unique event type. If you wish
to execute multiple callbacks for a single event wrap these in a single function, or consider changing your design pattern!

    removeEventListener( aElement, aType );

removes the previously registered listener for an event with given type (String) aType from given (Element|EventDispatcher) aElement.

    hasEventListener( aElement, aType );

returns boolean true/false if a listener for given type (String) aType has been registered onto given (Element|EventDispatcher) aElement.

## Inheritance

A very simple wrapper to introduce OOP-style patterns in your applications, inspired by the Closure Library Authors work on the Google
Closure library. It basically allows you to create a new "class" that "extends" another class (basically prototype inheritance).

Its methods are :

    extend( subClass, superClass );

indicating that given (Function) _subClass_ should inherit the prototype of given (Function) _superClass_.

    super( classInstance, optMethodName, var_args... );

executes a super call from given (Function) _classInstance_ onto its parent prototype. (String) _optMethodName_ describes the name
of the function to invoke (must be undefined when calling super from a constructor). The remainder of the arguments are applied
onto the prototype function.

An example of creating a new derived Sprite "class" using Inheritance :

    var Sprite      = require( "zjslib" ).Sprite;
    var Inheritance = require( "zjslib" ).Inheritance;

    function SpriteExtension()
    {
        Inheritance.super( this, "div" );
    }

    Inheritance.extend( SpriteExtension, Sprite );

## Sprite

Is a wrapper for a DOM element. A Sprite inherits from _EventDispatcher_ (making it also _Disposable_). As the name suggests, it
is inspired by the _flash.display.Sprite_ known to ActionScript 3 developers, introducing the concept of a Display List, which is
perfectly analogous to working with tags in HTML. Consider :

    var stage  = new Sprite( document.body );
    var square = new Sprite( "div", { "id" : "square" });
    var circle = new Sprite( "div', { "id" : "circle" });

    stage.addChild ( square );
    square.addChild( circle );

which basically says "circle is held inside square, which in turn is held inside stage", leading to the following HTML inside the DOM:

    <body>
        <div id="square">
            <div id="circle"></div>
        </div>
    </body>

Using the concepts of "addChild(At)", "removeChild(At)" it is possible to "stack" Sprites inside other Sprites. You can also attach
Events to Sprites. If the Events are DOM Events (e.g. mouse / touch events), these are attached to the Sprites Element (the Element
representing the Sprite inside the DOM), and broadcast over the Sprite instance. This means that the interface for working with
custom Events and DOM Events is equal when working with a Sprite.

Additionally, the Sprite provides methods to manipulate the DOM element (e.g. toggle CSS class, attributes, visibility, etc.)
basically creating an abstraction layer between your code and the HTML document. As such, you will NOT need to look for elements
in the DOM using "getElementById()", "getElementsByClassName()" or anything jQuery/sizzle like. You're merely requesting a property
from an Object that just _happens to be an Element inside the HTML document_. Bringing logic back into your applications code.

If you _do_ need to access the DOM element, you can retrieve it using the _getElement()_-method.

    function Sprite( aElement, aProperties, aContent )

Is the constructor. given _aElement_ can be a reference to an existing (HTML Element|DOM Node) (e.g. "window", "document.body", or
any other existing node inside the document) or a (String) tagName. When a tagName is given, the Element will be created on the fly
(and become visible in the document once the newly constructed Sprite is added to a parent Sprite).

(Object) _aProperties_ is an optional Object describing the attributes of the Sprites Element. These are HTML attributes and can thus
be anything like : "id", "class", etc.

(String) _aContent_ is optional. When given its text contents will be applied onto the Elements _innerHTML_.

The remainder of API will be documented here, until then you can look at the (heavily) annotated source file.

## utils/*

Convenience utilities to do String manipulations, Array operations, etc.

## loaders/*

Stripped-down loaders functions to integrate external content into your application.
