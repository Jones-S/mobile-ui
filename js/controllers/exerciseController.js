app.controller('exerciseController', ['$scope', '$route', '$location', function($scope, $route, $location) {
    $scope.exercises = [
        {
            number: "1",
            title: "Push Ups",
            type: "repetition",
        },
        {
            number: "2",
            title: "Pull Ups",
            type: "repetition",
        },
        {
            number: "3",
            title: "Bench Press",
            type: "weight",
        },
        {
            number: "4",
            title: "Side Hip Raises",
            type: "repetition",
        },
        {
            number: "5",
            title: "Plank",
            type: "time",
        },
    ];
    $scope.totalExercises = $scope.exercises.length;

    $scope.prev = function () {
        var prevEx = parseInt($route.current.params.id, 10) -1;
        $location.path('/exercise/' + prevEx);
    }

    $scope.next = function () {
        var nextEx = parseInt($route.current.params.id, 10) +1;
        $location.path('/exercise/' + nextEx);
    }

    $scope.currentExercise = function () {
        return $scope.exercises[$route.current.params.id -1];
    }

}]);