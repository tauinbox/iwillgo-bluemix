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

    // route for the friends page
    .state('app.friends', {
      url:'friends',
      views: {
        'content@': {
          templateUrl : 'views/friends.html',
          controller  : 'UsersController'                  
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
