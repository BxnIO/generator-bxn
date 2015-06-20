'use strict';

var yeoman = require('yeoman-generator'),
    path   = require('path'),
    _      = require('lodash');

var bxnGenerator = yeoman.Base.extend({
   constructor: function () {
      yeoman.Base.apply(this, arguments);
      this.argument('appName', {type: String, optional: true, defaults: path.basename(process.cwd())});
      // Set some defaults
      this.defaults = {
         appVersion: '0.0.1',
         serverPath: 'server',
         clientPath: 'client',
         defaultNodeModules: [
            'express',
            'lodash',
            'async',
            'body-parser',
            'compression',
            'cookie-parser',
            'express-session',
            'method-override',
            'request',
            'serve-favicon'
         ],
         additionalNodeModules: [
            'composable-middleware',
            'express-jwt',
            'jsonwebtoken',
            'memory-cache',
            'moment',
            'morgan',
            'winston'
         ],
         defaultBowerModules: [
            'angular',
            'angular-resource',
            'json3',
            'es5-shim',
            'jquery',
            'lodash'
         ],
         additionalBowerModules: [
            'angular-cookies',
            'angular-sanitize',
            'angular-animate',
            'localforage',
            'angular-localforage',
            'angular-jwt'
         ]
      };
      this.nodeModules = _.clone(this.defaults.defaultNodeModules, true);
      this.bowerModules = _.clone(this.defaults.defaultBowerModules, true);
      this.doInstall = true;
   },
   /**
    * Checks for an existing configuration within the application directory.
    */
   checkForYoRc: function () {
      var done = this.async();
      if (this.config.get('appName')) {
         this.prompt([{
            type: "confirm",
            name: "useConfig",
            message: "It appears you already have an app here. Would you like to use the existing settings?",
            default: true,
         }], function (response) {
            this.useConfig = response.useConfig;
            done();
         }.bind(this));
      } else {
         done();
      }
   },
   /**
    * Prompts for general application settings such as name, version author,
    * etc. These will be used to populate the general information in the
    * package.json, bower.json and in sub generators via the .yo-rc.json.
    */
   getAppConfig: function () {
      if (this.useConfig) { return; }
      var done = this.async();
      this.log('\n*** General Application Information ***\n');
      this.prompt([
         {
            type: 'input',
            name: 'appName',
            message: 'What is the name of your application?',
            default: this.appName,
            filter: function(val) {
               return _.camelCase(val);
            }
         }, {
            type: 'input',
            name: 'appDescription',
            message: 'Describe your application in one brief sentence.'
         }, {
            type: 'input',
            name: 'appAuthor',
            message: 'What is your name?'
         }, {
            type: 'input',
            name: 'appAuthorEmail',
            message: 'What is your email address? (Leave blank to ignore)'
         }, {
            type: 'input',
            name: 'appVersion',
            message: 'What version would you like to start with for your application?',
            default: this.defaults.appVersion
         }, {
            type: 'confirm',
            name: 'appHasRepository',
            message: 'Do you have a version control repository for this application?',
            default: false
         }, {
            type: 'list',
            name: 'appRepositoryType',
            message: 'What version control method do you use?',
            choices: ['Git', 'SVN'],
            when: function (responses) {
               return responses.appHasRepository;
            },
            filter: function (val) {
               return val.toLowerCase();
            }
         }, {
            type: 'input',
            name: 'appRepositoryUrl',
            message: 'What is the URL to your application\'s repository?',
            when: function (responses) {
               return responses.appHasRepository;
            }
         }
      ], function (responses) {
         _.forEach(responses, function (value, key) {
            if (typeof value !== 'undefined') {
               this.config.set(key, value);
            }
         }, this);
         done();
      }.bind(this));
   },
   /**
    * Prompts the user for server-side configurations such as specific node
    * modules, paths, etc. These are used to populate the dependency section of
    * the package.json as well as define defaults for sub generators via the
    * .yo-rc.json.
    */
   getServerConfig: function () {
      if (this.useConfig) { return; }
      var done = this.async();
      this.log('\n*** Server Configuration ***\n');
      this.log('\nNOTE: By default, we will install the following node modules: '+this.defaults.defaultNodeModules.join(', ')+'\n');
      this.prompt([
         {
            type: 'input',
            name: 'serverRoot',
            message: 'What would you like your server root path to be? ['+process.cwd()+'/]',
            default: this.defaults.serverPath

         }, {
            type: 'checkbox',
            name: 'serverModules',
            message: 'Select additional Node modules you would like installed.',
            choices: this.defaults.additionalNodeModules,
            filter: function (val) {
               return val;
            }
         }
      ], function (responses) {
         _.forEach(responses, function (value, key) {
            if (typeof value !== 'undefined') {
               this.config.set(key, value);
            }
            if (key === 'serverModules') {
               _.forEach(value, function (module) {
                  this.nodeModules.push(module);
               }, this);
            }
         }, this);
         done();
      }.bind(this));
   },
   /**
    * Prompts the user for client-side configurations such as specific bower
    * modules, paths, etc. These are used to populate the bower.json as well as
    * define defaults for sub generators via the .yo-rc.json.
    */
   getClientConfig: function () {
      if (this.useConfig) { return; }
      var done = this.async();
      this.log('\n*** Client Configuration ***\n');
      this.log('\nNOTE: By default, we will install the following bower components: '+this.defaults.defaultBowerModules.join(', ')+'\n');
      this.prompt([
         {
            type: 'input',
            name: 'clientRoot',
            message: 'What would you like your client root path to be? ['+process.cwd()+'/]',
            default: this.defaults.clientPath

         }, {
            type: 'checkbox',
            name: 'clientModules',
            message: 'Select additional Bower components you would like installed.',
            choices: this.defaults.additionalBowerModules,
            filter: function (val) {
               return val;
            }
         }
      ], function (responses) {
         _.forEach(responses, function (value, key) {
            if (typeof value !== 'undefined') {
               this.config.set(key, value);
            }
            if (key === 'clientModules') {
               _.forEach(value, function (module) {
                  this.bowerModules.push(module);
               }, this);
            }
         }, this);
         done();
      }.bind(this));
   },
   /**
    * Stores all gathered settings in the .yo-rc.json for use by sub generators.
    */
   writeConfiguration: function () {
      if (this.useConfig) { return; }
      var done = this.async();
      this.log('\n*** Save Settings ***\n');

      this.prompt([
         {
            type: 'confirm',
            name: 'saveAppConfig',
            message: 'Are the above settings correct?'
         }
      ], function (responses) {
         if (responses.saveAppConfig) {
            // Save the config to file just in case it hasn't been.
            this.config.save();
            this.log('\nYour application configuration has been saved.\n');
            done();
         } else {
            this.log('\nPlease run \'yo bxn\' again to make corrections.\n');
            this.doInstall = false;
            // Delete the config file that may have already been created.
            if (this.fs.exists(process.cwd()+'/.yo-rc.json')) {
               this.fs.delete(process.cwd()+'/.yo-rc.json');
            }
            done();
         }
      }.bind(this));
   },
   /**
    * All done configuring. Perform template copies and module installs if the
    * user saved the configuration.
    */
   end: function () {
      if (this.doInstall) {
         var appCore = [
            {from:'_.bowerrc', to:'.bowerrc'},
            {from:'.gitattributes', to:'.gitattributes'},
            {from:'_.gitignore', to:'.gitignore'},
            {from:'.jscsrc', to:'.jscsrc'},
            {from:'.jshintrc', to:'.jshintrc'},
            {from:'_bower.json', to:'bower.json'},
            {from:'_package.json', to:'package.json'},
            {from:'_README.md', to:'README.md'},
            {from:'server', to:this.config.get('serverRoot')},
            {from:'client', to:this.config.get('clientRoot')}
         ];

         this.log('\nPreparing your application now.\n');

         _.forEach(appCore, function (file) {
            this.fs.copyTpl(this.templatePath(file.from), this.destinationPath(file.to), this.config.getAll());
         }, this);

         // Install the latest and greatest!
         this.async.series([
             function (done) {
               this.npmInstall(this.nodeModules, { 'save': true }, done());
             },
             function (done) {
               this.bowerInstall(this.bowerModules, { 'save': true }, done());
             }
         ], function () {
            this.log('\nYour application has been prepared. You may start it by running \'grunt serve\'.\n');
         });
      }
   }
});

module.exports = bxnGenerator;