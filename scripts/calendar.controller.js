/**
 * Main controller for the application
 */
APP.controller('calendarController', function($scope, bookingService, filterService) {
    $scope.bookings_by_date = [];

    $scope.filters = filterService.filters;

    $scope.selectedUser = {
        "userid": 8,
        "name": "Edward H. Temme",
        "initials": "BD"
    };

    $scope.init = function() {
        console.log('init')
        $scope.bookings_by_date = _.chain(bookingService.read.formatted())
            .groupBy('date')
            .value();
    };

    $scope.isMonday = function(day) {
        return moment(day, "DD/MM/YYYY")
            .format('d') === "1";
    };

    $scope.getCellUser = function(name, bookings_on_date, unit) {
        return _.find(bookings_on_date, {
            name: name,
            unit: unit
        });
    };

    $scope.addBooking = function(name, date, unit, elem, event) {
        var css_classes = event.currentTarget.className

        // TODO: CONVERT TO REGEX
        var has_am_booking = css_classes.indexOf('AM');
        var has_pm_booking = css_classes.indexOf('PM');
        var user_clicked = (event.which === 1);

        var data = {
            "date": date,
            "unit": unit,
            // TODO: REPLACE WITHOUT HARDCODED VALUE
            "value": "V"
        };

        var user = _.pick($scope.selectedUser, ['name', 'userid']);

        var booking_to_create = _.extend(user, data);

        if (user_clicked && (has_am_booking > -1 || has_pm_booking > -1)) {
            bookingService.delete(booking_to_create);
            $scope.init();
        } else if (user_clicked) {
            bookingService.create(booking_to_create);
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