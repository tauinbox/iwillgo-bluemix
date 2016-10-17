(function() {

  'use strict';

  angular.module('iwgApp')
  .service('eventsFactory', ['$resource', '$rootScope', 'baseURL', function($resource, $rootScope, baseURL) {
    var eventsFac = this;

    eventsFac.events = $resource(baseURL + "events/:id", null, {
      'update': {
        method: 'PUT'
      }
    });

    eventsFac.iWillGo = function(eventid, userid) {
      eventsFac.events.get({id: eventid}).$promise.then(
        function(response) {
          for(var i=0; i<response.joined.length; i++) {
            if(response.joined[i] == userid) {
              console.log("Already joined");
              return;
            }
          }
          response.joined.push(userid);
          eventsFac.events.update({id: eventid}, response, function(response) {
            $rootScope.$broadcast('user:Added');
          });
        },
        function(response) {
          $scope.message = "Error: " + response.status + " " + response.statusText;
        }
      );
    };

  }]);

})();  