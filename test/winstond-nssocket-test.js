/**
 * winstond nssocket test
 */

var fs = require('fs')
  , assert = require('assert')
  , vows = require('vows')
  , winstond = require('winstond')
  , winston = require('winston')
  , helpers = require('./helpers');

/**
 * Server
 */

var server = winstond.nssocket.createServer({
  services: ['collect', 'query', 'stream'],
  port: 9003
});

/**
 * Logger
 */

var logger = new winston.Logger;

logger.add(require('winston-nssocket').Nssocket, {
  host: '127.0.0.1',
  port: 9003
});

/**
 * Tests
 */

helpers.run('nssocket-server', server, logger).export(module);
