angular.module('moviedash.movies', [])

.controller('MoviesCtrl', ['$scope', '$location', 'MovieClient', 'selected', 'convert', '$modal', '$sce',
  function ($scope, $location, MovieClient, selected, convert, $modal, $sce) {
  // Code
  //STUB: Replace with dynamic data


  $scope.selectMovie = function(movie) {
    selected.setStorage('movie', movie);
    $location.path('/details');
  };
  $scope.localShowtime = function(showtime) {
    return convert.convertShowTime(showtime, selected.getStorage('leavingTime'));
  };
  $scope.movies = MovieClient.getResults().data;

  $scope.showTrailer = function(movie) {
    var link = movie.trailerLink;
    if (link !== false) {
      var videoId = link.slice(link.indexOf('=') + 1);
      var embededUrl = 'https://www.youtube.com/embed/' + videoId;

      $scope.title = movie.movieName;
      $scope.trailerUrl = $sce.trustAsResourceUrl(embededUrl);

      $scope.$modalInstance = $modal.open({
        templateUrl: "../App/movies/videoplayer.html",
        controller: 'MoviesCtrl',
        size: "lg",
        scope: $scope
      });
    }
  };

  $scope.closeTrailer = function() {
    $scope.$modalInstance.close('');

  };

  $scope.getLeaveTime = function() {
    var leaveTime = new Date(selected.getStorage('leavingTime'));
    var hours = leaveTime.getHours() % 12 || 12;
    var minutes = leaveTime.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes.toString();
    }
    return hours.toString() + ":" + minutes;
  };

  $scope.isFinalRow = function(index, size) {
    var finalRow = size % 3 || 3;
    return size - index <= finalRow;
  };
}]);

