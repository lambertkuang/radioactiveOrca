var app = angular.module('moviedash.landing', []);

app.controller('LandingCtrl', ['$scope', '$location', 'MovieClient', '$http',
  function ($scope, $location, MovieClient, $http) {
    $scope.modality = "driving";

    // do a lot of Date finagling
    var rightNow = new Date();
    var midnight = rightNow.toString().split(" ");
    midnight = midnight.splice(1, 3);
    midnight.push("00:00:00");
    midnight = midnight.join(' ');
    var elapsedTime = Date.parse(rightNow) - Date.parse(midnight);

    // time from the ionic-timepicker module
    $scope.slots = {epochTime: elapsedTime, format: 12, step: 15};
    // prettify for user experience
    var prettyHour = Math.floor($scope.slots.epochTime/1000/60/60%60);
    if (prettyHour > 12) {
      prettyHour = prettyHour - 12;
    }
    var prettyMin = Math.floor($scope.slots.epochTime/1000/60%60);
    $scope.prettyTime = prettyHour + ":" + prettyMin; 

    // again from ionic-timepicker module
    $scope.timePickerCallback = function (val) {
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        console.log('Selected time is : ', val);    // `val` will contain the selected time in epoch
      }
    
      var prettyHour = Math.floor($scope.slots.epochTime/1000/60/60%60);
      if (prettyHour > 12) {
        prettyHour = prettyHour - 12;
      }
      var prettyMin = Math.floor($scope.slots.epochTime/1000/60%60);
      $scope.prettyTime = prettyHour + ":" + prettyMin; 
    
    };


    //Checks if geolocation is available, shows form if not
    $scope.findLocation = function() {
      $scope.error = null;
      $scope.isLoading = true;
      if (!navigator.geolocation) {
        $scope.error= "Geolocation is not supported by your browser. Please enter your zipcode.";
      }

      function success(position) {
        $scope.isLoading = false;
        //if location is found, sets lat and long
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        sendQuery(latitude, longitude);
      }

      function error() {
        $scope.isLoading = false;
        //on error, shows input form
        $scope.error = "Unable to retrieve location. Please enter your zipcode.";
      }

      //calls for geolocation on button click
      navigator.geolocation.getCurrentPosition(success, error);
    };

    //handles submit from form and sends zip to factory
    $scope.zipSubmit = function() {
      $scope.isLoading = true;
      $scope.error = null;
      $http.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + $scope.zip).then(function (response) {
        if (!response) {
          $scope.error = 'Not a valid zipcode';
          return;
        }
        var lat = response.data.results[0].geometry.location.lat;
        var long = response.data.results[0].geometry.location.lng;
        sendQuery(lat, long);
      });
    };

    var sendQuery = function(lat, long) {
      console.log(lat, long);
      $scope.location = lat + ', ' + long;
      var leavingMS = Date.parse(midnight) + $scope.slots.epochTime * 1000;
      $scope.query = {
        location: $scope.location,
        modality : $scope.modality,
        leavingTime: leavingMS,
        timeArray: [
          new Date(leavingMS).getHours(),
          new Date(leavingMS).getMinutes()
        ]
      };
      MovieClient.getTheaters($scope.query).then(function(response) {
        handleResults(response);
      });
    };

    var handleResults = function(response) {
      $scope.isLoading = false;
      if (!response.data) {
        $scope.error = "No movies are available at this time. Please try again later.";
        return;
      } else {
        MovieClient.setResults(response);
        $location.path('/movies');
      }
    };
  }]);
