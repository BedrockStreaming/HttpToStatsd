var sinon       = require('sinon'),
    sinonChai   = require("sinon-chai");

var mockedClientStatsd = {
    increment: function() {},
    timing: function() {}
};

var StatsdHostResolver = require('../../lib/statsd/statsdHostResolver.js');

describe('Test StatsdHostResolver class', function () {

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

    describe('increment', function() {
        it('should call statd client increment and set host and port', function(done){
            var statsdHostResolver = new StatsdHostResolver(mockedClientStatsd, [{host: 'raoul', port:'1212'}]);

            statsdHostResolver.increment('raoul', 10);
            statsdHostResolver.clientStatsd.host.should.be.equal('raoul');
            statsdHostResolver.clientStatsd.port.should.be.equal('1212');

            mockedClientStatsd.increment.should.have.been.calledWith('raoul', 10);
            done();
        });
    });

    describe('timing', function() {
        it('should call statd client timing and set host and port', function(done){
            var statsdHostResolver = new StatsdHostResolver(mockedClientStatsd, [{host: 'raoul', port:'1212'}]);

            statsdHostResolver.timing('raoul', 10);
            statsdHostResolver.clientStatsd.host.should.be.equal('raoul');
            statsdHostResolver.clientStatsd.port.should.be.equal('1212');

            mockedClientStatsd.timing.should.have.been.calledWith('raoul', 10);
            done();
        });
    });
});
