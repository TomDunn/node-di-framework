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
        cm.loadContextFiles(['./test_cntxts/test1.js']);
        cm.buildContext().done(function() {
            assert.equal(cm.context.a1.obj.msg, "hey");
            assert.equal(cm.context.a2.obj.msg, "hey2");
            done();
        });
    });

    it('b3 should not initialize until both b2 and b1 have finished', function(done) {
        cm.loadContextFiles(['./test_cntxts/test2.js']);
        cm.buildContext().done(function() {
            assert.equal(cm.context.b1.obj.msg, "heya1");
            assert.equal(cm.context.b2.obj.msg, "heya2");
            assert.equal(cm.context.b3.obj.msg, "heya3");
            done();
        });
    });
});
