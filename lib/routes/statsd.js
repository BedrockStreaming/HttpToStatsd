(function () {


    module.exports = function(clientStatsd, config) {

        var crc32 = require('easy-crc32');

        var getHost = function (node){
            return config.statsdServers[parseInt(crc32.calculate(node) % config.statsdServers.length,10)];
        };

        var routes = {};

        routes.increment = function(req, res) {
            // get a statsdServer
            statsdServer = getHost(req.params.node);
            // reconfigure the statsd client
            clientStatsd.host = statsdServer.host;
            clientStatsd.port = statsdServer.port;

            // fire the increment
            clientStatsd.increment(req.params.node);
            // console.log('increment '+req.params.node+' node');

            res.setHeader('Content-Type', 'image/jpeg');
            res.setHeader('Content-Length', 0);
            res.status(204).end('');
        };

        routes.timing = function(req, res) {
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
        };

        return routes;
    };

})();
