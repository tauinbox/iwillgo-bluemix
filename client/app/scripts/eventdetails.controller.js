(function() {

  'use strict';

  angular.module('iwgApp')

  .controller('EventDetailsController', ['$scope', '$rootScope', '$state', '$stateParams', 'eventsFactory', 'commentsFactory', 'authFactory', 'NgMap', 
    function($scope, $rootScope, $state, $stateParams, eventsFactory, commentsFactory, authFactory, NgMap) {

    // $scope.event = {};
    $scope.maploc = [];
    $scope.allowEdit = false;
    var userid = authFactory.getUserId();
    $scope.username = authFactory.getUsername();

    $scope.event = eventsFactory.events.get({ id: $stateParams.id })
      .$promise.then(
        function(response) {
          $scope.event = response;
          $scope.maploc[0] = $scope.event.place.loc.coordinates[1];
          $scope.maploc[1] = $scope.event.place.loc.coordinates[0];
          $scope.address = $scope.event.place.address;
          // console.log($scope.maploc);
          if (response.createdBy._id == userid) {
            $scope.allowEdit = true;
          } else {
            $scope.allowEdit = false;
          }
        },
        function(response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
          console.log($scope.message);
        }
    );

    $rootScope.$on('user:Added', function() {
      $state.go($state.current, {}, {reload: true});
    });

    // commentsFactory.query({ id: $stateParams.id },
    //   function (response) {
    //     $scope.comments = response;
    //   },
    //   function (response) {
    //     $scope.message = "Error: " + response.status + " " + response.statusText; //not used now
    //   });    

    $scope.submitComment = function () {

      commentsFactory.save({id: $stateParams.id}, {body: $scope.mycomment, postedBy: userid})
      .$promise.then(function() {
        $state.go($state.current, {}, {reload: true});
        // $scope.commentForm.$setPristine();
        // $scope.mycomment = {
        //   comment: ""
        // };      
      });
    };

    $scope.iWillGo = function() {
      // console.log($scope.event._id, userid);
      eventsFactory.iWillGo($scope.event._id, userid);
    };  
  }]);

})();  