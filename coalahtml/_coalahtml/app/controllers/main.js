'use strict';

angular.module('coalaHtmlApp')
  .factory('coalaJSON', function($http, $rootScope){
    var parseResult = function (result) {
      result.affected_code.forEach(function(sourceRange) {
          if (!(sourceRange.file in $rootScope.knownFiles)) {
            $rootScope.knownFiles[sourceRange.file] = [];
          }
          $rootScope.knownFiles[sourceRange.file].push({
            "start":    sourceRange.start.line,
            "end":      sourceRange.end.line,
            "diffs":    result.diffs,
            "message":  result.message,
            "origin":   result.origin,
            "severity": result.severity
          });
        });
    };
    return {
      async: function () {
        var promise =
        $http.get($rootScope.CONSTANTS.data + $rootScope.CONSTANTS.coala)
          .then(function (response) {
            return response;
          });
        return promise;
      },
      parseJSONResults: function (coala_json) {
        $rootScope.COALA_JSON = coala_json.data;
        $rootScope.logsCount = coala_json.data.logs.length;
        var resultsCount = 0;
        for (var section in $rootScope.COALA_JSON.results) {
          $rootScope.COALA_JSON.results[section].forEach(parseResult);
          resultsCount += $rootScope.COALA_JSON.results[section].length;
        }
        $rootScope.resultsCount = resultsCount;
        $rootScope.data.push($rootScope.knownFiles);
        $rootScope.resultFiles = $rootScope.knownFiles;
      }
    };
  })
  .controller('MainCtrl',["$scope", "$rootScope", "$http", "coalaJSON",
    function($scope, $rootScope, $http, coalaJSON) {
    var parseCoalaProject = function() {
        $rootScope.data = [];
        $rootScope.knownFiles = {};
        coalaJSON.async().then(function (coala_json) {
            coalaJSON.parseJSONResults(coala_json);
        });
      };

      $scope.search = function (searchText) {
        return function (item) {
          if (item){
            if(searchText){
              if ((JSON.stringify(item).toLowerCase())
                .indexOf(searchText.toLowerCase()) > -1){
                return true;
              } else {
                return false;
              }
            }
            return true;
          }
        };
      };

    parseCoalaProject();
  }]);
