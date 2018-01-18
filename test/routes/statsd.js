(function() {

    var request     = require('supertest'),
        express     = require('express'),
        sinon       = require('sinon'),
        sinonChai   = require("sinon-chai");

    var mockedClientStatsd = {
        increment: function() {},
        decrement: function() {},
        timing: function() {},
        set: function() {},
        gauge: function() {}
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
    app.get('/statsd/:node/increment/:delta', statsdRoutes.increment);
    app.get('/statsd/:node/decrement', statsdRoutes.decrement);
    app.get('/statsd/:node/timer/:timing', statsdRoutes.timing);
    app.get('/statsd/:node/gauge/:gauge', statsdRoutes.gauge);
    app.get('/statsd/:node/set/:set', statsdRoutes.set);

    describe('Test statsd routing', function () {

        before(function() {
            //define spies
            sinon.spy(mockedClientStatsd, 'increment');
            sinon.spy(mockedClientStatsd, 'decrement');
            sinon.spy(mockedClientStatsd, 'timing');
            sinon.spy(mockedClientStatsd, 'gauge');
            sinon.spy(mockedClientStatsd, 'set');
        });

        beforeEach(function() {
            // reset spies
            mockedClientStatsd.increment.reset();
            mockedClientStatsd.decrement.reset();
            mockedClientStatsd.timing.reset();
            mockedClientStatsd.gauge.reset();
            mockedClientStatsd.set.reset();
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

        it('should return a 204 and call statsdClient.increment with delta on increment', function(done){
            request(app)
                .get('/statsd/test/increment/123')
                .expect(204)
                .end(function() {
                    mockedClientStatsd.increment.should.have.been.calledWith('test', '123');
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

        it('should return a 204 and call statsdClient.gauge on gauge', function(done){
            request(app)
                .get('/statsd/test/gauge/1000')
                .expect(204)
                .end(function() {
                    mockedClientStatsd.gauge.should.have.been.calledWith('test', '1000');
                    done();
                });
        });

        it('should return a 204 and call statsdClient.decrement on decrement', function(done){
            request(app)
                .get('/statsd/test/decrement')
                .expect(204)
                .end(function() {
                    mockedClientStatsd.decrement.should.have.been.calledWith('test');
                    done();
                });
        });

        it('should return a 204 and call statsdClient.set on set', function(done){
            request(app)
                .get('/statsd/test/set/123')
                .expect(204)
                .end(function() {
                    mockedClientStatsd.set.should.have.been.calledWith('test', '123');
                    done();
                });
        });
    });

})();

