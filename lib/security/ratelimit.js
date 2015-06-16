var md5 = require('MD5'),
    rateLimitStack = {};

module.exports = function (config, clientStatsd) {

    setInterval(function() {
        rateLimitStack = [];
    }, config.rateLimit.expire * 1E3);

    return function (req, res, next) {

        if(config.rateLimit.enable) {

            config.rateLimit.lookup = Array.isArray(config.rateLimit.lookup) ? config.rateLimit.lookup : [config.rateLimit.lookup];

            var uid = md5(config.rateLimit.lookup.map(function(item) {
                return item + ':' + item.split('.').reduce(function(prev, cur) {
                    return prev[cur];
                }, req);
            }).join(':'));

            if(!(uid in rateLimitStack)) {
                rateLimitStack[uid] = 1;
            } else {
                rateLimitStack[uid]++;
            }

            if(!config.rateLimit.skipHeaders) {
                res.setHeader('X-RateLimit-Limit', config.rateLimit.maxRequestsPerSeconds);
                res.setHeader('X-RateLimit-Remaining', Math.max(config.rateLimit.maxRequestsPerSeconds - rateLimitStack[uid], 0));
                res.setHeader('X-RateLimit-Reset', Math.ceil((Date.now() / 1E3) + config.rateLimit.expire));
            }

            if(rateLimitStack[uid] > config.rateLimit.maxRequestsPerSeconds) {
                if(!config.rateLimit.skipHeaders) {
                    res.status(429);
                    return res.send('Rate limit exceeded');
                } else {
                    res.setHeader('Content-Type', 'image/jpeg');
                    res.setHeader('Content-Length', 0);
                    res.status(204);
                    return res.send('');
                }

                if (config.monitoringNodeBase && 'undefined' !== config.monitoringNodeBase) {
                    clientStatsd.increment(config.monitoringNodeBase + '.ratelimit');
                }

            }
            next();

        } else {
            next();
        }
    };
};
