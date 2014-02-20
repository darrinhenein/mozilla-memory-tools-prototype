angular.module('memtoolsProtoApp', [
  'ngCookies',
  'ngSanitize',
  'ngRoute'
  ])
.config(function ($routeProvider, $locationProvider) {

  // $locationProvider.html5Mode(true);

  $routeProvider
  .when('/memory', {
    templateUrl: 'views/main.html',
    controller: 'MainCtrl'
  })
  .otherwise({
    redirectTo: '/memory'
  });
});
