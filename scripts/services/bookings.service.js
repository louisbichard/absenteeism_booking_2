/**
 * CRUD SERVICE
 */
APP.service("bookingService", function(databaseService, $rootScope) {

    this.selected_user = {
        "set": function(user) {
            // ENSURE ONLY ACCESS THROUGH THIS FUNCTION
            this.USER = user;
            // BROAD CAST THE UPDATE TO OTHER CONTROLLERS
            $rootScope.$broadcast('user-changed');
        },
        "get": function() {
            return this.USER;
        },
        // DEFAULT USER, ARTIFIAL PRIVATE CONSTANT WITH PRIVATE SCOPE
        "USER": {
            "userid": 8,
            "name": "Edward H. Temme",
            "initials": "BD"
        }
    };

    var establishClashes = function(curr, idx, original) {

        has_clash = false;

        // THE PRECEEDING, CURRENT AND NEXT DATE IN THE DATABASE (WHEN SORTED)
        var a = new moment(original[original[idx - 1] ? idx - 1 : 0].date, 'DD/MM/YYYY');
        var b = new moment(original[idx].date, 'DD/MM/YYYY');
        var c = new moment(original[original[idx + 1] ? idx + 1 : idx].date, 'DD/MM/YYYY');

        // GET DATE DIFFERENCE BETWEEN THE DATES, MATHS.ABS TO ROUND VALUES TO ENSURE POSITIVE VALUE
        var diff_before = Math.abs(a.diff(b, 'days'));
        var diff_after = Math.abs(b.diff(c, 'days'));

        // BINARY VALUES FOR WHETHER IT IS THE FIRST OR LAST INDEX
        var last_element = (original.length - 1 === idx);
        var first_element = (idx === 0);

        // THE FIRST ELEMENT IS ONLY CONCERNED WITH THE DATE FOLLOWING IT
        if (first_element && diff_after <= 4) {
            curr['clashed'] = true;
        }
        // THE SECOND ELEMENT IS ONLY CONCERNED WITH THE DATE PRECEEDING IT
        else if (last_element && diff_before <= 4) {
            curr['clashed'] = true;
        }
        // ALL OTHER ELEMENTS ARE CHECKED AGAINST THE DATE BEFORE AND AFTER
        else if ((!last_element && !first_element) && (diff_before <= 4 || diff_after <= 4)) {
            curr['clashed'] = true;
        }

        return curr;
    };

    // READ
    this.read = {
        raw: function() {
            return databaseService.database;
        },
        formatted: function(data) {
            return _.chain(data || databaseService.database)
                .sortBy(function(curr) {
                    return new Date(curr.date.split('/').reverse().join('/'));
                })
                .map(establishClashes)
                .value();
        },
        formattedUsers: function(data) {
            return _.chain(data || this.raw())
                .uniq('name')
                // EXTRACT THE INITIALS FOR THE USER
                .map(function(curr) {
                    curr.initials =
                        _.map(curr.name.split(' '), function(curr) {
                            return curr.split('')[0];
                        })
                        .join('');
                    return curr;
                })
                .sortBy('name')
                .value();
        },
        clashedDates: function(data) {
            return _.chain(data || this.raw())
                .reduce(function(prev, curr) {
                    var f = 'DD/MM/YYYY';
                    var num_of_iterations = 9;
                    var start_offset;

                    /* 
                    AS WEEKENDS WILL AFFECT THIS PURE NUMERIC IMPLEMENTATION, IF IT IS A EARLIER THAN A THURSDAY,
                    THE OFFSET MUST BE SET BACK 2 DAYS, TO JUMP BEFOR THE WEEKEND, IF NOT THE OFFSET IS SET TO 
                    EARLIER IN THE WEEK AND WILL ITERATE AS USUAL

                    THIS DOES FEEL A LITTLE UNCLEAN AND I'M NOT 100% HAPPY WITH IT, I'M SURE A CLEANER SOLUTION
                    COULD BE DERIVED
                    */

                    // START BEFORE THE WEEKEND
                    if (moment().day() < 4) start_offset = 6;
                    // JUMP OVER THE WEEKEND
                    else start_offset = 4;

                    var moment_date = moment(curr.date, f).subtract(start_offset, 'day');
                    var iterations = new Array(num_of_iterations);

                    // ADD THE DATES 3 BEFORE AND AFTER
                    _.each(iterations, function() {
                        prev[moment_date.add(1, 'day').format(f)] = true;
                    });

                    return prev;
                }, {})
                .value();
        }
    };

    this.create = function(record) {
        // INTENTIONAL CONSOLE LOG AS PER REQUIREMENTS
        console.log('EXAMPLE SERVER UPDATE REQUEST', '(CREATE)', record);

        databaseService.database.push(record);
    };

    this.delete = function(record) {
        // INTENTIONAL CONSOLE LOG AS PER REQUIREMENTS
        console.log('EXAMPLE SERVER UPDATE REQUEST', '(DELETE)', record);

        var index = _.findIndex(this.read.raw(), record);

        console.log(index);

        if (index !== -1) databaseService.database.splice(index, 1);

    };
});