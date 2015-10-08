app.controller('d3Controller', ['$scope', function($scope) {
    $scope.scrollY = 0;
    var currentScrollPos = 0;
    var options = 20;

    $scope.getOptions = function(){
        return new Array(options);
    }

    $scope.panInput = function (event) {

        $scope.scrollY = event.deltaY + currentScrollPos;
        checkPos();
        console.log("mapRange(10): " + mapRange(0.5, 0, 1, 0, 100));
    }

    $scope.stopPan = function (event) {
        // save scroll Position to current
        currentScrollPos = $scope.scrollY;
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
        console.log(middle);

        d3.selectAll(".input__number").classed('input__active', function(d) {
            // console.log($(this).html() + '<html und data>' + $(this)[0].getBoundingClientRect().top);
            // console.log( $(this)[0].getBoundingClientRect());
            var position = $(this)[0].getBoundingClientRect().top
            var range = position + $(this).height();
            console.log("range: " + range + " VON: " + $(this).html());
            if( range >= middle && !(position > middle)){
                return true;
            } else {
                return false;
            }
        });
    }

    //mapping function
    function mapRange(value, low1, high1, low2, high2) {
        return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
    }



}]);