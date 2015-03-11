module.exports = Disposable;

/**
 * a Disposable Object has an interface to clean up its
 * used resources by invoking the "dispose"-function prior
 * to destroying the object. The "disposeInternal"-method can
 * be overridden in your custom Disposable-extending Objects
 *
 * @see {goog.Disposable} (Google Closure library)
 * @constructor
 */
function Disposable()
{

}

/* class properties */

/** @private @type {boolean} */ Disposable.prototype._disposed = false;

/* public methods */

/**
 * method that will invoke the internal disposal method
 * which can be used to remove listeners, referenced Objects, etc.
 * this method is not meant to be overridden
 *
 * @public
 */
Disposable.prototype.dispose = function()
{
    if ( this._disposed ) {
        return;
    }
    this.disposeInternal();
    this._disposed = true;
};

/* protected methods */

/**
 * internal disposal method
 * override to clean up listeners, recursively call
 * disposal of referenced Disposable objects, etc.
 *
 * @protected
 */
Disposable.prototype.disposeInternal = function()
{
    // override in derived classes
};
