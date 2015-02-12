APP.service("filterService", function(bookingService) {

    this.filters = [{
            field: "name",
            value: "",
            operator: "contains",
            name: "All results"
        }, {
            field: "name",
            value: "Matthew,Brojen,Cynthia",
            operator: "contains",
            name: "My Team (A)"
        }, {
            field: "name",
            value: "Matthew Webb",
            operator: "===",
            name: "Just Matthew Webb"
        }, {
            "name": "Just Thomas William",
            "field": "name",
            "value": "Thomas William",
            "operator": "contains"
        }, {
            "field": "value",
            "value": "V",
            "operator": "===",
            "name": "Just Vacations"
        }

    ];

    this.operators = {
        'contains': function(a, b) {

            // ACCOMODATE COMMA SEPARATED
            b = b.split(',');

            return _.reduce(b, function(prev, curr) {

                var has_substring =
                    a
                    .toString()
                    .indexOf(curr) > -1;

                return (prev || has_substring);

            }, false);
        },
        '===': function(a, b) {

            b = b.split(',');

            return _.reduce(b, function(prev, curr) {

                var is_equal = (a.toString() === curr);

                return (prev || is_equal);

            }, false);

        }
    };
});