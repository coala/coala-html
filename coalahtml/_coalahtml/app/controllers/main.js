'use strict';

angular.module('coalaHtmlApp')
  .controller('MainCtrl',["$scope", "$rootScope", "$http",
    function($scope, $rootScope, $http) {
    var parseCoalaProject = function() {
        $scope.data = [];
        var knownFiles = {};
        var parseResult = function(result) {
          result.affected_code.forEach(function(sourceRange) {
            if (!(sourceRange.file in knownFiles)) {
              knownFiles[sourceRange.file] = [];
            }
            knownFiles[sourceRange.file].push({
              "start":    sourceRange.start.line,
              "end":      sourceRange.end.line,
              "diffs":    result.diffs,
              "message":  result.message,
              "origin":   result.origin,
              "severity": result.severity
            });
          });
        };
        $http.get($rootScope.CONSTANTS.data + $rootScope.CONSTANTS.coala)
          .then(function(coala_json) {
            $rootScope.COALA_JSON = coala_json.data;
            $rootScope.logsCount = coala_json.data.logs.length;
            var resultsCount = 0;
            for (var section in $rootScope.COALA_JSON.results) {
              $rootScope.COALA_JSON.results[section].forEach(parseResult);
              resultsCount += $rootScope.COALA_JSON.results[section].length;
            }
            $rootScope.resultsCount = resultsCount;
            $scope.data.push(knownFiles);
            $rootScope.resultFiles = knownFiles;
        });
      };

    parseCoalaProject();
  }]);
