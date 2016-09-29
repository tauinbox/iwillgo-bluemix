'use strict';

angular.module('iwgApp', ['ui.router', 'ui.bootstrap', 'ngResource', 'ngDialog', 'ngMap'])
  .config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    // route for the home page
    .state('app', {
      url:'/',
      views: {
        'header': {
          templateUrl : 'views/header.html',
          controller  : 'HeaderController'
        },
        'content': {
          templateUrl : 'views/events.html',
          controller  : 'EventsController'
        },
        'footer': {
          templateUrl : 'views/footer.html',
        }
      }

    })

    // route for the friends page
    .state('app.friends', {
      url:'friends',
      views: {
        'content@': {
          templateUrl : 'views/friends.html',
          controller  : 'FriendsController'                  
        }
      }
    })

    // route for the profile page
    .state('app.profile', {
      url: 'profile',
      views: {
        'content@': {
          templateUrl : 'views/profile.html',
          controller  : 'ProfileController'
        }
      }
    })

    // route for the editprofile page
    .state('app.editprofile', {
      url: 'editprofile',
      views: {
        'content@': {
          templateUrl : 'views/editprofile.html',
          controller  : 'ProfileController'
        }
      }
    })    

    // route for the eventdetails page
    .state('app.eventdetails', {
      url: 'events/:id',
      views: {
        'content@': {
          templateUrl : 'views/eventdetails.html',
          controller  : 'EventDetailsController'
       }
      }
    })

    // route for the editevent page
    .state('app.editevent', {
      url: 'events/:id/edit',
      views: {
        'content@': {
          templateUrl : 'views/editevent.html',
          controller  : 'EditEventController'
       }
      }
    })

    // route for the newevent page
    .state('app.newevent', {
      url: 'newevent',
      views: {
        'content@': {
          templateUrl : 'views/editevent.html',
          controller  : 'NewEventController'
       }
      }
    })
    ;

    $urlRouterProvider.otherwise('/');
})
;
