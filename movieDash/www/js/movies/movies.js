angular.module('moviedash.movies', [])

.controller('MoviesCtrl', ['$scope', '$location', 'MovieClient', 'selected', 'convert', '$modal', '$sce',
  function ($scope, $location, MovieClient, selected, convert, $modal, $sce) {
  // Bool: change depending on whether you want to use mock data
  var developerMode = false;

  // the mock data
  var stub = [{
    dateObjectShowTime: 1440009027415,
    id: "tt1449283",
    imdbLink: "http://www.imdb.com/title/tt1449283/",
    movieName: "Winnie the Pooh",
    poster: "http://image.tmdb.org/t/p/w300/vokAA5Sxqc5zqK612kbuUKCTDPH.jpg",
    rating: "PG",
    showTime: "11:30am",
    synopsis: "WINNIE THE POOH",
    theaterAddress: "845 Market Street, San Francisco, CA",
    theaterName: "Century San Francisco Centre 9 and XD",
    trailerLink: "https://www.youtube.com/watch?v=zCqspczvg8o",
    transitTime: "6 mins"
  },
  {
    dateObjectShowTime: 1440009027485,
    id: "tt0076363",
    imdbLink: "http://www.imdb.com/title/tt0076363/",
    movieName: "The Many Adventures of Winnie the Pooh",
    poster: "http://image.tmdb.org/t/p/w300/vokAA5Sxqc5zqK612kbuUKCTDPH.jpg",
    rating: "PG",
    showTime: "12:00pm",
    synopsis: "Much adventure. Many Pooh. Wow.",
    theaterAddress: "845 Market Street, San Francisco, CA",
    theaterName: "Century San Francisco Centre 9 and XD",
    trailerLink: "https://www.youtube.com/watch?v=U4w3lJis7t8",
    transitTime: "6 mins"
  },{
    dateObjectShowTime: 1440009027500,
    id: "tt0061199",
    imdbLink: "http://www.imdb.com/title/tt0061199/",
    movieName: "Winnie the Pooh and the Honey Tree",
    poster: "http://image.tmdb.org/t/p/w300/vokAA5Sxqc5zqK612kbuUKCTDPH.jpg",
    rating: "PG",
    showTime: "1:30pm",
    synopsis: "This is the one with the honey tree and the umbrella and 'tut tut it looks like rain'!",
    theaterName: "Century San Francisco Centre 9 and XD",
    trailerLink: "https://www.youtube.com/watch?v=NitBpJaom5k",
    transitTime: "6 mins"
  }];

  $scope.selectMovie = function(movie) {
    selected.setStorage('movie', movie);
    $location.path('/details');
  };
  $scope.localShowtime = function(showtime) {
    return convert.convertShowTime(showtime, selected.getStorage('leavingTime'));
  };

  console.log(stub);

  // loads the mock data or the server query, depending on if one
  // is in developerMode or not.
  $scope.movies = developerMode ? stub : MovieClient.getResults().data;


  // $scope.showTrailer = function(movie) {
  //   console.log("show trailer");
  //   var link = movie.trailerLink;
  //   if (link !== false) {
  //     var videoId = link.slice(link.indexOf('=') + 1);
  //     var embededUrl = 'https://www.youtube.com/embed/' + videoId;

  //     $scope.title = movie.movieName;
  //     $scope.trailerUrl = $sce.trustAsResourceUrl(embededUrl);

  //     $scope.$modalInstance = $modal.open({
  //       templateUrl: "../App/movies/videoplayer.html",
  //       controller: 'MoviesCtrl',
  //       size: "lg",
  //       scope: $scope
  //     });
  //   }
  // };


  // $scope.closeTrailer = function() {
  //   $scope.$modalInstance.close('');

  // };

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

