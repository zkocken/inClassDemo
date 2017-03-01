// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var lab2 = angular.module('lab2', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

lab2.run(function($ionicPlatform, $rootScope, $ionicHistory) {
  $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
    $ionicHistory.clearCache();
  });
});

/* The block below you can ignore. It is used to demonstrate the utilization of native transitions in Ionic */

lab2.service('navigation', function($state) {
  //directly binding events to this context
  this.curl = function(view, data, direction) {
    $state.go(view, data);
    window.plugins.nativepagetransitions.curl({
        "direction": direction
      },
      function(msg) {
        console.log("success: " + msg)
      }, // called when the animation has finished
      function(msg) {
        alert("error: " + msg)
      } // called in case you pass in weird values
    );
  };
  this.flip = function(view, data, direction) {
    $state.go(view, data);
    window.plugins.nativepagetransitions.flip({
        "direction": direction
      },
      function(msg) {
        console.log("success: " + msg)
      }, // called when the animation has finished
      function(msg) {
        alert("error: " + msg)
      } // called in case you pass in weird values
    );
  };
  this.slide = function(view, data, direction) {
    $state.go(view, data);
    window.plugins.nativepagetransitions.slide({
        "direction": direction
      },
      function(msg) {
        console.log("success: " + msg)
      }, // called when the animation has finished
      function(msg) {
        alert("error: " + msg)
      } // called in case you pass in weird values
    );
  };
});

lab2.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

  if(window.plugins && window.plugins.nativepagetransitions)
    $ionicConfigProvider.views.transition('none');

  $stateProvider
    .state('startPage', {
      url: '/',
      templateUrl: '/index',
      controller: 'startPage'
    })
    .state('player1', {
      url: '/player1',
      templateUrl: '/player',
      params: {'player1_choice': -1, 'player2_choice': -1, 'player1_wins': 0, 'player2_wins': 0},
      controller: 'player1'
    })
    .state('player2', {
      url: '/player2',
      templateUrl: '/player',
      params: {'player1_choice': -1, 'player2_choice': -1, 'player1_wins': 0, 'player2_wins': 0},
      controller: 'player2'
    })
    .state('results', {
      url: '/results',
      templateUrl: '/results',
      params: {'winner': 0},
      controller: 'results'
    });
  $urlRouterProvider.otherwise("/");
});

lab2.factory('processMove', function() {
  return function() {
    self.checkWins =  function(player1_choice, player2_choice) {
      var a = player1_choice;
      var b = player2_choice;

      /* TODO: check wins by using logic from function below to determine which player won the current round */
      /* Google is your friend in this situation ;) */

      /* return 0 if tie */
      /* return 1 if player 1 won the current round */
      /* return 2 if player 2 won the current round */
      if(player1_choice == 0) {
        if(player2_choice == 0) {
          return 0;
        } else if(player2_choice == 1) {
          return 2;
        } else {
          return 1;
        }
      } else if(player1_choice == 1) {
        if(player2_choice == 0) {
          return 1;
        } else if(player2_choice == 1) {
          return 0;
        } else {
          return 2;
        }
      } else {
        if(player2_choice == 0) {
          return 2;
        } else if(player2_choice == 1) {
          return 1;
        } else {
          return 0;
        }
      }
    };
    self.getChoiceAsNumber = function(player_choice) {
      if (angular.equals(player_choice, 'rock')) return 0;
      if (angular.equals(player_choice, 'paper')) return 1;
      if (angular.equals(player_choice, 'scissors')) return 2;
    };
  return self;
  };
});

/* The startPage controller has been completed for you */
// The first usage of $rootScope is illustrated in the startPage controller

// As seen below, it is injected into the controller and then once the function onStart()
// is called the names of the players set on the start page are put onto the rootScope
lab2.controller('startPage', function($rootScope, $scope, $ionicViewSwitcher, $state, navigation) {
  $scope.title = "Rock Paper Scissors";
  $scope.subheader = "Enter player names and press Start to Begin!";

  $scope.onStart = function () {

    if ($scope.player1_name == "") $scope.player1_name = "Player 1";
    if ($scope.player2_name == "") $scope.player2_name = "Player 2";

    $rootScope.player1_name = $scope.player1_name; // Put player 1 name on $rootScope (available to all controllers)
    $rootScope.player2_name = $scope.player2_name; // Put player 1 name on $rootScope (available to all controllers)

    if(window.plugins && window.plugins.nativepagetransitions) {
      navigation.flip('player1', null, 'right');
    }
    else {
      $ionicViewSwitcher.nextDirection('forward');
      $rootScope.wasInStartState = true; // Set variable on rootScope to true so next state is aware previous state was start state
      // Ignore this block for now; this is for native transitions (More on Wednesday 2/22/17) //
      $state.go('player1', {
        'player1_choice': 0,
        'player2_choice': 0,
        'player1_wins': 0,
        'player2_wins': 0
      });
    }
  };
});

lab2.controller('player1', function(processMove, $rootScope, $scope, $ionicModal, $ionicLoading, $ionicViewSwitcher, $state ,$stateParams, navigation) {
  /* TODO: Create processMove factory instance and place on local scope */
  var move = new processMove();

  $ionicLoading.show({ template: $rootScope.player1_name+"'s Turn", noBackdrop: false, duration: 1250 }); // Display modal with current players turn

  $scope.title = "Rock Paper Scissors"; // Set title for nav bar in HTML using binding

  /* TODO: Grab name of player 1 from $rootScope and set to current player variable on local scope */
  $scope.currentPlayer = $rootScope.player1_name;

  /* TODO: Grab wins of player 1 from $stateParams and put on local scope */
  $scope.player1_wins = $stateParams.player1_wins;
  /* TODO: Grab wins of player 2 from $stateParams and put on local scope */
  $scope.player2_wins = $stateParams.player2_wins;

  $scope.onNext = function (choice) {

    if ($rootScope.wasInStartState != true && $stateParams.player1_wins >= 2) // Check if previous state was start state using variable on $rootScope
      // Additionally check if player 1 has best 2/3
    {
      if(window.plugins && window.plugins.nativepagetransitions) {
        // Ignore this block for now; this is for native transitions (More on Wednesday 2/22/17) //
      }
      else {
        $ionicViewSwitcher.nextDirection('forward');
        /* TODO: Transition to results state and pass winner since player1 has best 2/3 */
        $state.go('results', {
          'winner': 1
        });
      }
    }
    else if ($rootScope.wasInStartState != true && $stateParams.player2_wins >= 2) // Check if previous state was start state using variable on $rootScope
    // Additionally check if player 2 has best 2/3
    {
      if(window.plugins && window.plugins.nativepagetransitions) {
        // Ignore this block for now; this is for native transitions (More on Wednesday 2/22/17) //
      }
      else {
        $ionicViewSwitcher.nextDirection('forward');
        /* TODO: Transition to results state and pass winner since player2 has best 2/3 */
        $state.go('results', {
          'winner': 2
        })
      }
    }
    else {
      // This is to ensure $stateParams has been cleared from previous turns
      // This has been completed already, no modifications are needed
      if ($rootScope.wasInStartState == true) {
        $stateParams.player1_choice = 0;
        $stateParams.player2_choice = 0;
        $stateParams.player1_wins = 0;
        $stateParams.player2_wins = 0;
        $rootScope.wasInStartState = false;
      }

      if(window.plugins && window.plugins.nativepagetransitions) {
        // Ignore this block for now; this is for native transitions (More on Wednesday 2/22/17) //
      }
      else {
        $ionicViewSwitcher.nextDirection('forward');
        /* TODO: Transition to player2 state since neither player has 2/3 */
        $state.go('player2', {
          'player1_choice': move.getChoiceAsNumber(choice),
          'player2_choice': $stateParams.player2_choice,
          'player1_wins': $stateParams.player1_wins,
          'player2_wins': $stateParams.player2_wins
        })
      }
    }
  };
});

lab2.controller('player2', function(processMove, $rootScope, $scope, $ionicModal, $ionicLoading, $ionicViewSwitcher, $state, $stateParams, navigation) {
  /* TODO: Create processMove factory instance and place on local scope */
  var move = new processMove();

  $ionicLoading.show({ template: $rootScope.player2_name+"'s Turn", noBackdrop: false, duration: 1250 });
  $scope.title = "Rock Paper Scissors";

  if (!$rootScope.player1_name) $state.go('startPage'); // This sends app back to starting controller if reset occurs
  // The rootScope will be cleared upon a reset

  /* TODO: Grab name of player 2 from $rootScope and set to current player */
  $scope.currentPlayer = $rootScope.player2_name;

  /* TODO: Grab wins of player 1 from $stateParams and put on local scope */
  $scope.player1_wins = $stateParams.player1_wins;
  /* TODO: Grab wins of player 2 from $stateParams and put on local scope */
  $scope.player2_wins = $stateParams.player2_wins;

  $scope.onNext = function (choice) {

    /* TODO: Use processMove factory instance to check if player1 has a win */ //DIRECTLY UPDATE STATEPARAMS
    /* TODO: Use processMove factory instance to check if player2 has a win */ //DIRECTLY UPDATE STATEPARAMS
    $stateParams.player2_choice = move.getChoiceAsNumber(choice);
    var winner = move.checkWins($stateParams.player1_choice, $stateParams.player2_choice);
    if(winner == 1) $stateParams.player1_wins++;
    else if (winner == 2) $stateParams.player2_wins++;

    if ($stateParams.player1_wins >= 2) // Check if player1 has best 2/3
    {
      if(window.plugins && window.plugins.nativepagetransitions) {
        // Ignore this block for now; this is for native transitions (More on Wednesday 2/22/17) //
      }
      else {
        $ionicViewSwitcher.nextDirection('forward');
        /* TODO: Transition to results state and pass winner since player1 has best 2/3 */
        $state.go('results', {
          'winner': 1
        })
      }
    }
    else if ($stateParams.player2_wins >= 2) // Check if player2 has best 2/3
    {
      if(window.plugins && window.plugins.nativepagetransitions) {
        // Ignore this block for now; this is for native transitions (More on Wednesday 2/22/17) //
      }
      else {
        $ionicViewSwitcher.nextDirection('forward');
        /* TODO: Transition to results state and pass winner since player2 has best 2/3 */
        $state.go('results', {
          'winner': 2
        })
      }
    } else {
      if(window.plugins && window.plugins.nativepagetransitions) {
        // Ignore this block for now; this is for native transitions (More on Wednesday 2/22/17) //
      }
      else {
        $ionicViewSwitcher.nextDirection('forward');
        /* TODO: Transition to player1 state since neither player has 2/3 */
        $state.go('player1', {
          'player1_choice': 0,
          'player2_choice': 0,
          'player1_wins': $stateParams.player1_wins,
          'player2_wins': $stateParams.player2_wins
        })
      }
    }
  };
});

// The results controller below has been completed for you. No modifications are needed
lab2.controller('results', function($rootScope, $scope, $ionicModal, $ionicLoading, $ionicViewSwitcher, $state, $stateParams, navigation) {
  $scope.title = "Rock Paper Scissors";
  $scope.subheader = "Press Start for another game!";

  if (!$stateParams.winner) $state.go('startPage');

  if ($stateParams.winner == 1)
  {
    $scope.winner = $rootScope.player1_name;
  }
  if ($stateParams.winner == 2)
  {
    $scope.winner = $rootScope.player2_name;
  }

  $scope.onStart = function () {

    /* The if statement here checks if native transitions are available and uses them if so */
    if(window.plugins && window.plugins.nativepagetransitions)
      navigation.slide('startPage', 'left');
    else {
      /* Otherwise, $ionicViewSwitcher transitions are used */
      $ionicViewSwitcher.nextDirection('back');
      $state.go('startPage');
    }
  };
});
