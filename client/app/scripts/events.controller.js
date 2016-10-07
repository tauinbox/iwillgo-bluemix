(function() {

  'use strict';

  angular.module('iwgApp')

  .controller('EventsController', ['$scope', '$rootScope', '$state', 'eventsFactory', 'authFactory', function ($scope, $rootScope, $state, eventsFactory, authFactory) {

    $scope.isAuthenticated = authFactory.isAuthenticated();

    if ($scope.isAuthenticated) {
      $scope.userid = authFactory.getUserId();
    }

    $rootScope.$on('login:Successful', function() {
      $scope.isAuthenticated = authFactory.isAuthenticated();
      $scope.userid = authFactory.getUserId();
    });

    $rootScope.$on('user:Added', function() {
      $state.go($state.current, {}, {reload: true});
    });

    eventsFactory.events.query(
      function (response) {
        $scope.events = response;
      },
      function (response) {
        $scope.message = "Error: " + response.status + " " + response.statusText; //not used now
      });

    $scope.createEvent = function() {
      $state.go('app.newevent');
    };

    $scope.iWillGo = function(eventid) {
      // console.log($scope.userid);
      eventsFactory.iWillGo(eventid, $scope.userid);
    };

  }]);

})();