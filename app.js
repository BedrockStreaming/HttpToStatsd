#!/usr/bin/env node

//Load config from config.js file
var config = require('config').Server;

var crc32              = require('easy-crc32'),
    StatsDAggregator   = require('./lib/statsd/statsdAggregator.js'),
    StatsdHostResolver = require('./lib/statsd/statsdHostResolver.js');

var security = require('./lib/security/security.js')(config.secretKey),
    middleware = require('./lib/middleware.js');
    express = require('express');

var app = express();

var StatsD = require('node-statsd').StatsD,
clientStatsd = new StatsD();

// rate limiting
var ratelimit = require('./lib/security/ratelimit.js')(config, clientStatsd);

// Create StatsdClient for dynamic host resolution
var statsdHostResolver = new StatsdHostResolver(clientStatsd, config.statsdServers);
// Create StatsdClient for increment aggregation
var statsdAggregator   = new StatsDAggregator(statsdHostResolver, config.aggregatorTimeout);

var statsdRouting = require('./lib/routes/statsd.js')(statsdAggregator, config);

app.get('/check', function (req, res){
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).end('OK');
});

app.get('/statsd/:node/increment',
    ratelimit,
    middleware.securityToken(security),
    statsdRouting.increment
);

app.get('/statsd/:node/increment/:delta',
    ratelimit,
    middleware.securityToken(security, {valueParameter: 'delta'}),
    statsdRouting.increment
);

app.get('/statsd/:node/decrement',
    ratelimit,
    middleware.securityToken(security),
    statsdRouting.decrement
);

app.get('/statsd/:node/timer/:timing',
    ratelimit,
    middleware.securityToken(security, {valueParameter: 'timing'}),
    statsdRouting.timing
);

app.get('/statsd/:node/gauge/:gauge',
    ratelimit,
    middleware.securityToken(security, {valueParameter: 'gauge'}),
    statsdRouting.gauge
);

app.get('/statsd/:node/set/:set',
    ratelimit,
    middleware.securityToken(security, {valueParameter: 'set'}),
    statsdRouting.set
);

var port = process.env.NODE_PORT || config.port;

app.listen(port);
console.log('Server running at http://127.0.0.1:'+port+' in '+app.settings.env+' mode');

