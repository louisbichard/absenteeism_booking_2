APP.config(function($routeProvider) {
    $routeProvider

        .when('/', {
        templateUrl: '../views/calendar.html',
        controller: 'calendarController'
    })

    .when('/calendar', {
        templateUrl: '../views/calendar.html',
        controller: 'calendarController'
    })

    .when('/filters', {
        templateUrl: '../views/filters.html',
        controller: 'filterController'
    })

    // #DEFAULT REDIRECT
    .otherwise({
        redirectTo: '/'
    });
});