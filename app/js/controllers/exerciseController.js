app.controller('exerciseController', ['$scope', '$rootScope', '$route', '$location', 'dataService', function($scope, $rootScope, $route, $location, dataService) {
    console.log(dataService);
    $scope.infoDeltaY = 0;
    $scope.exercises = dataService.getExercises();
    console.log("$scope.exercises: " + $scope.exercises);
    $scope.totalExercises = $scope.exercises.length;



    $scope.prev = function () {
        console.log("prev");
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
        } else if(event.deltaY > 0){
            // send hint to pan down
            $rootScope.$emit('overview:panDown', { y: event.deltaY });
            // and pan down info with color
            $scope.infoDeltaY = event.deltaY;
        }
    }



    $scope.overviewShowEmit = function() {
        $rootScope.$emit('overview:show');
    }

    $scope.stopPanInfo = function (event) {
        // if over threshold -> move up totally
        if($scope.infoDeltaY < -160 ){
            $scope.infoTransition = 1; // in seconds
            $scope.infoDeltaY = -230;
            // = exercise done
            // and change view
            var nextEx = parseInt($route.current.params.id, 10) +1;
            $('body').addClass('anim-from-right');
            $('body').removeClass('anim-from-left');

            // check for transition ending
            $('.exercise__info').on('transitionend webkitTransitionEnd oTransitionEnd mozTransitionEnd msTransitionEnd', function () {
                    console.log("transition ended");
                    // after transition has finished go to next exercise
                    $scope.$apply(function(){
                        $location.path('/exercise/' + nextEx);
                    });
                }
            );

        } else if( event.deltaY > 0) {
            console.log("pan down", event.deltaY);
            if ( event.deltaY > $(window).height() * 0.4 ) {
                // init overv scroll down fct in overview controller
                $rootScope.$emit('overview:show');
                // and scroll down info area
                $scope.infoTransition = 1; // in seconds
                $scope.infoDeltaY = 460;
            }

        } else {
            // change transition speed
            $scope.infoTransition = 1; // in seconds
            $scope.infoDeltaY = 0;
        }

    }

    $scope.setBgColor = function (type) {
        switch (type) {
            case "repetition":
            return 'clr-blue'; // return class name
            break;

            case "weight":
            return 'clr-red'; // return class name
            break;

            case "time":
            return 'clr-orange'; // return class name
            break;

            default:
            return 'clr-orange'; // return class name
        }
    }

}]);