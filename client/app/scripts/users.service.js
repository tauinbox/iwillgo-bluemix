(function() {

  'use strict';

  angular.module('iwgApp')
  .factory('usersFactory', ['$resource', 'baseURL', 'authFactory', function($resource, baseURL, authFactory) {

    var usersFac = {};

    usersFac.users = $resource(baseURL + "users/:id", null, {
      'update': {
        method: 'PUT'
      }
    });

    usersFac.friends = $resource(baseURL + "users/:id/friends/:friendId", { id: '@id', friendId: '@friendId' }, {
      'update': { 
        method: 'PUT' 
      }
    });

    return usersFac;

  }]);

})();  