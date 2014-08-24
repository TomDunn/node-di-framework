var assert          = require('assert');
var ContextManager  = require('./index.js');

var delayed = function(delay, cb) {
    setTimeout(function()  {
        cb();
    }, delay);
};

describe('TEST TEST', function() {
    it('should work', function() {
        assert.equal(true, true);
    });

    describe('test dependencies', function(done) {
        var cm;

        beforeEach(function() {
            cm = new ContextManager();
        });

        it('d2 should not run until d1 completes', function(done) {
            cm.register([], 'd1', function(deferred) {
                console.log('building d1');

                delayed(600, function() {
                    deferred.resolve({msg: "hey"});
                    console.log('d1 resolved');
                });
            });

            cm.register(['d1'], 'd2', function(deferred) {
                console.log('building d2');
                deferred.resolve({
                    msg: "hey2"
                });
            });
        });
    });
});
