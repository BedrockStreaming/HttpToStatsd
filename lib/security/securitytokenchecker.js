var SecurityTokenChecker = function(security, options) {

    if (!options || typeof options === "undefined") {
        options = {};
    }

    return function middleware (req, res, next) {

        var value = false;

        if (options.valueParameter && typeof options.valueParameter !== "undefined") {
            value = req.params[options.valueParameter];
        } else {
            value = '1'; // Default value
        }

        var token = false;

        if (typeof req.query.token != 'undefined') {
            token = req.query.token;
        }

        if ((value && token == security.getToken(req.params.node,value)) || token == security.getToken(req.params.node)) {
            next();
        } else {
            res.status(400).end('no token or invalid provided');
        }
    };
};

module.exports = SecurityTokenChecker;
