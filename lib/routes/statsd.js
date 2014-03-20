module.exports = function(clientStatsd, config) {

    var routes = {};

    routes.increment = function(req, res) {
        // fire the increment
        clientStatsd.increment(req.params.node);

        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Length', 0);
        res.status(204).send('');
        if (config.monitoringNodeBase && config.monitoringNodeBase !== 'undefined') {
            clientStatsd.increment(config.monitoringNodeBase + '.incr');
        }
    };

    routes.timing = function(req, res) {
        // fire the time
        clientStatsd.timing(req.params.node, req.params.timing);

        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Length', 0);
        res.status(204).send('');
        if (config.monitoringNodeBase && config.monitoringNodeBase !== 'undefined') {

            clientStatsd.increment(config.monitoringNodeBase + '.timing');
        }
    };

    return routes;
};
