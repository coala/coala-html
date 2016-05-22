'use strict';

angular.module('coalaHtmlApp')
  .controller('MainCtrl', function ($scope, $http) {
    var parseCoalaProject = function(projectDir, coalaJSON) {
      $http.get(projectDir + $scope.Constants.file_data)
        .success(function(file_data) {
          $scope.file_dict = angular.copy(file_data);
          coalaJSON = coalaJSON || projectDir + $scope.Constants.coala;
          $scope.data = [];
          $http.get(coalaJSON).success(function(coala_json) {
            var knownFiles = {};
            var parseResult = function(el) {
                el.affected_code.forEach(function(sourceRange){
                    if (!(sourceRange.file in knownFiles)){
                        knownFiles[sourceRange.file] = [];
                    }
                    knownFiles[sourceRange.file].push({
                      "start":    sourceRange.start.line,
                      "end":      sourceRange.end.line,
                      "diffs":    el.diffs,
                      "message":  el.message,
                      "origin":   el.origin,
                      "severity": el.severity
                    });
                });
            };
            for (var section in coala_json.results) {
              if (coala_json.results[section].length > 0) {
                coala_json.results[section].forEach(parseResult);
              }
            }
            $scope.data.push(knownFiles);
          });
        });
      };
    $http.get("data/Constants.json").success(function(constants) {
      $scope.Constants = constants;
      parseCoalaProject($scope.Constants.data);
    });
  });
