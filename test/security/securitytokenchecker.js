var sinon = require('sinon'),
    sinonChai = require("sinon-chai"),
    chai = require('chai'),
    SecurityTokenChecker = require('../../lib/security/securitytokenchecker.js');

chai.use(sinonChai);
chai.should();

var mockedSecurity = {

    getToken: function() {

        return 'VALID_TOKEN';
    },

    decodeNode: function() {

        return 'sample.decoded.node';
    }
};

var mockedResponse = {

    status: function() {

        return {
            end: function() {}
        };
    }
};

describe('Test SecurityTokenChecker middleware', function() {

    before(function() {

        //define spies
        sinon.spy(mockedSecurity, 'getToken');
        sinon.spy(mockedSecurity, 'decodeNode');
        sinon.spy(mockedResponse, 'status');

    });

    beforeEach(function() {
        // reset spies
        mockedResponse.status.reset();
        mockedSecurity.getToken.reset();
        mockedSecurity.decodeNode.reset();
    });

    describe('Test middleware with default value' , function() {
        it('if req token different to Security getToken value should not call next method and send a 400 response', function() {

            var next = sinon.spy();

            var middleware = new SecurityTokenChecker(mockedSecurity);

            middleware({query: {token:'INVALID_TOKEN' }, params: {node: 'NODE'}}, mockedResponse, next);

            next.should.not.have.been.called;
            mockedResponse.status.should.have.been.calledWith(400);
        });

        it('if req token equal to Security getToken value call next method and not send response', function() {

            var next = sinon.spy();

            var middleware = new SecurityTokenChecker(mockedSecurity);

            middleware({query: {token:'VALID_TOKEN' }, params: {node: 'NODE'}}, mockedResponse, next);

            next.should.have.been.called;
            mockedResponse.status.should.not.have.been.called;
        });
    });

    describe('Test middleware with an encoded node' , function() {
        it('if the -encoded- request param is set to 1, call getToken with a decoded node', function() {

            var next = sinon.spy();

            var middleware = new SecurityTokenChecker(mockedSecurity, {valueParameter: 'test'});

            middleware({query: {token:'VALID_TOKEN', encoded: '1'}, params: {node: 'c2FtcGxlLmRlY29kZWQubm9kZQ=='}}, mockedResponse, next);

            mockedSecurity.getToken.should.have.been.calledWith('sample.decoded.node');
            mockedSecurity.getToken.should.have.been.calledOnce;
        });
    });

    describe('Test middleware with valueParameter' , function() {
        it('if req token different to Security getToken value should not call next method and send a 400 response', function() {

            var next = sinon.spy();

            var middleware = new SecurityTokenChecker(mockedSecurity, {valueParameter: 'test'});

            middleware({query: {token:'INVALID_TOKEN' }, params: {node: 'NODE', test: 'VALUE'}}, mockedResponse, next);

            next.should.not.have.been.called;

            mockedSecurity.getToken.should.have.been.calledWith('NODE', 'VALUE');
            mockedResponse.status.should.have.been.calledWith(400);
        });

        it('if req token equal to Security getToken value call next method and not send response (with value)', function() {

            var next = sinon.spy();

            var middleware = new SecurityTokenChecker(mockedSecurity, {valueParameter: 'test'});

            middleware({query: {token:'VALID_TOKEN' }, params: {node: 'NODE', test: 'VALUE'}}, mockedResponse, next);

            next.should.have.been.called;
            mockedSecurity.getToken.should.have.been.calledWith('NODE', 'VALUE');
            mockedResponse.status.should.not.have.been.called;
        });

        it('if req token equal to Security getToken call next method (without value)', function() {
            var next = sinon.spy();

            var middleware = new SecurityTokenChecker(mockedSecurity, {valueParameter: 'test'});

            middleware({query: {token:'VALID_TOKEN' }, params: {node: 'NODE'}}, mockedResponse, next);

            next.should.have.been.called;
            mockedSecurity.getToken.should.have.been.calledWith('NODE');
            mockedSecurity.getToken.should.have.been.calledOnce;
            mockedResponse.status.should.not.have.been.called;
        });
    });

});
