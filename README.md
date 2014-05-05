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
```

example

```
/statsd/raoul/increment?token=xxx
```

### timer

```
/statsd/:node/timer/:timing?token=xxx
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

## Launch unit test

```
npm test
```

