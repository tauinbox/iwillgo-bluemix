(function() {

  'use strict';

  angular.module('iwgApp')

  .controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'authFactory', function($scope, $state, $rootScope, ngDialog, authFactory) {

    $scope.loggedIn = false;
    $scope.username = '';
    
    if(authFactory.isAuthenticated()) {
      $scope.loggedIn = true;
      $scope.username = authFactory.getUsername();
    }
        
    $scope.openLogin = function() {
      ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller: "LoginController" });
    };

    $scope.openRegister = function () {
      ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller: "RegisterController" });
    };  
    
    $scope.logOut = function() {
      authFactory.logout();
      $scope.loggedIn = false;
      $scope.username = '';
      $state.go('app', {}, { reload: true });
    };

    $scope.collapseMenu = function() {
      var screenWidth = window.innerWidth;
      if (screenWidth < 768) {
        setTimeout(function() {
          // console.log($state.current.name);
          if (!$state.is('app.profile')) {
            jQuery("#navbar").collapse('hide');
          }
        }, 500);
      }
    };  
    
    $rootScope.$on('login:Successful', function() {
      $scope.loggedIn = authFactory.isAuthenticated();
      $scope.username = authFactory.getUsername();
    });
        
    $rootScope.$on('registration:Successful', function() {
      $scope.loggedIn = authFactory.isAuthenticated();
      $scope.username = authFactory.getUsername();
    });
    
    $scope.stateis = function(curstate) {
      var stateMatched = $state.is(curstate);
      if (!stateMatched) {
        $scope.collapseMenu();
      }
      return stateMatched;  
    };
      
  }]);

})();    