/**
 * Main controller for the application
 */
APP.controller('filterController', function($scope, bookingService) {

    // A UNIQUE, ALPHABETICALLY NAME SORTED LIST OF USERS
    $scope.users = bookingService.read.formattedUsers();

    $scope.submitFilter = function(test) {
        console.log('test');
        var data =
            _.chain(bookingService.read.raw())
            .filter(filterFromExpression)
            .value();
        $scope.results = {
            data: data,
            total: data.length
        };

    };

    var operators = {
        '+': function(a, b) {
            return a + b;
        },
        'contains': function(a, b) {
            return a.indexOf(b) > -1;
        },
        '<=': function(a, b) {
            return a <= b;
        },
        '>=': function(a, b) {
            return a >= b;
        },
        '===': function(a, b) {
            return a === b;
        }
    };

    var filterFromExpression = function(curr) {
        return operators[$scope.expression.operator](curr[$scope.expression.field], $scope.expression.value);
    };

    $scope.expression = {
        field: "name",
        value: "Matthew Webb",
        operator: "==="
    };

    $scope.results = {};

});