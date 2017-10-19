# HttpToStatsd [![Build Status](https://travis-ci.org/M6Web/HttpToStatsd.png?branch=master)](https://travis-ci.org/M6Web/HttpToStatsd)

An HTTP server in node.js for receiving client metrics and send them to statsD.

Native apps, and client side apps, can't easily send UDP packet directly to StatsD.
With this server, you can send to it, asynchronous http request, from client-side apps, letting the server send them in UDP to your statsD.

## installation

```shell
npm install
```

... profit !

## usage in production

```
node app
```
or if you want to choose the port (to run multiple instance) :
```
export NODE_PORT=8081 && node app
```

## usage in dev (loading dev config)

```
export NODE_ENV=development
node app
```

## usage in production (loading production config)

```
export NODE_ENV=production
node app
```

### increment

```
/statsd/:node/increment?token=xxx
/statsd/:node/increment/:delta?token=xxx
```

example

```
/statsd/raoul/increment?token=xxx
/statsd/raoul/increment/123?token=xxx
```

delta value specifies by how much counter is modified

### timer

```
/statsd/:node/timer/:timing?token=xxx
```

### gauge

```
/statsd/:node/gauge/:gauge?token=xxx
```

example

```
/statsd/raoul/timer/234?token=xxx
```

timing value in ms

### how to compute a token

```
md5sum(node + value + secretKey)
```

for increment, value is ```'1'```


## Rate limit

``` js
    "rateLimit": {
        "enable": true,
        "lookup": [
            "connection.remoteAddress"
        ],
        "maxRequestsPerSeconds": 100,
        "expire": 60,
        "skipHeaders": true
    }
```

 - `enable`: `Boolean` enable/disable rate limit feature
 - `lookup`: `String|Array.<String>` value lookup on the request object. Can be a single value or array.
 - `maxRequestsPerSeconds`: `Number` allowed number of requests before getting rate limited
 - `expire`: `Number` amount of time in `s` before the rate-limited is reset (global reset)
 - `skipHeaders`: `Boolean` whether to skip sending HTTP `X-Ratelimit` headers for rate limit

## Launch unit test

```
npm test
```

