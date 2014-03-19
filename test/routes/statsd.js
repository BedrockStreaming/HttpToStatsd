(function() {

    var request     = require('supertest'),
        express     = require('express'),
        sinon       = require('sinon'),
        sinonChai   = require("sinon-chai");

    var mockedClientStatsd = {
        increment: function() {},
        timing: function() {}
    };

    var config = {
        statsdServers: [
            {host:"localhost", port: "8125"},
        ]
    };

    var statsdRoutes = require('../../lib/routes/statsd.js')(mockedClientStatsd, config);

    // Test server
    var app = express();
    app.get('/statsd/:node/increment', statsdRoutes.increment);
    app.get('/statsd/:node/timer/:timing', statsdRoutes.timing);

    describe('Test statsd routing', function () {

        before(function() {
            //define spies
            sinon.spy(mockedClientStatsd, 'increment');
            sinon.spy(mockedClientStatsd, 'timing');
        });

        beforeEach(function() {
            // reset spies
            mockedClientStatsd.increment.reset();
            mockedClientStatsd.timing.reset();
        });

        it('should return a 204 and call statsdClient.increment on increment', function(done){
            request(app)
                .get('/statsd/test/increment')
                .expect(204)
                .end(function() {
                    mockedClientStatsd.increment.should.have.been.calledWith('test');
                    done();
                });
        });

        it('should return a 204 and call statsdClient.timing on timing', function(done){
            request(app)
                .get('/statsd/test/timer/1000')
                .expect(204)
                .end(function() {
                    mockedClientStatsd.timing.should.have.been.calledWith('test', '1000');
                    done();
                });
        });
    });

})();

