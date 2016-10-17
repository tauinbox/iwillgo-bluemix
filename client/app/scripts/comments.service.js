(function() {

  'use strict';

  angular.module('iwgApp')
  .factory('commentsFactory', ['$resource', 'baseURL', function($resource, baseURL) {

    return $resource(baseURL + "events/:id/comments/:commentId", {id: "@id", commentId: "@commentId"}, {
      'update': {
        method: 'PUT'
      }
    });

  }]);

})();  