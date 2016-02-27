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
  })
  .directive('prettyprint', function() {
    return {
      priority: 10,  // Decrease priority so it's run after ngBindHtml
      restrict: 'C',
      link: function postLink(scope, element, attrs) {
        // When ngBindHtml changes value, we parse the html again
        scope.$watch(attrs.ngBindHtml, function(newValue) {
          // Look for a class like linenums or linenums:<n> where <n> is the
          // 1-indexed number of the first line.
          var elementClasses = element[0].className;
          var lineNumClass = elementClasses.match(/\blinenums\b(?::(\d+))?/);
          var lineNums = Boolean(lineNumClass);
          if (lineNumClass[1] && lineNumClass[1].length > 0) {
            lineNums = +lineNumClass[1];  // Convert to integer
          }

          element.html(prettyPrintOne(newValue, '', lineNums));
        });
      }
    };
  });
