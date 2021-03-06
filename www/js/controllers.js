var app = angular.module('starter.controllers', []);

app.controller('PlayCtrl', function($scope, Api, Letters) {
  Api.gameDetails();
  Api.nextPhrase();

  $scope.showNormalOcto = true;
  $scope.showConcernedOcto = false;
  $scope.showWorriedOcto = false;
  $scope.showDeadOcto = false;

  $scope.$on('detailsSetup', function() {
    $scope.guesses = Api.guesses;
  });

  $scope.$on('phraseUpdated', function() {
    $scope.splitPhraseText = splitPhrase(Api.phrase.text);
    Letters.removeCrossedOutLetters();
  });

  $scope.$on('octoMoved', function() {
    var guessesRemaining = Api.guesses;
    hideAllOctos();

    if (guessesRemaining == 2) {
      $scope.showConcernedOcto = true;
    } else if (guessesRemaining == 1) {
      $scope.showWorriedOcto = true;
    } else if (guessesRemaining == 0) {
      $scope.showDeadOcto = true;
    } else {
      $scope.showNormalOcto = true;
    }
  });

  function hideAllOctos() {
    $scope.showNormalOcto = false;
    $scope.showConcernedOcto = false;
    $scope.showWorriedOcto = false;
    $scope.showDeadOcto = false;
  }

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
    var phraseAndHint = "Phrase: " + Api.phrase.text + "\nHint: " + Api.phrase.hint;

    makeGuess(letter);
    if (isComplete()) {
      swal({
        title: "Awkward high five!",
        text: "You saved the Octo :)\n\n" + phraseAndHint + ".\n\nYou gained " + Api.guesses + " love " + pluralizePoints(Api.guesses) + ".",
        type: "success",
        confirmButtonText: "Next!"
      });
      gameOver();
    } else if (Api.noMoreGuesses()) {
      setTimeout(
        function(){
          swal({
            title: "No goot!",
            text: "The ninjas ate the octo...\n\n" + phraseAndHint + ".\n\nYou lost 1 love point. Gawd.",
            type: "error",
            confirmButtonText: "Next..."
          });
          gameOver();
        },
        1500
      );
    }
  }

  $scope.clickedHelp = function() {
    $(".letters-section").toggle();
    $(".help-section").toggle();
  }

  function makeGuess(letter) {
    if (!alreadyClicked(letter)) {
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
  }

  function alreadyClicked(letter) {
    return include($scope.clickedLetters, letter);
  }

  function gameOver() {
    Api.finishedGame();
    $scope.clickedLetters = [];
    Phrase.coverEverythingUp();
    Api.nextPhrase();
    Api.resetGuesses();
    Animations.resetOcto();
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

  function pluralizePoints(points) {
    if (points == 1) {
      return "point";
    } else {
      return "points";
    }
  }
});

app.controller('HelpCtrl', function($scope, $ionicModal, Api, Animations) {
  $scope.showHint = false;

  $scope.$on('firstTimeInApp', function() {
    $scope.modal.show();
  });

  $scope.$on('detailsUpdated', function() {
    $scope.guessesRemaining = Api.guesses;
    $scope.lovePoints = Api.lovePoints;
  });

  $scope.$on('gamePosted', function() {
    $scope.lovePoints = Api.lovePoints;
  });

  $scope.$on('phraseUpdated', function() {
    $scope.hint = Api.phrase.hint;
  });

  $scope.clickedBack = function() {
    $(".letters-section").toggle();
    $(".help-section").toggle();
    $scope.showHint = false;
  }

  $scope.$watch('showHint', function(){
    $scope.showHintButtonText = $scope.showHint ? 'Hide hint' : 'Show hint';
    Animations.moveOctoToLastStep(Api);
    Api.reduceGuessAfterHintShown();
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
});

















