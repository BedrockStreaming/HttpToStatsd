var md5 = require('MD5');
var Base64 = require('js-base64').Base64;

var Security = function (secretKey) {
    this._secretKey = secretKey;
};

Security.prototype.getToken = function (node, value) {
    if (!value || value == 'undefined') {
         value = '';
    }

    return md5(node + value + this._secretKey).toUpperCase();
};

Security.prototype.decodeNode = function (hashedNode) {
    return Base64.decode(hashedNode);
};

module.exports = function(secretKey) {
    return new Security(secretKey);
};
