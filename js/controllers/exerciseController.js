app.controller('exerciseController', ['$scope', '$route', '$location', function($scope, $route, $location) {
    $scope.infoDeltaY = 0;
    $scope.infoDeltaY = 0;
    $scope.infoTransition = 0; // define duration in seconds
    $scope.exercises = [
        {
            id: 1,
            title: "Push Ups",
            type: "repetition",
        },
        {
            id: 2,
            title: "Pull Ups",
            type: "repetition",
        },
        {
            id: 3,
            title: "Bench Press",
            type: "weight",
        },
        {
            id: 4,
            title: "Side Hip Raises",
            type: "repetition",
        },
        {
            id: 5,
            title: "Plank",
            type: "time",
        },
    ];
    $scope.totalExercises = $scope.exercises.length;

    $scope.prev = function () {
        var prevEx = parseInt($route.current.params.id, 10) -1;
        // class to check if anim from left or right
        $('body').addClass('anim-from-left');
        $('body').removeClass('anim-from-right');
        $location.path('/exercise/' + prevEx);
    }

    $scope.next = function () {
        var nextEx = parseInt($route.current.params.id, 10) +1;
        // class to check if anim from left or right
        $('body').addClass('anim-from-right');
        $('body').removeClass('anim-from-left');
        $location.path('/exercise/' + nextEx);
    }

    $scope.currentExercise = function () {
        return $scope.exercises[$route.current.params.id -1];
    }

    $scope.panInfoUp = function (event) {
        // console.log(event.deltaY);
        // set transition to 0 to have instantaneous reaction
        $scope.infoTransition = 0; // in seconds
        if(event.deltaY < 0){
            $scope.infoDeltaY = event.deltaY;
        }
    }

    $scope.stopPanInfo = function (event) {
        // if over threshold -> move up totally
        if($scope.infoDeltaY < -180 ){
            $scope.infoDeltaY = -250;
            // exerciseDone();
        } else {
            // change transition speed
            $scope.infoTransition = 1; // in seconds
            $scope.infoDeltaY = 0;
        }

    }

}]);