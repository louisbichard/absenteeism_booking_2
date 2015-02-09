APP.controller('clashesController', function($scope, bookingService, filterService) {
    $scope.results = {
        total: 0,
        data: {},
        type: ""
    };

    $scope.filter = {
        number_of_days: bookingService.clashDefinition.get('number_of_days'),
        proximity_of_day: bookingService.clashDefinition.get('proximity_of_day')
    };

    $scope.$watch('filter.number_of_days', function() {

        // SET SERVICE TO USE THE VALUE
        bookingService.clashDefinition.set('number_of_days', $scope.filter.number_of_days);

        var data = _.chain(bookingService.read.formatted())
            .groupBy(function(n) {
                return n.date + ' (' + n.unit + ')';
            })
            .reduce(function(prev, val, key) {

                if (val.length > $scope.filter.number_of_days) prev[key] = val;

                return prev;
            }, {})
            .value();
        $scope.results.data = data;
        $scope.results.type = 'number_of_days';

        $scope.results.total = _.keys(data).length;
    });

    $scope.filterUpdated = {
        proximity_of_day: function() {

            // SET SERVICE TO USE THE VALUE
            bookingService.clashDefinition.set('proximity_of_day', $scope.filter.proximity_of_day);

            var data = _.chain(bookingService.read.formatted())
                .filter(function(curr, idx, original) {
                    return curr.clashed;
                })
                .value();

            $scope.results.data = data;
            $scope.results.type = 'proximity_of_day';
            $scope.results.total = _.keys(data).length;

        }
    };

});