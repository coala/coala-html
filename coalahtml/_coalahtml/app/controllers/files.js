'use strict';

angular.module('coalaHtmlApp')
  .controller('FilesCtrl', function ($scope, $http, $routeParams) {
    var parseCoalaProject = function(fileName, projectDir, filesJSON) {
      /* Expected file structure in filesJSON:
       * JSON object with keys as directory relative to the project
       * path and values are files inside directory relative to the
       * project.
       * For files in the project root, the key should be root.
       */
      filesJSON = filesJSON || projectDir + $scope.Constants.files;
      $scope.data = [];
      $scope.fileBack = fileName.split("/").slice(0, -1).join('/');
      $http.get(filesJSON).success(function(fJSON) {
        if (fJSON.hasOwnProperty(fileName)) {
          $scope.fileType = "dir";
          $scope.fileContents = {};
          for(var i_file = 0;i_file < fJSON[fileName].length;i_file += 1) {
            var dirFile = fJSON[fileName][i_file];
            var dirFileType = fJSON.hasOwnProperty(dirFile) ? "dir": "file";
            $scope.fileContents[dirFile] = dirFileType;
          }
        } else {
            $scope.fileType = "file";
            $http.get(projectDir + $scope.Constants.file_data)
            .success(function(fileData) {
              var result = "";
              fileData[fileName].forEach(function(line){
                result += line;
              });
              $scope.fileContents = result;
            });
        }
        $scope.data = fJSON;
      }).error(function(e){
        console.log(e);
      });
    };
    $http.get("data/Constants.json").success(function(constants) {
      $scope.Constants = constants;
      $http.get($scope.Constants.roothome).success(function(roothome) {
        $scope.fileName = $routeParams.fileName || roothome;
        $scope.roothome = roothome;
        parseCoalaProject($scope.fileName, $scope.Constants.data);
      });
    });
    $scope.basename = function(path_name){
      return path_name.split('/').slice(-1)[0];
    };
  });
