var app = angular.module('moviedash.landing', []);

app.controller('LandingCtrl', ['$scope', '$location', 'MovieClient', '$http',
  function ($scope, $location, MovieClient, $http) {
    $scope.modality = 'driving';
    $scope.data = {
      activeButton : 'driving'
    };
    // do a lot of Date finagling
    var rightNow = new Date();
    var midnight = rightNow.toString().split(" ");
    midnight = midnight.splice(1, 3);
    midnight.push("00:00:00");
    midnight = midnight.join(' ');
    // get the time since midnight, but add a minute to allow for passing of time
    var elapsedTime = Date.parse(rightNow) - Date.parse(midnight);
    var constant = 1;

    // time from the ionic-timepicker module
    $scope.slots = {epochTime: elapsedTime, format: 12, step: 15};

    // prettify for user experience
    var timeDesignation = 'AM';
    var prettyHour = Math.floor($scope.slots.epochTime/1000/60/60%60);
    if (prettyHour >= 12) {
      if (prettyHour !== 12) {
        prettyHour = prettyHour - 12;
      }
      timeDesignation = 'PM';
    }
    var prettyMin = Math.floor($scope.slots.epochTime/1000/60%60);
    // check if I need to add a zero
    var minString = prettyMin.toString();
    if (minString.length < 2) {
      var prettyString = '0' + minString;
    }
    $scope.prettyTime = prettyHour + ":" + (prettyString ? prettyString : minString) + ' ' + timeDesignation;
    
    // call on button click to set mode of transport
    $scope.selectMode = function(mode) {
      $scope.modality = mode;
      $scope.data = {
        activeButton: mode
      };
    };

    // again from ionic-timepicker module
    $scope.timePickerCallback = function (val) {
      if (typeof (val) === 'undefined') {
        console.log('Time not selected');
      } else {
        console.log('Selected time is : ', val);    // `val` will contain the selected time in epoch

        var timeDesignation = 'AM';
        var prettyHour = Math.floor(val/60/60%60);
        if (prettyHour > 12) {
          if (prettyHour !== 12) {
            prettyHour = prettyHour - 12;
          }
          timeDesignation = 'PM'
        }
        var prettyMin = Math.floor(val/60%60);
        // check if I need to add a zero
        var minString = prettyMin.toString();
        if (minString.length < 2) {
          var prettyString = '0' + minString;
        }
        $scope.prettyTime = prettyHour + ":" + (prettyString ? prettyString : minString) + ' ' + timeDesignation;
        constant = 1000;
      }
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
    $scope.zipSubmit = function(zip) {
      $scope.isLoading = true;
      $scope.error = null;
      $http.get('http://maps.googleapis.com/maps/api/geocode/json?address=' + zip).then(function (response) {
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
      // console.log(lat, long);
      $scope.location = lat + ', ' + long;

      var leavingMS = Date.parse(midnight) + $scope.slots.epochTime * constant;
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
