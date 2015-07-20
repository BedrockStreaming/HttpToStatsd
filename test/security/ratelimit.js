(function() {
    var request     = require('supertest'),
        express     = require('express')
        app         = express(),
        rateLimit = require('../../lib/security/ratelimit.js');

    app.get('/', rateLimit({
        rateLimit: {
            enable: true,
            lookup: 'test',
            maxRequestsPerSeconds: 1,
            expire: 1,
            skipHeaders: false
        }
    }), function(req, res) {
        res.send();
    });

    app.get('/silent', rateLimit({
        rateLimit: {
            enable: true,
            lookup: 'test',
            maxRequestsPerSeconds: 0,
            expire: 1,
            skipHeaders: true
        }
    }), function(req, res) {
        res.send();
    });

    describe('Test rate limit', function () {

        it('should return 200 with rate limit headers', function(done) {
            request(app)
                .get('/')
                .expect(200)
                .expect(function(res) {
                    if(res.headers['x-ratelimit-limit'] !== '1') {
                        return 'X-RateLimit-Limit Header not to be set';
                    }
                    if(res.headers['x-ratelimit-remaining'] !== '0') {
                        return 'X-RateLimit-Remaining Header not to be set';
                    }
                    if(res.headers['x-ratelimit-reset'].search(/\d+/i) === -1) {
                        return 'X-RateLimit-Reset Header not to be set';
                    }
                })
                .end(function(err, res) {
                    done(err ? err : null);
                });
        });

        it('should return 429 with rate limit headers (when rate limit is reached)', function(done) {
            request(app)
                .get('/')
                .expect(429)
                .expect('Rate limit exceeded')
                .expect(function(res) {
                    if(res.headers['x-ratelimit-limit'] !== '1') {
                        return 'X-RateLimit-Limit Header not to be set';
                    }
                    if(res.headers['x-ratelimit-remaining'] !== '0') {
                        return 'X-RateLimit-Remaining Header not to be set';
                    }
                    if(res.headers['x-ratelimit-reset'].search(/\d+/i) === -1) {
                        return 'X-RateLimit-Reset Header not to be set';
                    }
                })
                .end(function(err, res) {
                    done(err ? err : null);
                });
        });

        it('should return 200 with rate limit headers (when rate limit is outdated)', function(done) {
            setTimeout(function() {
                request(app)
                    .get('/')
                    .expect(200)
                    .expect(function(res) {
                        if(res.headers['x-ratelimit-limit'] !== '1') {
                            return 'X-RateLimit-Limit Header not to be set';
                        }
                        if(res.headers['x-ratelimit-remaining'] !== '0') {
                            return 'X-RateLimit-Remaining Header not to be set';
                        }
                        if(res.headers['x-ratelimit-reset'].search(/\d+/i) === -1) {
                            return 'X-RateLimit-Reset Header not to be set';
                        }
                    })
                    .end(function(err, res) {
                        done(err ? err : null);
                    });
            }, 1E3);
        });

        it('should return 204 with no rate limit headers', function(done) {
            request(app)
                .get('/silent')
                .expect(204)
                .expect(function(res) {
                    if('x-ratelimit-limit' in res.headers) {
                        return 'X-RateLimit-Limit Header not will be set';
                    }
                    if('x-ratelimit-remaining' in res.headers) {
                        return 'X-RateLimit-Remaining Header not will be set';
                    }
                    if('x-ratelimit-reset' in res.headers) {
                        return 'X-RateLimit-Reset Header not will be set';
                    }
                })
                .end(function(err, res) {
                    done(err ? err : null);
                });
        });
    });

})();
