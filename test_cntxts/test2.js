var assert = require('assert');

module.exports = function(contextManager) {
    var cm = contextManager;

    cm.register([], 'b1', function(deferred) {
        setTimeout(function() {
            deferred.resolve({msg: "heya1"});
        }, 30);
    });

    cm.register([], 'b2', function(deferred) {
        setTimeout(function() {
            deferred.resolve({msg: "heya2"});
        }, 40);
    });

    cm.register(['b1', 'b2'], 'b3', function(deferred, cntxt) {
        assert.equal(cntxt.b1.msg, "heya1");
        assert.equal(cntxt.b2.msg, "heya2");
        deferred.resolve({msg: "heya3"});
    });
};
