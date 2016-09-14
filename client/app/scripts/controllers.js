'use strict';

angular.module('iwgApp')

.controller('EventsController', ['$scope', 'eventsFactory', function ($scope, eventsFactory) {

  eventsFactory.query(
    function (response) {
      $scope.events = response;
    },
    function (response) {
      $scope.message = "Error: " + response.status + " " + response.statusText; //not used now
    });
}])

.controller('EventDetailsController', ['$scope', '$state', '$stateParams', 'eventsFactory', 'commentsFactory', function($scope, $state, $stateParams, eventsFactory, commentsFactory) {

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

    commentsFactory.save({id: $stateParams.id}, $scope.mycomment);
    $state.go($state.current, {}, {reload: true});
    $scope.commentForm.$setPristine();
    $scope.mycomment = {
      comment: ""
    };
  };
}])

.controller('FriendsController', ['$scope', '$state', 'usersFactory', 'AuthFactory', function ($scope, $state, usersFactory, AuthFactory) {

  $scope.searchString = "";
  $scope.error = "";

  var currentUserId = AuthFactory.getUserId();

  usersFactory.friends.query({ id: currentUserId },
    function (response) {
      $scope.friends = response;
      if (response.length < 1) $scope.info = "No one has been added yet...";
    },
    function (response) {
      // If token has expired then logout and refresh
      if ((response.data.message === 'You are not authenticated!') && AuthFactory.isAuthenticated) {
        AuthFactory.logout();
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
      if ((response.data.message === 'You are not authenticated!') && AuthFactory.isAuthenticated) {
        AuthFactory.logout();
        $state.go('app', {}, { reload: true });
      }
      $scope.error += "\nError: " + response.status + " " + response.statusText;
    }
  );  

  $scope.findUser = function() {
    $scope.found = [];

    externloop:
    for (var i=0; i<$scope.users.length; i++) {
      if (($scope.users[i].username.indexOf($scope.searchString) >= 0) || 
          ($scope.users[i].firstname.indexOf($scope.searchString) >= 0) || 
          ($scope.users[i].lastname.indexOf($scope.searchString) >= 0)) {
        
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

}])

.controller('ProfileController', ['$scope', '$state', '$stateParams', 'usersFactory', 'AuthFactory', function ($scope, $state, $stateParams, usersFactory, AuthFactory) {

  var userid = AuthFactory.getUserId();
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

}])

.controller('HeaderController', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function($scope, $state, $rootScope, ngDialog, AuthFactory) {

  $scope.loggedIn = false;
  $scope.username = '';
  
  if(AuthFactory.isAuthenticated()) {
    $scope.loggedIn = true;
    $scope.username = AuthFactory.getUsername();
  }
      
  $scope.openLogin = function() {
    ngDialog.open({ template: 'views/login.html', scope: $scope, className: 'ngdialog-theme-default', controller: "LoginController" });
  };

  $scope.openRegister = function () {
    ngDialog.open({ template: 'views/register.html', scope: $scope, className: 'ngdialog-theme-default', controller: "RegisterController" });
  };  
  
  $scope.logOut = function() {
    AuthFactory.logout();
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
    $scope.loggedIn = AuthFactory.isAuthenticated();
    $scope.username = AuthFactory.getUsername();
  });
      
  $rootScope.$on('registration:Successful', function() {
    $scope.loggedIn = AuthFactory.isAuthenticated();
    $scope.username = AuthFactory.getUsername();
  });
  
  $scope.stateis = function(curstate) {
    var stateMatched = $state.is(curstate);
    if (!stateMatched) {
      $scope.collapseMenu();
    }
    return stateMatched;  
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