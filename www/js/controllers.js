var app = angular.module('starter.controllers', []);

app.controller('PlayCtrl', function($scope, Letters) {
  $scope.lettersAToI = Letters.aToI();
  $scope.lettersJToR = Letters.jToR();
  $scope.lettersSToZ = Letters.sToZ();

  var root_url = "http://localhost:3000/api/";
  // var root_url = "http://takoyaki.herokuapp.com/api/";
  var game_details_url = root_url + "game_details";
  var next_phrase_url = root_url + "next_phrase";

  $.ajax({
    url: game_details_url,
    async: false
  }).done(function(result) {
    $scope.guesses = result.guesses;
  }).fail(function() {
    console.log("I'm a failure...");
  });

  $.ajax({
    url: next_phrase_url,
    async: false
  }).done(function(result) {
    $scope.phrase = jQuery.parseJSON(result.phrase);
  }).fail(function() {
    console.log("I'm a failure...");
  });
});