/**
 * Controller
 */

function Controller(server) {
  this.server = server;
}

Controller.prototype.query = function(options, callback) {
  this.server.query(options, callback);
};

Controller.prototype.stream = function(options, res, callback) {
  var self = this
    , socket = res.response.socket;

  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Transfer-Encoding': 'chunked'
  });

  var hash = JSON.stringify(options)
    , streams = this._streams = this._streams || {}
    , stream = streams[hash] || (streams[hash] = this.server.stream(options));

  if (!stream) return;

  stream.on('log', function (payload) {
    res.write(JSON.stringify(payload) + '\n');
  });

  socket.on('close', function () {
    stream.listeners('log').pop();
    if (!stream.listeners('log').length) {
      delete streams[hash];
      stream.destroy();
    }
  });

  socket.on('close', function () {
    if (callback) callback();
  });
};

Controller.prototype.collect = function(log, callback) {
  this.server.log(log.level, log.message, log.meta, callback);
};

module.exports = Controller;
