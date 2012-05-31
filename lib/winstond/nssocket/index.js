/*
 * nssocket.js: NsSocket-based logging server
 *
 * (C) 2011, Nodejitsu Inc.
 *
 */

var nssocket = require('nssocket')
  , winstond = require('../../winstond')
  , path = require('path')
  , common = require('flatiron').common;

exports.createServer = function (options) {
  return new Server(options);
};

var Server = exports.Server = function (options) {
  var options = options || {};
  winstond.Server.call(this, options);
  this._listener = this._connectionListener.bind(this);
  this.server = nssocket.createServer(options.tcp || {}, this._listener);
};

common.inherits(Server, winstond.Server);

Server.prototype._connectionListener = function (socket) {
  var self = this;

  if (!this.handlers) {
    this.handlers = this.services.map(function (service) {
      return require(path.join(__dirname, service));
    });
  }

  for (var i = 0; i < this.handlers.length; i++) {
    this.handlers[i].call(this, socket);
  }
};
