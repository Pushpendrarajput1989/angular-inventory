myApp.controller('outboundController', outboundController);

outboundController.$inject = ['$scope', '$http', '$location', 'baseUrl', '$mdDialog', '$mdMedia', 'growl', '$window', 'downloadOrderTemplateUrl', 'Upload', 'PagerService', '$q', 'imageUrl', '$routeParams', '$cookies'];

function outboundController($scope, $http, $location, baseUrl, $mdDialog, $mdMedia, growl, $window, downloadOrderTemplateUrl, Upload, PagerService, $q, imageUrl, $routeParams, $cookies) {
    
    $scope.clearStartDate = function() {
        $scope.startDate = "";
        $scope.start1Date = undefined;
        $scope.isStartDateDisabled = true;
    }

    $scope.clearEndDate = function() {
        $scope.endDate = "";
        $scope.end1Date = undefined;
        $scope.isEndDateDisabled = true;
    }
}
    