var app = angular.module('physioApp', ['ngTouch', 'ngRoute', 'hmTouchEvents', 'ngAnimate']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/start.html'
        })
        .when('/exercise/:id', {
            templateUrl: 'views/exercise.html'
        })
        .when('/wheel', {
            templateUrl: 'views/wheel.html'
        });
}]);
(function ($) { // iief = Immediately-Invoked Function Expression, mainly useful to limit scope
    $(function() { // Shorthand for $( document ).ready()



    });
}(jQuery));
app.controller('d3Controller', ['$scope', function($scope) {
    $scope.scrollY = -15;
    var currentScrollPos = 0;
    var options = 20;

    $scope.getOptions = function(){
        return new Array(options);
    }

    $scope.panInput = function (event) {
        // remove span panend class in case it was added before
        $('.span--panend').removeClass('span--panend');

        $scope.scrollY = event.deltaY + currentScrollPos;
        checkPos();
    }

    $scope.stopPan = function (event) {
        // save scroll Position to current
        currentScrollPos = $scope.scrollY;
        console.log("currentScrollPos: " + currentScrollPos);
        // check if end at top or bottom reached
        var elemHeight = $('.input__inactive').first().height();
        if(currentScrollPos > 140) {
            currentScrollPos = 3*elemHeight;
        } else if(currentScrollPos < -(options*elemHeight - 4*elemHeight)){
            currentScrollPos = -(options*elemHeight - 4*elemHeight);
        }
        console.log("options*elemHeight + 2*elemHeight: ", -options*elemHeight);

        var nearestPoint = roundTo(currentScrollPos, 40);
        var deltaToStop = nearestPoint - currentScrollPos;
        console.log("nearestPoint", nearestPoint, "point at stop", currentScrollPos, "delta", deltaToStop);


        // increase css transition duration to animate
        $('.input__scroll-container').addClass("scroll-container--anim");
        $scope.scrollY = nearestPoint;

        // check for transition ending
        $('.scroll-container--anim').on('transitionend webkitTransitionEnd oTransitionEnd mozTransitionEnd msTransitionEnd', function () {
                $('.input__scroll-container').removeClass("scroll-container--anim");
            }
        );

        checkPos(true, deltaToStop);

    }


    // ------------------- 3d.js -------------------

    $scope.d3Transform = function(){
        console.log("transform this shit");

        d3.selectAll(".input__number").transition()
            .duration(750)
            .style('color', 'red');
    }

    function checkPos(last, endPosition){
        // set last to default value false
        last = typeof last !== 'undefined' ? last : false;

        // center of wrap to determine, which span should transform
        // center + position of wrap from top
        var middle = $('.input__wrap').height() / 2 + $('.input__wrap')[0].getBoundingClientRect().top;
        var elemHeight = $('.input__inactive').first().height();
        var selectionRange = {
            min: middle - elemHeight/2,
            max: middle + elemHeight/2
        }
        var transitionRange = {
            min: selectionRange.min - elemHeight,
            max: selectionRange.max + elemHeight/2
        }


        d3.selectAll(".input__number").each( function(d) {
            var scaleValue, opacityValue;
            var position = $(this)[0].getBoundingClientRect().top

            if (last) {
                // modify position if pan stopped and set wanted end pos
                position = position + endPosition;
            }

            var range = position + $(this).height();
            $(this).attr('data-pos', position);

            if( selectionRange.min < position && position < middle){
                scaleValue = "scale(1) translateZ(0)";
                opacityValue = 1;
                logValue = "CASE: 0 – MIDDLE";
            } else if ( transitionRange.min <= position && position <= selectionRange.min ) {
                // return a mapped value
                var mappedScale = mapRange( position, transitionRange.min, selectionRange.min, 0.5, 1 );
                opacityValue = mapRange( position, transitionRange.min, selectionRange.min, 0.2, 1 );
                scaleValue = ("scale(" + mappedScale + ") translateZ(0)" );
                logValue = "CASE: 1 – TRANS LOW";
            } else if ( middle <= position && position <= transitionRange.max ) {
                // return a mapped value
                var mappedScale = mapRange( position, middle, transitionRange.max, 1, 0.5 );
                opacityValue = mapRange( position, middle, transitionRange.max, 1, 0.2 );
                scaleValue = ("scale(" + mappedScale + ") translateZ(0)" );
                logValue = "CASE: 2 – TRANS HIGH";
            } else {
                scaleValue = "scale(0.5) translateZ(0)";
                opacityValue = 0.2;
                logValue = "CASE: 3 – ELSE";
            }

            // if is last check after panMove -> set css transitions
            if(last==true){
                // add class which sets transitions in css
                d3.select(this).classed('span--panend', true);
            }

            d3.select(this).style('-webkit-transform', scaleValue);
            d3.select(this).style('opacity', opacityValue);

        });
    }

    //mapping function
    function mapRange(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }

    //round function
    function roundTo(num, round){
        return Math.round(num/round) * round;
    }




}]);
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
        $rootScope.$emit('overview:setTransitionSpeed', { speed: 0});
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
        $rootScope.$emit('overview:setTransitionSpeed', { speed: 0});
        // if over threshold -> move up totally
        if($scope.infoDeltaY < -100 ){
            $scope.infoTransition = 0.2; // in seconds
            // +50 for padding and margin
            $scope.infoDeltaY = - ($('.exercise__info').height() + 50);
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
            if ( event.deltaY > $(window).height() * 0.2 ) {
                // init overv scroll down fct in overview controller
                $rootScope.$emit('overview:show');
                // and scroll down info area
                $scope.infoTransition = 1; // in seconds
                $scope.infoDeltaY = $(window).height();

                // check for transition ending
                $('.exercise__info').on('transitionend webkitTransitionEnd oTransitionEnd mozTransitionEnd msTransitionEnd', function () {
                        console.log("overview at bottom");
                        $scope.$apply(function(){
                            $scope.infoDeltaY = 0;
                        });
                    }
                );
            } else {
                // and scroll down info area
                $scope.infoTransition = 1; // in seconds
                $scope.infoDeltaY = 0;
                $rootScope.$emit('overview:hide');
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
app.controller('mainController', ['$scope', '$rootScope', '$route', '$location', function($scope, $rootScope, $route, $location) {

    // $rootScope.$on('overview:show', function(event, data) {
    //     // handle showOverview()
    //     console.log("emit received");

    // })

    $scope.goToURL = function(targetURL, direction) {
        console.log("function goToURL");
        if(direction == 'fromLeft'){
            $('body').addClass('anim-from-left');
            $('body').removeClass('anim-from-right');
        } else {
            $('body').addClass('anim-from-right');
            $('body').removeClass('anim-from-left');
        }

        $location.path(targetURL);
    }



}]);
app.controller('overviewController', ['$scope', '$rootScope', '$route', '$location', 'dataService', function($scope, $rootScope, $route, $location, dataService) {

    $scope.panDeltaY = -$(window).height();
    $scope.transitionSpeed = 0; // define duration in seconds

    $scope.exercises = dataService.getExercises();

    // listen to events
    $rootScope.$on('overview:show', function(event, data) {
        // handle showOverview()
        $scope.overviewShow();
    })

    $rootScope.$on('overview:setTransitionSpeed', function(event, data) {
        // handle showOverview()
        // console.log("setTransitionSpeed: " + data.speed);
        $scope.transitionSpeed = data.speed;
    })

    // listen to events
    $rootScope.$on('overview:hide', function(event, data) {
        // handle showOverview()
        $scope.transitionSpeed = 1; // in sec
        $scope.panDeltaY = -$(window).height();
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
app.directive('paExercise', function() {
  return {
    scope: {
      info: '='
    },
    templateUrl: 'js/directives/pa-exercise.html'
  };
});
app.directive('paOverview', function() {
  return {
    scope: {
      info: '='
    },
    templateUrl: 'js/directives/pa-overview.html'
  };
});
app.directive('pickWheeld3', function() {
    // all d3 stuff

});
app.factory('dataService', function() {
    var exercises = [
        {
            id: 1,
            title: "Push Ups",
            type: "repetition",
            imgSrc: "pushups.svg"
        },
        {
            id: 2,
            title: "Pull Ups",
            type: "repetition",
            imgSrc: "frontlift.svg"
        },
        {
            id: 3,
            title: "Shoulder Frontlift",
            type: "weight",
            imgSrc: "frontlift.svg"
        },
        {
            id: 4,
            title: "Side Hip Raises",
            type: "repetition",
            imgSrc: "sidehipraises.svg"
        },
        {
            id: 5,
            title: "Plank",
            type: "time",
            imgSrc: "plank.svg"
        }
    ];

    var service = {
        getExercises: function() {
            return exercises;
        }
    };
    return service;
});

//# sourceMappingURL=maps/all.js.map