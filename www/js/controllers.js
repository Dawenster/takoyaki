var app = angular.module('starter.controllers', []);

app.controller('PlayCtrl', function($scope, Api, Letters) {
  Api.gameDetails();
  Api.nextPhrase();

  $scope.$on('guessesUpdated', function() {
    $scope.guesses = Api.guesses;
  });

  $scope.$on('phraseUpdated', function() {
    $scope.splitPhraseText = splitPhrase(Api.phrase.text);
    Letters.removeCrossedOutLetters();
  });

  function splitPhrase(phrase) {
    var phraseArr = [];
    var line = 0;
    var words = phrase.split(" ");

    for (var i = 0; i < words.length; i++) {
      if (phraseArr[line]) {
        if (phraseArr[line].length + words[i].length < 11) {
          phraseArr[line].push("");
          for (var x = 0; x < words[i].length; x++) {
            phraseArr[line].push(words[i][x]);
          };
        } else {
          line += 1;
          phraseArr.push(words[i].split(""));
        }
      } else {
        phraseArr.push(words[i].split(""));
      }
    };
    return phraseArr;
  }
});

app.controller('LettersCtrl', function($scope, Letters, Api, Phrase) {
  var letters = Letters.all();
  $scope.firstRowLetters = letters.slice(0, 9);
  $scope.secondRowLetters = letters.slice(9, 17);
  $scope.thirdRowLetters = letters.slice(17, 26);

  $scope.clickedLetters = [];

  $scope.clickedLetter = function(letter) {
    $scope.clickedLetters.push(letter)
    uncoverLetters(letter);
    strikeoutClickedLetters();

    if (isComplete()) {
      $scope.clickedLetters = [];
      Phrase.coverEverythingUp();
      Api.nextPhrase();
    }
  }

  function uncoverLetters(letter) {
    var wordLetters = $(".word-letter");
    for (var i = 0; i < wordLetters.length; i++) {
      if ($(wordLetters[i]).attr("value").toLowerCase() == letter.toLowerCase()) {
        $(wordLetters[i]).removeClass("covered");
      }
    };
  }

  function strikeoutClickedLetters() {
    var letters = $(".letter");
    for (var i = 0; i < letters.length; i++) {
      var letter = $(letters[i]).text().trim()
      if (include($scope.clickedLetters, letter)) {
        $(letters[i]).addClass("strikethrough");
      }
    };
  }

  function isComplete() {
    var coveredLetters = $(".covered").not(".blank");
    return coveredLetters.length == 0;
  }

  function include(arr,obj) {
    return (arr.indexOf(obj) != -1);
  }
});