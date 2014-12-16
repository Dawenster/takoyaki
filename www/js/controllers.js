var app = angular.module('starter.controllers', []);

app.controller('PlayCtrl', function($scope, Letters) {
  $scope.lettersAToI = Letters.aToI();
  $scope.lettersJToR = Letters.jToR();
  $scope.lettersSToZ = Letters.sToZ();
});