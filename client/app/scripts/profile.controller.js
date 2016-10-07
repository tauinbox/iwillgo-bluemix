(function() {

  'use strict';

  angular.module('iwgApp')

  .controller('ProfileController', ['$scope', '$state', '$stateParams', 'usersFactory', 'authFactory', function ($scope, $state, $stateParams, usersFactory, authFactory) {

    var userid = authFactory.getUserId();
    // console.log(userid);

    $scope.user = usersFactory.users.get({ id: userid })
      .$promise.then(
        function(response) {
          $scope.user = response;
        },
        function(response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
        }
    );

    $scope.submitProfile = function() {
      usersFactory.users.update({ id: userid }, $scope.user);
      // $state.go($state.current, {}, {reload: true});
      $state.go('app.profile', {}, { reload: true });
    };

  }]);

})();    