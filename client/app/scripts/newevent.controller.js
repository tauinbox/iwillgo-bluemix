(function() {

  'use strict';

  angular.module('iwgApp')

  .controller('NewEventController', ['$scope', '$state', 'eventsFactory', 'authFactory', 'NgMap', function($scope, $state, eventsFactory, authFactory, NgMap) {
    var userid = authFactory.getUserId();
    $scope.mainTitle = "Create a new Event";
    $scope.buttonName = "Create";

    $scope.event = {};
    $scope.event.place = { address: "", loc: { type: "Point", coordinates: [0, 0] } };

    $scope.vm = {};
    $scope.vm.types = "['geocode']";

    $scope.vm.placeChanged = function() {
      $scope.vm.place = this.getPlace();
      // console.log('location', $scope.vm.place.geometry.location);
      $scope.vm.map.setCenter($scope.vm.place.geometry.location);
      $scope.event.place.loc.coordinates[0] = $scope.vm.place.geometry.location.lng();
      $scope.event.place.loc.coordinates[1] = $scope.vm.place.geometry.location.lat();
      $scope.event.place.address = $scope.vm.place.formatted_address;
      // console.log($scope.event.place);
    };

    NgMap.getMap().then(function(map) {
      $scope.vm.map = map;
    });

    $scope.today = function() {
      $scope.event.eventDate = new Date();
    };
    // $scope.today();

    $scope.clear = function() {
      $scope.event.eventDate = null;
    };

    $scope.inlineOptions = {
      // customClass: getDayClass,
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
      $scope.event.eventDate = new Date(year, month, day);
    };

    $scope.format = 'dd-MM-yyyy';


    $scope.popup = {
      opened: false
    };

    $scope.submitEvent = function() {
      $scope.event.createdBy = userid;
      eventsFactory.events.save($scope.event, function(response) {
        $state.go('app.eventdetails', { id: response._id });
        // $state.go('app');
      });
    };
  }]);

})();