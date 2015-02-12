APP.controller('filterController', function($scope, bookingService, filterService, notifyService) {

    // A UNIQUE, ALPHABETICALLY NAME SORTED LIST OF USERS
    $scope.users = bookingService.read.formattedUsers();

    // SET DEFAULT VALUES IN FILTERS FOR DEMO
    $scope.expression = {
        field: "name",
        value: "Matthew Webb",
        operator: "==="
    };

    // OBJECT OF SETUP PARAMETERS TO INITIALISE ON THE INTERFACE
    $scope.setup = {
        // USED TO POPULATE THE SELECT BOX
        operators: _.keys(filterService.operators)
    };

    $scope.testFilter = function(test) {
        // RUN THE OPERATORS FILTER EXPRESSION TO FILTER
        var filterFromExpression = function(curr) {
            return filterService.operators[$scope.expression.operator](curr[$scope.expression.field], $scope.expression.value);
        };

        var data = _.chain(bookingService.read.raw())
            .filter(filterFromExpression)
            .value();

        $scope.results = {
            data: data,
            total: data.length
        };
    };

    $scope.filters = {
        save: function() {
            filterService.filters.push($scope.expression);
            notifyService.success('Filter saved!');
            /* 
            NOTE: HAVE TO CLEAR THE EXPRESSION AS ANGUALR IS VERY CLEVER AND WILL BIND 
            THE VALUE TO THAT IN THE SERVICE MAKING IT IMPOSSIBLE TO ADD MULTIPLE
            FILTERS
              */
            $scope.expression = {};
        },
        get: function() {
            return filterService.filters;
        },
        delete: function(id) {
            filterService.filters.splice(id, 1);
        }
    };

    $scope.results = {};

});