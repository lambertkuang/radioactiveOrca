var qs = require('querystring');
var request = require('request');

if(!process.env.GOOGLEBACKUP) {
  var secret = require('./googleKey');
}

var DISTANCE_API_URL = 'https://maps.googleapis.com/maps/api/distancematrix/json?';

var DistanceMatrix = function() {
  // constructor
};

var travelModes = ['driving', 'walking', 'bicycling', 'transit'];


DistanceMatrix.prototype._format = function(params) {
  /*query reference:
    https://developers.google.com/maps/documentation/distancematrix/intro
  */

  var query = {};
  try {
    query.key = process.env.GOOGLEBACKUP || secret.googlebackup;
    query.origins = params.origin.toString(); // change to string
    query.origins = query.origins.replace(/[\s]/g, ''); // get rid of spaces
    query.destinations = params.destinations.join('|');
    // travel mode
    query.mode = !!params.mode ? params.mode.toLowerCase() : 'driving';
    if (travelModes.indexOf(query.mode) === -1) {
      throw new Error("Invalid Transit Mode");
    }
    query.departure_time = (query.mode === 'transit') ?
                            // convert departure time to seconds since January 1, 1970 UTC
                           Math.round((parseInt(params.departure_time)) / 1000) :
                            // departure_time is 'now' if travel mode is not transit
                           query.departure_time = 'now';
  } catch (e) {
    throw new Error(e);
  }

  return qs.stringify(query);
};

DistanceMatrix.prototype.query = function(params, callback) {
  var querystring = this._format(params);
  request(DISTANCE_API_URL + querystring, function(err, response, body) {
    if (err) {
      return console.error (err);
    }
    var parsedBody = JSON.parse(body);
    if (parsedBody.status !== "OK") {
      console.error("Error with Google Request:\n", parsedBody, parsedBody.status);
    }

    callback(parsedBody);
  });
};

module.exports = new DistanceMatrix();
