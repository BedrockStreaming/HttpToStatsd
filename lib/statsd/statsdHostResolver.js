var crc32 = require('easy-crc32');

/**
 * StatsdClient Decorator for different host and port by host
 * @param object statdsClient  StatsdClient to decorate
 * @param Array  statsdServers Array of servers {host, port}
 */
var StatsdHostResolver = function(clientStatsd, statsdServers) {
    this.clientStatsd  = clientStatsd;
    this.statsdServers = statsdServers;
};

StatsdHostResolver.prototype._fetchHost = function (node){
    var statsdServer = this.statsdServers[parseInt(crc32.calculate(node) % this.statsdServers.length,10)];
    // reconfigure the statsd client
    this.clientStatsd.host = statsdServer.host;
    this.clientStatsd.port = statsdServer.port;
};

StatsdHostResolver.prototype.increment = function(metricName, value) {
    this._fetchHost(metricName);
    this.clientStatsd.increment(metricName, value);
};

StatsdHostResolver.prototype.decrement = function(metricName, value) {
    this._fetchHost(metricName);
    this.clientStatsd.decrement(metricName, value);
};

StatsdHostResolver.prototype.timing = function(metricName, timing) {
    this._fetchHost(metricName);
    this.clientStatsd.timing(metricName, timing);
};

StatsdHostResolver.prototype.gauge = function(metricName, gauge) {
    this._fetchHost(metricName);
    this.clientStatsd.gauge(metricName, gauge);
};

StatsdHostResolver.prototype.set = function(metricName, set) {
    this._fetchHost(metricName);
    this.clientStatsd.set(metricName, set);
};

module.exports = StatsdHostResolver;
