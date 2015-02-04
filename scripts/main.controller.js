/**
 * Main controller for the application
 */
APP.controller('mainController', function($scope, bookingService) {

    // INITIALISATION PARAMETERS
    $scope.search = {
        selectallusers: true,
        // DEFAULTS FOR THE ADDING EVENTS INPUTS
        // COULD HOWEVER BE INTUITIVELY POPULATED BASED ON FREQUENCY OF TYPES/UNITS FOR THE USER
        add_event: {
            value: "V",
            unit: "AM"
        }
    };

    // REQUIRED AS THE FULL CALENDAR DOES NOT RECOGNISE CHANGES IN THE SCOPE
    // A FULL DESTROY AND REBUILD OF THE CALENDAR IS REQUIRED ON CHANGE
    $scope.$watch('filter', function() {
        $scope.redrawCalendar();
    }, true);

    // A UNIQUE, ALPHABETICALLY NAME SORTED LIST OF USERS
    $scope.users = bookingService.read.formattedUsers();

    $scope.filter = {
        // CREATE AN OBJECT OF USERS, WHERE THE PROPERTY IS THE USERNAME AND
        // THE VALUE IS WHETHER IT SHOULD APPEAR ON THE CALENDAR UI
        user: _.reduce($scope.users, function(prev, curr) {
            prev[curr.name] = true;
            return prev;
        }, {}),
        value: {
            "V": true,
            "P": true,
            "T": true
        },
        unit: {
            "AM": true,
            "PM": true
        }
    };

    $scope.eventSources = [
        bookingService.read.formatted()
    ];

    $scope.selectAllUsers = function() {
        $scope.filter.user = _.chain($scope.filter.user)
            .map(function(user, name) {
                var temp = {};
                temp[name] = $scope.search.selectallusers;
                return temp;
            })
            .reduce(function(prev, curr) {
                return _.extend(prev, curr);
            }, {})
            .value();
        $scope.redrawCalendar();
    };

    var confirmBooking = function(record_to_add) {
        // FORMATTED ALERT MESSAGE WITH NEW LINE BREAKS
        var message = [
            'Please confirm the following is correct for this booking: \n',
            'User: ' + $scope.selectedUser.name,
            'Value: ' + $scope.search.add_event.value,
            'Unit: ' + $scope.search.add_event.unit
        ];

        if (bookingService.read.eventHasClash(record_to_add)) {
            message.push('\nNote: This booking would cause a clash, are you sure you wish to continue?');
        }

        var confirmed = confirm(message.join('\n'));

        if (confirmed) {
            bookingService.create(record_to_add);
            $scope.redrawCalendar();
        }
    };

    // NEW EVENT TRIGGERED BY CLICKING ON DAY EVENT CELLS
    $scope.addNewEvent = function(start, end) {

        var record_to_add = {
            "userid": $scope.selectedUser.userid,
            "name": $scope.selectedUser.name,
            "date": moment(start._d)
                .format('DD/MM/YYYY'),
            "unit": $scope.search.add_event.unit,
            "value": $scope.search.add_event.value
        };

        // VALIDATE THAT THE ENTRY DOESN'T ALREADY EXIST
        if (bookingService.read.eventExists(record_to_add)) {
            alert('This booking already exists, please alter your criteria or choose an alternate date');
        } else {
            confirmBooking(record_to_add);
        }

    };

    var deleteEventBooking = function(record) {
        var confirm_delete = confirm('Are you sure you want to delete this record?');
        if (confirm_delete) {
            var to_delete = _.pick(record, ['userid', 'date', 'value', 'unit', 'name']);
            bookingService.delete(to_delete);
            $scope.redrawCalendar();
        }
    };

    $scope.uiConfig = {
        calendar: {
            weekends: false,
            selectable: true,
            height: 600,
            eventLimit: true,
            eventClick: deleteEventBooking,
            selectHelper: true,
            select: $scope.addNewEvent,
            header: {
                left: 'month',
                center: 'title',
                right: 'today prev,next'
            }
        }
    };

    var filterByUser = function(filter, curr) {
        return !!filter.val[curr.name];
    };

    var filterByUnit = function(filter, curr) {
        return !!filter.val[curr.unit];
    };

    var filterByValue = function(filter, curr) {
        return !!filter.val[curr.value];
    };

    $scope.redrawCalendar = function() {
        var temp_events = _.chain(bookingService.read.formatted())
            .filter(_.partial(filterByUser, {
                val: $scope.filter.user,
                prop: 'name'
            }))
            .filter(_.partial(filterByUnit, {
                val: $scope.filter.unit,
                prop: 'unit'
            }))
            .filter(_.partial(filterByValue, {
                val: $scope.filter.value,
                prop: 'value'
            }))
            .value();

        $scope.events = temp_events;

        // USED FOR DISPLAYING THE NUMBER OF RESULTS
        $scope.total_events = temp_events.length;

        if ($scope.myCalendar) {

            // STORES THE CURRENT DATE IN VIEW, SO RE RENDERS ON THE SAME VIEW TO PREVENT DEFAULTING TO CURRENT DATE
            var set_date = $scope.myCalendar.fullCalendar('getDate');

            $scope.myCalendar.fullCalendar('destroy');

            var config = {
                events: temp_events
            };

            $scope.myCalendar.fullCalendar(_.extend(config, $scope.uiConfig.calendar));

            $scope.myCalendar.fullCalendar('refetchEvents');

            $scope.myCalendar.fullCalendar('gotoDate', set_date);
        }

    };

});