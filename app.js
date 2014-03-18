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

app.get('/check', function (req, res){
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).end('OK');
});

app.get('/statsd/:node/increment', middleware.securityToken(security), function (req, res, next){
    // get a statsdServer
    statsdServer = getHost(req.params.node);
    // reconfigure the statsd client
    clientStatsd.host = statsdServer.host;
    clientStatsd.port = statsdServer.port;

    // fire the increment
    statsdAggregator.increment(req.params.node);
    // console.log('increment '+req.params.node+' node');

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', 0);
    res.status(204).end('');

    statsdAggregator.increment('service.httptostatsd.incr');
});


app.get('/statsd/:node/timer/:timing', middleware.securityToken(security, {valueParameter: 'timing'}), function (req, res, next){

    // get a statsdServer
    statsdServer = getHost(req.params.node);
    // reconfigure the statsd client
    clientStatsd.host = statsdServer.host;
    clientStatsd.port = statsdServer.port;

    // fire the time
    clientStatsd.timing(req.params.node, req.params.timing);
    // console.log('timing '+req.params.node+' node to '+req.params.timing+' ms');

    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Content-Length', 0);
    res.status(204).end('');

    statsdAggregator.increment('service.httptostatsd.timing');
});


var port = process.env.NODE_PORT || config.port;

app.listen(port);
console.log('Server running at http://127.0.0.1:'+port+' in '+app.settings.env+' mode');

