var _ = require('underscore');

var StatsdAggregator = function(statdsClient, timeout) {
    this.statdsClient = statdsClient;
    this.metrics = [];
    this.timeout = timeout;
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
        _this.statdsClient.increment(metric.metric, metric.value);
        _this.metrics = _.without(_this.metrics, metric);
    }, this.timeout);
};

StatsdAggregator.prototype.increment = function(metricName) {
    var metric = this._getMetric(metricName);

    metric.value++;
};


StatsdAggregator.prototype.timing = function(metricName, timing) {
   statdsClient.timing(metricName, timing);
};

module.exports = StatsdAggregator;
