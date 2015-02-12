// THE PURPOSE OF THIS SERVICE IS JUST TO WRAP THE TOASTR LIBRARY WITH SOME DEFAULT CONFIGURATIONS
APP.service("notifyService", function(toastr) {

    this.success = function(string) {
        return toastr.success(string);
    };
});