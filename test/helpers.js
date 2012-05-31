/**
 * Helpers
 */

var fs = require('fs')
  , assert = require('assert')
  , vows = require('vows')
  , winstond = require('winstond')
  , winston = require('winston');

exports.run = function(name, server, logger) {
  var logFile = __dirname + '/test.log';

  /**
   * Server
   */

  server.listen();

  server.add(winstond.transports.File, {
    filename: logFile
  });

  try {
    server.remove(winstond.transports.Console);
  } catch (e) {
    ;
  }

  /**
   * Logging
   */

  return vows.describe('winstond/' + name).addBatch({
    'An instance of Server': {
      'topic': logger,
      'should allow logging': {
        'topic': function() {
          var next = this.callback;
          logger.log('info', 'Logging test.', {}, next);
        },
        'when using the .log() method': function(logged) {
          assert.isNotNull(logged);
        }
      }
    }
  }).addBatch({
    'An instance of Server': {
      'topic': logger,
      'should allow querying': {
        'topic': function() {
          var next = this.callback;
          logger.log('info', 'Logging test.', {}, function() {
            setTimeout(function() {
              logger.query(next);
            }, 1000);
          });
        },
        'when using the .query() method': function(err, logs) {
          assert.equal(logs.http
            ? logs.http.file[0].message
            : logs.nssocket.file[0].message, 'Logging test.');
        }
      }
    }
  }).addBatch({
    'An instance of Server': {
      'topic': logger,
      'should allow streaming': {
        'topic': function() {
          var next = this.callback
            , pending = 3
            , logs = [];

          try {
            logger.remove(winston.transports.Console);
          } catch (e) {
            ;
          }

          logger.stream().on('log', function(log) {
            logs.push(log);
            if (!--pending) {
              this.destroy();
              next(null, logs);
            }
          });

          setTimeout(function() {
            var i = 3;
            while (i--) {
              logger.log('info', 'hello world ' + i, {});
            }
            logger.add(winston.transports.Console);
          }, 1000);
        },
        'when using the .stream() method': function(err, logs) {
          assert.isNull(err);
          logs.forEach(function(log) {
            assert.equal(log.message.replace(/ \d+/g, ''), 'hello world');
          });
        }
      }
    }
  }).addBatch({
    'An instance of Server': {
      'topic': logger,
      'should cleanup when done': function() {
        try {
          fs.unlinkSync(logFile);
        } catch (e) {
          ;
        }
      }
    }
  });
};
