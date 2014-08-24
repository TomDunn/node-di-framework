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

    buildContext: function() {
        var that = this;

        _.values(this.context, function(contxtObj) {
            var dependencyDetails = _.map(contxtObj.dependencies, function(dependencyName) {
                return that.getContextObjDetails(dependencyName);
            });

            var dependencyPromises = _.map(dependencyDetails, function(dependency) {
                return dependency.deferred.promise;
            });

            Q.all(dependencyPromises).done(function() {
                contxtObj.prepare(contxtObj.deferred);
            });
        });
    }
});

module.exports = ContextManager;