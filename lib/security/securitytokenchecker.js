var SecurityTokenChecker = function(security, options) {

    if (!options || typeof options === "undefined") {
        options = {};
    }

    return function middleware (req, res, next) {

        var value = '1'; // Default value

        if (options.valueParameter && typeof options.valueParameter !== "undefined") {

            value = req.params[options.valueParameter];
        }

        var token = false;

        if (typeof req.query.token != 'undefined') {
            token = req.query.token;
        }

        if (token == security.getToken(req.params.node,value)) {
            next();
        } else {
            res.status(400).end('no token or invalid provided');
        }
    };
};

module.exports = SecurityTokenChecker;
