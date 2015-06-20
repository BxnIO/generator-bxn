'use strict';

var yeoman = require('yeoman-generator');

var routeGenerator = yeoman.NamedBase.extend({
   constructor: function () {
      yeoman.Base.apply(this, arguments);
      this.argument('routeName', {type: String, required: false});
   },

   getRouteName: function () {
      var done = this.async();
      if (this.routeName) {
         done();
      } else {
         this.prompt({
            type    : 'input',
            name    : 'routeName',
            message : 'What is the name of your new route'
         }, function (answers) {
            this.routeName = answers.routeName;
            done();
         }.bind(this));
      }
   },

   writeNewRoute: function () {
      this.log('Your new route is: ' + this.routeName);
   }
});

module.exports = routeGenerator;