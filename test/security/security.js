var assert = require("assert");

var security = require('../../lib/security/security.js')('e56f5a32a32a65232');

describe('service-log', function() {
    describe('getToken method', function(){
        it('should return a token based on the node, the value and a secret key', function(){
          assert.equal('4e93d4885d32f2de7cc3641f4885c934', security.getToken('stats_counts.test',1));
        });
    });
});
