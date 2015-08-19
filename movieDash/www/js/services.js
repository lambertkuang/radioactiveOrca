var app = angular.module('moviedash.services', []);

app.factory('MovieClient', ['$http', 'selected', function($http, selected) {
  var setResults = function(results) {
    selected.setStorage('movieInfo', results);
  };
  var getResults = function() {
    return selected.getStorage('movieInfo');
  };
  var getTheaters = function(query) {
    selected.setStorage('location', query.location);
    selected.setStorage('modality', query.modality);
    selected.setStorage('leavingTime', query.leavingTime);
    return $http({
      method: 'POST',
      data: query,
      url: 'http://localhost:8080/api/movies',
      success: function(response) {
         return response;
      },
      error: function(err){
        console.log(err);
      }
    });
  };
  return {
    getTheaters: getTheaters,
    setResults: setResults,
    getResults: getResults
  };
}]);

app.factory('selected', function() {

  var setStorage = function(key, value) {
    sessionStorage[key] = angular.toJson(value);
  };
  var getStorage = function(key) {
    return angular.fromJson(sessionStorage[key]);
  };
  return {
    setStorage: setStorage,
    getStorage: getStorage
  };
});

app.factory('convert', function () {
  var convertShowTime = function(showtime, leavingTime) {
    today = new Date(leavingTime);
    var timeArray = showtime.split(/\D/);
    if (showtime.indexOf('pm') !== -1 && +timeArray[0] !== 12) {
      today.setHours(+timeArray[0] + 12);
      //if time is midnight
    } else if (showtime.indexOf('am') !== -1 && +timeArray[0] === 12) {
      today.setHours(0);
      today.setDate(today.getDate() + 1);
    } else {
      //change hours to showtime hour
      today.setHours(+timeArray[0]);
    }
    //change minutes to showtime minutes
    today.setMinutes(+timeArray[1]);
    
    return today.getTime();
  };

  return { convertShowTime: convertShowTime };

});

//This filter is meant to be used on a javascript Date object. It
//replaces the date object with a string describing that time in relative
//terms like "5 minutes from now"
app.filter('timeFromNow', function() {
  return function(input) {
    var delta = Math.round((input - new Date()) / 1000);
    if (delta < 0) {
      return "Expired";
    }
    var minutes = Math.round(delta / 60);
    var hours = Math.floor(minutes / 60);
    minutes = minutes - hours * 60;
    if(hours === 0) { 
      if (minutes === 1) {
        return "in 1 minute";
      } 
      return "in " + minutes.toString() + " minutes";
    } 
    if (hours === 1) {
      if (minutes === 0) {
        return "in 1 hour";
      }
      if (minutes === 1) {
        return "in 1 hour, 1 minute";
      }
      return "in 1 hour, " + minutes + " minutes";
    }
    if (minutes === 0) {
      return "in " + hours.toString() + " hours";
    }
    if (minutes === 1) {
      return "in " + hours.toString() + " hours, 1 minute";
    }
    return "in " + hours.toString() + " hours, " + minutes.toString() + " minutes";
  };
});
