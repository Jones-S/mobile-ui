app.controller('overviewController', ['$scope', '$rootScope', '$route', '$location', 'dataService', function($scope, $rootScope, $route, $location, dataService) {

    $scope.panDeltaY = -$(window).height();
    $scope.transitionSpeed = 0; // define duration in seconds

    $scope.exercises = dataService.getExercises();

    // listen to events
    $rootScope.$on('overview:show', function(event, data) {
        // handle showOverview()
        $scope.overviewShow();
    })

    $rootScope.$on('overview:panDown', function(event, data) {
        // handle showOverview()
        $scope.panDeltaY = -$(window).height() + data.y;
    })

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

    $scope.goToURL = function(targetURL, direction) {
        if(direction == 'fromLeft'){
            $('body').addClass('anim-from-left');
            $('body').removeClass('anim-from-right');
        } else {
            $('body').addClass('anim-from-right');
            $('body').removeClass('anim-from-left');
        }

        $location.path(targetURL);
    }

    $scope.panOverviewUp = function (event) {
        if(event.deltaY < 0){
            $scope.transitionSpeed = 0; // in sec
            $scope.panDeltaY = event.deltaY;
            console.log("$scope.panDeltaY: " + $scope.panDeltaY);
        }
    }

    $scope.stopPanOverview = function (event) {
                // if threshold is more than:
        if (event.deltaY < (-$(window).height() * 0.15)) {
            $scope.transitionSpeed = 1; // in sec
            $scope.panDeltaY = - $(window).height();
        } else {
            $scope.transitionSpeed = 1; // in sec
            $scope.panDeltaY = 0; //
        }

    }

    $scope.swipeUp = function () {
        console.log("swipe up");
        $scope.transitionSpeed = 1;
        $scope.panDeltaY = - $(window).height();
    }

    $scope.overviewShow = function () {
        // show overview from top to bottom
        $scope.transitionSpeed = 1;
        $scope.panDeltaY = 0;
    }

}]);