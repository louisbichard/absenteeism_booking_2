APP.controller('specialController', function($scope, bookingService, filterService) {
    $scope.special_filters = filterService.special_filters;

    $scope.testSpecialFilter = function(details) {
        $scope.results = $scope.special_filters[0].F(details);
    };

    $scope.special_filters = [
        // ANNUAL LEAVE FILTER
        {
            'name': 'Employees with < than {days} in the year {year} ',
            'fields': [{
                'label': 'days',
                'type': 'number'
            }, {
                'label': 'year (YYYY)',
                'type': 'number'
            }],
            'F': function(special_filter_details) {

                var grouped_bookings_this_year = _.chain(bookingService.read.raw())
                    .groupBy('name')
                    .reduce(function(prev, bookings, name) {
                        // TODO CONSIDER ADDING CONFIGURABLE YEAR

                        // REMOVE ALL BOOKINGS THAT AREN'T THIS YEAR
                        prev[name] = _.filter(bookings, function(curr) {
                            var specified_year = special_filter_details.fields[1].value;
                            return moment(curr.date, 'DD/MM/YYYY').year() === specified_year;
                        });

                        return prev;
                    }, {})
                    .reduce(function(prev, bookings, name) {
                        // CONSIDER ALTERING OPERATOR
                        var bookings_this_year = bookings.length;
                        if (bookings_this_year < special_filter_details.fields[0].value) prev.push({
                            name: name,
                            total: bookings_this_year
                        });
                        return prev;
                    }, [])
                    .value();

                return {
                    data: grouped_bookings_this_year,
                    total: grouped_bookings_this_year.length,
                    keys: ['name', 'days booked this year'],
                };

            }
        }

        // SOME OTHER FILTER

    ];
});