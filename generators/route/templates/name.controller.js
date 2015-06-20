(function (angular) {
   'use strict';

   function <%= routeName %> () {
      var <%= routeName %> = this;

      angular.extend(<%= routeName%>, {

      });
   }

   angular.module('<%= appName %>').controller('<%= routeName %>', <%= routeName %>);
})(angular);