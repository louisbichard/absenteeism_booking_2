/**
 * CRUD SERVICE
 */
APP.service("bookingService", function(databaseService) {

    var formatDatabase = function(curr, index) {
        var date_split = curr.date.split('/');
        var d = date_split[0];
        var m = date_split[1];
        var y = date_split[2];

        return _.extend({
            title: curr.name,
            start: y + "-" + m + "-" + d,
            // NOTE: SUBTRACT ONE FROM THE MONTH AS JANUARY IS CONSIDERED 00 NOT 01 BY FULLCALENDAR PLUGIN
            end: y + "-" + (m - 1) + "-" + d,
            editable: true,
            // CLASSES ADDED FOR CONDITIONAL FORMATTING
            className: [
                'color-value-' + curr.value,
                'calendar-cell',
                'calendar-unit-' + curr.unit
            ],
        }, curr);
    };

    var establishClashes = function(curr, idx, original) {

        has_clash = false;

        // THE PRECEEDING, CURRENT AND NEXT DATE IN THE DATABASE (WHEN SORTED)
        var a = new moment(original[original[idx - 1] ? idx - 1 : 0].start);
        var b = new moment(original[idx].start);
        var c = new moment(original[original[idx + 1] ? idx + 1 : idx].start);

        // GET DATE DIFFERENCE BETWEEN THE DATES, MATHS.ABS TO ROUND VALUES TO ENSURE POSITIVE VALUE
        var diff_before = Math.abs(a.diff(b, 'days'));
        var diff_after = Math.abs(b.diff(c, 'days'));

        // BINARY VALUES FOR WHETHER IT IS THE FIRST OR LAST INDEX
        var last_element = (original.length - 1 === idx);
        var first_element = (idx === 0);

        // THE FIRST ELEMENT IS ONLY CONCERNED WITH THE DATE FOLLOWING IT
        if (first_element && diff_after <= 4) {
            curr.className.push('event-clash');
        }
        // THE SECOND ELEMENT IS ONLY CONCERNED WITH THE DATE PRECEEDING IT
        else if (last_element && diff_before <= 4) {
            curr.className.push('event-clash');
        }
        // ALL OTHER ELEMENTS ARE CHECKED AGAINST THE DATE BEFORE AND AFTER
        else if ((!last_element && !first_element) && (diff_before <= 4 || diff_after <= 4)) {
            curr.className.push('event-clash');
        }

        return curr;
    };

    // READ
    this.read = {
        raw: function() {
            return databaseService.database;
        },
        formatted: function() {
            return _.chain(databaseService.database)
                .map(formatDatabase)
                // RECORDS *MUST* BE SORTED BEFORE CLASHES CAN BE ESTABLISHED
                .sortBy(function(curr) {
                    return new Date(curr.start);
                })
                .map(establishClashes)
                .value();
        },
        formattedUsers: function() {
            return _.chain(this.raw())
                .uniq('name')
                .sortBy('name')
                .value();
        },
        eventExists: function(record) {
            return _.findWhere(this.raw(), record);
        },
        eventHasClash: function(record) {

            var db = this.raw();

            return _.reduce(new Array(8), function(prev, curr, index) {

                var date_to_compare = new moment(
                        record.date.split('/')
                        .reverse()
                    )
                    .subtract(1, 'months')
                    .subtract(4, 'days')
                    .add(index, 'days')
                    .format('DD/MM/YYYY');

                var found_clash = _.findWhere(db, {
                    date: date_to_compare
                });

                if (found_clash) prev = true;

                return prev;
            }, false);
        }
    };

    this.create = function(event) {
        // INTENTIONAL CONSOLE LOG AS PER REQUIREMENTS
        console.log('EXAMPLE SERVER UPDATE REQUEST', '(CREATE)', event);

        databaseService.database.push(event);
    };

    this.delete = function(record) {
        // INTENTIONAL CONSOLE LOG AS PER REQUIREMENTS
        console.log('EXAMPLE SERVER UPDATE REQUEST', '(DELETE)', event);

        var index = _.findIndex(this.read.raw(), record);

        databaseService.database.splice(index, 1);
    };

});