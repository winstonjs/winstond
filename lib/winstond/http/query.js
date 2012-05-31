/**
 * Query Persistent Logs
 */

module.exports = function(options, req, res, callback) {
  this.controller.query(options, function (err, results) {
    if (err) {
      return res.json(500, err);
    }

    res.json(200, results);

    if (callback) callback();
  });
};
