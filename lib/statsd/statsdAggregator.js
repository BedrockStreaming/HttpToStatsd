var _ = require('underscore');

/**
 * StatsdClient Decorator for agregate increment message
 * @param object statdsClient StatsdClient to decorate
 * @param int    timeout      Timeout for increment aggregation
 */
var StatsdAggregator = function(statdsClient, timeout) {
    this.statdsClient = statdsClient;
    this.metrics      = [];
    this.timeout      = timeout;
};

StatsdAggregator.prototype._getMetric = function(metricName) {

    var metric = _.findWhere(this.metrics, {metric: metricName});
    if (!metric || metric == 'undefined') {
        metric = {metric: metricName, value: 0};
        this.metrics.push(metric);
        this._timeoutMetric(metric);
    }

    return metric;
};

StatsdAggregator.prototype._timeoutMetric = function(metric) {
    var _this = this;

    setTimeout(function() {
        // This condition is because StatsD client for 0 delta fallbacks to increment by 1
        if(metric.value) {
            // fire increment
            _this.statdsClient.increment(metric.metric, metric.value);
        }
        _this.metrics = _.without(_this.metrics, metric);
    }, this.timeout);
};

StatsdAggregator.prototype.increment = function(metricName, delta) {
    var metric = this._getMetric(metricName);

    if(typeof delta === "undefined") {
        // Default delta value is increment by 1
        ++metric.value;
    }
    else {
        // If delta value is provided then increment by delta
        metric.value += parseInt(delta);
    }
};

StatsdAggregator.prototype.decrement = function(metricName) {
    var metric = this._getMetric(metricName);

    metric.value--;
};

StatsdAggregator.prototype.timing = function(metricName, timing) {
    //fire timing
    this.statdsClient.timing(metricName, timing);
};

StatsdAggregator.prototype.gauge = function(metricName, gauge) {
    //fire gauge
    this.statdsClient.gauge(metricName, gauge);
};

StatsdAggregator.prototype.set = function(metricName, set) {
    //fire gauge
    this.statdsClient.set(metricName, set);
};

module.exports = StatsdAggregator;
