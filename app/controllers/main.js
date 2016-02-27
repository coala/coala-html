'use strict';

angular.module('coalaHtmlApp')
  .controller('MainCtrl', function ($scope, $http) {
    var parseCoalaProject = function(projectDir, coalaJSON) {
      coalaJSON = coalaJSON || projectDir + '/coala.json';
      $scope.data = [];
      $http.get(coalaJSON).success(function(response){
        var knownFiles = {};
        $scope.content = {};

        var parseResult = function(el){
          var sourceRange = el.affected_code[0];
          if (!(sourceRange.file in knownFiles)){
              knownFiles[sourceRange.file] = [];

              $http.get(projectDir + "/" + sourceRange.file)
                .success(function(content) {
                  $scope.content[sourceRange.file] = content.split("\n");
                });
          }
          knownFiles[sourceRange.file].push({
            "start":    sourceRange.start.line,
            "end":      sourceRange.end.line,
            "diffs":    el.diffs,
            "message":  el.message,
            "origin":   el.origin,
            "severity": el.severity
          });
        };

        for (var errors in response.results) {
          if (response.results[errors][0]){ // If error exists
              response.results[errors].forEach(parseResult);
          }
        }

        $scope.data.push(knownFiles);
      });
    };
    parseCoalaProject("tests/test_projects/simple");

    $scope.range = function(min, max, step) {
      step = step || 1;
      var input = [];
      for (var i = min; i <= max; i += step) {
        input.push(i);
      }
      return input;
    };
  });
