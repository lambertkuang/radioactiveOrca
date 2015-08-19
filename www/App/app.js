angular.module('moviedash', [
  'ionic',
  'moviedash.landing',
  'moviedash.movies',
  'moviedash.details',
  'moviedash.services',
  'ui.router',
  'ngMap',
  'ui.bootstrap'
  //'ngMock'

])
.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/landing");

  $stateProvider
    .state('landing', {
      url : '/landing',
      controller: 'LandingCtrl',
      templateUrl: 'App/landing/landing.html'
    })
    .state('movies', {
      url : '/movies',
      controller: 'MoviesCtrl',
      templateUrl: 'App/movies/movies.html'
    })
    .state('details', {
      url: '/details',
      controller: 'DetailsCtrl',
      templateUrl: 'App/details/details.html'
    });
}]);
