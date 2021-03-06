(function() {

  'use strict';

  angular.module('iwgApp')

  .factory('authFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseURL', 'ngDialog', function($resource, $http, $localStorage, $rootScope, $window, baseURL, ngDialog){
      
    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var username = '';
    var userid = '';
    var authToken;
      

    function loadUserCredentials() {
      var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
      if (credentials.username !== undefined) {
        useCredentials(credentials);
      }
    }
   
    function storeUserCredentials(credentials) {
      $localStorage.storeObject(TOKEN_KEY, credentials);
      useCredentials(credentials);
    }
   
    function useCredentials(credentials) {
      isAuthenticated = true;
      username = credentials.username;
      userid = credentials.userid;
      authToken = credentials.token;
   
      // Set the token as header for your requests!
      $http.defaults.headers.common['x-access-token'] = authToken;
    }
   
    function destroyUserCredentials() {
      authToken = undefined;
      username = '';
      userid = '';
      isAuthenticated = false;
      $http.defaults.headers.common['x-access-token'] = authToken;
      $localStorage.remove(TOKEN_KEY);
    }
       
    authFac.login = function(loginData) {
        
      $resource(baseURL + "users/login")
        .save(loginData,
          function(response) {
            storeUserCredentials({ username: loginData.username, token: response.token, userid: response.userid });
            // console.log(response);
            $rootScope.$broadcast('login:Successful');
          },
          function(response){
            isAuthenticated = false;
            // console.log(response);
            var message =
              '<div class="ngdialog-message">' +
              ' <div><h3>Login Unsuccessful</h3></div>' +
              ' <div><p>' + response.data.err.message + '</p><p>' + response.data.err.name + '</p></div>' +
              ' <div class="ngdialog-buttons">' +
              '  <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>' +
              ' </div>' +
              '</div>';
          
              ngDialog.openConfirm({ template: message, plain: 'true'});
           }
        );
      };
      
      authFac.logout = function() {
        $resource(baseURL + "users/logout").get(function(response) {});
        destroyUserCredentials();
      };
      
      authFac.register = function(registerData) {
          
        $resource(baseURL + "users/register")
        .save(registerData,
          function(response) {
            authFac.login({username:registerData.username, password:registerData.password});
            if (registerData.rememberMe) {
              $localStorage.storeObject('userinfo', {username:registerData.username, password:registerData.password});
            }
            $rootScope.$broadcast('registration:Successful');
          },
          function(response) {
            var message = 
              '<div class="ngdialog-message">' +
              ' <div><h3>Registration Unsuccessful</h3></div>' +
              ' <div><p>' +  response.data.err.message + '</p><p>' + response.data.err.name + '</p></div>' +
              '</div>';
              
              ngDialog.openConfirm({ template: message, plain: 'true'});
          }
        );
      };
      
      authFac.isAuthenticated = function() {
        return isAuthenticated;
      };
      
      authFac.getUsername = function() {
        return username;  
      };

      authFac.getUserId = function() {
        return userid;  
      };    

      loadUserCredentials();
      
      return authFac;
      
  }]);

})();