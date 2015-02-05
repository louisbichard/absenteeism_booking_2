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

    .when('/advanced', {
        templateUrl: '../views/advanced.html',
        controller: 'advancedController'
    })

    .when('/heatmap', {
        templateUrl: '../views/heatmap.html',
        controller: 'heatMapController'
    })

    // #DEFAULT REDIRECT
    .otherwise({
        redirectTo: '/'
    });
});