'use strict';

angular.module('coalaHtmlApp')
  .controller('FilesCtrl',['$scope', '$routeParams', '$rootScope',
    function ($scope, $routeParams, $rootScope) {
    $scope.basename = function(path_name) {
      path_name = path_name || $rootScope.ROOTHOME;
      return path_name.split('/').slice(-1)[0];
    };
    var getNameLink = function(fileName) {
      var linkNameContainer = [], files = fileName.split('/');
      var fileNameLen = files.length,
          rootHomeLen = $rootScope.ROOTHOME.split('/').length;
      var link = "#/file/" + $rootScope.ROOTHOME;

      linkNameContainer.push({'name':'/','link':link});
      for (var index = rootHomeLen; index < fileNameLen; index++) {
        link = link + '/' + files[index];
        linkNameContainer.push({
          'name' : files[index] + (index < fileNameLen-1 ? '/' : ''),
          'link' : link
        });
      }
      $scope.linkNameContainer = linkNameContainer;
    };
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
          var resultFound = $rootScope.resultFiles[file] ? true : false;
          $scope.fileContents.push({'name': file,
                                    'type': fileType,
                                    'result':resultFound});
          console.log(resultFound + " " + file);
        });
      } else {
          $scope.fileType = "file";
          var result = "";
          $rootScope.FILE_DATA[fileName].forEach(function(line){
            result += line;
          });
          $scope.fileContents = result;
      }
      getNameLink(fileName);
    };

    $scope.fileName = $routeParams.fileName || $rootScope.ROOTHOME;
    parseCoalaProject($scope.fileName);
  }]);
