
__Author__: Louis John Bichard

A basic timetabling system built upon AngularJS and SASS for presenting user availability and dates for Mudano as part of second stage recruitment process. 

# Notes

- Calendar interface not tested for larger user sets
- Interface not mobile friendly
- Totals on the calendar view are restricted to the only viewed employees and are displayed in half units, this however is up for debate depending on the preferences of the end users

# Limitations & Future improvements

The following is a list of known issues with the requirements themselves, the interface limitations and future suggestions and basic notes on potential for bugs or improvements in the system to demonstrate thought processes throughout the process.

##### Dragging Angular templating rendering issue on selection
Due to the way Angular is re-rending the template when a user makes a dragged selection sometimes dragged selections are not inputted properly, this could be fixed by caching all the changes temporarily and then updating the model only once

##### Public holiday booking mechanism
Adding public holidays was discussed with Sandhi to be across all users within the organisation, not just the particular individual. This however is conflicted with the data set, as individual records seem to be added for all users. This would be an issue in multiple scenarios such as: 
- Adding new users to the system 
- Adding public holidays be added to the current view (i.e just the filtered users) or to the entire dataset of users (this could be confusing for the user)
- Would be restricting withing the context of multiple localities for working.Offshore teams may require different public holiday structures. 

##### Lack of ability to book weekends
- Some offshore workers may well work weekends, for instance, some oversea's public holidays are more generous, and this would ned to be made up for on other days to be inline with UK based working hours and contracts. 

##### Use of datatables in advanced section
The advanced section merely returns a large lumped HTML table dataset, having sortable and powerful table functionality would help here

##### Use of printing section in advanced reports area
The advanced reports area could be improved with the addition of print functionality.

##### Client side validation on the reports area
As the forms are generated dynamically, greater adoption of fields such as date popout selectors, and better use of client side validation would improve the functionality. The validation could be defined as regular expressions potetntially that are passed into the field via a directive or purely through Angulars validaiton mechanisms.

##### Heat mapping on the reports (advanced pages)
Heat maps could be generated for results sets to provide a better simple view than the current report, table structure that is present.

# Features

## Filters

- Demo filters are added to show how a user may filter just their own timetable, or a team if necessary. This could be done through a name/userid contains, equals saved filter. 

The filters are achieved through an object of operators provided in the filters service, where simply the value of each records property that is chosen (e.g name) is compared against the value provided in the filter query.

In future this would be abstracted away into API's.
    
    this.operators = {
        '+': function(a, b) {
            return a + b;
        },


## Advanced filters

This is a peculiar front-end feature, as there is a lot of data processing occuring in order to render the templates, this would not be the case in a production applicaiton as a lot of the heavy manipulation of data would be done through a database query language. 

- Advanced filters are easily constructed on the front end.
- The advanced filter service has an array under the 'constant' property 'FILTERS' and has API methods for retrieving its data

To extend the current filter functionality, extend the FILTERS array with 

* __Name__ (string): Appears in the drop down on the interface

* __Fields__ (object): Fields with object properties:
    * __label__: Is displayed beside the input box in the interface
    * __type__: type of input box in the interface
    * __name__: The value passed to the callback function _F_ for use in manipulating the data set.
    
* __F__ (callback function): A callback function that must return an object with properties __data__, __total__ and __keys__, where data is the data to be displayed, keys is the columns in the result table and total is the result records. and is provided with function provided with arguments:
    *  __fields__: The parameters fields (an object with the field values as defined earlier as 'name' in the field object)
    *  __result__: The records to filter

            {
                'name': 'Some filter name' 
                'fields': [{
                    'label': 'year (YYYY)',
                    'name': 'year',
                    'type': 'number'
                }],
                'F': function(fields, records) {
                    // SOME FILTER FUNCTION HERE
                    return {
                        data: data,
                        total: total,
                        keys: ['name', 'days booked this year'],
                    };

                }
            }