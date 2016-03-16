'use strict';

angular.module('coalaHtmlApp')
  .controller('MainCtrl', function ($scope, $http) {
      console.log("In main");
      var parseCoalaProject = function(projectDir, coalaJSON) {
          $http.get(projectDir + '/file_data.json')
            .success(function(file_data) {
                console.log(file_data);
                $scope.file_dict = {};
                Object.keys(file_data).forEach(function(key) {
                    Object.keys(file_data[key]).forEach(function(file_name) {
                        if (!(file_name in $scope.file_dict)){
                          $scope.file_dict[file_name]=file_data[key][file_name];
                        }
                    });
                });
              coalaJSON = coalaJSON || projectDir + '/coala.json';
              $scope.data = [];
              $http.get(coalaJSON).success(function(response){
                  var knownFiles = {};
                  var parseResult = function(el){
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
                for (var errors in response.results) {
                  if (response.results[errors][0]){ // If error exists
                      response.results[errors].forEach(parseResult);
                  }
                }
                $scope.data.push(knownFiles);
              });
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
