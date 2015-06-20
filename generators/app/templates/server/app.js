'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

global.rootRequire = function(name) {
   return require(__dirname + '/' + name);
}

var express = require('express'),
    mongoose = require('mongoose'),
    config = require('./config/environment'),
    logger = rootRequire('./components/logger');

mongoose.connect(config.mongo.uri, config.mongo.options);

var app = express();

var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
   logger.info('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// If I die, wake me up!
process.on('SIGTERM', function () {
   server.close(function () { process.exit(0); });
});

// Expose app
exports = module.exports = app;