APP.service("advancedFilterService", function(bookingService) {
    var thisService = this;

    this.filters = {
        "get": {
            "byName": function(name) {
                var id = _.findIndex(thisService.filters.FILTERS, {
                    name: name
                });
                return thisService.filters.FILTERS[id];
            },
            "all": function() {
                return thisService.filters.FILTERS;
            }
        },
        "FILTERS": [
            // ANNUAL LEAVE FILTER
            {
                'name': 'Employees with < than {days} in the year {year} ',
                'fields': [{
                    'label': 'days',
                    'name': 'days',
                    'type': 'number'
                }, {
                    'label': 'year (YYYY)',
                    'name': 'year',
                    'type': 'number'
                }],
                'F': function(fields, records) {

                    var grouped_bookings_this_year = _.chain(records)
                        .groupBy('name')
                        .reduce(function(prev, bookings, name) {
                            // TODO CONSIDER ADDING CONFIGURABLE YEAR

                            // REMOVE ALL BOOKINGS THAT AREN'T THIS YEAR
                            prev[name] = _.filter(bookings, function(curr) {
                                var specified_year = fields.year;
                                return moment(curr.date, 'DD/MM/YYYY').year() === specified_year;
                            });

                            return prev;
                        }, {})
                        .reduce(function(prev, bookings, name) {
                            // CONSIDER ALTERING OPERATOR
                            var bookings_this_year = bookings.length;
                            if (bookings_this_year < fields.days) prev.push({
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
                    'name': 'employees',
                    'type': 'number'
                }],
                'F': function(field_values, records) {

                    var grouped_bookings_this_year = _.chain(records)
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
                            return val.total > field_values.employees;
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
        ]
    };
});