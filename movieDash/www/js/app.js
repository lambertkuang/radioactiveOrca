// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('moviedash', [
  'ionic',
  'moviedash.landing',
  'moviedash.movies',
  'moviedash.details',
  'moviedash.services',
  'ui.router',
  'ngMap',
  'ui.bootstrap',
  'ionic-timepicker'
  ])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleLightContent();
    }
  });
})

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/landing");

  $stateProvider
    .state('landing', {
      url : '/landing',
      controller: 'LandingCtrl',
      templateUrl: 'templates/landing.html'
    })
    .state('movies', {
      url : '/movies',
      controller: 'MoviesCtrl',
      templateUrl: 'templates/movies.html'
    })
    .state('details', {
      url: '/details',
      controller: 'DetailsCtrl',
      templateUrl: 'templates/details.html'
    });
}])

.controller('MainCtrl', function($scope) {
  screen.unlockOrientation();
});

