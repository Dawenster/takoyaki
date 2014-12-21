var app = angular.module('starter.controllers', []);

app.controller('PlayCtrl', function($scope, Api, Letters) {
  Api.gameDetails();
  Api.nextPhrase();

  $scope.$on('detailsSetup', function() {
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

app.controller('LettersCtrl', function($scope, Letters, Api, Phrase, Animations) {
  var letters = Letters.all();
  $scope.firstRowLetters = letters.slice(0, 9);
  $scope.secondRowLetters = letters.slice(9, 18);
  $scope.thirdRowLetters = letters.slice(18, 27);

  $scope.clickedLetters = [];

  $scope.clickedLetter = function(letter) {
    makeGuess(letter);
    if (isComplete()) {
      gameOver()
    } else if (Api.noMoreGuesses()) {
      alert("You lose!");
      gameOver()
    }
  }

  $scope.clickedHelp = function() {
    $(".letters-section").toggle();
    $(".help-section").toggle();
  }

  function makeGuess(letter) {
    $scope.clickedLetters.push(letter)

    var original_num_covered_letters = $(".covered").length;
    uncoverLetters(letter);
    var subsequent_num_covered_letters = $(".covered").length;

    if (original_num_covered_letters == subsequent_num_covered_letters) {
      Api.reduceGuess();
      Animations.moveOcto(Api);
    }

    strikeoutClickedLetters();
  }

  function gameOver() {
    $scope.clickedLetters = [];
    Phrase.coverEverythingUp();
    Api.nextPhrase();
    Api.resetGuesses();
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

app.controller('HelpCtrl', function($scope, $ionicModal, Api) {
  $scope.showHint = false;

  $scope.$on('detailsUpdated', function() {
    $scope.guessesRemaining = Api.guesses;
    $scope.lovePoints = Api.lovePoints;
  });

  $scope.clickedBack = function() {
    $(".letters-section").toggle();
    $(".help-section").toggle();
    $scope.showHint = false;
  }

  $scope.$watch('showHint', function(){
    $scope.showHintButtonText = $scope.showHint ? 'Hide hint' : 'Show hint';
  });

  $ionicModal.fromTemplateUrl('about_modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.openAboutModal = function() {
    $scope.modal.show();
  };

  $scope.closeAboutModal = function() {
    $scope.modal.hide();
  };

  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // // Execute action on hide modal
  // $scope.$on('modal.hidden', function() {
  //   // Execute action
  // });
  // // Execute action on remove modal
  // $scope.$on('modal.removed', function() {
  //   // Execute action
  // });
});

















