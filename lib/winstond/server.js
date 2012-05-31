/*
 * server.js: Base server for `http` and `nssocket` winstond servers.
 *
 * (C) 2012, Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var path = require('path')
  , common = require('flatiron').common
  , winston = require('winston');

var Server = exports.Server = function (options) {
  options || (options = {});
  winston.Logger.call(this, options);

  this.port = options.port || 9000;
  this.host = options.host;
  this.path = options.path;
  this.services = options.services || [];

  this.services.forEach(function (service) {
    if (!~['collect', 'query', 'stream'].indexOf(service)) {
      throw new TypeError('Unknown logging service: ' + service);
    }
  });
};

common.inherits(Server, winston.Logger);

Server.prototype.listen = function () {
  //this.server.on('listening', function() { self.emit('listening'); });
  switch (typeof arguments[0]) {
    case 'number':
      return this.server.listen(arguments[0], arguments[1] || this.host);
    case 'string':
      return this.server.listen(arguments[0]);
    default:
      return this.server.listen(this.path || this.port, this.host);
  }
};

Server.prototype.close = function () {
  return this.server
    ? this.server.close.apply(this.server, arguments)
    : false;
};
