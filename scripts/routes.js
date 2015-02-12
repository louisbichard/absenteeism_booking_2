APP.config(function($routeProvider) {
    $routeProvider

        .when('/', {
        templateUrl: '../absenteeism_booking_2/views/calendar.html',
        controller: 'calendarController'
    })

    .when('/calendar', {
        templateUrl: '../absenteeism_booking_2/views/calendar.html',
        controller: 'calendarController'
    })

    .when('/filters', {
        templateUrl: '../absenteeism_booking_2/views/filters.html',
        controller: 'filterController'
    })

    .when('/advanced', {
        templateUrl: '../absenteeism_booking_2/views/advanced.html',
        controller: 'advancedController'
    })

    .when('/heatmap', {
        templateUrl: '../absenteeism_booking_2/views/heatmap.html',
        controller: 'heatMapController'
    })

    // #DEFAULT REDIRECT
    .otherwise({
        redirectTo: '/'
    });
});