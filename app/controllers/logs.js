'use strict';

angular.module('coalaHtmlApp')
  .controller('LogsCtrl', ['$scope', '$rootScope',
    function ($scope, $rootScope) {
    var parseCoalaProject = function() {
      $scope.data = $rootScope.COALA_JSON.logs;
    };

    parseCoalaProject();
  }]);
