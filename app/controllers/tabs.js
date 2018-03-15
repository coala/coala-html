'use strict';

angular.module('coalaHtmlApp')
.controller('TabCtrl', ['$scope', '$location', function ($scope, $location) {
  $scope.tab = $location.path();
  $scope.setTab = function (stab) {
    $scope.tab = stab;
    $location.path(stab);
    $(document).ready(function () {
      $(".button-collapse").sideNav('hide');
    });
  };
  $scope.isSet = function (stab) {
    return $location.path() === stab;
  };
}]);
