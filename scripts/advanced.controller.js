APP.controller('advancedController', function($scope, bookingService, filterService) {
    $scope.special_filters = filterService.special_filters;

    $scope.testSpecialFilter = function(details) {
        var filter_index = _.findIndex($scope.special_filters, {
            name: details.name
        });

        $scope.results = $scope.special_filters[filter_index].F(details);
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
                    .sortBy('total')
                    .reverse()
                    .value();

                return {
                    data: grouped_bookings_this_year,
                    total: grouped_bookings_this_year.length,
                    keys: ['name', 'days booked this year'],
                };

            }
        }, {
            'name': 'Weeks this year with more than {E} absent employees',
            'fields': [{
                'label': 'Employees (E)',
                'type': 'number'
            }],
            'F': function(special_filter_details) {

                var grouped_bookings_this_year = _.chain(bookingService.read.raw())
                    .reduce(function(prev, curr) {
                        var date = moment(curr.date, 'DD/MM/YYYY');

                        // IF TODAYS DATE
                        if (date.year() === moment().year()) {
                            var w = date.week();
                            var has_key = prev[w];

                            if (has_key) prev[w] ++;
                            else prev[w] = 1;
                        }

                        return prev;
                    }, {})
                    .reduce(function(prev, total, week_no) {

                        var week_beginning = moment().week(week_no).format('DD/MM/YYYY');

                        prev.push({
                            'total': total,
                            'week_beginning': week_beginning

                        });

                        return prev;

                    }, [])
                    .filter(function(val) {
                        return val.total > special_filter_details.fields[0].value;
                    })
                    .sortBy('total', 1)
                    .reverse()
                    .value();

                return {
                    data: grouped_bookings_this_year,
                    total: grouped_bookings_this_year.length,
                    keys: ['Total bookings', 'Week beginning'],
                };

            }
        }

        // SOME OTHER FILTER

    ];
});