/**
 * Query
 */

module.exports = function (socket) {
  var self = this;

  socket.data(['query', '*'], function (payload) {
    var eventId = this.event[2];
    self.query(payload, function(err, results) {
      return !err
        ? socket.send(['result', eventId], results)
        : socket.send(['error', eventId], err);
    });
  });
};
