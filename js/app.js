var app = angular.module('physioApp', ['ngTouch', 'ngRoute', 'hmTouchEvents']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'views/start.html'
        })
        .when('/exercise/:id', {
            templateUrl: 'views/exercise.html'
        });
}]);