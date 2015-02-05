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