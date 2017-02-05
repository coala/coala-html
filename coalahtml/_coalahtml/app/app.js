'use strict';

angular
  .module('coalaHtmlApp', ['ngRoute', 'ngSanitize'])
  .run(['$rootScope', '$http', function($rootScope, $http) {
    $rootScope.LOG_LEVELS = ["DEBUG", "INFO", "WARNING", "ERROR"];
    $rootScope.RESULT_SEVERITY = ["INFO", "NORMAL", "MAJOR"];
    $rootScope.SEVERITY_TO_BOOTSTRAP = ["info", "warning", "danger"];
    $rootScope.LOG_LEVEL_TO_BOOTSTRAP = ["primary", "info", "warning",
                                         "danger"];
    $rootScope.THEME = 0; // 0 for Dark and 1 for Light
    $http.get("data/Constants.json").then(function(constants) {
      $rootScope.CONSTANTS = constants.data;
      $http.get($rootScope.CONSTANTS.data + $rootScope.CONSTANTS.file_data)
        .then(function(file_data) {
          $rootScope.FILE_DATA = file_data.data;
          $rootScope.filesCount = Object.keys(file_data.data).length;
      });
      $http.get($rootScope.CONSTANTS.data + $rootScope.CONSTANTS.files)
        .then(function(files) {
          $rootScope.FILES = files.data;
      });
      $http.get($rootScope.CONSTANTS.roothome)
        .then(function(roothome) {
          $rootScope.ROOTHOME = roothome.data;
      });
    });
  }])
  .config(['$routeProvider', '$locationProvider',
           function ($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(false).hashPrefix('');
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
      .when('/file/:fileName*?', {
        templateUrl: 'app/views/files.html',
        controller: 'FilesCtrl',
        controllerAs: 'files'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);
