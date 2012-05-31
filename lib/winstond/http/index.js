/**
 * winstond http server
 * (C) 2011, Nodejitsu Inc.
 */

var winstond = require('../../winstond')
  , flatiron = require('flatiron')
  , common = flatiron.common
  , path = require('path')
  , Controller = require('./controller');

exports.createServer = function (options) {
  return new Server(options);
};

var Server = exports.Server = function (options) {
  var self = this
    , options = options || {};

  winstond.Server.call(this, options);
  flatiron.plugins.http.attach.call(this, options);
  delete this.start;

  var listen = this.listen;
  this.listen = function(port, host, callback) {
    this.emit('listening');
    return listen.call(this, port || this.port, host, callback);
  };

  this.controller = new Controller(this);

  if (!this.handlers) {
    this.handlers = {};
    this.services.forEach(function(service) {
      self.handlers[service] = require(path.join(__dirname, service));
      self.handlers[service] = self.handlers[service].bind(self);
    });
  }

  if (options.auth) {
    this.router.before(options.auth);
  }

  this.on('listening', function() {
    if (!Object.keys(self.router.routes).length) {
      self._bindRoute();
    }
  });
};

common.inherits(Server, winstond.Server);

Server.prototype._bindRoute = function() {
  var self = this;

  if (this._boundRoute) return;
  this._boundRoute = true;

  this.router.post(function(next) {
    var req = this.req
      , res = this.res
      , options = req.body || {};

    if (!~self.services.indexOf(options.method)) {
      return next();
    }

    var method = self.handlers[options.method];

    if (!method) {
      return res.json(400, {
        message: 'Bad Request'
      });
    }

    var params = options.params || {};

    method(params, req, res, function (err, data) {
      ;
    });
  });
};
