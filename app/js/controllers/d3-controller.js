app.controller('d3Controller', ['$scope', '$route', 'dataService', function($scope, $route, dataService) {


    // get exercise data via service
    $scope.exercises = dataService.getExercises();
    var currEx = parseInt($route.current.params.id, 10);
    var elemHeight = 40; // set manually because elem does not exist yet
    $scope.predefinedRep = $scope.exercises[currEx].predefined.rep;
    console.log("$scope.predefinedRep: " + $scope.predefinedRep);



    //startvalue calc from predefined
    $scope.scrollY = - ($scope.predefinedRep - 2) * elemHeight; // height of span
    console.log("$scope.scrollY: " + $scope.scrollY);

    $scope.minutesScrollY = -15;
    $scope.secScrollY = -15;
    var currentScrollPos = $scope.scrollY;
    var currentScrollPos2 = 0;
    var amount;


    $scope.getOptions = function(_amount){
        return new Array(_amount);
        amount = _amount;
    }

    $scope.getMinSec = function(){
        return new Array(60);
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

    $scope.panInput = function (event) {
        // remove span panend class in case it was added before
        $('.span--panend').removeClass('span--panend');

        $scope.scrollY = event.deltaY + currentScrollPos;
        checkPos();
    }

    // $scope.panTime = function (event, time) {
    //     // remove span panend class in case it was added before
    //     $('.span--panend').removeClass('span--panend');

    //     $scope.minutesScrollY = event.deltaY + currentScrollPos;
    //     checkPos();
    // }

    $scope.panMin = function (event) {
        // remove span panend class in case it was added before
        $('.span--panend').removeClass('span--panend');

        $scope.minutesScrollY = event.deltaY + currentScrollPos;
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
        elemHeight = $('.input__inactive').first().height();
        if(currentScrollPos > 140) {
            currentScrollPos = 3*elemHeight;
        } else if(currentScrollPos < -(amount*elemHeight - 4*elemHeight)){
            currentScrollPos = -(amount*elemHeight - 4*elemHeight);
        }
        console.log("amount*elemHeight + 2*elemHeight: ", -amount*elemHeight);

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

    $scope.stopMin = function (event) {
        // save scroll Position to current
        currentScrollPos = $scope.minutesScrollY;

        // check if end at top or bottom reached
        elemHeight = $('.input__inactive').height();

        if(currentScrollPos > 140) {
            currentScrollPos = 3*elemHeight;
        } else if(currentScrollPos < -(amount*elemHeight - 4*elemHeight)){
            currentScrollPos = -(amount*elemHeight - 4*elemHeight);
        }

        var nearestPoint = roundTo(currentScrollPos, 40);
        var deltaToStop = nearestPoint - currentScrollPos;


        // increase css transition duration to animate
        $('.scroll-container--min').addClass("scroll-container--anim");
        $scope.minutesScrollY = nearestPoint;

        // check for transition ending
        $('.scroll-container--anim').on('transitionend webkitTransitionEnd oTransitionEnd mozTransitionEnd msTransitionEnd', function () {
                $('.scroll-container--min').removeClass("scroll-container--anim");
            }
        );

        checkPos(true, deltaToStop);

    }

    $scope.stopSec = function (event) {
        // save scroll Position to current
        currentScrollPos2 = $scope.secScrollY;

        // check if end at top or bottom reached
        elemHeight = $('.input__inactive').first().height();
        if(currentScrollPos2 > 140) {
            currentScrollPos2 = 3*elemHeight;
        } else if(currentScrollPos2 < -(amount*elemHeight - 4*elemHeight)){
            currentScrollPos2 = -(amount*elemHeight - 4*elemHeight);
        }

        var nearestPoint = roundTo(currentScrollPos2, 40);
        var deltaToStop = nearestPoint - currentScrollPos2;


        // increase css transition duration to animate
        $('.scroll-container--sec').addClass("scroll-container--anim");
        $scope.secScrollY = nearestPoint;

        // check for transition ending
        $('.scroll-container--anim').on('transitionend webkitTransitionEnd oTransitionEnd mozTransitionEnd msTransitionEnd', function () {
                $('.scroll-container--sec').removeClass("scroll-container--anim");
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