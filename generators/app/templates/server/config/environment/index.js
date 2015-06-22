'use strict';

var path = require('path'),
    _ = require('lodash');

function requiredProcessEnv(name) {
   if(!process.env[name]) {
      throw new Error('You must set the ' + name + ' environment variable');
   }
   return process.env[name];
}

var all = {
   env: process.env.NODE_ENV,
   root: path.normalize(__dirname + '/../../..'),
   port: process.env.PORT || 9000,
   // Secret for session, you will want to change this and make it an environment variable
   secrets: {
      session: 'thee4vax7main3eimair3mahgoht3ahRiepheicaenohth2IPhei6ahmeeb1xioch9jakaiciez8ooyaizou9eexeimuerai'
   },
   // List of user roles
   userRoles: ['guest', 'user', 'admin'],
   // MongoDB connection options
   mongo: {
      options: {
         db: { safe: true }
      }
   },

   facebook: {
      clientID:     process.env.FACEBOOK_ID || 'id',
      clientSecret: process.env.FACEBOOK_SECRET || 'secret',
      callbackURL:  (process.env.DOMAIN || '') + '/auth/facebook/callback'
   },

   twitter: {
      clientID:     process.env.TWITTER_ID || 'id',
      clientSecret: process.env.TWITTER_SECRET || 'secret',
      callbackURL:  (process.env.DOMAIN || '') + '/auth/twitter/callback'
   },

   google: {
      clientID:     process.env.GOOGLE_ID || 'id',
      clientSecret: process.env.GOOGLE_SECRET || 'secret',
      callbackURL:  (process.env.DOMAIN || '') + '/auth/google/callback'
   }
};

module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});