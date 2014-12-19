var app = angular.module('starter.services', []);

app.factory("Letters", function() {
  var Letters = {};

  Letters.all = function() {
    return ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
  }

  Letters.removeCrossedOutLetters = function() {
    var struckOutLetters = $(".strikethrough");
    for (var i = 0; i < struckOutLetters.length; i++) {
      $(struckOutLetters[i]).removeClass("strikethrough");
    };
  }

  return Letters;
});

app.factory("Phrase", function() {
  var Phrase = {};

  Phrase.coverEverythingUp = function() {
    var wordLetters = $(".word-letter");
    for (var i = 0; i < wordLetters.length; i++) {
      $(wordLetters[i]).addClass("covered");
    };
  }

  return Phrase;
});

app.factory('Api', function($http, $rootScope) {
  var root_url = "http://localhost:3000/api/";
  // var root_url = "http://takoyaki.herokuapp.com/api/";
  var game_details_url = root_url + "game_details";
  var next_phrase_url = root_url + "next_phrase";

  var Api = {};

  Api.original_guesses = null;
  Api.guesses = null;
  Api.phrase = null;

  Api.gameDetails = function() {
    $http.get(game_details_url).then(function(result) {
      Api.original_guesses = result.data.guesses;
      Api.guesses = Api.original_guesses;
      $rootScope.$broadcast("guessesUpdated");
    });
  }

  Api.nextPhrase = function() {
    $http.get(next_phrase_url).then(function(result) {
      var phrase = jQuery.parseJSON(result.data.phrase);
      Api.phrase = phrase;
      $rootScope.$broadcast("phraseUpdated");
    });
  }

  Api.reduceGuess = function() {
    Api.guesses -= 1;
  }

  Api.noMoreGuesses = function() {
    return Api.guesses == 0;
  }

  Api.resetGuesses = function() {
    Api.guesses = Api.original_guesses;
  }

  return Api;
});