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