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

app.factory("Animations", function(Api) {
  var Animations = {};

  Animations.moveOcto = function(Api) {
    $(".octo, .stick").animate({
      right: "+=" + Api.stepSize,
    }, 1000 );
  }

  return Animations;
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
  Api.stepSize = 0;
  Api.lovePoints = 0;

  Api.gameDetails = function() {
    $http.get(game_details_url).then(function(result) {
      Api.original_guesses = result.data.guesses;
      Api.guesses = Api.original_guesses;
      setStepSize(Api.guesses);
      $rootScope.$broadcast("detailsSetup");
      $rootScope.$broadcast("detailsUpdated");
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
    $rootScope.$broadcast("detailsUpdated");
  }

  Api.noMoreGuesses = function() {
    return Api.guesses == 0;
  }

  Api.resetGuesses = function() {
    Api.guesses = Api.original_guesses;
  }

  function setStepSize(guesses) {
    var width = $(window).width();
    var adjustedWidth = width - 95 // 95 is a constant to offset so the image doesn't go edge to edge 
    Api.stepSize = adjustedWidth / guesses;
  }

  return Api;
});

app.filter('loveLevel', function() {
  return function(lovePoints) {
    if (lovePoints <= 10) {
      return "Puppy lover";
    } else if (lovePoints <= 25 ) {
      return "Mediocre lover";
    } else if (lovePoints <= 50) {
      return "B- lover";
    } else if (lovePoints <= 100) {
      return "Goot lover";
    } else if (lovePoints < 238) {
      return "But I lover";
    } else {
      return "Forever lover :*...";
    }
  }
});




















