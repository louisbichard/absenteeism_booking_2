APP.service("filterService", function() {
    this.filters = [{
            field: "name",
            value: "Matthew Webb",
            operator: "===",
            name: "Filter just Matthew Webb"
        }, {
            field: "name",
            value: "",
            operator: "contains",
            name: "All results"
        }, {
            "name": "Just William",
            "field": "name",
            "value": "William",
            "operator": "contains"
        }, {
            name: "Something",
            filter: [{
                "field": "name",
                "operator": "contains",
                "value": "William"
            }, {
                "comparator": "OR",
                "field": "name",
                "operator": "contains",
                "value": "William"
            }]
        }

    ];

    this.operators = {
        '+': function(a, b) {
            return a + b;
        },
        'contains': function(a, b) {
            return a.indexOf(b) > -1;
        },
        '<=': function(a, b) {
            return a <= b;
        },
        '>=': function(a, b) {
            return a >= b;
        },
        '===': function(a, b) {
            return a === b;
        }
    };
});