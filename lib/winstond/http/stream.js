/**
 * Streaming
 */

module.exports = function(options, req, res, callback) {
  this.controller.stream(options, res, function (err) {
    if (err) {
      try {
        if (!res.response.finished) {
          res.response.end();
          res.response.socket.destroy();
        }
      } catch (e) {
        ;
      }
    }
    if (callback) callback();
  });
};
