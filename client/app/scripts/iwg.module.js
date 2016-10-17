(function() {
  
  'use strict';

  angular.module('iwgApp', ['ui.router', 'ui.bootstrap', 'ngResource', 'ngDialog', 'ngMap'])
  .constant("baseURL", "http://localhost:3000/");
  
})();