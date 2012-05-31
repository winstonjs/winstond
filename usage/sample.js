var winstond = require('winstond');

//
// Tell winstond to collect, query, and stream
// logs over both HTTP
// and TCP (NsSocket).
//

var nssocket = winstond.nssocket.createServer({
  services: ['collect', 'query', 'stream'],
  port: 9000
});

nssocket.add(winstond.transports.File, {
  filename: __dirname + '/foo.log'
});

var http = winstond.http.createServer({
  services: ['collect', 'query', 'stream'],
  port: 9001
});

http.add(winstond.transports.Console, {});

nssocket.listen();
http.listen();
