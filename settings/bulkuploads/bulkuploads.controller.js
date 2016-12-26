myApp.controller("bulkuploadsController", bulkuploadsController);

bulkuploadsController.$inject = ["$scope", "$http", "$location", "baseUrl", "$mdDialog", "$mdMedia", "growl", "$window", "downloadOrderTemplateUrl", "Upload", "PagerService", "$q", "imageUrl", "$routeParams", "$cookies"];

function bulkuploadsController($scope, $http, $location, baseUrl, $mdDialog, $mdMedia, growl, $window, downloadOrderTemplateUrl, Upload, PagerService, $q, imageUrl, $routeParams, $cookies) {
    $scope.activeTab = "Masters";
    $scope.searchSuccessClicked = false;
    $scope.isActive = function(tab) {
        if ($scope.activeTab == tab) {
            return true;
        }
        return false;
    };

    $scope.toggleSearchSuccessUploads = function() {
        $scope.searchSuccessClicked = !$scope.searchSuccessClicked;
    };

    $scope.showBulkUploadDialog = function() {
        $("#bulkUploadDialog").modal("show");
    };

    $scope.showBulkUploadFileDialog = function() {
        $("#bulkUploadFileDialog").modal("show");
    };

    $scope.closeBulkUploadDialog = function() {
        $("#bulkUploadDialog").modal("hide");
    };
    $scope.closeBulkUploadFileDialog = function() {
        $("#bulkUploadFileDialog").modal("hide");
    };
}
