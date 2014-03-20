var securityTokenChecker = require('./security/securitytokenchecker.js');

var middlewareFactory = {

    securityToken: function(security, options) {

        return new securityTokenChecker(security, options);
    }
};

module.exports = middlewareFactory;
