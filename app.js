#!/usr/bin/env node

//Load config from config.js file
var config = require('config').Server;

var crc32 = require('easy-crc32'),
    StatsDAggregator = require('./lib/statsdAggregator.js');

// get a host - crc32 on the node key
function getHost(node){
    return config.statsdServers[parseInt(crc32.calculate(node) % config.statsdServers.length,10)];
}

var security = require('./lib/security/security.js')(config.secretKey),
    middleware = require('./lib/middleware.js');
    express = require('express');

var app = express();

var StatsD = require('node-statsd').StatsD,
clientStatsd = new StatsD();

var statsdAggregator = new StatsDAggregator(clientStatsd, 500);

var statsdRouting = require('./lib/routes/statsd.js')(statsdAggregator, config);

app.get('/check', function (req, res){
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).end('OK');
});

app.get('/statsd/:node/increment',
    middleware.securityToken(security),
    statsdRouting.increment
);

app.get('/statsd/:node/timer/:timing',
    middleware.securityToken(security, {valueParameter: 'timing'}),
    statsdRouting.timing
);


var port = process.env.NODE_PORT || config.port;

app.listen(port);
console.log('Server running at http://127.0.0.1:'+port+' in '+app.settings.env+' mode');

