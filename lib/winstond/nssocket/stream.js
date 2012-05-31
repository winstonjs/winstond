/**
 * Stream
 */

module.exports = function (socket) {
  var self = this;

  socket.data(['stream'], function (payload) {
    var options = payload || {};

    var hash = JSON.stringify(options)
      , streams = self._streams = self._streams || {}
      , stream = streams[hash] || (streams[hash] = self.stream(options));

    if (!stream) return;

    stream.on('log', function (log) {
      // All logs.
      socket.send(['log'], log);

      // By transport.
      socket.send(['log', log.transport[0]], payload);

      // By anything else.
      if (payload.keys) {
        payload.keys.forEach(function (key) {
          if (!log[key]) return;
          socket.send(['log', log[key]], payload);
        });
      }
    });

    stream.on('error', function (err) {
      socket.send(['error'], err);
    });

    socket.on('close', function () {
      stream.listeners('log').pop();
      if (!stream.listeners('log').length) {
        delete streams[hash];
        stream.destroy();
      }
    });

    socket.dataOnce(['stream', 'stop'], function () {
      stream.destroy();
    });
  });
};
