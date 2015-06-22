'use strict';

var express = require('express'),
    favicon = require('serve-favicon'),
    morgan = require('morgan'),
    compression = require('compression'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    cookieParser = require('cookie-parser'),
    errorHandler = require('errorhandler'),
    path = require('path'),
    config = require('./environment'),
    passport = require('passport'),
    session = require('express-session'),
    mongoStore = require('connect-mongo')(session),
    mongoose = require('mongoose'),
    seo = require('mean-seo');

module.exports = function(app) {
   var env = app.get('env');
   app.set('views', config.root + '/server/views');
   app.engine('html', require('ejs').renderFile);
   app.set('view engine', 'html');
   app.use(compression());
   app.use(bodyParser.urlencoded({ extended: false }));
   app.use(bodyParser.json());
   app.use(methodOverride());
   app.use(cookieParser());
   app.use(passport.initialize());

   app.use(seo({
      cacheClient: 'disk', // or redis
      //redisURL: 'redis://:password@hostname.port', //specify if using redis
      cacheFolder: path.join(config.root, '.tmp/cache'),
      cacheDuration: 24 * 60 * 60 * 1000 // milleseconds (one day)
   }));

   // Persist sessions with mongoStore
   // We need to enable sessions for passport twitter because its an oauth 1.0 strategy
   var sessionStore = new mongoStore(
      {db: mongoose.connections[0].name, mongooseConnection: mongoose.connections[0]},
      function(e) {
         app.use(session({
            secret: config.secrets.session,
            resave: true,
            saveUninitialized: true,
            store: sessionStore
         })
      );
   });

   if ('production' === env || 'stage' === env) {
      app.use(favicon(path.join(config.root, 'public', 'favicon.ico')));
      app.use(express.static(path.join(config.root, 'public')));
      app.set('appPath', config.root + '/public');
      app.use(morgan('dev'));
   }

   if ('development' === env || 'test' === env) {
      app.use(require('connect-livereload')());
      app.use(express.static(path.join(config.root, '.tmp')));
      app.use(express.static(path.join(config.root, 'client')));
      app.set('appPath', config.root + '/client');
      app.use(morgan('dev'));
      app.use(errorHandler()); // Error handler - has to be last
   }
};