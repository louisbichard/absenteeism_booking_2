# Timetabling

A basic timetabling system built upon AngularJS and SASS for presenting user availability and dates

## Overview

- Has been tested only in 'modern browsers'
- Not 100% mobile/tablet/small device optimised
- Colour codes are not taking into account colourblind users, better choices could be made for improved accessibility
- Alerts/Prompts are used, but these could be removed in future with modals or something more aesthetic if required
- Colour is quite heavily used in the UI, a good future improvement would be divide the cells into AM and PM, however this is not possible easily with the current used plugin and would require more work than is in scope for this taks
- The system has dragging functionality for events, however this has not been added due to the added complexity, but could be a future extension so that bookings can be made easily for long periods of time
- No unit tests are provided, so functionality will be largely unstable
- There is no 'updating' of tasks, they are only created or destroyed, this is how the 'update' functionality is provided. 
- No admin rights are provided, all users can add for all users, and all users can remove all other users events
- User selection could be improved by addition of groups, i.e users grouped into developers, managers, etc. 
- Most of the code is built into 1 controller, this however would be better broken down where possible into separate services/directives, however for a smaller project this seems acceptable (uncertainty of requirements make this slightly difficult) as 1 controller is easier to maintain while requirements are addressed.
- Animations have been added for transitions on load and when logging in

## Requirements

✓ __The user should be able to mark time as “Present”, “Vacation”, “Public Holiday”, “Training”__ 'Present' is assumed default.

✓ __All categories other than “Present” are classified as Absent__

✓ __Weekends should be ignored by the system (not displayed and no classification should be given)__

✓ __The system should work on units of half days__ Each item added is added as either AM or PM. This is denoted through colours defined in the colour key. At the time of writing, blue denotes AM and pink denotes PM. The system also validates against this. 

✓ __The default for days should be “Present” other than Public Holidays__

✓ __The user should be able to see the records for other team members as they make their selections__ Can be seen and removed/added through the panel on the left

✓ __The interface should be designed to be able to deal with projects with up to 40 people__

✓ __The interface should highlight clashes with other users.__ This is denoted by a red mark to the right of the event

✓ __The interface should deal with a period of up to 12 months in the future__

✓ __It is not required that all 12 months must be shown at the same time and the interface should be optimised for the most common use case (Vacation and training to be added within the next 3 months)__ 1 month shown at a time, this was assumed optimal for screen sizings etc.

✓ __User can select a relevant time to book absence/User can input absence__ Selected by clicking on dates

✓__User can get feedback on clashes of input absence (can be automatic if required)__ 

✓__Save (can be automatic if required)__ Automatic saving

