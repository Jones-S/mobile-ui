app.controller('d3Controller', ['$scope', function($scope) {
    $scope.scrollY = -15;
    var currentScrollPos = 0;
    var options = 20;

    $scope.getOptions = function(){
        return new Array(options);
    }

    $scope.panInput = function (event) {

        $scope.scrollY = event.deltaY + currentScrollPos;
        checkPos();
    }

    $scope.stopPan = function (event) {
        // save scroll Position to current
        currentScrollPos = $scope.scrollY;
        var nearestPoint = roundTo(currentScrollPos, 50);
        console.log(nearestPoint);
        $scope.scrollY = nearestPoint;
        checkPos();

    }


    // ------------------- 3d.js -------------------

    $scope.d3Transform = function(){
        console.log("transform this shit");

        d3.selectAll(".input__number").transition()
            .duration(750)
            .style('color', 'red');
    }

    function checkPos(){

        // center of wrap to determine, which span should transform
        // center + position of wrap from top
        var middle = $('.input__wrap').height() / 2 + $('.input__wrap')[0].getBoundingClientRect().top;
        var selectionRange = {
            min: middle - $('.input__inactive').height()/2,
            max: middle + $('.input__inactive').height()/2
        }
        var transitionRange = {
            min: selectionRange.min - $('.input__inactive').height(),
            max: selectionRange.max + $('.input__inactive').height()/2
        }

        // console.log("selectionRange: " + selectionRange.max);
        // console.log("transitionRange: " + transitionRange.max);
        // console.log("middle: " + middle);
        // console.log("middle: " + middle);

        d3.selectAll(".input__number").style( '-webkit-transform', function(d) {
            var returnValue;
            var position = $(this)[0].getBoundingClientRect().top
            var range = position + $(this).height();
            $(this).attr('data-pos', position);

            if( selectionRange.min < position && position < middle){
                returnValue = "scale(1) translateZ(0)";
                logValue = "CASE: 0 – MIDDLE";
            } else if ( transitionRange.min <= position && position <= selectionRange.min ) {
                // return a mapped value
                var value = mapRange( position, transitionRange.min, selectionRange.max, 0.5, 1 );
                returnValue = ("scale(" + value + ") translateZ(0)" );
                logValue = "CASE: 1 – TRANS LOW";
            } else if ( middle <= position && position <= transitionRange.max ) {
                // return a mapped value
                var value = mapRange( position, middle, transitionRange.max, 1, 0.5 );
                returnValue = ("scale(" + value + ") translateZ(0)" );
                logValue = "CASE: 2 – TRANS HIGH";
            } else {
                returnValue = "scale(0.5) translateZ(0)";
                logValue = "CASE: 3 – ELSE";
            }

            if ($(this).html() == '5'){
                // console.log("position: " + position);
                // console.log("returnValue: " + returnValue);
                // console.log("logValue: " + logValue);
            };

            // JOEL
            // returnValue = {
            //     "background-color": "red"
            // }
            return returnValue;
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