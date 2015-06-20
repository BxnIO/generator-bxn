'use strict';

var _ = require('lodash'),
    winston = require('winston'),
    path = require('path'),
    config = rootRequire('config/environment');

winston.emitErrs = true;

var logger = new winston.Logger({
   transports: [
      new winston.transports.Console(config.winston.console)
   ],
   exitOnError: false
});

module.exports = logger;
module.exports.stream = {
   write: function(message, encoding){ logger.info(message); }
};