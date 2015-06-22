'use strict';

// Development specific configuration
// ==================================
module.exports = {
  // MongoDB connection options
  mongo: {
    uri: 'mongodb://localhost/gweb-dev'
  },
  seedDB: false,
  gravy: {
    webservices: 'https://blsystest2.foozor.com/tRAppWS/api/r1/',
    api: 'https://testapi.foozor.com/v1/'
  },
  winston: {
    file: {
      level: 'info',
      handleExceptions: true,
      timestamp: true,
      json: true,
      maxsize: 5242880, //5MB
      maxFiles: 5,
      colorize: false
    },
    console: {
      level: 'debug',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      timestamp: true,
      json: false,
      colorize: true
    },
    loggly: {
      level: 'error',
      timestamp: true,
      subdomain: 'timerazor',
      inputToken: 'ca2ddc1a-bc63-455e-937b-9ff577e3e251',
      tags: ['NodeJS', 'EventWeb'],
      stripColors: true
    }
  }
};
