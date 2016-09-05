'use strict';

angular.module('iwgApp')

.controller('EventController', ['$scope', 'eventFactory', function ($scope, eventFactory) {

  eventFactory.query(
    function (response) {
      $scope.events = response;
    },
    function (response) {
      $scope.message = "Error: " + response.status + " " + response.statusText; //not used now
    });
}])

.controller('EventDetailController', ['$scope', '$state', '$stateParams', 'eventFactory', 'commentFactory', function($scope, $state, $stateParams, eventFactory, commentFactory) {

  // $scope.event = {};
  $scope.message = "Loading ...";

  $scope.event = eventsFactory.get({ id: $stateParams.id })
    .$promise.then(
      function(response) {
        $scope.event = response;
      },
      function(response) {
        $scope.message = "Error: " + response.status + " " + response.statusText;
      }
  );

  $scope.submitComment = function () {

    commentFactory.save({id: $stateParams.id}, $scope.mycomment);
    $state.go($state.current, {}, {reload: true});
    $scope.commentForm.$setPristine();
    $scope.mycomment = {
      comment: ""
    };
  }
}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function($scope, $state, $rootScope, ngDialog, AuthFactory) {

  $scope.loggedIn = false;
  $scope.username = '';
  
  if(AuthFactory.isAuthenticated()) {
    $scope.loggedIn = true;
    $scope.username = AuthFactory.getUsername();
  }
      
  $scope.openLogin = function() {
    ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginController" });
  };

  $scope.openRegister = function () {
    ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller: "RegisterController" });
  };  
  
  $scope.logOut = function() {
    AuthFactory.logout();
    $scope.loggedIn = false;
    $scope.username = '';
  };
  
  $rootScope.$on('login:Successful', function() {
    $scope.loggedIn = AuthFactory.isAuthenticated();
    $scope.username = AuthFactory.getUsername();
  });
      
  $rootScope.$on('registration:Successful', function() {
    $scope.loggedIn = AuthFactory.isAuthenticated();
    $scope.username = AuthFactory.getUsername();
  });
  
  $scope.stateis = function(curstate) {
    return $state.is(curstate);  
  };
    
}])

.controller('LoginController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function($scope, ngDialog, $localStorage, AuthFactory) {
    
  $scope.loginData = $localStorage.getObject('userinfo','{}');

  $scope.doLogin = function() {
    if($scope.rememberMe) $localStorage.storeObject('userinfo',$scope.loginData);
    AuthFactory.login($scope.loginData);
    ngDialog.close();

  };
          
  $scope.openRegister = function () {
    ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller: "RegisterController" });
  };
    
}])

.controller('RegisterController', ['$scope', 'ngDialog', '$localStorage', 'AuthFactory', function($scope, ngDialog, $localStorage, AuthFactory) {
    
  $scope.register={};
  $scope.loginData={};

  $scope.doRegister = function() {
    console.log('Doing registration', $scope.registration);
    AuthFactory.register($scope.registration);
    ngDialog.close();

  };
}])
;