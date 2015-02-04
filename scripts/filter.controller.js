/**
 * Main controller for the application
 */
APP.controller('filterController', function($scope, bookingService) {

    // A UNIQUE, ALPHABETICALLY NAME SORTED LIST OF USERS
    $scope.users = bookingService.read.formattedUsers();

    $scope.filters = {};

});