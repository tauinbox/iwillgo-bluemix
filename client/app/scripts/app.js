'use strict';

angular.module('iwgApp', ['ui.router','ngResource','ngDialog'])
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

    // route for the contactus page
    .state('app.friends', {
      url:'friends',
      views: {
        'content@': {
          templateUrl : 'views/friends.html',
          controller  : 'FriendsController'                  
        }
      }
    })

    // route for the menu page
    .state('app.profile', {
      url: 'profile',
      views: {
        'content@': {
          templateUrl : 'views/profile.html',
          controller  : 'ProfileController'
        }
      }
    })

    // route for the dishdetail page
    .state('app.eventdetails', {
      url: 'event/:id',
      views: {
        'content@': {
          templateUrl : 'views/eventdetails.html',
          controller  : 'EventDetailsController'
       }
      }
    })
    ;

    $urlRouterProvider.otherwise('/');
})
;
