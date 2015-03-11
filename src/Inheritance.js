module.exports =
{
    /**
     * convenience method to inherit prototypes, this can be used to
     * inherit in an OOP-style pattern, e.g. :
     *
     * extend( Bus, Vehicle ) will apply the properties of the Vehicle prototype onto
     * the Bus prototype. As thus, creating a new instance of Bus will also provide all
     * properties and methods of Vehicle
     *
     * adapted from source by The Closure Library Authors
     *
     * @param {!Function} subClass reference to the prototype that will inherit from superClass
     * @param {!Function} superClass reference to the prototype to inherit from
     */
    extend : function( subClass, superClass )
    {
        function ctor() {} // wrapper to act as a constructor

        ctor.prototype     = superClass.prototype;
        subClass.super     = superClass.prototype;
        subClass.prototype = new ctor();

        /** @override */
        subClass.prototype.constructor = subClass;
    },

    /**
     * convenience method to call the prototype constructor when instantiating
     * a function that has been extended (see helpers.extend), e.g. :
     *
     * helpers.super( this ); can be invoked from the child constructor to
     * apply the super class' constructor
     *
     * adapted from source by The Closure Library Authors
     *
     * @param {!Function} classInstance the instance of a child class calling this function
     * @param {string=} optMethodName optional, when null this invocation should act
     *                  as a super call from the constructor, when given it should match
     *                  a method name present on the prototype of the superclass
     * @param {...number} var_args optional arguments to pass to the super constructor
     */
    super : function( classInstance, optMethodName, var_args )
    {
        var caller = arguments.callee.caller;

        if ( caller.super ) {
            return caller.super.constructor.apply( classInstance,
                                                   Array.prototype.slice.call( arguments, 1 ));
        }

        var args = Array.prototype.slice.call( arguments, 2 ), foundCaller = false;

        for ( var ctor = classInstance.constructor; ctor;
              ctor = ctor.super && ctor.super.constructor )
        {
            if ( ctor.prototype[ optMethodName ] === caller )
                foundCaller = true;
            else if ( foundCaller )
                return ctor.prototype[ optMethodName ].apply( classInstance, args );
        }
    }
};
