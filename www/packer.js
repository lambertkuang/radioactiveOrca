var movieCtrler = require('./movieModel/movieController.js');
var request = require('request');

if (!process.env.PORT) {
  var keys = require('./googleKey');
}

module.exports = function(movies, callback) {
  var index = 0;
  var results = [];
  //Recursive function to handle multiple async movie lookups
  var movieLookupHelper = function() {
    if (index > movies.length - 1) {
      //All movies have been packed. Call callback.
      callback(results);
    } else {
      var movie = movies[index];
      //check the database to see if we already have information for that movie
      checkForMovie(movie, function(found) {
      //if successfully found,
        if (found) {
        //pack that information in with the movies list and continue to next movie
          packInfo(found, index);
          index++;
          movieLookupHelper();
        } else {
        //hit IMDB for the required information

          getInfoFromIMDB(movie, function (data) {
            if (data) {
              //Add this data to the database
              addMovieToDB(data, movie.id);
              //Pack that information in with the movies list and continue to next movie
              packInfo(data, index);
              index++;
              movieLookupHelper();
            } else {
              index++;
              movieLookupHelper();
            }
          });
        }
      });
    }
  };



  var packInfo = function(movieData, index) {
    var movie = movies[index];

    if (!movie) {
      return;
    }
    movie.poster = movieData.poster;
    movie.synopsis = movieData.synopsis;
    results.push(movie);
  };
  var checkForMovie = function(movie, callback) {
    //callback(movieCtrler.addMovie(movie));
    movieCtrler.findMovie(movie.id, callback);
  };
  var getInfoFromIMDB = function(movie, callback) {

    var movieDbKey = process.env.DBKEY || keys.moviedb;
    request("https://api.themoviedb.org/3/find/" + movie.id + "?api_key=" + movieDbKey + '&external_source=imdb_id', function(error, response, body){
      body = JSON.parse(body);
      if (!body.movie_results[0]) {
        callback(null);
        return;
      }
      var film = {};
      film.title = body.movie_results[0].title;
      film.poster = 'http://image.tmdb.org/t/p/w300' + body.movie_results[0].poster_path;
      film.synopsis = body.movie_results[0].overview;

      callback(film);
    });


  };
  var addMovieToDB = function(imdbData, id) {
    return movieCtrler.addMovie(imdbData, id);
  };

  movieLookupHelper();

};

