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