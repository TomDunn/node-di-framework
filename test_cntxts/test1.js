var assert = require('assert');

module.exports = function(contextManager) {
    var cm = contextManager;

    cm.register([], 'a1', function(deferred) {
        setTimeout(function() {
            deferred.resolve({msg: "hey"});
        }, 30);
    });

    cm.register(['a1'], 'a2', function(deferred, cntxt) {
        assert.equal(cntxt.a1.msg, "hey");

        deferred.resolve({
            msg: "hey2"
        });
    });
};
