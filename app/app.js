'use strict';

angular
  .module('coalaHtmlApp', ['ngRoute', 'ngSanitize'])
  .run(function($rootScope) {
    $rootScope.LOG_LEVELS = ["DEBUG", "INFO", "WARNING", "ERROR"];
    $rootScope.RESULT_SEVERITY = ["INFO", "NORMAL", "MAJOR"];
    $rootScope.SEVERITY_TO_BOOTSTRAP = ["info", "warning", "danger"];
    $rootScope.LOG_LEVEL_TO_BOOTSTRAP = ["primary", "info", "warning",
                                         "danger"];
  })
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
