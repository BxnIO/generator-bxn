'use strict';

var yeoman = require('yeoman-generator'),
    path   = require('path'),
    _      = require('lodash');

var resourceGenerator = yeoman.Base.extend({
   constructor: function () {
      yeoman.Base.apply(this, arguments);
      this.argument('resourceName', {type: String, optional: true, defaults: path.basename(process.cwd())});
   },

   checkForYoRc: function () {
      this.initialized = (this.config.get('appName'));
      if (this.initialized) {
         this.log(this.config.getAll());
      } else {
         this.log('You have no project started. Run \'yo bxn\' to create a project first.');
      }
   },

   getResourceName: function () {
      // Do we have an app configuration?
      if (!this.initialized) { return; }
      // Was a name supplied on the command line?
      if (this.resourceName) { return; }
      var done = this.async();
      this.prompt([
         {
            type: 'input',
            name: 'resourceName',
            message: 'What do you want to call this resource?'
         }
      ], function (response) {

      });
   },

   end: function () {
      if (this.initialized) {

      }
   }
});

module.exports = resourceGenerator;