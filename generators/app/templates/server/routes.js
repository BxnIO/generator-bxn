'use strict';

var errors = require('./components/errors'),
    path = require('path');

module.exports = function(app) {
   app.use('*', function (req, res, next) {
      var host = (req.headers.host.indexOf(':')>0) ? req.headers.host.split(':')[0] : req.headers.host;
      siteHostname(host);
      return next();
   });

   // Insert routes below
   app.use('/api/categories', require('./api/categories'));
   app.use('/api/channels', require('./api/channels'));
   app.use('/api/venues', require('./api/venues'));
   app.use('/api/bestlists', require('./api/bestlists'));
   app.use('/api/settings', require('./api/settings'));
   app.use('/api/events', require('./api/events'));
   app.use('/api/users', require('./api/user'));

   app.use('/auth', require('./auth'));

   app.route('/api/health')
      .get(function (req, res) { res.send(200); });

   // All undefined asset or api routes should return a 404
   app.route('/:url(api|auth|components|app|brands|bower_components|assets)/*')
      .get(errors[404]);

   // All other routes should redirect to the index.html
   app.route('/*')
      .get(function(req, res) {
         res.sendFile(app.get('appPath') + '/index.html');
      });
};