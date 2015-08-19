//Server-side JS
var express = require('express');
var request = require('request');
var bodyParser = require('body-parser');
var url = require('url-parse');
var requestHandler = require('./request-handler');
var mongoose = require('mongoose');


var port = process.env.PORT || 8080;

var app = express();
app.use(bodyParser.json());

var mongooseConnection = process.env.MONGOLAB_URI || 'mongodb://localhost/movies';
mongoose.connect(mongooseConnection);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log("YAY");
  // yay!
});

app.use(express.static('client'));

app.get('/', function(req, res) {
  res.send("SITE IS UP");
});

app.post('/api/movies', requestHandler.getShows);

app.listen(port, function() {
  console.log('Listening at localhost:8080');
});