(function() {

  'use strict';

  angular.module('iwgApp')

  .controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'authFactory', function($scope, ngDialog, $localStorage, authFactory) {
      
    $scope.register={};
    $scope.loginData={};

    $scope.doRegister = function() {
      console.log('Doing registration', $scope.registration);
      authFactory.register($scope.registration);
      ngDialog.close();

    };
  }]);

})();