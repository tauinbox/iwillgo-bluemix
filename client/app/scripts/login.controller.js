(function() {

  'use strict';

  angular.module('iwgApp')

  .controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'authFactory', function($scope, ngDialog, $localStorage, authFactory) {
      
    $scope.loginData = $localStorage.getObject('userinfo','{}');

    $scope.doLogin = function() {
      if($scope.rememberMe) $localStorage.storeObject('userinfo',$scope.loginData);
      authFactory.login($scope.loginData);
      ngDialog.close();

    };
            
    $scope.openRegister = function () {
      ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller: "RegisterController" });
    };
      
  }]);

})();  