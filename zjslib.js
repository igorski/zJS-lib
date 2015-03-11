/**
 * expose the separate actors of the library
 */
module.exports =
{
    Disposable      : require( "./src/Disposable" ),
    DOM             : require( "./src/DOM" ),
    Event           : require( "./src/Event" ),
    EventDispatcher : require( "./src/EventDispatcher" ),
    EventHandler    : require( "./src/EventHandler" ),
    Inheritance     : require( "./src/Inheritance" ),
    Sprite          : require( "./src/Sprite" ),
    Style           : require( "./src/Style" ),

    // loaders

    loaders : {
        ImageLoader  : require( "./src/loaders/ImageLoader" ),
        ScriptLoader : require( "./src/loaders/ScriptLoader" )
    },

    // utils

    utils : {
        ArrayUtil      : require( "./src/utils/ArrayUtil" ),
        FullscreenUtil : require( "./src/utils/FullscreenUtil" ),
        StringUtil     : require( "./src/utils/StringUtil" )
    }
};
