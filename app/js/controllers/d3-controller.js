app.controller('d3Controller', ['$scope', '$route', 'dataService', function($scope, $route, dataService) {

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
                console.log("_index: " + _index);
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
        checkPos();
    }

    $scope.panMin = function (event) {
        // remove span panend class in case it was added before
        $('.span--panend').removeClass('span--panend');

        $scope.minutesScrollY = event.deltaY + currentScrollPos;
        console.log("$scope.minutesScrollY: " + $scope.minutesScrollY);
        checkPos();
    }

    $scope.panSec = function (event) {
        // remove span panend class in case it was added before
        $('.span--panend').removeClass('span--panend');

        $scope.secScrollY = event.deltaY + currentScrollPos2;
        checkPos();
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


    function checkPos(last, endPosition){
        // set last to default value false
        last = typeof last !== 'undefined' ? last : false;

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
    // $scope.startTimer = function (){
    //     $scope.$broadcast('timer-start');
    //     $scope.timerRunning = true;
    // };
    // $scope.stopTimer = function (){
    //     $scope.$broadcast('timer-stop');
    //     $scope.timerRunning = false;
    // };

    // angular timer

    // liste to end of timer
    $scope.$on('timer-stopped', function (event, args) {
        console.log('timer-stopped args = ', args);
    });




}]);