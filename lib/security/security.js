var md5 = require('MD5');

var Security = function (secretKey) {
    this._secretKey = secretKey;
};

Security.prototype.getToken = function (node, value) {
    if (!value || value == 'undefined') {
         value = '';
    }

    return md5(node + value + this._secretKey).toUpperCase();
};

module.exports = function(secretKey) {
    return new Security(secretKey);
};
