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

        d3.selectAll(".input__number").style('color', function(d) {
            // console.log($(this).html() + '<html und data>' + $(this)[0].getBoundingClientRect().top);
            // console.log( $(this)[0].getBoundingClientRect());
            var position = $(this)[0].getBoundingClientRect().top
            var range = position + $(this).height();
            console.log("range: " + range + " VON: " + $(this).html());
            if( range >= middle && !(position > middle)){
                return 'red';
            } else {
                return 'black';
            }
        });
    }



}]);