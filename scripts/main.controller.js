/**
 * Main controller for the application
 */
APP.controller('mainController', function($scope, bookingService) {

    // A UNIQUE, ALPHABETICALLY NAME SORTED LIST OF USERS
    $scope.users = bookingService.read.formattedUsers();

});