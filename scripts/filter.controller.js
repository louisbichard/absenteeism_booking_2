/**
 * Main controller for the application
 */
APP.controller('filterController', function($scope, bookingService, filterService) {

    // A UNIQUE, ALPHABETICALLY NAME SORTED LIST OF USERS
    $scope.users = bookingService.read.formattedUsers();

    $scope.saveFilter = function() {
        filterService.filters.push($scope.expression);
        $scope.expression = {};
    };

    $scope.submitFilter = function(test) {

        var data =
            _.chain(bookingService.read.raw())
            .filter(filterFromExpression)
            .value();

        $scope.results = {
            data: data,
            total: data.length
        };

    };

    var filterFromExpression = function(curr) {
        return filterService.operators[$scope.expression.operator](curr[$scope.expression.field], $scope.expression.value);
    };

    $scope.expression = {
        field: "name",
        value: "Matthew Webb",
        operator: "==="
    };

    $scope.results = {};

});