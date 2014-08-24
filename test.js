var assert          = require('assert');
var ContextManager  = require('./index.js');

var delayed = function(delay, cb) {
    setTimeout(function()  {
        cb();
    }, delay);
};

describe('Dependency Injection Framework Tests', function() {
    var cm;

    beforeEach(function() {
        cm = new ContextManager();
    });

    it('a2 should not run until a1 completes', function(done) {
        cm.register([], 'a1', function(deferred) {

            delayed(30, function() {
                deferred.resolve({msg: "hey"});
            });
        });

        cm.register(['a1'], 'a2', function(deferred, cntxt) {

            assert.equal(cntxt.a1.msg, "hey");

            deferred.resolve({
                msg: "hey2"
            });

            done();
        });

        cm.buildContext();
    });

    it('b3 should not initialize until both b2 and b1 have finished', function(done) {
        cm.register([], 'b1', function(deferred) {

            delayed(30, function() {
                deferred.resolve({msg: "heya1"});
            });
        });

        cm.register([], 'b2', function(deferred) {

            delayed(40, function() {
                deferred.resolve({msg: "heya2"});
            });
        });

        cm.register(['b1', 'b2'], 'b3', function(deferred, cntxt) {

            assert.equal(cntxt.b1.msg, "heya1");
            assert.equal(cntxt.b2.msg, "heya2");

            deferred.resolve({msg: "heya3"});
            done();
        });

        cm.buildContext();
    });
});
