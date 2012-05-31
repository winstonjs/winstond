/**
 * Collect
 */

module.exports = function (socket) {
  var self = this;

  socket.data(['log'], function (log) {
    self.log(log.level, log.message, log.meta);
  });
}
