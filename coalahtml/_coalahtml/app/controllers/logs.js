'use strict';

angular.module('coalaHtmlApp')
  .controller('LogsCtrl', function ($scope, $http) {
    var parseCoalaProject = function(projectDir, coalaJSON) {
      coalaJSON = coalaJSON || projectDir + $scope.Constants.coala;
      $scope.data = [];
      $http.get(coalaJSON).success(function(response){
        $scope.data = response.logs;
      });
    };
    $http.get("data/Constants.json").success(function(content) {
      $scope.Constants = content;
      parseCoalaProject($scope.Constants.data);
    });
  });
