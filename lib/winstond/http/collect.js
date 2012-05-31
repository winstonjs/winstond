/**
 * Collect
 */

module.exports = function(log, req, res, callback) {
  this.controller.collect(log, function (err, data) {
    if (err) {
      return res.json(500, err);
    }

    res.json(200, data || { ok: true });

    if (callback) callback();
  });
};
