/**
 * CRUD SERVICE
 */
APP.service("bookingService", function(databaseService) {

    var formatDatabase = function(curr, index) {
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
                .sortBy(function(curr) {
                    return new Date(curr.start);
                })
                .value();
        },
        formattedUsers: function() {
            return _.chain(this.raw())
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