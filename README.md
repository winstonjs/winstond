# winstond

A logging server built on top of winston, capable of receiving, querying,
and streaming logs.

## Services

Each winstond server can utilize up to 3 different services, which leverage
the main capabilities of a winston transport.

- `collect` - log collection
- `query` - querying logs
- `stream` - streaming logs

## Usage

### Creating a winstond server

``` js
var winstond = require('winstond');

var server = winstond.nssocket.createServer({
  services: ['collect', 'query', 'stream'],
  port: 9003
});

server.add(winstond.transports.File, {
  filename: __dirname + '/foo.log'
});

server.listen();
```

### Communicating with a winstond server

``` js
var winston = require('winston');

winston.add(require('winston-nssocket').Nssocket, {
  host: 'localhost',
  port: 9003
});

winston.log('info', 'Hello world!', {
  foo: 'bar'
});

winston.stream().on('log', function(log) {
  console.log(log);
});

winston.query({ start: 10 }, function(err, results) {
  if (err) throw err;
  console.log(results);
});
```

## Backends

winstond supports http and [nssocket][1] backends.

## Installation

``` bash
$ npm install winstond -g
```

#### Author: [Nodejitsu Inc.](http://nodejitsu.com)
#### Contributors: [Christopher Jeffrey](http://github.com/chjj), [Charlie Robbins](http://github.com/indexzero)
#### License: **MIT**

[1]: https://github.com/nodejitsu/nssocket
