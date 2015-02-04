/**
 * Main controller for the application
 */
APP.controller('calendarController', function($scope, bookingService) {

    $scope.addBooking = function() {
        console.log('test');
    };

    $scope.getCellUser = function(name, bookings_on_date, unit) {
        return _.countBy(bookings_on_date, {name: name, unit: unit}).true;
    };

    $scope.selectedUser = {
        "userid": 12,
        "name": "Brojen Das",
        "date": "23/12/2014",
        "unit": "AM",
        "value": "V",
        "initials": "BD"
    };

    $scope.bookings_by_date = _.chain(bookingService.read.formatted())
        .groupBy('date')
        .value();

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

});