(function() {

  'use strict';

  angular.module('iwgApp')

  .controller('FriendsController', ['$scope', '$state', 'usersFactory', 'authFactory', function ($scope, $state, usersFactory, authFactory) {

    $scope.searchString = "";
    $scope.error = "";

    var currentUserId = authFactory.getUserId();

    usersFactory.friends.query({ id: currentUserId },
      function (response) {
        $scope.friends = response;
        if (response.length < 1) $scope.info = "No one has been added yet...";
      },
      function (response) {
        // If token has expired then logout and refresh
        if ((response.data.message === 'You are not authenticated!') && authFactory.isAuthenticated) {
          authFactory.logout();
          $state.go('app', {}, { reload: true });
        }
        $scope.error += "\nError: " + response.status + " " + response.statusText;
      }
    );

    usersFactory.users.query(
      function (response) {
        $scope.users = response;
      },
      function (response) {
        // If token has expired then logout and refresh
        if ((response.data.message === 'You are not authenticated!') && authFactory.isAuthenticated) {
          authFactory.logout();
          $state.go('app', {}, { reload: true });
        }
        $scope.error += "\nError: " + response.status + " " + response.statusText;
      }
    );  

    $scope.findUser = function() {
      $scope.found = [];
      var input = $scope.searchString.toLowerCase();

      externloop:
      for (var i=0; i<$scope.users.length; i++) {
        if (($scope.users[i].username.toLowerCase().indexOf(input) >= 0) || 
            ($scope.users[i].firstname.toLowerCase().indexOf(input) >= 0) || 
            ($scope.users[i].lastname.toLowerCase().indexOf(input) >= 0)) {
          
          if ($scope.users[i]._id != currentUserId) {
            // console.log($scope.users[i]._id);

            if ($scope.friends) {
              for (var q=0; q<$scope.friends.length; q++) {
                if ($scope.friends[q]._id == $scope.users[i]._id) continue externloop; // skip if user is already my friend
              }
            }

            $scope.found.push($scope.users[i]);              
          }
        }
      }
    };

    $scope.addFriend = function(friend) {
      usersFactory.friends.save({ id: currentUserId }, { _id: friend }, function(success) {   // add him/her to my friendlist
        usersFactory.friends.save({ id: friend }, { _id: currentUserId }, function(success) { // add me to his/her friendlist
          $state.go($state.current, {}, { reload: true }); // refresh page if everything is good
        });  
      });
    };

    $scope.removeFriend = function(friend) {
      // console.log({ id: currentUserId, friendId: friend });
      usersFactory.friends.delete({ id: currentUserId, friendId: friend }, function(success) {
        usersFactory.friends.delete({ id: friend, friendId: currentUserId }, function(success) {
          $state.go($state.current, {}, { reload: true });
        });      
      });
    };  

  }]);

})();