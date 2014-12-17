var app = angular.module('starter.controllers', []);

app.controller('PlayCtrl', function($scope, Api) {
  Api.gameDetails().then(function(guesses) {
    $scope.guesses = guesses;
  });

  Api.nextPhrase().then(function(phrase) {
    $scope.splitPhraseText = splitPhrase(phrase.text);
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

app.controller('LettersCtrl', function($scope, Letters) {
  var letters = Letters.all();
  $scope.firstRowLetters = letters.slice(0, 9);
  $scope.secondRowLetters = letters.slice(9, 17);
  $scope.thirdRowLetters = letters.slice(17, 26);

  $scope.clickedLetter = function(letter) {
    var wordLetters = $(".word-letter");
    for (var i = 0; i < wordLetters.length; i++) {
      if ($(wordLetters[i]).attr("value").toLowerCase() == letter.toLowerCase()) {
        $(wordLetters[i]).removeClass("covered");
      }
    };

    if (isComplete()) {
      // alert("All done!");
    }
  }

  function isComplete() {
    var coveredLetters = $(".covered");
    return coveredLetters.length == 0;
  }
});