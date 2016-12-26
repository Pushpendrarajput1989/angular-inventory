myApp.controller('inboundController', inboundController);

inboundController.$inject = ['$scope', '$http', '$location', 'baseUrl', '$mdDialog', '$mdMedia', 'growl', '$window', 'downloadOrderTemplateUrl', 'Upload', 'PagerService', '$q', 'imageUrl', '$routeParams', '$cookies'];

function inboundController($scope, $http, $location, baseUrl, $mdDialog, $mdMedia, growl, $window, downloadOrderTemplateUrl, Upload, PagerService, $q, imageUrl, $routeParams, $cookies) {
    
    $scope.orderLists = [{
        "tableSaleOrderClientOrderNo":'1234',
        "tableCustomer":{"tableCustomerFirstName":"Pushpendra Rajput"},
        "tableSalesChannelValueInfo":{"tableSalesChannelValueInfoName":"Default"},
        "tableSaleOrderDate":{"0":"2016", "1":"12","2":"05"},
        "totalQuantity":"12",
        "totalCostAmount":"2376",
    },{
        "tableSaleOrderClientOrderNo":'1234',
        "tableCustomer":{"tableCustomerFirstName":"Pushpendra Rajput"},
        "tableSalesChannelValueInfo":{"tableSalesChannelValueInfoName":"Default"},
        "tableSaleOrderDate":{"0":"2016", "1":"12","2":"05"},
        "totalQuantity":"12",
        "totalCostAmount":"2376",
    },{
        "tableSaleOrderClientOrderNo":'1234',
        "tableCustomer":{"tableCustomerFirstName":"Pushpendra Rajput"},
        "tableSalesChannelValueInfo":{"tableSalesChannelValueInfoName":"Default"},
        "tableSaleOrderDate":{"0":"2016", "1":"12","2":"05"},
        "totalQuantity":"12",
        "totalCostAmount":"2376",
    },{
        "tableSaleOrderClientOrderNo":'1234',
        "tableCustomer":{"tableCustomerFirstName":"Pushpendra Rajput"},
        "tableSalesChannelValueInfo":{"tableSalesChannelValueInfoName":"Default"},
        "tableSaleOrderDate":{"0":"2016", "1":"12","2":"05"},
        "totalQuantity":"12",
        "totalCostAmount":"2376",
    },{
        "tableSaleOrderClientOrderNo":'1234',
        "tableCustomer":{"tableCustomerFirstName":"Pushpendra Rajput"},
        "tableSalesChannelValueInfo":{"tableSalesChannelValueInfoName":"Default"},
        "tableSaleOrderDate":{"0":"2016", "1":"12","2":"05"},
        "totalQuantity":"12",
        "totalCostAmount":"2376",
    }]
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
    