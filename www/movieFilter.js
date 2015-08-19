//changes showtime into date object
var convertShowTime = function(showtime, leavingTime) {
  today = new Date(leavingTime);
  //splitting showtime on non numerical characters
  var timeArray = showtime.split(/\D/);
  //if time is in the evening
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
  console.log("SHOWTIME", new Date(today.getTime()));
  return today.getTime();
};

module.exports = function(theaters, leavingTime, timeArray) {
  var results = [];
  var today = new Date(leavingTime);
  today.setHours(timeArray[0]);
  today.setMinutes(timeArray[1]);
  theaters.forEach(function(theater) {
    //adds transit time to leaving time
    var targetTime = (theater.transitTimeSeconds * 1000) + today.getTime();
    console.log("TARGET", new Date(targetTime));
    //mintime is target plus 5 minutes
    minTargetTime = targetTime + 300000;
    //maxtime is target plus 35 minutes
    maxTargetTime = targetTime + 2100000;
    theater.movies.forEach(function(movie) {
      movie.showtimes.forEach(function(showtime) {
      var convertedShowTime = convertShowTime(showtime, leavingTime);

        if (minTargetTime <= convertedShowTime && convertedShowTime <= maxTargetTime) {
          //extract imdb id from url
          var imdbArr = movie.imdb.split('/');
          var imdb = imdbArr[imdbArr.length - 2];
          results.push({
            id: imdb,
            dateObjectShowTime: convertedShowTime,
            showTime: showtime,
            movieName: movie.name,
            transitTime: theater.transitTime,
            theaterName: theater.name,
            imdbLink: movie.imdb,
            trailerLink: movie.trailer,
            theaterAddress: theater.address,
            rating: movie.rating});
        }
      });
    });
  });
  return results;
};

