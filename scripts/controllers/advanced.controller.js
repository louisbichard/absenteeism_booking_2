APP.controller('advancedController', function($scope, bookingService, filterService, advancedFilterService) {
    $scope.special_filters = advancedFilterService.filters.get.all();

    $scope.testSpecialFilter = function(details) {

        var filter = advancedFilterService.filters.get.byName(details.name);

        var fields = _.reduce(details.fields, function(prev, curr) {
            prev[curr.name] = curr.value;
            return prev;
        }, {});

        $scope.results = filter.F(fields, bookingService.read.raw());
    };

});