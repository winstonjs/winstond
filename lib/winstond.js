/**
 * winstond
 */

var winstond = exports;

winstond.__defineGetter__('Server', function() {
  return require('./winstond/server').Server;
});

winstond.__defineGetter__('http', function() {
  return require('./winstond/http');
});

winstond.__defineGetter__('nssocket', function() {
  return require('./winstond/nssocket');
});

winstond.transports = require('winston/lib/winston/transports');
