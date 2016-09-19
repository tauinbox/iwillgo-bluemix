'use strict';

angular.module('iwgApp')

.controller('EventsController', ['$scope', '$rootScope', '$state', 'eventsFactory', 'AuthFactory', function ($scope, $rootScope, $state, eventsFactory, AuthFactory) {

  $scope.isAuthenticated = AuthFactory.isAuthenticated();

  $rootScope.$on('login:Successful', function() {
    $scope.isAuthenticated = AuthFactory.isAuthenticated();
  });  

  eventsFactory.query(
    function (response) {
      $scope.events = response;
    },
    function (response) {
      $scope.message = "Error: " + response.status + " " + response.statusText; //not used now
    });

  $scope.createEvent = function() {
    $state.go('app.newevent');
  };
}])

.controller('NewEventController', ['$scope', '$state', '$stateParams', 'eventsFactory', 'AuthFactory', function($scope, $state, $stateParams, eventsFactory, AuthFactory) {
  var userid = AuthFactory.getUserId();
  $scope.mainTitle = "Create a new Event";
  $scope.buttonName = "Create";

  $scope.today = function() {
    $scope.dt = new Date();
  };
  // $scope.today();

  $scope.clear = function() {
    $scope.dt = null;
  };

  $scope.inlineOptions = {
    customClass: getDayClass,
    minDate: new Date(),
    showWeeks: true
  };

  $scope.dateOptions = {
    // dateDisabled: disabled,
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  // Disable weekend selection
  function disabled(data) {
    var date = data.date,
      mode = data.mode;
    return mode === 'day' && (date.getDay() === 0 || date.getDay() === 6);
  }

  $scope.toggleMin = function() {
    $scope.inlineOptions.minDate = $scope.inlineOptions.minDate ? null : new Date();
    $scope.dateOptions.minDate = $scope.inlineOptions.minDate;
  };

  $scope.toggleMin();

  $scope.open = function() {
    $scope.popup.opened = true;
  };

  $scope.setDate = function(year, month, day) {
    $scope.dt = new Date(year, month, day);
  };

  $scope.format = 'dd-MM-yyyy';


  $scope.popup = {
    opened: false
  };

  var tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  var afterTomorrow = new Date();
  afterTomorrow.setDate(tomorrow.getDate() + 1);
  $scope.events = [
    {
      date: tomorrow,
      status: 'full'
    },
    {
      date: afterTomorrow,
      status: 'partially'
    }
  ];

  function getDayClass(data) {
    var date = data.date,
      mode = data.mode;
    if (mode === 'day') {
      var dayToCheck = new Date(date).setHours(0,0,0,0);

      for (var i = 0; i < $scope.events.length; i++) {
        var currentDay = new Date($scope.events[i].date).setHours(0,0,0,0);

        if (dayToCheck === currentDay) {
          return $scope.events[i].status;
        }
      }
    }

    return '';
  }

  $scope.submitEvent = function() {
    $scope.event.createdBy = userid;
    $scope.event.eventDate = $scope.dt;
    eventsFactory.save($scope.event, function(response) {
      $state.go('app.eventdetails', { id: response._id });
      // $state.go('app');
    });
  };
}])

.controller('EditEventController', ['$scope', '$state', '$stateParams', 'eventsFactory', 'AuthFactory', function($scope, $state, $stateParams, eventsFactory, AuthFactory) {
  $scope.mainTitle = "Edit the Event";
  $scope.buttonName = "Update";
}])

.controller('EventDetailsController', ['$scope', '$state', '$stateParams', 'eventsFactory', 'commentsFactory', 'AuthFactory', function($scope, $state, $stateParams, eventsFactory, commentsFactory, AuthFactory) {

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