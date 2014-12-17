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

app.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}]);

app.factory('Api', function($http, $rootScope) {
  var root_url = "http://localhost:3000/api/";
  // var root_url = "http://takoyaki.herokuapp.com/api/";
  var game_details_url = root_url + "game_details";
  var next_phrase_url = root_url + "next_phrase";

  var Api = {};

  Api.guesses = null;
  Api.phrase = null;

  Api.gameDetails = function() {
    $http.get(game_details_url).then(function(result) {
      Api.guesses = result.data.guesses;
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

  return Api;
});