'use strict';

angular.module('coalaHtmlApp')
  .controller('FilesCtrl',['$scope', '$routeParams', '$rootScope',
    function ($scope, $routeParams, $rootScope) {
    var parseCoalaProject = function(fileName) {
      /* Expected file structure in filesJSON:
       * JSON object with keys as directory relative to the project
       * path and values are files inside directory relative to the
       * project.
       * For files in the project root, the key should be root.
       */
      $scope.fileBack = fileName.split("/").slice(0, -1).join('/');
      if ($rootScope.FILES.hasOwnProperty(fileName)) {
        $scope.fileType = "dir";
        $scope.fileContents = [];
        $rootScope.FILES[fileName].forEach(function(file){
          var fileType = $rootScope.FILES.hasOwnProperty(file) ? "dir": "file";
          $scope.fileContents.push({'name' : file, 'type' : fileType});
        });
      } else {
          $scope.fileType = "file";
          var result = "";
          $rootScope.FILE_DATA[fileName].forEach(function(line){
            result += line;
          });
          $scope.fileContents = result;
      }
    };
    $scope.fileName = $routeParams.fileName || $rootScope.ROOTHOME;
    parseCoalaProject($scope.fileName);
    $scope.basename = function(path_name){
      return path_name.split('/').slice(-1)[0];
    };
  }]);
