'use strict';

angular
  .module('coalaHtmlApp', ['ngRoute', 'ngSanitize'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main'
      })
      .when('/logs', {
        templateUrl: 'app/views/logs.html',
        controller: 'LogsCtrl',
        controllerAs: 'logs'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
