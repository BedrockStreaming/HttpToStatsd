module.exports = function(clientStatsd, config) {

    var routes = {};

    routes.increment = function(req, res) {
        // fire the increment
        clientStatsd.increment(req.params.node, req.params.delta);

        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Length', 0);
        res.status(204).send('');
        if (config.monitoringNodeBase && config.monitoringNodeBase !== 'undefined') {
            clientStatsd.increment(config.monitoringNodeBase + '.incr');
        }
    };

    routes.decrement = function(req, res) {
        // fire the decrement
        clientStatsd.decrement(req.params.node);

        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Length', 0);
        res.status(204).send('');
        if (config.monitoringNodeBase && config.monitoringNodeBase !== 'undefined') {
            clientStatsd.increment(config.monitoringNodeBase + '.decr');
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

    routes.gauge = function(req, res) {
        // fire the gauge
        clientStatsd.gauge(req.params.node, req.params.gauge);

        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Length', 0);
        res.status(204).send('');
        if (config.monitoringNodeBase && config.monitoringNodeBase !== 'undefined') {
            clientStatsd.increment(config.monitoringNodeBase + '.gauge');
        }
    };

    routes.set = function(req, res) {
        // fire the set
        clientStatsd.set(req.params.node, req.params.set);

        res.setHeader('Content-Type', 'image/jpeg');
        res.setHeader('Content-Length', 0);
        res.status(204).send('');
        if (config.monitoringNodeBase && config.monitoringNodeBase !== 'undefined') {
            clientStatsd.increment(config.monitoringNodeBase + '.set');
        }
    };

    return routes;
};
