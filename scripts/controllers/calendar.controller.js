APP.controller('calendarController', function($scope, bookingService, filterService, $rootScope) {

    $scope.bookings_by_date = [];

    $scope.selected_unit = "V";

    $scope.filters = filterService.filters;

    // TODO: JUST AN EXAMPLE, DELETE THIS EVENTUALLY

    $scope.$on('user-changed', function(event, args) {
        $scope.selected_user = bookingService.selected_user.get();
    });

    $scope.selected_user = bookingService.selected_user.get();

    $scope.init = function() {
        var theFilter;

        if ($scope.selectedFilter) {
            var f = $scope.selectedFilter;
            theFilter = function(curr) {
                return filterService.operators[f.operator](curr[f.field], f.value);
            };
        } else {
            theFilter = function() {
                return true;
            };
        }

        var filtered_users =
            _.chain(bookingService.read.formatted())
            .filter(theFilter)
            .value();

        $scope.bookings_by_date = _.chain(filtered_users)
            // NOTE: MUST PERFORM FILTER BEFORE THE GROUP BY
            .filter(theFilter)
            // TODO: FILTER OUT THE DATES NOT CURRENTLY VIEWED
            .groupBy('date')
            .value();

        $scope.bookings_by_date_current_user = _.chain(bookingService.read.formatted())
            .filter({
                userid: $scope.selected_user.userid
            })
            .groupBy('date').value();

        $scope.users = bookingService.read.formattedUsers(filtered_users);
    };

    $scope.isMonday = function(day) {
        return moment(day, "DD/MM/YYYY")
            .format('d') === "1";
    };

    $scope.cellHasBooking = function(name, bookings_on_date, unit, value, date) {
        //        if (date === "13/04/2015" && name === "Matthew Webb") debugger;
        var data = _.find(bookings_on_date, {
            name: name,
            unit: unit
        });
        return (value && data) ? data.value : data;
    };

    $scope.addBooking = function(name, date, unit, elem, event) {

        // NOTE: THIS REGEX, AND CLASS BASED IMPLEMENTATION PROBABLY NOT THE BEST, I WOULD CHANGE THIS IN FUTURE GIVEN CHANCE
        var has_booking = event.currentTarget.className.match(/value-P|value-V|value-T/g);
        // NOTE: GET VALUE LETTER, AGAIN A LITTLE HACKY
        var booking_value = has_booking ? has_booking[0].split('value-')[1] : false;
        var user_clicked = (event.which === 1);

        // CONSTRUCT RECORD TO DELETE OR ADD
        var user = _.pick($scope.selected_user, ['name', 'userid']);
        var booking_details = _.extend(user, {
            "date": date,
            "unit": unit,
            // TODO: REPLACE WITHOUT HARDCODED VALUE
            "value": booking_value || $scope.selected_unit
        });

        if (user_clicked && has_booking) {
            bookingService.delete(booking_details);
            $scope.init();
        } else if (user_clicked) {
            bookingService.create(booking_details);
            $scope.init();
        }
    };

    $scope.demo_dates =
        _.chain(new Array(76))
        .map(function(curr, index) {
            return moment()
                .add(index, 'day')
                .format('DD/MM/YYYY');
        })
        .filter(function(curr, index) {
            var day =
                moment(curr, 'DD/MM/YYYY')
                .format('E');

            var isWeekend = (day === "6" || day === "7");
            return !isWeekend;
        })
        .value();

    $scope.init();
});