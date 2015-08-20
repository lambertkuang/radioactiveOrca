angular.module('moviedash.details', [])

.controller('DetailsCtrl', ['$scope', 'selected', '$modal', '$sce', function($scope, selected, $modal, $sce) {
  // Code
  $scope.movie = selected.getStorage('movie');

  $scope.reminderMsg = 'Remind Me to Leave';
  var uniqueMovieId = $scope.movie.id + $scope.movie.showTime + $scope.movie.movieName;
  var alreadyClicked = false;
  var timeoutID;

  // This block of code only executes when user chooses to use the movie reminder button
  if (selected.getStorage(uniqueMovieId)) {
    var reminderInfo = selected.getStorage(uniqueMovieId);
 
    $scope.btn = reminderInfo[0];
    alreadyClicked = reminderInfo[2];
    timeoutID = reminderInfo[1];

    if (alreadyClicked) {
      $scope.reminderMsg = 'Don\'t Remind Me';
    }
  }

  $scope.showTrailer = function(movie) {
    console.log("show trailer");
    var link = movie.trailerLink;
    if (link !== false) {
      var videoId = link.slice(link.indexOf('=') + 1);
      var embeddedUrl = 'https://www.youtube.com/embed/' + videoId;

      $scope.title = movie.movieName;
      $scope.trailerUrl = $sce.trustAsResourceUrl(embeddedUrl);

      $scope.$modalInstance = $modal.open({
        templateUrl: '../../templates/videoplayer.html',
        controller: 'DetailsCtrl',
        size: 'lg',
        scope: $scope
      });
    }
  };

  $scope.closeTrailer = function() {
    $scope.$modalInstance.close('');

  };

  $scope.reminder = function(movie) {
    // HTML 5 Notifications setup
    var Notification = window.Notification || window.mozNotification || window.webkitNotification;
    
    Notification.requestPermission(function (permission) {
      console.log(permission);
    });

    // Calculating the difference between movie showtime and current time. Subtract this difference
    // from the travel time and set the notification alert to 5 minutes before user must leave
    // to catch the movie
    var currentTime = new Date().getTime();
    var timeToMovie = Math.floor(((movie.dateObjectShowTime - currentTime) / 1000) / 60);
    var transitTime = parseInt(movie.transitTime.slice(0, movie.transitTime.indexOf(" ")));
    var leaveTime = ((timeToMovie - transitTime) - 5) * 60000;
    
    if (!alreadyClicked) {
      timeoutID = window.setTimeout(function(){
        var instance = new Notification("Leave now to catch " + movie.movieName+ " at " + movie.showTime + " @ " + movie.theaterAddress);
      }, leaveTime);

      $scope.reminderMsg = 'Don\'t Remind Me';
      alreadyClicked = true;
      $scope.btn = "btn btn-success";
    } else {
      window.clearTimeout(timeoutID);
      $scope.reminderMsg = 'Remind Me to Leave';
      alreadyClicked = false;
      $scope.btn = "btn btn-primary";
    }
    
    // If reminder is used, the session stores the specific movie, theater, and time as a combined ID
    // And stores an array of values assigned to that ID.
    selected.setStorage(uniqueMovieId, [$scope.btn, timeoutID, alreadyClicked]);
  };

  // Navigation info
  $scope.origin = selected.getStorage('location');
  $scope.destination = $scope.movie.theaterAddress;
  $scope.travelMode = selected.getStorage('modality') ? selected.getStorage('modality').toUpperCase() : 'DRIVING';
  $scope.departure_time = $scope.travelMode === 'TRANSIT' ?
                          new Date(parseInt(selected.getStorage('leavingTime'))) :
                          new Date(); // default to now

  $scope.transit_options = {departureTime: $scope.departure_time};
}]);