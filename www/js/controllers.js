var app = angular.module('starter.controllers', []);

app.controller('PlayCtrl', function($scope) {
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

app.controller('LettersCtrl', function($scope, Letters) {
  var letters = Letters.all();

  $scope.firstRowLetters = letters.slice(0, 9);
  $scope.secondRowLetters = letters.slice(9, 18);
  $scope.thirdRowLetters = letters.slice(18, 27);
});