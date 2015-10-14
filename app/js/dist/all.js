var app = angular.module('physioApp', ['ngTouch', 'ngRoute', 'hmTouchEvents', 'ngAnimate', 'timer']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/start.html'
        })
        .when('/exercise/:id', {
            templateUrl: 'views/exercise.html'
        })
        .when('/timer', {
            templateUrl: 'views/timer.html'
        })
        .when('/wheel', {
            templateUrl: 'views/wheel.html'
        });
}]);
(function ($) { // iief = Immediately-Invoked Function Expression, mainly useful to limit scope
    $(function() { // Shorthand for $( document ).ready()



    });
}(jQuery));
app.controller('d3Controller', ['$scope', '$rootScope', '$route', 'dataService', function($scope, $rootScope, $route, dataService) {

    var elemHeight = 40; // set manually because elem does not exist yet
    var currentScrollPos;
    $scope.exercises = dataService.getExercises();
    var currEx = parseInt($route.current.params.id, 10) - 1;
    console.log("currEx: " + currEx);

    // check if exercise
    if ($scope.exercises[currEx].type == 'repetition' || $scope.exercises[currEx].type == 'weight') {
        // get exercise data via service
        $scope.predefinedRep = $scope.exercises[currEx].predefined.rep;
        console.log("$scope.predefinedRep: " + $scope.predefinedRep);

        //startvalue calc from predefined
        $scope.scrollY = - ($scope.predefinedRep - 2) * elemHeight; // height of span
        console.log("$scope.scrollY: " + $scope.scrollY);
        currentScrollPos = $scope.scrollY;
    }

    else if ($scope.exercises[currEx].type == 'time') {
        $scope.predefinedMin = $scope.exercises[currEx].predefined.min;
        $scope.predefinedSec = $scope.exercises[currEx].predefined.sec;

        $scope.minutesScrollY = - ($scope.predefinedMin -1) * elemHeight;
        $scope.secScrollY = - ($scope.predefinedSec -1) * elemHeight;
        currentScrollPos = $scope.minutesScrollY;
        var currentScrollPos2 = $scope.secScrollY;
    }





    var amount;

    $scope.returnExerciseType = function (_type) {
        if (_type == 'time'){
            return 'includes/input-timer.html';
        } else if (_type == 'repetition'){
            return 'includes/input-repetition.html';
        } else if (_type == 'weight'){
            return 'includes/input-repetition.html';
        }
    }

    $scope.currentExercise = function () {
        return $scope.exercises[$route.current.params.id -1];
    }

    $scope.getOptions = function(_amount){
        amount = _amount;
        return new Array(_amount);
    }

    $scope.getMinSec = function(){
        amount = 60;
        return new Array(amount);
    }

    $scope.getIndices = function (_index) {
        if (_index+1 <= 10){
            var _indexstring = '0' + _index;
            return _indexstring;
        } else {
            return _index;
        }
    }

    $scope.determineActive = function (_index) {
        if (_index == parseInt($scope.predefinedRep, 10)){
            // return active element
            return "input__active";
        } else if (_index == parseInt($scope.predefinedRep, 10) +1 || _index == parseInt($scope.predefinedRep, 10) -1) {
            // if one more or one less return half active
            return "input__active--half";
        }
    }

    $scope.predefinedTime = function (_index, unit) {
        if (unit == 'min'){
            if (_index == parseInt($scope.predefinedMin, 10)){
                // return active element
                return "input__active";
            } else if (_index == parseInt($scope.predefinedMin, 10) +1 || _index == parseInt($scope.predefinedMin, 10) -1) {
                // if one more or one less return half active
                return "input__active--half";
            }
        } else if (unit == 'sec') {
            if (_index == parseInt($scope.predefinedSec, 10)){
                // return active element
                return "input__active";
            } else if (_index == parseInt($scope.predefinedSec, 10) +1 || _index == parseInt($scope.predefinedSec, 10) -1) {
                // if one more or one less return half active
                return "input__active--half";
            }
        }

    }

    $scope.panInput = function (event) {
        // remove span panend class in case it was added before
        $('.span--panend').removeClass('span--panend');

        $scope.scrollY = event.deltaY + currentScrollPos;
        checkPos('input__number');
    }

    $scope.panMin = function (event) {
        // remove span panend class in case it was added before
        $('.span--panend').removeClass('span--panend');

        $scope.minutesScrollY = event.deltaY + currentScrollPos;
        console.log("$scope.minutesScrollY: " + $scope.minutesScrollY);
        checkPos('number--minute');
    }

    $scope.panSec = function (event) {
        // remove span panend class in case it was added before
        $('.span--panend').removeClass('span--panend');

        $scope.secScrollY = event.deltaY + currentScrollPos2;
        checkPos('number--second');
    }

    $scope.stopPan = function (event) {
        // save scroll Position to current
        currentScrollPos = $scope.scrollY;
        console.log("currentScrollPos: " + currentScrollPos);
        // check if end at top or bottom reached
        elemHeight = $('.input__inactive').height();
        console.log("elemHeight: " + elemHeight);

        var _spans = $('.input__number');


        // clean up first
        removeClasses(_spans);
        removeInlineStyles(_spans);


        // if less than first element
        if(currentScrollPos > (elemHeight)) {
            console.log("FIRST");
            currentScrollPos = elemHeight; // center 1x
            _spans.first().addClass("input__active");
            _spans.eq(1).addClass('input__active--half');

        }
        // if more than last element
        else if(currentScrollPos < -(amount*elemHeight - 2*elemHeight)){
            console.log("unten drüber gescrollt");
            currentScrollPos = -(amount*elemHeight - 2*elemHeight);
            // remove classes and set last element to active
            var lastSpan = _spans.last();
            _spans.eq(amount-2).addClass('input__active--half');
            lastSpan.addClass('input__active');
        }


        var nearestPoint = roundTo(currentScrollPos, 40);
        var deltaToStop = nearestPoint - currentScrollPos;


        // increase css transition duration to animate
        $('.input__scroll-container').addClass("scroll-container--anim");
        $scope.scrollY = nearestPoint;
        var _activeElem = -(nearestPoint/elemHeight -2); // e.g. -160/40 = 4 -2 => -6 (6th elem)
        //set active class to active Element
        _spans.eq(_activeElem-1).addClass('input__active');
        // and set half active classes for accompanying elements
        _spans.eq(_activeElem).addClass('input__active--half');
        _spans.eq(_activeElem-2).addClass('input__active--half');



        // check for transition ending
        $('.scroll-container--anim').on('transitionend webkitTransitionEnd oTransitionEnd mozTransitionEnd msTransitionEnd', function () {
                $('.input__scroll-container').removeClass("scroll-container--anim");
            }
        );
    }

    $scope.stopMin = function (event) {
        // save scroll Position to current
        currentScrollPos = $scope.minutesScrollY;

        // check if end at top or bottom reached
        elemHeight = $('.input__inactive').height();

        var _spans = $('.number--minute');

        // clean up first
        removeClasses(_spans);
        removeInlineStyles(_spans);

        // if less than first element
        if(currentScrollPos > (elemHeight)) {
            currentScrollPos = elemHeight; // center 1x
            _spans.first().addClass("input__active");
            _spans.eq(1).addClass('input__active--half');

        }
        // if more than last element
        else if(currentScrollPos < -(amount*elemHeight - 2*elemHeight)){
            currentScrollPos = -(amount*elemHeight - 2*elemHeight);
            // remove classes and set last element to active
            var lastSpan = _spans.last();
            _spans.eq(amount-2).addClass('input__active--half');
            lastSpan.addClass('input__active');
        }

        var nearestPoint = roundTo(currentScrollPos, 40);
        var deltaToStop = nearestPoint - currentScrollPos;


        // increase css transition duration to animate
        $('.croll-container--min').addClass("scroll-container--anim");
        $scope.minutesScrollY = nearestPoint;
        var _activeElem = -(nearestPoint/elemHeight -2); // e.g. -160/40 = 4 -2 => -6 (6th elem)
        //set active class to active Element
        _spans.eq(_activeElem-1).addClass('input__active');
        // and set half active classes for accompanying elements
        _spans.eq(_activeElem).addClass('input__active--half');
        _spans.eq(_activeElem-2).addClass('input__active--half');

        // check for transition ending
        $('.scroll-container--anim').on('transitionend webkitTransitionEnd oTransitionEnd mozTransitionEnd msTransitionEnd', function () {
                $('.scroll-container--min').removeClass("scroll-container--anim");
            }
        );

    }

    $scope.stopSec = function (event) {
        // save scroll Position to current
        currentScrollPos2 = $scope.secScrollY;
        console.log("currentScrollPos2: " + currentScrollPos2);

        // check if end at top or bottom reached
        elemHeight = $('.input__inactive').first().height();

        var _spans = $('.number--second');

        // clean up first
        removeClasses(_spans);
        removeInlineStyles(_spans);

        // if less than first element
        if(currentScrollPos2 > (elemHeight)) {
            currentScrollPos2 = elemHeight; // center 1x
            _spans.first().addClass("input__active");
            _spans.eq(1).addClass('input__active--half');

        }
        // if more than last element
        else if(currentScrollPos2 < -(amount*elemHeight - 2*elemHeight)){
            currentScrollPos2 = -(amount*elemHeight - 2*elemHeight);
            console.log("drunter");
            // remove classes and set last element to active
            var lastSpan = _spans.last();
            _spans.eq(amount-2).addClass('input__active--half');
            lastSpan.addClass('input__active');
        }

        var nearestPoint = roundTo(currentScrollPos2, 40);
        var deltaToStop = nearestPoint - currentScrollPos2;


        // increase css transition duration to animate
        $('.scroll-container--sec').addClass("scroll-container--anim");
        $scope.secScrollY = nearestPoint;
        var _activeElem = -(nearestPoint/elemHeight -2); // e.g. -160/40 = 4 -2 => -6 (6th elem)
        //set active class to active Element
        _spans.eq(_activeElem-1).addClass('input__active');
        // and set half active classes for accompanying elements
        _spans.eq(_activeElem).addClass('input__active--half');
        _spans.eq(_activeElem-2).addClass('input__active--half');

        // check for transition ending
        $('.scroll-container--anim').on('transitionend webkitTransitionEnd oTransitionEnd mozTransitionEnd msTransitionEnd', function () {
                $('.scroll-container--sec').removeClass("scroll-container--anim");
            }
        );

    }












    // ------------------- 3d.js -------------------

    $scope.d3Transform = function(){
        d3.selectAll(".input__number").transition()
            .duration(750)
            .style('color', 'red');
    }


    function checkPos(_target){
        _target = "." + _target;


        // center of wrap to determine, which span should transform
        // center + position of wrap from top
        var middle = $('.input__wrap').height() / 2 + $('.input__wrap')[0].getBoundingClientRect().top;
        elemHeight = $('.input__inactive').first().height();
        var selectionRange = {
            min: middle - elemHeight/2,
            max: middle + elemHeight/2
        }
        var transitionRange = {
            min: selectionRange.min - elemHeight,
            max: selectionRange.max + elemHeight/2
        }

        // choose all scrolled spans and check position
        d3.selectAll(_target).each( function(d) {
            var scaleValue, opacityValue;
            var position = $(this)[0].getBoundingClientRect().top



            var range = position + $(this).height();
            $(this).attr('data-pos', position);

            if( selectionRange.min < position && position < middle){
                scaleValue = "scale(1) translateZ(0)";
                opacityValue = 1;
                logValue = "CASE: 0 – MIDDLE";
                // set active class
                d3.select(this).classed('input__active', true);
            }

            else if ( transitionRange.min <= position && position <= selectionRange.min ) {
                // remove classes
                d3.select(this).classed('input__active', false);
                // return a mapped value
                var mappedScale = mapRange( position, transitionRange.min, selectionRange.min, 0.5, 1 );
                opacityValue = mapRange( position, transitionRange.min, selectionRange.min, 0.2, 1 );
                scaleValue = ("scale(" + mappedScale + ") translateZ(0)" );
                logValue = "CASE: 1 – TRANS LOW";
            }

            else if ( middle <= position && position <= transitionRange.max ) {

                // remove classes
                d3.select(this).classed('input__active', false);
                // return a mapped value
                var mappedScale = mapRange( position, middle, transitionRange.max, 1, 0.5 );
                opacityValue = mapRange( position, middle, transitionRange.max, 1, 0.2 );
                scaleValue = ("scale(" + mappedScale + ") translateZ(0)" );
                logValue = "CASE: 2 – TRANS HIGH";
            }

            else {
                scaleValue = "scale(0.5) translateZ(0)";
                opacityValue = 0.2;
                logValue = "CASE: 3 – ELSE";
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

    //remove classes
    function removeClasses(_elem) {
        _elem.removeClass('input__active input__active--half');
    }

    //remove inline style to make css effective again
    function removeInlineStyles(_elem) {
        _elem.css({
            opacity : "",
            transform: ""
        });
    }

    // $scope.timerRunning = true;
    $scope.startTimer = function (){
        // set timer to time from scroll selector
        var _selectedMin = parseInt($('.number--minute.input__active').html(), 10);
        var _selectedSec = parseInt($('.number--second.input__active').html(), 10);
        console.log("_selectedMin: " + _selectedMin);
        console.log("_selectedSec: " + _selectedSec);
        var _selectedTime = _selectedMin * 60 + _selectedSec;
        $scope.$broadcast('timer-set-countdown-seconds', _selectedTime);

        // remove scroll selector
        $('.input__wrap').hide();
        // show timer
        $('.input__timer').show();


        $scope.$broadcast('timer-start');
        $scope.timerRunning = true;
    };


    $scope.$on('timer-set-countdown-seconds', function (e, seconds) {
        console.log(seconds);
    });

    // liste to end of timer
    $scope.$on('timer-stopped', function (event, args) {
        console.log('timer-stopped args = ', args);
        // mark exercise as done:
        // emit signal to exerciseController to pan info up
        $rootScope.$emit('info:panInfoUp', { speed: 1});
    });




}]);
app.controller('exerciseController', ['$scope', '$rootScope', '$route', '$location', 'dataService', function($scope, $rootScope, $route, $location, dataService) {

    $scope.infoDeltaY = 0;
    $scope.exercises = dataService.getExercises();
    $scope.totalExercises = $scope.exercises.length;


    // liste to emit from d3Controller
    $rootScope.$on('info:panInfoUp', function(event, data) {
        console.log("info pan up received");
        // set transition speed from emit message
        $scope.infoTransition = data.speed;
        console.log("data.speed: " + data.speed);
        // set y pos of info div to top + 50
        $scope.$apply(function(){
            $scope.infoDeltaY = - ($('.exercise__info').height() + 50);
        });

        // check for transition ending
        $('.exercise__info').on('transitionend webkitTransitionEnd oTransitionEnd mozTransitionEnd msTransitionEnd', function () {
                // after transition has finished go to next exercise
                $scope.$apply(function(){
                    $scope.next();
                });
            }
        );
    })



    $scope.prev = function () {
        console.log("prev");
        var prevEx = parseInt($route.current.params.id, 10) -1;
        if(prevEx > 0){
            // hide overview
            $('.overview').hide();
            // class to check if anim from left or right
            $('body').addClass('anim-from-left');
            $('body').removeClass('anim-from-right');
            $location.path('/exercise/' + prevEx);
        }
    }

    $scope.next = function () {
        var nextEx = parseInt($route.current.params.id, 10) +1;
        if(nextEx <= $scope.totalExercises){
            // hide overview
            $('.overview').hide();
            // class to check if anim from left or right
            $('body').addClass('anim-from-right');
            $('body').removeClass('anim-from-left');
            $location.path('/exercise/' + nextEx);
        }
    }

    $scope.currentExercise = function () {
        return $scope.exercises[$route.current.params.id -1];
    }

    $scope.panInfoUp = function (event) {
        // console.log(event.deltaY);
        // set transition to 0 to have instantaneous reaction
        $scope.infoTransition = 0; // in seconds
        $rootScope.$emit('overview:setTransitionSpeed', { speed: 0});
        if(event.deltaY < -40){
            console.log("event.deltaY: " + event.deltaY);
            $scope.infoDeltaY = event.deltaY;
        } else if(event.deltaY > 50){
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

    // undo overview display none
    $scope.overviewDisplayState = "inline";

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
            predefined: { rep: '10' },
            imgSrc: "pushups.svg"
        },
        {
            id: 2,
            title: "Pull Ups",
            type: "repetition",
            predefined: { rep: '22' },
            imgSrc: "frontlift.svg"
        },
        {
            id: 3,
            title: "Shoulder Frontlift",
            type: "weight",
            predefined: { rep: '3' },
            imgSrc: "frontlift.svg"
        },
        {
            id: 4,
            title: "Plank",
            type: "time",
            predefined: { min: '0', sec: '2' },
            imgSrc: "plank.svg"

        },
        {
            id: 5,
            title: "Side Hip Raises",
            type: "repetition",
            predefined: { rep: '4' },
            imgSrc: "sidehipraises.svg"
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