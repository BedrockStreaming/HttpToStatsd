var sinon       = require('sinon'),
    sinonChai   = require("sinon-chai");

var mockedClientStatsd = {
    increment: function() {},
    timing: function() {}
};

var StatsdAggregator = require('../../lib/statsd/statsdAggregator.js');

describe('Test statsdAggregator', function () {

    before(function() {
        //define spies
        sinon.spy(mockedClientStatsd, 'increment');
    });

    beforeEach(function() {
        // reset spies
        mockedClientStatsd.increment.reset();
    });

    it('should call statd client increment once with value 10', function(done){
        var statsdAggregator = new StatsdAggregator(mockedClientStatsd, 100);

        for (var i = 0; i < 10; i++) {
            statsdAggregator.increment('raoul');
        }

        setTimeout(function() {
            mockedClientStatsd.increment.should.have.been.calledWith('raoul', 10);
            done();
        }, 500);

    });

    it('Should support multiple call first with 10 then with 5', function(done){
        var statsdAggregator = new StatsdAggregator(mockedClientStatsd, 100);

        for (var i = 0; i < 5; i++) {
            statsdAggregator.increment('raoul');
        }

        setTimeout(function() {
            mockedClientStatsd.increment.should.have.been.calledWith('raoul', 5);
            mockedClientStatsd.increment.reset();

            for (var i = 0; i < 10; i++) {
                statsdAggregator.increment('raoul');
            }

        }, 200);

        setTimeout(function () {
            mockedClientStatsd.increment.should.have.been.calledWith('raoul', 10);
            done();
        }, 500);

    });

    it('should call statd client increment with value 123 when increment was called with delta 123', function(done) {
        var statsdAggregator = new StatsdAggregator(mockedClientStatsd, 100);

        statsdAggregator.increment('raoul', '123');

        setTimeout(function() {
            mockedClientStatsd.increment.should.have.been.calledWith('raoul', 123);
            done();
        }, 500);
    });
});
