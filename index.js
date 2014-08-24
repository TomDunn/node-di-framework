var Q           = require('q');
var underscore  = require('underscore');

var ContextManager = function(params) {
    this.initialize(params);
};

underscore.extend(ContextManager.prototype, {
    initialize: function(params) {
        this.params  = params;
        this.context = {};
    },

    /*
     * Used for registering a new member with the context.
     * Arguments:
     *  dependencies: a list of dependencies for this member
     *  dependencyName: how to refer to this member
     *  callback: the method that will be called when all of
     *    dependencies are resolved. It will be passed a deferred
     *    object and a context object. The deferred should be 
     *    resolved when the member object is ready. The context
     *    object will contain the dependencies.
     */
    register:   function(dependencies, dependencyName, callback) {
        var deferred = Q.defer();
        var details = {
            name:           dependencyName,
            dependencies:   dependencies,
            prepare:        callback,
            deferred:       deferred,
            dependenciesPromise: null,
            obj:            null
        };

        this.context[details.name] = details;

        details.deferred.promise.then(function(cntxtObj) {
            details.obj = cntxtObj;
        });
    },

    getContextObjDetails: function(dependencyName) {
        return this.context[dependencyName];
    },

    getContextObj: function(dependencyName) {
        return this.context[dependencyName].obj;
    },

    /*
     * Should be called once all the desired members have
     * been registered with the ContextManager. This method
     * will begin constructing the context members, once a
     * particular member's dependencies are resolved its
     * constructor will be invoked. This method returns a
     * promise that is resolved when all of the context's
     * members are resolved.
     */
    buildContext: function() {
        var that = this;

        underscore.each(underscore.values(this.context), function(contxtObj) {
            var dependencyDetails = underscore.map(contxtObj.dependencies, function(dependencyName) {
                return that.getContextObjDetails(dependencyName);
            });

            var dependencyPromises = underscore.map(dependencyDetails, function(dependency) {
                return dependency.deferred.promise;
            });

            Q.all(dependencyPromises).done(function() {
                var cntxt = {};

                underscore.each(dependencyDetails, function(d) {
                    cntxt[d.name] = d.obj;
                });

                contxtObj.prepare(contxtObj.deferred, cntxt);
            });
        });

        var allPromises = underscore.map(underscore.keys(this.context), function(dependencyName) {
            return that.getContextObjDetails(dependencyName).deferred.promise;
        });

        return Q.all(allPromises);
    },

    /*
     * Given a list of context file paths, will load each one
     * in order. If multiple files register a member with the
     * same name, then only the latest one is kept.
     */
    loadContextFiles: function(cntxtFiles) {
        var that = this;

        underscore.each(cntxtFiles, function(cntxtFile) {
            require(cntxtFile)(that);
        });
    }
});

module.exports = ContextManager;
