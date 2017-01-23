var assert = require("assert");

var security = require('../../lib/security/security.js')('e56f5a32a32a65232');

describe('service-log', function() {
    describe('getToken method', function(){
        it('should return a token based on the node, the value and a secret key', function(){
          assert.equal('4E93D4885D32F2DE7CC3641F4885C934', security.getToken('stats_counts.test',1));
        });

        it('should return a token based only on the node (no value)', function() {
            assert.equal('C9307CB0A7A695B7F1258A669BD31C2B', security.getToken('stats_counts.test'));
        });
    });
    describe('decodeNode method', function(){
        it('should return the decoded node', function(){
          assert.equal('raoul', security.decodeNode('cmFvdWw='));
        });
    });
});
