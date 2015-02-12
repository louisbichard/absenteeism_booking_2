/**
 * Main controller for the application
 */
APP.controller('mainController', function($scope, bookingService, $location) {

    // A UNIQUE, ALPHABETICALLY NAME SORTED LIST OF USERS
    $scope.login_users = bookingService.read.formattedUsers();

    // NOTE: ARBITRARY SELECTION FOR DEFAULT USAGE
    $scope.selected_user = $scope.login_users[1];
    $scope.$watch('selected_user', function() {
        console.log('changed');
        bookingService.selected_user.set($scope.selected_user);
    });

    $scope.$on('$locationChangeSuccess', function() {
        $scope.current_location = $location.path()
            .split('/')[1];
    });

});