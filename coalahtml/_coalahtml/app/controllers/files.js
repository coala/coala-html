'use strict';

angular.module('coalaHtmlApp')
  .controller('FilesCtrl', function ($scope, $http, $routeParams) {
    var parseCoalaProject = function(fileName, projectDir, filesJSON) {
      /* Expected file structure in filesJSON:
       * JSON object with keys as directory relative to the project
       * path and values are files inside directory relative to the
       * project.
       * For files in the project root, the key should be "".
       */
      filesJSON = filesJSON || projectDir + '/files.json';
      $scope.data = [];
      $scope.fileBack = fileName.split("/").slice(0, -1).join('/');

      $http.get(filesJSON).success(function(fileData){
        if (fileData.hasOwnProperty(fileName)) {
          $scope.fileType = "dir";
          $scope.fileContents = {};
          for(var i_file = 0; i_file < fileData[fileName].length; i_file += 1) {
            var dirFile = fileData[fileName][i_file];
            var dirFileType = fileData.hasOwnProperty(dirFile) ? "dir": "file";
            $scope.fileContents[dirFile] = dirFileType;
          }
        } else {
          $scope.fileType = "file";
          $http.get(projectDir + "/" + fileName)
            .success(function(content) {
              $scope.fileContents = content;
            });
        }
        $scope.data = fileData;
      });
    };

    $scope.fileName = $routeParams.fileName || "";
    parseCoalaProject($scope.fileName, "tests/test_projects/simple");
  });
