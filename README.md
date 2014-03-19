# installation

```shell
npm install
```

... profit !

# usage in production

```
node app
```
or if you want to choose the port (to run multiple instance) :
```
export NODE_PORT=8081 && node app
```

# usage in dev (loading dev config)

```
export NODE_ENV=development
node app
```

# usage in production (loading production config)

```
export NODE_ENV=production
node app
```

## increment

```
/statsd/:node/increment?token=xxx
```

exemple

```
/statsd/raoul/increment?token=xxx
```

## timer

```
/statsd/:node/timer/:timing?token=xxx
```

exemple

```
/statsd/raoul/timer/234?token=xxx
```

timing value in ms

## how to compute a token

```
md5sum(node + value + secretKey)
```

for increment, value is ```'1'```

# test

```
npm test
```

