/**
 * Created by angularpc on 07-12-2016.
 */
myApp.controller('stockTransfer', stockTransfer);

stockTransfer.$inject = ['$scope', '$http', '$location', 'fileUpload', '$mdDialog', '$mdMedia', 'baseUrl', 'growl', 'PagerService', '$q', '$cookies', 'downloadOrderTemplateUrl', 'imageUrl', '$routeParams'];

function stockTransfer($scope, $http, $location, fileUpload, $mdDialog, $mdMedia, baseUrl, growl, PagerService, $q, $cookies, downloadOrderTemplateUrl, imageUrl, $routeParams) {

    $scope.baseSkuUrl = baseUrl + '/omsservices/webapi/skus/search?search=';
    $scope.baseCustomerUrl = baseUrl + '/omsservices/webapi/customers/search?search=';
    $scope.products = [];
    $scope.start = 0;
    $scope.orderSize = 5;
    $scope.defaultTabs = 'all';
    $scope.baseCustomerUrl = baseUrl + '/omsservices/webapi/vendors/search?search=';
    $scope.$on('$routeChangeSuccess', function () {
        //$scope.customerid = customerId;
        $http.get(baseUrl + '/omsservices/webapi/vendors').success(function (data) {
            $scope.customerString = data.tableCustomerFirstName;
            if (data.tableCustomerLastName && data.tableCustomerLastName != null && data.tableCustomerLastName != null) {
                $scope.customerString += " " + data.tableCustomerLastName;
            }
        }).error(function (error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);


                $location.path('/login');
            }
        });
        //$scope.getPoData();
        $scope.listOfStatesCount($scope.defaultTabs);
        $scope.listOfWareHouses();
        $scope.listOfVendors();
        $scope.listOfPayments();
        $scope.listOfShippingOwners();
        $scope.listOfShippingCarriers()

    });

    $scope.tableRowExpanded = false;
    $scope.tableRowIndexExpandedCurr = "";
    $scope.tableRowIndexExpandedPrev = "";
    $scope.storeIdExpanded = "";


    // getting all list of orders (all the orders)
    $scope.listOfOrders = function (tabsValue, start, action) {

        console.log(tabsValue);
        console.log(start);
        console.log($scope.channel);
        console.log($scope.skuId);
        console.log($scope.customerid);
        console.log($scope.startDate);
        console.log($scope.endDate)
        if (tabsValue == 'all') {
            $scope.tabsColor = {
                "background-color": "#E9EEEF",
                "outline": "none"
            }
            $scope.tabsColor1 = {};
            $scope.tabsColor2 = {};
            $scope.tabsColor3 = {};
            $scope.tabsColor4 = {};
            $scope.tabsColor5 = {};
            $scope.tabsColor6 = {};
            $scope.tabsColor7 = {};
        }
        if (tabsValue == 'new') {
            $scope.tabsColor1 = {
                "background-color": "#E9EEEF",
                "outline": "none"
            }
            $scope.tabsColor = {}
            $scope.tabsColor2 = {}
            $scope.tabsColor3 = {}
            $scope.tabsColor4 = {}
            $scope.tabsColor5 = {}
            $scope.tabsColor6 = {}
            $scope.tabsColor7 = {}
        }
        if (tabsValue == 'intransit') {
            $scope.tabsColor2 = {
                "background-color": "#E9EEEF",
                "outline": "none"
            }
            $scope.tabsColor = {}
            $scope.tabsColor1 = {}
            $scope.tabsColor3 = {}
            $scope.tabsColor4 = {}
            $scope.tabsColor5 = {}
            $scope.tabsColor6 = {}
            $scope.tabsColor7 = {}
        }

        if (tabsValue == 'inprocess') {
            $scope.tabsColor3 = {
                "background-color": "#E9EEEF",
                "outline": "none"
            }
            $scope.tabsColor = {}
            $scope.tabsColor1 = {}
            $scope.tabsColor2 = {}
            $scope.tabsColor4 = {}
            $scope.tabsColor5 = {}
            $scope.tabsColor6 = {}
            $scope.tabsColor7 = {}
        }
        if (tabsValue == 'grn') {
            $scope.tabsColor4 = {
                "background-color": "#E9EEEF",
                "outline": "none"
            }
            $scope.tabsColor = {}
            $scope.tabsColor1 = {}
            $scope.tabsColor2 = {}
            $scope.tabsColor3 = {}
            $scope.tabsColor5 = {}
            $scope.tabsColor6 = {}
            $scope.tabsColor7 = {}
        }

        if (tabsValue == 'hold') {
            $scope.tabsColor5 = {
                "background-color": "#E9EEEF",
                "outline": "none"
            }
            $scope.tabsColor = {}
            $scope.tabsColor1 = {}
            $scope.tabsColor2 = {}
            $scope.tabsColor3 = {}
            $scope.tabsColor4 = {}
            $scope.tabsColor6 = {}
            $scope.tabsColor7 = {}
        }
        if (tabsValue == 'cancelled') {
            $scope.tabsColor6 = {
                "background-color": "#E9EEEF",
                "outline": "none"
            }
            $scope.tabsColor = {}
            $scope.tabsColor1 = {}
            $scope.tabsColor2 = {}
            $scope.tabsColor3 = {}
            $scope.tabsColor4 = {}
            $scope.tabsColor5 = {}
            $scope.tabsColor7 = {}
        }
        if (tabsValue == 'draft') {
            $scope.tabsColor7 = {
                "background-color": "#E9EEEF",
                "outline": "none"
            }
            $scope.tabsColor = {};
            $scope.tabsColor1 = {};
            $scope.tabsColor2 = {};
            $scope.tabsColor3 = {};
            $scope.tabsColor4 = {};
            $scope.tabsColor5 = {};
            $scope.tabsColor6 = {}
        }

        $scope.defaultTab = tabsValue;

        var orderListUrl = baseUrl + "/omsservices/webapi/stock/transfer";

        if ($scope.defaultTab == 'all')
            orderListUrl += "?start=" + start + "&size=5&direction=asc";

        if ($scope.defaultTab != 'all')
        //orderListUrl += "?&state=" +  tabsValue;
            orderListUrl += "?start=" + start + "&size=5&direction=asc&state=" + tabsValue;


        if ($scope.skuId) {
            orderListUrl += "&skuid=" + $scope.skuId;
        }
        if ($scope.channel) {
            orderListUrl += "&warehouseid=" + $scope.channel;
        }
        if ($scope.startDate) {
            orderListUrl += "&startdate=" + $scope.startDate;
        }
        if ($scope.endDate) {
            orderListUrl += "&enddate=" + $scope.endDate;
        }
        console.log("ORDER LIST URL");
        console.log(orderListUrl);
        $http.get(orderListUrl).success(function (data) {
            console.log(data);
            $scope.orderLists = data;
            //$scope.callOrderListed();
            $scope.dayDataCollapse = [];

            for (var i = 0; i < $scope.orderLists.length; i += 1) {
                $scope.dayDataCollapse.push(false);
            }
        }).error(function (error, status) {

            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);

                $location.path('/login');
            }
        });
    }
    $scope.getTotal = function (tableSkuData) {

        var total = 0;
        for (var i = 0; i < tableSkuData.tableStockXferOrderSkusChargeses.length; i++) {
            var product = tableSkuData.tableStockXferOrderSkusChargeses[i].tablePurchaseOrderSkusChargesValue;
            total += product;
        }
        return total;
    };

    $scope.totalCostPerProduct = function (tableSkuData) {
        // console.log(tableSkuData.tablePurchaseOrderSkusChargeses.length);
        var total = 0;
        var totalCost = 0;
        for (var i = 0; i < tableSkuData.tablePurchaseOrderSkusChargeses.length; i++) {
            var product = tableSkuData.tablePurchaseOrderSkusChargeses[i].tablePurchaseOrderSkusChargesValue;
            total += product;
        }

        var totalCost = total * tableSkuData.tablePurchaseOrderSkusSkuQuantity;

        return totalCost;
    }
    //
    //$scope.getPoData = function(){
    //	var poListUrl = baseUrl + "/omsservices/webapi/purchase/order";
    //	console.log(poListUrl);
    //	$http.get(poListUrl).success(function(data) {
    //		console.log(data);
    //		$scope.orderLists = data;
    //	}).error(function(error, status) {
    //		console.log(error);
    //		if (status == 401) {
    //			//$('#AuthError').modal('show');
    //			$location.path('/login');
    //		}
    //	});
    //}
    //
    //$scope.callOrderListed = function(value){
    //    console.log(value);
    //    var countUrl = baseUrl+"/omsservices/webapi/purchase/order/filtercount";
    //    $http.get(countUrl).success(function(data){
    //        console.log(data);
    //        $scope.AllCount = data;
    //    }).error(function(data){
    //        console.log(data);
    //    });
    //    var countUrl = baseUrl+"/omsservices/webapi/purchase/order/filtercount?state=new";
    //    $http.get(countUrl).success(function(data){
    //        console.log(data);
    //        $scope.newCount = data;
    //    }).error(function(data){
    //        console.log(data);
    //    });
    //    var countUrl = baseUrl+"/omsservices/webapi/purchase/order/filtercount?state=intransit";
    //    $http.get(countUrl).success(function(data){
    //        console.log(data);
    //        $scope.processCount = data;
    //    }).error(function(data){
    //        console.log(data);
    //    });
    //    var countUrl = baseUrl+"/omsservices/webapi/purchase/order/filtercount?state=inprocess";
    //    $http.get(countUrl).success(function(data){
    //        console.log(data);
    //        $scope.shippingCount = data;
    //    }).error(function(data){
    //        console.log(data);
    //    });
    //    var countUrl = baseUrl+"/omsservices/webapi/purchase/order/filtercount?state=grn";
    //    $http.get(countUrl).success(function(data){
    //        console.log(data);
    //        $scope.returnCount = data;
    //    }).error(function(data){
    //        console.log(data);
    //    });
    //    var countUrl = baseUrl+"/omsservices/webapi/purchase/order/filtercount?state=cancelled";
    //    $http.get(countUrl).success(function(data){
    //        console.log(data);
    //        $scope.cancelledCount = data;
    //    }).error(function(data){
    //        console.log(data);
    //    });
    //
    //};
    //
    //
    //
    //
    //$scope.callOrderListed();

    //====================================== Increament and Decreament ====================================== //


    $scope.startIncrement = function () {
        var nextVal = $scope.firstNo + 5
        console.log(nextVal);
        console.log($scope.allCountWithoutDecimal)
        if ($scope.defaultTab == 'all') {
            if (nextVal > $scope.allCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
            if (nextVal <= $scope.allCountWithoutDecimal) {
                $scope.firstNo = $scope.firstNo + 5;
                $scope.secNo = $scope.secNo + 5;
                $scope.thirdNo = $scope.thirdNo + 5;
                $scope.fourthNo = $scope.fourthNo + 5;
                $scope.fifthNo = $scope.fifthNo + 5;

                console.log($scope.start);
                $scope.start = ($scope.firstNo - 1) * 5;
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
        }
        if ($scope.defaultTab == 'new') {
            if (nextVal > $scope.newCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
            if (nextVal <= $scope.newCountWithoutDecimal) {
                $scope.firstNo = $scope.firstNo + 5;
                $scope.secNo = $scope.secNo + 5;
                $scope.thirdNo = $scope.thirdNo + 5;
                $scope.fourthNo = $scope.fourthNo + 5;
                $scope.fifthNo = $scope.fifthNo + 5;

                console.log($scope.start);
                $scope.start = ($scope.firstNo - 1) * 5;
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
        }
        if ($scope.defaultTab == 'process') {
            if (nextVal > $scope.processCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
            if (nextVal <= $scope.processCountWithoutDecimal) {
                $scope.firstNo = $scope.firstNo + 5;
                $scope.secNo = $scope.secNo + 5;
                $scope.thirdNo = $scope.thirdNo + 5;
                $scope.fourthNo = $scope.fourthNo + 5;
                $scope.fifthNo = $scope.fifthNo + 5;

                console.log($scope.start);
                $scope.start = ($scope.firstNo - 1) * 5;
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
        }
        if ($scope.defaultTab == 'shipping') {
            if (nextVal > $scope.shippingCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
            if (nextVal <= $scope.shippingCountWithoutDecimal) {
                $scope.firstNo = $scope.firstNo + 5;
                $scope.secNo = $scope.secNo + 5;
                $scope.thirdNo = $scope.thirdNo + 5;
                $scope.fourthNo = $scope.fourthNo + 5;
                $scope.fifthNo = $scope.fifthNo + 5;

                console.log($scope.start);
                $scope.start = ($scope.firstNo - 1) * 5;
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
        }
        if ($scope.defaultTab == 'return') {
            if (nextVal > $scope.returnCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
            if (nextVal <= $scope.returnCountWithoutDecimal) {
                $scope.firstNo = $scope.firstNo + 5;
                $scope.secNo = $scope.secNo + 5;
                $scope.thirdNo = $scope.thirdNo + 5;
                $scope.fourthNo = $scope.fourthNo + 5;
                $scope.fifthNo = $scope.fifthNo + 5;

                console.log($scope.start);
                $scope.start = ($scope.firstNo - 1) * 5;
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
        }

        if ($scope.defaultTab == 'draft') {
            if (nextVal > $scope.holdCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
            if (nextVal <= $scope.holdCountWithoutDecimal) {
                $scope.firstNo = $scope.firstNo + 5;
                $scope.secNo = $scope.secNo + 5;
                $scope.thirdNo = $scope.thirdNo + 5;
                $scope.fourthNo = $scope.fourthNo + 5;
                $scope.fifthNo = $scope.fifthNo + 5;

                console.log($scope.start);
                $scope.start = ($scope.firstNo - 1) * 5;
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
        }
        if ($scope.defaultTab == 'cancelled') {
            if (nextVal > $scope.cancelledCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
            if (nextVal <= $scope.cancelledCountWithoutDecimal) {
                $scope.firstNo = $scope.firstNo + 5;
                $scope.secNo = $scope.secNo + 5;
                $scope.thirdNo = $scope.thirdNo + 5;
                $scope.fourthNo = $scope.fourthNo + 5;
                $scope.fifthNo = $scope.fifthNo + 5;

                console.log($scope.start);
                $scope.start = ($scope.firstNo - 1) * 5;
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
        }
        if ($scope.defaultTab == 'delivered') {
            if (nextVal > $scope.deliveredCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
            if (nextVal <= $scope.deliveredCountWithoutDecimal) {
                $scope.firstNo = $scope.firstNo + 5;
                $scope.secNo = $scope.secNo + 5;
                $scope.thirdNo = $scope.thirdNo + 5;
                $scope.fourthNo = $scope.fourthNo + 5;
                $scope.fifthNo = $scope.fifthNo + 5;

                console.log($scope.start);
                $scope.start = ($scope.firstNo - 1) * 5;
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
        }
    };


    $scope.startDecrement = function () {
        var prevVal = $scope.firstNo - 5;
        console.log(prevVal);
        console.log($scope.allCountWithoutDecimal);
        if ($scope.defaultTab == 'all') {
            if (prevVal > $scope.allCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
            if (prevVal <= $scope.allCountWithoutDecimal) {
                $scope.firstNo = $scope.firstNo - 5;
                $scope.secNo = $scope.secNo - 5;
                $scope.thirdNo = $scope.thirdNo - 5;
                $scope.fourthNo = $scope.fourthNo - 5;
                $scope.fifthNo = $scope.fifthNo - 5;
                console.log($scope.start);
                $scope.start = ($scope.firstNo - 1) * 5;
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
        }
        if ($scope.defaultTab == 'new') {
            if (prevVal > $scope.newCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
            if (prevVal <= $scope.newCountWithoutDecimal) {
                $scope.firstNo = $scope.firstNo - 5;
                $scope.secNo = $scope.secNo - 5;
                $scope.thirdNo = $scope.thirdNo - 5;
                $scope.fourthNo = $scope.fourthNo - 5;
                $scope.fifthNo = $scope.fifthNo - 5;
                console.log($scope.start);
                $scope.start = ($scope.firstNo - 1) * 5;
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
        }
        if ($scope.defaultTab == 'process') {
            if (prevVal > $scope.processCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
            if (prevVal <= $scope.processCountWithoutDecimal) {
                $scope.firstNo = $scope.firstNo - 5;
                $scope.secNo = $scope.secNo - 5;
                $scope.thirdNo = $scope.thirdNo - 5;
                $scope.fourthNo = $scope.fourthNo - 5;
                $scope.fifthNo = $scope.fifthNo - 5;
                console.log($scope.start);
                $scope.start = ($scope.firstNo - 1) * 5;
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
        }
        if ($scope.defaultTab == 'shipping') {
            if (prevVal > $scope.shippingCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
            if (prevVal <= $scope.shippingCountWithoutDecimal) {
                $scope.firstNo = $scope.firstNo - 5;
                $scope.secNo = $scope.secNo - 5;
                $scope.thirdNo = $scope.thirdNo - 5;
                $scope.fourthNo = $scope.fourthNo - 5;
                $scope.fifthNo = $scope.fifthNo - 5;
                console.log($scope.start);
                $scope.start = ($scope.firstNo - 1) * 5;
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
        }
        if ($scope.defaultTab == 'return') {
            if (prevVal > $scope.returnCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
            if (prevVal <= $scope.returnCountWithoutDecimal) {
                $scope.firstNo = $scope.firstNo - 5;
                $scope.secNo = $scope.secNo - 5;
                $scope.thirdNo = $scope.thirdNo - 5;
                $scope.fourthNo = $scope.fourthNo - 5;
                $scope.fifthNo = $scope.fifthNo - 5;
                console.log($scope.start);
                $scope.start = ($scope.firstNo - 1) * 5;
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
        }
        if ($scope.defaultTab == 'hold') {
            if (prevVal > $scope.holdCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
            if (prevVal <= $scope.holdCountWithoutDecimal) {
                $scope.firstNo = $scope.firstNo - 5;
                $scope.secNo = $scope.secNo - 5;
                $scope.thirdNo = $scope.thirdNo - 5;
                $scope.fourthNo = $scope.fourthNo - 5;
                $scope.fifthNo = $scope.fifthNo - 5;
                console.log($scope.start);
                $scope.start = ($scope.firstNo - 1) * 5;
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
        }
        if ($scope.defaultTab == 'cancelled') {
            if (prevVal > $scope.cancelledCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
            if (prevVal <= $scope.cancelledCountWithoutDecimal) {
                $scope.firstNo = $scope.firstNo - 5;
                $scope.secNo = $scope.secNo - 5;
                $scope.thirdNo = $scope.thirdNo - 5;
                $scope.fourthNo = $scope.fourthNo - 5;
                $scope.fifthNo = $scope.fifthNo - 5;
                console.log($scope.start);
                $scope.start = ($scope.firstNo - 1) * 5;
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
        }
        if ($scope.defaultTab == 'delivered') {
            if (prevVal > $scope.deliveredCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
            if (prevVal <= $scope.deliveredCountWithoutDecimal) {
                $scope.firstNo = $scope.firstNo - 5;
                $scope.secNo = $scope.secNo - 5;
                $scope.thirdNo = $scope.thirdNo - 5;
                $scope.fourthNo = $scope.fourthNo - 5;
                $scope.fifthNo = $scope.fifthNo - 5;
                console.log($scope.start);
                $scope.start = ($scope.firstNo - 1) * 5;
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
        }
    };

    $scope.zeroDecrement = function () {
        growl.error("Order for that Range does not exist");
    };


    $scope.listOfWareHouses = function () {
        $scope.wareHousesData = [];
        var wareHousesListUrl = baseUrl + "/omsservices/webapi/warehouses";
        // console.log(channelListUrl);
        $http.get(wareHousesListUrl).success(function (data) {
            console.log(data);
            $scope.wareHousesLists = data;

            for (var i = 0; i < $scope.wareHousesLists.length; i++) {
                $scope.wareHousesData.push($scope.wareHousesLists[i]);
            }
        }).error(function (error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $location.path('/login');
            }
        });
    };

    $scope.listOfVendors = function () {
        $scope.vendorsData = [];
        var vendorsListUrl = baseUrl + "/omsservices/webapi/vendors";
        // console.log(channelListUrl);
        $http.get(vendorsListUrl).success(function (data) {
            console.log(data);
            $scope.vendorsLists = data;
            for (var i = 0; i < $scope.vendorsLists.length; i++) {
                $scope.vendorsData.push($scope.vendorsLists[i]);
            }
        }).error(function (error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to login again.');
                $location.path('/login');
            }
        });
    }

    $scope.WareHouseList = function () {
        var warehouse = baseUrl + '/omsservices/webapi/warehouses';
        $http.get(warehouse).success(function (data) {
            console.log(data);
            $scope.wareHousesData = data;

        }).error(function (data) {
            console.log(data);
        });
    }

    $scope.listOfPayments = function () {
        $scope.paymentNamesData = [];
        var paymentListUrl = baseUrl + "/omsservices/webapi/purchaseorderpaymenttypes";
        $http.get(paymentListUrl).success(function (data) {
            $scope.paymentLists = data;
            for (var i = 0; i < $scope.paymentLists.length; i++) {
                $scope.paymentNamesData.push($scope.paymentLists[i]);
            }
        }).error(function (error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to login again.');
                $location.path('/login');
            }
        });
    }

    $scope.listOfShippingOwners = function () {
        $scope.shippingOwnersData = []
        var shippingOwnersUrl = baseUrl + "/omsservices/webapi/shippingowner";
        $http.get(shippingOwnersUrl).success(function (data) {
            $scope.shippingOwnersLists = data;
            for (var i = 0; i < $scope.shippingOwnersLists.length; i++) {
                $scope.shippingOwnersData.push($scope.shippingOwnersLists[i]);
            }
            console.log($scope.shippingOwnersData);
        }).error(function (error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to login again.');
                $location.path('/login');
            }
        });
    }

    $scope.listOfShippingCarriers = function () {
        $scope.shippingCarriersData = [];
        var shippingCarriersUrl = baseUrl + "/omsservices/webapi/carrierservices";
        $http.get(shippingCarriersUrl).success(function (data) {
            $scope.shippingCarriersLists = data;
            for (var i = 0; i < $scope.shippingCarriersLists.length; i++) {
                $scope.shippingCarriersData.push($scope.shippingCarriersLists[i]);
            }
            console.log($scope.shippingCarriersData);
        }).error(function (error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to login again.');
                $location.path('/login');
            }
        });
    };

    $scope.sendShipOwner = function (shipOwner) {
        console.log(shipOwner);
        var shipOwners;
        if (typeof shipOwner == 'string') {
            shipOwners = JSON.parse(shipOwner);
        } else {
            shipOwners = shipOwner
        }

        $scope.shipOwnerId = shipOwners.idtableShippingOwnershipId;
        console.log($scope.shipOwnerId);
    }

    $scope.getVendorId = function (vendorData) {
        console.log(vendorData);
        var vendor;
        if (typeof vendorData == 'string') {
            vendor = JSON.parse(vendorData);

        } else {
            vendor = vendorData;

        }
        console.log(vendor);
        $scope.vendorId = vendor.idtableVendorId;
        var vendorAddress = baseUrl + "/omsservices/webapi/vendors/" + $scope.vendorId + "/address";
        $http({
            method: 'GET',
            url: vendorAddress
        }).success(function (data) {
            console.log(data);
            $scope.deliveryAddressArray = [];
            $scope.vendoraddresses = data; // get data from json
            angular.forEach($scope.vendoraddresses, function (item) {
                $scope.deliveryAddressArray.push(item.tableAddress);
            });
            //$scope.$apply();
        }).error(function (data) {
            console.log(data);
        });
        console.log($scope.vendorId);
    };
    //getting price of Product
    //$scope.getPriceOfProduct = function(skuId, vendorId,quantity) {
    //	console.log(skuId);
    //	console.log(vendorId);
    //	console.log(quantity);
    //	var skuId = JSON.parse(skuId);
    //	var vendorId = JSON.parse(vendorId);
    //	var quantity = quantity;
    //    $http({
    //        method: 'GET',
    //        url: baseUrl + '/omsservices/webapi/vendors/vendorsystemskumap/sku/' + skuId +'/vendor/' + vendorId + '/skuquantity/' + quantity +'/price',
    //        headers: {
    //            'Content-Type': 'application/json'
    //        }
    //    }).success(function(res) {
    //        console.log(res);
    //        $scope.singleorderData.priceProd = res;
    //        if(res=='')
    //        {
    //        	$scope.singleorderData.priceProd = 0;
    //        }
    //    }).error(function(error, status) {
    //        $scope.singleorderData.priceProd = 0;
    //        console.log(status);
    //        if (status == 401) {
    //            $('#AuthError').modal('show');
    //            $location.path('/login');
    //        }
    //    });
    //}

    $scope.singleorderData = {};
    var producted = [];
    // adding the product in table one by one
    $scope.addProduct = function (tableSku, tablePurchaseOrderSkusSkuQuantity, id, price) {


        if (tablePurchaseOrderSkusSkuQuantity == undefined) {

            growl.error("Please give proper quantity.");
        }
        if (price >= 0 && tablePurchaseOrderSkusSkuQuantity > 0) {
            var tableSku = tableSku.originalObject;
            producted.push({
                tableSku: tableSku,
                tableStockXferOrderSkusSkuQuantity: tablePurchaseOrderSkusSkuQuantity,
                "tableStockXferOrderSkusChargeses": [],
                "tableStockXferOrderSkuStateTrails": []
            });
            $scope.products = _.uniq(producted, tableSku.idtableSkuId);

            console.log($scope.products);
            //console.log(memmory);
            var id = 'products'
            if (id) {
                $scope.$broadcast('angucomplete:clearInput', id);
                tableSku = null;
                tablePurchaseOrderSkusSkuQuantity = null;
                $scope.singleorderData.productObj = null;
                $scope.singleorderData.quantityNo = null;
                $scope.singleorderData.priceProd = null;
            } else {
                $scope.$broadcast('angucomplete:clearInput');
            }
            //$scope.listOfStatesCount($scope.defaultTab, 1, 'clearAction');
            $scope.singleorderData.productObject = undefined;
        }
    };

    $scope.WareHouseCheck = function(){
    if($scope.singleorderData.TowareHousesData == $scope.singleorderData.FromwareHousesData){
        $scope.WareHouseMatch = true;
    }else{
        $scope.WareHouseMatch = false;
    }
    };

    $scope.HideError = function(){
        $scope.WareHouseMatch = false;
    };
    //remove the product
    $scope.removeProduct = function (index) {
        $scope.products.splice(index, 1);
    };

    $scope.purchaseOrderData = {};

    $scope.saveSingleOrder = function () {

        console.log($scope.singleorderData);
        console.log(JSON.parse($scope.singleorderData.FromwareHousesData));
        console.log(JSON.parse($scope.singleorderData.TowareHousesData));
        console.log($scope.singleorderData.orderNo);
        console.log(JSON.parse($scope.singleorderData.shipOwner));
        console.log(JSON.parse($scope.singleorderData.shipService));
        console.log($scope.products);
//Test Abhinit
        if ($scope.singleorderData.shipService == undefined) {
            $scope.singleorderData.shipService = null;
        }
        console.log(JSON.parse($scope.singleorderData.shipOwner));
        //console.log(JSON.parse($scope.pickupAddressName))
        //var locateAddress = JSON.parse($scope.pickupAddressName);
        //console.log(locateAddress);
        console.log($scope.singleorderData.tableWorkOrderScheduledStartDatetime);
        console.log($scope.singleorderData.tableWorkOrderScheduledEndDatetime);
        // if ($scope.addOrderForm.orderNumberId.$invalid) {
        //     $scope.orderNumberEntered = true;
        //     growl.error("Please enter an Order Number!");
        // } else if ($scope.addOrderForm.channelObject.$invalid) {
        //     $scope.salesChannelSelected = true;
        //     growl.error("Please choose a sales channel!");
        // } else if ($scope.addOrderForm.pickupAddressName.$invalid) {
        //     $scope.deliveryAddressSelected = true;
        //     growl.error("Please choose a delivery address!");
        // } else {

        if ($scope.products.length == 0) {
            growl.error('you need to add product and its quantity also')
        } else {
            var StoPost = {
                "tableFbaOutboundShippingSpeedCategory": null,
                "tableShippingCarrierServices": JSON.parse($scope.singleorderData.shipService),
                "tableShippingOwnership": JSON.parse($scope.singleorderData.shipOwner),
                "tableWarehouseDetailsByTableStockXferOrderFromLocation": JSON.parse($scope.singleorderData.FromwareHousesData),
                "tableWarehouseDetailsByTableStockXferOrderToLocation": JSON.parse($scope.singleorderData.TowareHousesData),
                "tableStockXferOrderClientOrderNo": $scope.singleorderData.orderNo,
                "tableStockXferOrderDate": null,
                "tableStockXferOrderRemarks": $scope.singleorderData.Remarks,
                "tableStockXferOrderShippingCharges": 2000,
                "tableStockXferOrderShippingTax": 200,
                "tableStockXferOrderType": 1,
                "tableStockXferOrderHasParent": null,
                "tableStockXferOrderHasChildren": null,
                "tableStockXferOrderPickupDatetime": [
                    2016,
                    12,
                    7,
                    0,
                    0,
                    0,
                    0
                ],
                "tableStockXferOrderDropDatetime": [
                    2016,
                    12,
                    10,
                    0,
                    0,
                    0,
                    0
                ],
                "tableStockXferOrderTags": [],
                "tableStockXferOrderSkuses": $scope.products,

                "tableStockXferOrder": null,
                "tableStockXferOrders": []
            };

            console.log(StoPost);
            $http({
                method: 'POST',
                url: baseUrl + '/omsservices/webapi/stock/transfer',
                data: StoPost,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function (res) {
                console.log(res);
                //$scope.callOrderListed();
                if (res) {
                    $scope.singleOrderMsg = 'Submitted successfully';
                    $scope.orderNo = '';
                    $scope.product = '';
                    $scope.pickupAddressName = null;
                    $scope.customer = '';
                    $scope.popupChannel = '';
                    $scope.payment = '';
                    //$scope.singleorderData = null;
                    postData = null;
                    $scope.products = [];
                    //$scope.getPoData();
                    $scope.listOfStatesCount($scope.defaultTab);
                    growl.success("Order Added Successfully");
                    $('#addOrderModal').modal('hide');
                    console.log($scope.products);
                    // $scope.cancelSingleOrder();
                }
            }).error(function (error, status) {
                console.log(error);
                console.log(status);
                if (status == 401) {
                    //$('#AuthError').modal('show');
                    growl.error('Your session has been expired. You need to login again.');
                    $location.path('/login');
                }
                growl.error("Order Cant be Added");
            });
        }

        // }
    };

    $scope.submitAction = function (saleChannelId, skuId, startDate, endDate, customerid) {
        //console.log(saleChannelId);
        if (saleChannelId != undefined && saleChannelId != '') {
            var wareID = JSON.parse(saleChannelId);
        }
        console.log(skuId);
        console.log(startDate);
        console.log(endDate);
        console.log(customerid);
        if (wareID != undefined) {
            $scope.channel = wareID.idtableWarehouseDetailsId;
        }
        if (saleChannelId == '') {
            $scope.channel = null;
        }
        if (skuId != undefined) {
            $scope.skuId = skuId;
        }
        if (startDate != undefined) {
            $scope.startDate = dateFormat(new Date(startDate), 'yyyy-mm-dd');
        }
        if (endDate != undefined) {
            $scope.endDate = dateFormat(new Date(endDate), 'yyyy-mm-dd');
        }
        if (customerid != undefined) {
            $scope.customerid = customerid;
        }
        // $scope.listOfOrders($scope.defaultTab, 0);
        $scope.listOfStatesCount($scope.defaultTab, 1);
        //$scope.callOrderListed();
    }

    $scope.clearAction = function (saleChannelId, skuId, startDate, endDate, customerid) {
        // $scope.listOfOrders($scope.defaultTab, 0);
        $scope.wareHouseId = null;
        $scope.channel = "";
        $scope.skuId = "";
        $scope.customerid = "";
        $scope.saleChannelId = undefined;
        $scope.startDate = "";
        $scope.endDate = "";
        $scope.start1Date = undefined;
        $scope.end1Date = undefined;
        var productId = 'products1_value';
        var customerId = 'customersMain';
        if (productId) {
            $scope.$broadcast('angucomplete-alt:clearInput', productId);
        }
        if (customerId) {
            $scope.$broadcast('angucomplete-alt:clearInput', customerId);
        }

        $scope.listOfStatesCount($scope.defaultTab, 1, 'clearAction');
    };

    $scope.searchedProduct = function (selected) {
        if (selected != null) {
            $scope.skuId = selected.originalObject.idtableSkuId;
        }
    }

    $scope.searchedCustomer = function (selected) {
        if (selected != null) {
            $scope.customerid = selected.originalObject.idtableCustomerId;
        }
    }


    $scope.getPriceOfProduct = function (skuId, saleChannelId, quantity) {
        console.log($scope.singleorderData.FromwareHousesData);
        console.log(typeof  $scope.singleorderData.FromwareHousesData);

        var wareHouseId = JSON.parse($scope.singleorderData.FromwareHousesData);
        ///omsservices/webapi/stock/transfer/inventory/sku/1/warehouse/1/count
        $http({
            method: 'GET',
            url: baseUrl + '/omsservices/webapi/stock/transfer/inventory/sku/' + skuId + '/warehouse/' + wareHouseId.idtableWarehouseDetailsId + '/count',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (res) {
            console.log(res);
            $scope.singleorderData.priceProd = res;

            if(res != $scope.singleorderData.quantityNo){
                $scope.BlockSkuAdd = true;
            }else{
                $scope.BlockSkuAdd = false;
            }

        }).error(function (error, status) {
            $scope.singleorderData.priceProd = 0;
            console.log(status);
            if (status == 401) {
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);

                $location.path('/login');
            }
        });
    };

    $scope.addShippingAddress = function (customerId, customerTypeId) {
        console.log(customerTypeId);
        console.log(customerId);

        var customersByIDUrl = baseUrl + "/omsservices/webapi/customers/" + customerId;
        $http.get(customersByIDUrl).success(function (data) {
            $scope.customerId = data.idtableCustomerId;
            $scope.customerTypeId = customerTypeId;
            $scope.contactPersonName = data.tableCustomerFirstName + " " + data.tableCustomerLastName;
            $scope.contactEmail = data.tableCustomerEmail;
            $scope.contactPhone = data.tableCustomerPhone;
        }).error(function (error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);

                $location.path('/login');
            }
        });
        $('#orderShippingAddressModal').modal('show');
    };
    $scope.ReOrdered = function () {
        console.log($scope.singleorderData);
        console.log($scope.products);
        console.log($scope.singleorderData.shipOwner);
        console.log($scope.pickupAddressName);
        var locateAddress = $scope.pickupAddressName;
        console.log(locateAddress);
        console.log($scope.singleorderData.payment);
        console.log($scope.singleorderData.tableWorkOrderScheduledStartDatetime);
        console.log($scope.singleorderData.tableWorkOrderScheduledEndDatetime);
        var postData = {
            "tablePurchaseOrderClientOrderNo": $scope.singleorderData.orderNo,
            "tablePurchaseOrderRemarks": "testing",
            "tablePurchaseOrderShippingCharges": 120000,
            "tablePurchaseOrderShippingTax": 1200,
            "tablePurchaseOrderHasParent": null,
            "tablePurchaseOrderHasChildren": null,
            "tablePurchaseOrderPickupDate": $scope.singleorderData.tableWorkOrderScheduledStartDatetime,
            "tablePurchaseOrderDropDate": $scope.singleorderData.tableWorkOrderScheduledEndDatetime,
            "tablePurchaseOrderSkuses": $scope.products,
            "tablePurchaseOrderTags": [],
            "tableAddressByTablePurchaseOrderVendorPickupAddress": $scope.pickupAddressName,
            "tableCurrencyCode": {
                "idtableCurrencyCodeId": 1,
                "tableCurrencyCodeShortname": "INR",
                "tableCurrencyCodeLongname": "Indian Rupee"
            },
            "tablePurchaseOrderPaymentType": $scope.singleorderData.payment,
            "tableShippingCarrierServices": $scope.singleorderData.shipService,
            "tableShippingOwnership": $scope.singleorderData.shipOwner,
            "tableVendor": $scope.singleorderData.vendorData,
            "tableWarehouseDetails": $scope.singleorderData.wareHouses
        }
        console.log(postData);
        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/purchase/order',
            data: postData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (res) {
            console.log(res);
            if (res) {
                $scope.singleOrderMsg = 'Submitted successfully';
                $scope.orderNo = '';
                $scope.product = '';
                $scope.pickupAddressName = null;
                $scope.customer = '';
                $scope.popupChannel = '';
                $scope.payment = '';
                // $scope.singleorderData = null;
                postData = null;
                $scope.products = [];
                //$scope.getPoData();
                // $scope.listOfStatesCount($scope.defaultTab, $scope.vmPager.currentPage);
                growl.success("Order Added Successfully");
                $('#addOrderModal').modal('hide');
                console.log($scope.products);
                // $scope.cancelSingleOrder();
            }
        }).error(function (error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
            growl.error("Order Cant be Added");
        });
    };


//    =============================== deleting values from modal ======================== //

    $scope.cancelSingleOrder = function () {
        $scope.singleorderData.wareHouses = null;
        $scope.singleorderData.vendorData = null;
        $scope.products = [];
        $scope.BlockSkuAdd=false;
        $scope.pickupAddressName = null;
        $scope.reorder = false;
        $scope.singleorderData.payment = null;
        $scope.singleorderData.shipOwner = null;
        $scope.singleorderData.shipService = null;
        $scope.singleorderData.tableWorkOrderScheduledStartDatetime = null;
        $scope.singleorderData.tableWorkOrderScheduledEndDatetime = null;
        $scope.stockModel.$setPristine();
        $scope.QuickGRN.$setPristine();

    };

    $scope.openEditAndReorderModal = function (order, screen) {
        console.log(order);
        //$scope.vendorId = order.tableVendor.idtableVendorId;
        var OutDate = order.tableStockXferOrderDropDatetime[0]+"-"+order.tableStockXferOrderDropDatetime[1]+"-"+order.tableStockXferOrderDropDatetime[2];
        var InDate = order.tableStockXferOrderPickupDatetime[0]+"-"+order.tableStockXferOrderPickupDatetime[1]+"-"+order.tableStockXferOrderPickupDatetime[2];
        var DropDate = OutDate.toString();
        var PickupDate = InDate.toString();
        console.log(DropDate);
        $scope.shipOwnerId = order.tableShippingOwnership.idtableShippingOwnershipId;
        $scope.singleorderData.Remarks = order.tableStockXferOrderRemarks;
        //$scope.singleorderData.vendorData = order.tableVendor;
        $scope.singleorderData.FromwareHousesData = order.tableWarehouseDetailsByTableStockXferOrderFromLocation;
        $scope.singleorderData.TowareHousesData = order.tableWarehouseDetailsByTableStockXferOrderToLocation;
        $scope.products = [];
        angular.forEach(order.tableStockXferOrderSkuses, function (data) {
            $scope.products.push(data);
        });
        //console.log(order.tableAddressByTablePurchaseOrderVendorPickupAddress.tableAddress1);
        //$scope.singleorderData.payment = order.tablePurchaseOrderPaymentType;
        $scope.singleorderData.shipOwner = order.tableShippingOwnership;
        $scope.singleorderData.shipService = order.tableShippingCarrierServices;
        $scope.singleorderData.tableWorkOrderScheduledStartDatetime = new Date(PickupDate);
        $scope.singleorderData.tableWorkOrderScheduledEndDatetime = new Date(DropDate);
        $scope.pickupAddressName = order.tableAddressByTablePurchaseOrderVendorPickupAddress;
        $('#addOrderModal').modal('show');
        //var vendorAddress = baseUrl + "/omsservices/webapi/vendors/" + $scope.vendorId + "/address";
        //$http({
        //    method: 'GET',
        //    url: vendorAddress
        //}).success(function (data) {
        //    $scope.deliveryAddressArray = [];
        //    $scope.vendoraddresses = data; // get data from json
        //    angular.forEach($scope.vendoraddresses, function (item) {
        //        $scope.deliveryAddressArray.push(item.tableAddress);
        //    });
        //
        //}).error(function (data) {
        //    console.log(data);
        //});
    };

    //    ==================================== edit po ================================= //
    $scope.EditOrder = function (order) {

        $scope.reorder = false;
        $scope.reEdit = true;
        $scope.orderSave = false;
        $scope.singleorderData.poID = order.idtablePurchaseOrderId;
        $scope.openEditAndReorderModal(order, "edit");

    };

    $scope.EditOrdered = function () {
        console.log($scope.singleorderData);
        var locateAddress = $scope.pickupAddressName;
        var payment, shipService, shipOwner, vendorData, warehouseData;
        if ($scope.singleorderData.orderNo == null) {
            growl.error('Order No. is required.')
        } else {
            if (typeof $scope.singleorderData.payment == 'string') {
                payment = JSON.parse($scope.singleorderData.payment);
                warehouseData = $scope.singleorderData.wareHouses;
                vendorData = $scope.singleorderData.vendorData;
                shipService = $scope.singleorderData.shipService;
                shipOwner = $scope.singleorderData.shipOwner;
            }
            if (typeof $scope.singleorderData.shipService == 'string') {
                shipService = JSON.parse($scope.singleorderData.shipService);
                payment = $scope.singleorderData.payment;
                warehouseData = $scope.singleorderData.wareHouses;
                vendorData = $scope.singleorderData.vendorData
                shipOwner = $scope.singleorderData.shipOwner;
            }
            if (typeof $scope.singleorderData.shipOwner == 'string') {
                shipOwner = JSON.parse($scope.singleorderData.shipOwner);
                payment = $scope.singleorderData.payment;
                warehouseData = $scope.singleorderData.wareHouses;
                vendorData = $scope.singleorderData.vendorData
                shipService = $scope.singleorderData.shipService;
            }
            if (typeof $scope.singleorderData.vendorData == 'string') {
                vendorData = JSON.parse($scope.singleorderData.vendorData);
                payment = $scope.singleorderData.payment;
                warehouseData = $scope.singleorderData.wareHouses;
                shipOwner = $scope.singleorderData.shipOwner;
                shipService = $scope.singleorderData.shipService;
            }
            if (typeof $scope.singleorderData.wareHousesData == 'string') {
                warehouseData = JSON.parse($scope.singleorderData.wareHousesData);
                vendorData = $scope.singleorderData.vendorData
                shipOwner = $scope.singleorderData.shipOwner;
                shipService = $scope.singleorderData.shipService;
                payment = $scope.singleorderData.payment;
            }

            var postData = {
                "tablePurchaseOrderClientOrderNo": $scope.singleorderData.orderNo,
                "tablePurchaseOrderRemarks": "testing",
                "tablePurchaseOrderShippingCharges": 120000,
                "tablePurchaseOrderShippingTax": 1200,
                "tablePurchaseOrderHasParent": null,
                "tablePurchaseOrderHasChildren": null,
                "tablePurchaseOrderPickupDate": $scope.singleorderData.tableWorkOrderScheduledStartDatetime,
                "tablePurchaseOrderDropDate": $scope.singleorderData.tableWorkOrderScheduledEndDatetime,
                "tablePurchaseOrderSkuses": $scope.products,
                "tablePurchaseOrderTags": [],
                "tableAddressByTablePurchaseOrderVendorPickupAddress": $scope.pickupAddressName,
                "tableCurrencyCode": {
                    "idtableCurrencyCodeId": 1,
                    "tableCurrencyCodeShortname": "INR",
                    "tableCurrencyCodeLongname": "Indian Rupee"
                },
                "tablePurchaseOrderPaymentType": payment,
                "tableShippingCarrierServices": shipService,
                "tableShippingOwnership": shipOwner,
                "tableVendor": vendorData,
                "tableWarehouseDetails": warehouseData
            };
            console.log(postData);
            $http({
                method: 'PUT',
                url: baseUrl + '/omsservices/webapi/purchase/order/' + $scope.singleorderData.poID + '/update',
                data: postData,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function (res) {
                console.log(res);
                if (res) {
                    $scope.singleOrderMsg = 'Submitted successfully';
                    $scope.orderNo = '';
                    $scope.product = '';
                    $scope.deliveryAddressName = '';
                    $scope.customer = '';
                    $scope.popupChannel = '';
                    $scope.payment = '';
                    $scope.singleorderData = null;
                    postData = null;
                    $scope.products = [];
                    //$scope.getPoData();
                    $scope.listOfStatesCount($scope.defaultTab, $scope.vmPager.currentPage);
                    growl.success("Order Added Successfully");
                    $('#addOrderModal').modal('hide');
                    console.log($scope.products);
                    $window.location.reload();
                    // $scope.cancelSingleOrder();
                }
            }).error(function (error, status) {
                console.log(error);
                console.log(status);
                if (status == 401) {
                    //$('#AuthError').modal('show');
                    $location.path('/login');
                }
                growl.error("Order Cant be Added");
            });
        }


    };


//    ------============================ reorder --------------------------==============//
    $scope.reOrder = function (order) {
        $scope.reorder = true;
        $scope.reEdit = false;
        $scope.orderSave = false;
        $scope.openEditAndReorderModal(order, "reorder");
        //$scope.sendShipOwner(order.tableShippingOwnership);
        // $scope.getVendorId(order.tableVendor);

        //$('#addOrderModal').on('shown.bs.modal', function() {
        //	$scope.reorder = true;
        // console.log(order);

        //$scope.singleorderData.orderNo = order.tablePurchaseOrderClientOrderNo;
        //  $scope.singleorderData.vendorData = order.tableVendor;
        // $scope.singleorderData.wareHouses = order.tableWarehouseDetails;
        //$scope.products = [];
        // angular.forEach(order.tablePurchaseOrderSkuses,function(data){
        //     $scope.products.push(data);
        //  });
        //  console.log(order.tableAddressByTablePurchaseOrderVendorPickupAddress.tableAddress1);
        //  $scope.singleorderData.payment = order.tablePurchaseOrderPaymentType;
        //  $scope.singleorderData.shipOwner = order.tableShippingOwnership;
        //  $scope.singleorderData.shipService = order.tableShippingCarrierServices;
        //  $scope.singleorderData.tableWorkOrderScheduledStartDatetime = new Date(order.tablePurchaseOrderPickupDate);
        //  $scope.singleorderData.tableWorkOrderScheduledEndDatetime = new Date(order.tablePurchaseOrderDropDate);
        //	$scope.pickupAddressName = order.tableAddressByTablePurchaseOrderVendorPickupAddress;
//});

        //  $('#addOrderModal').modal('show');


    };


    $scope.dayDataCollapseFn = function () {
        $scope.dayDataCollapse = [];
        console.log($scope.orderLists);
        for (var i = 0; i < $scope.orderLists.length; i += 1) {
            $scope.dayDataCollapse.push(false);
            console.log(dayDatacollapse);
        }
    }
    //console.log($scope.orderLists);
//    ================================== table row expnsion ================================= //

    $scope.selectTableRow = function (index, storeId) {

        console.log(index);
        console.log(storeId);
        if (typeof $scope.dayDataCollapse === 'undefined') {
            $scope.dayDataCollapseFn();
        }

        if ($scope.tableRowExpanded === false && $scope.tableRowIndexExpandedCurr === "" && $scope.storeIdExpanded === "") {
            $scope.tableRowIndexExpandedPrev = "";
            $scope.tableRowExpanded = true;
            $scope.tableRowIndexExpandedCurr = index;
            $scope.storeIdExpanded = storeId;
            $scope.dayDataCollapse[index] = true;
        } else if ($scope.tableRowExpanded === true) {
            if ($scope.tableRowIndexExpandedCurr === index && $scope.storeIdExpanded === storeId) {
                $scope.tableRowExpanded = false;
                $scope.tableRowIndexExpandedCurr = "";
                $scope.storeIdExpanded = "";
                $scope.dayDataCollapse[index] = false;
            } else {
                $scope.tableRowIndexExpandedPrev = $scope.tableRowIndexExpandedCurr;
                $scope.tableRowIndexExpandedCurr = index;
                $scope.storeIdExpanded = storeId;
                $scope.dayDataCollapse[$scope.tableRowIndexExpandedPrev] = false;
                $scope.dayDataCollapse[$scope.tableRowIndexExpandedCurr] = true;
            }
        }

    };

    $scope.stateTrials = function (saleordskus) {
        console.log(saleordskus);
        console.log(saleordskus.length);
        $scope.trialsDataArray = [];
        $scope.trialIdArray = [];
        $scope.trialsLength = [];
        $scope.fullTrialsArray = [];
        $scope.fullIdArray = [];
        $scope.StateArray = [];
        for (var i = 0; i < saleordskus.length; i++) {
            console.log(i);
            console.log(saleordskus[i]);
            $scope.StateArray.push(saleordskus[i].tableStockXferOrderSkuStateType.tableStockXferOrderSkuStateTypeString);
            console.log($scope.StateArray);
            console.log(saleordskus[i]);
            var trials = saleordskus[i].tableStockXferOrderSkuStateTrails;
            $scope.trialsLength.push(trials.length);
            console.log(trials);
            console.log($scope.trialsLength);
            if (trials.length < 4) {
                for (var j = 0; j < trials.length; j++) {
                    console.log(trials[j].tableStockXferOrderSkuStateType.tableStockXferOrderSkuStateTypeString);
                    $scope.trialsDataArray.push(trials[j].tableStockXferOrderSkuStateType.tableStockXferOrderSkuStateTypeString);
                    $scope.trialIdArray.push(trials[j].tableStockXferOrderSkuStateType.idtableStockXferOrderSkuStateTypeId);
                }
            }

            if (trials.length == 4) {
                for (var j = 0; j < trials.length; j++) {
                    console.log(trials[j].tableStockXferOrderSkuStateType.tableStockXferOrderSkuStateTypeString);
                    $scope.trialsDataArray.push(trials[j].tableStockXferOrderSkuStateType.tableStockXferOrderSkuStateTypeString);
                    $scope.trialIdArray.push(trials[j].tableStockXferOrderSkuStateType.idtableStockXferOrderSkuStateTypeId);
                }
            }

            if (trials.length > 4) {
                console.log(trials.length - 4);
                var totalLength = trials.length - 4;
                for (var j = totalLength; j < trials.length; j++) {
                    console.log(trials[j].tableStockXferOrderSkuStateType.tableStockXferOrderSkuStateTypeString);
                    $scope.trialsDataArray.push(trials[j].tableStockXferOrderSkuStateType.tableStockXferOrderSkuStateTypeString);
                    $scope.trialIdArray.push(trials[j].tableStockXferOrderSkuStateType.idtableStockXferOrderSkuStateTypeId);
                }
            }


            $scope.fullTrialsArray.push($scope.trialsDataArray);
            $scope.fullIdArray.push($scope.trialIdArray);

            $scope.trialsDataArray = [];
            $scope.trialIdArray = [];

            //console.log($scope.fullTrialsArray);
        }
    }


    $scope.openInfoBox = function (ev, stateTrials) {
        console.log(stateTrials);
        $scope.steps = [];
        console.log(stateTrials);
        for (var i = 0; i < stateTrials.length; i++) {
            var a = stateTrials.length - 1;
            var fulldate = stateTrials[i].tableStockXferOrderSkuStateTrailTimestamp[2] + "/" + stateTrials[i].tableStockXferOrderSkuStateTrailTimestamp[1] + "/" + stateTrials[i].tableStockXferOrderSkuStateTrailTimestamp[0];
            if (i < a) {
                $scope.steps.push({
                    title: stateTrials[i].tableStockXferOrderSkuStateType.tableStockXferOrderSkuStateTypeString,
                    active: true,
                    orderState: "Successful",
                    remarks: stateTrials[i].tableStockXferOrderSkuStateTrailRemarks,
                    fulldate: fulldate
                });
            }
            if (i == a) {
                $scope.steps.push({
                    title: stateTrials[i].tableStockXferOrderSkuStateType.tableStockXferOrderSkuStateTypeString,
                    orderState: "In Process",
                    remarks: stateTrials[i].tableStockXferOrderSkuStateTrailRemarks,
                    fulldate: fulldate
                });
            }
        }
        console.log($scope.steps);
        $mdDialog.show({
            templateUrl: 'infoDialoged.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            scope: $scope.$new()
        })
            .then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
    }


    $scope.cancelInfoBox = function () {
        $mdDialog.hide();
    };


    $scope.cancelSaleOrderBox = function (ev, orderId, tableSaleOrderId, orderNo) {
        $scope.orderId = orderId;
        $scope.tableSaleOrderId = tableSaleOrderId;
        $scope.orderNo = orderNo;
        $scope.loadCancelReasons();
        $mdDialog.show({
            templateUrl: 'dialog33.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            scope: $scope.$new()
        })
            .then(function (answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function () {
                $scope.status = 'You cancelled the dialog.';
            });
    }

    $scope.loadCancelReasons = function () {
        var cancelReasonsUrl = baseUrl + '/omsservices/webapi/stockxfercancelreasons';
        $http.get(cancelReasonsUrl).success(function (data) {
            console.log(data);
            $scope.cancelReasonArray = data;
            //$scope.getPoData();
            console.log($scope.cancelReasonArray);
        }).error(function (error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);
                $location.path('/login');
            }
        });
    };


    $scope.selectCancelAction = function (orderId, tableSaleOrderId, remarks) {
        console.log(orderId);
        console.log(tableSaleOrderId);
        console.log(remarks);
        if (remarks == undefined) {
            growl.error("Order Cannot Be Cancelled");
        }
        if (remarks != undefined) {
            var cancelUrl = baseUrl + '/omsservices/webapi/purchase/order/' + orderId + '/orderskus/' + tableSaleOrderId + '/cancel/?remarks=' + remarks;
            $http.put(cancelUrl).success(function (data) {
                console.log(data);
                $mdDialog.hide();
                if (data) {
                    growl.success("Order Cancelled Successfully");
                    // $scope.listOfOrders($scope.defaultTab, 0);
                    $scope.listOfStatesCount($scope.defaultTab);
                    for (var i = 0; i < $scope.orderLists.length; i += 1) {
                        $scope.dayDataCollapse[i] = false;
                    }
                }
            }).error(function (error, status) {
                console.log(error);
                console.log(status);
                if (status == 401) {
                    growl.error('Your session has been expired. You need to login again.');
                    //$('#AuthError').modal('show');
                    $cookies.put('isLoggedIn', false);

                    $location.path('/login');
                }
                growl.error("Order Cannot Be Cancelled");
            });
        }
    };


    $scope.totalCostAmount = function (allSkus) {
        //console.log(allSkus);
        var total = 0;
        var totalCost = 0;
        var totalCostAmount = 0;
        var totalCostAll = [];
        for (var i = 0; i < allSkus.length; i++) {
            //console.log(allSkus[i]);
            for (var j = 0; j < allSkus[i].tablePurchaseOrderSkusChargeses.length; j++) {
                var product = allSkus[i].tablePurchaseOrderSkusChargeses[j].tablePurchaseOrderSkusChargesValue;
                total += product;
            }
            totalCostAmount += total * allSkus[i].tablePurchaseOrderSkusSkuQuantity;
            totalCostAll.push(totalCostAmount);
            total = 0;
        }
        return totalCostAmount;
    };

//=============================================== Searching po ========================== //

    $scope.listOfStatesCount = function (tabsValue, page, action) {
        console.log(tabsValue);
        console.log(page);
        console.log($scope.channel);
        if ($scope.channel != undefined && $scope.channel != null && $scope.channel != '') {
            $scope.channels = JSON.parse($scope.channel);
        }
        console.log($scope.skuId);
        console.log($scope.customerid);
        console.log($scope.startDate);
        console.log($scope.endDate)

        $scope.defaultTab = tabsValue;
        $scope.allCount = 0;
        $scope.newCount = 0;
        $scope.processCount = 0;
        $scope.holdCount = 0;
        $scope.returnCount = 0;
        $scope.cancelledCount = 0;
        $scope.shippingCount = 0;
        $scope.returnCount = 0;
        $scope.deliveredCount = 0;

        var newCountUrl = baseUrl + "/omsservices/webapi/stock/transfer/filtercount?state=new";
        var processCountUrl = baseUrl + "/omsservices/webapi/stock/transfer/filtercount?state=process";
        var holdCountUrl = baseUrl + "/omsservices/webapi/stock/transfer/filtercount?state=intransit";
        var returnCountUrl = baseUrl + "/omsservices/webapi/stock/transfer/filtercount?state=grn";
        var cancelledCountUrl = baseUrl + "/omsservices/webapi/stock/transfer/filtercount?state=cancelled";
        var draftCountUrl = baseUrl + "/omsservices/webapi/stock/transfer/filtercount?state=draft";
        //var deliveredCountUrl = baseUrl + "/omsservices/webapi/orders/filtercount?state=delivered";
        var allCountUrl = baseUrl + "/omsservices/webapi/stock/transfer/filtercount?";

        if ($scope.channel != undefined || $scope.channel != null) {
            //newCountUrl += "&warehouseid=0";
            //processCountUrl += "&warehouseid=0";
            //holdCountUrl += "&warehouseid=0";
            //returnCountUrl += "&warehouseid=0";
            //cancelledCountUrl += "&warehouseid=0";
            ////shippingCountUrl += "&warehouseid=0";
            ////deliveredCountUrl += "&warehouseid=0";
            //allCountUrl += "warehouseid=0";

            newCountUrl += "&warehouseid=" + $scope.channels;
            processCountUrl += "&warehouseid=" + $scope.channels;
            holdCountUrl += "&warehouseid=" + $scope.channels;
            returnCountUrl += "&warehouseid=" + $scope.channels;
            cancelledCountUrl += "&warehouseid=" + $scope.channels;
            allCountUrl += "warehouseid=" + $scope.channels;
        } //else {
        //    newCountUrl += "&warehouseid=" + $scope.channels;
        //    processCountUrl += "&warehouseid=" + $scope.channels;
        //    holdCountUrl += "&warehouseid=" + $scope.channels;
        //    returnCountUrl += "&warehouseid=" + $scope.channels;
        //    cancelledCountUrl += "&warehouseid=" + $scope.channels;
        //    allCountUrl += "warehouseid=" + $scope.channels;
        //    //shippingCountUrl += "&warehouseid=" + $scope.channels;
        //    //deliveredCountUrl += "&warehouseid=" + $scope.channels;
        //}
        if ($scope.skuId) {
            newCountUrl += "&skuid=" + $scope.skuId;
            processCountUrl += "&skuid=" + $scope.skuId;
            holdCountUrl += "&skuid=" + $scope.skuId;
            returnCountUrl += "&skuid=" + $scope.skuId;
            cancelledCountUrl += "&skuid=" + $scope.skuId;
            allCountUrl += "&skuid=" + $scope.skuId;
            shippingCountUrl += "&skuid=" + $scope.skuId;
            //deliveredCountUrl += "&skuid=" + $scope.skuId;
        }
        if ($scope.customerid) {
            newCountUrl += "&vendorid=" + $scope.customerid;
            processCountUrl += "&vendorid=" + $scope.customerid;
            holdCountUrl += "&vendorid=" + $scope.customerid;
            returnCountUrl += "&vendorid=" + $scope.customerid;
            cancelledCountUrl += "&vendorid=" + $scope.customerid;
            allCountUrl += "&vendorid=" + $scope.customerid;
            shippingCountUrl += "&vendorid=" + $scope.customerid;
            //deliveredCountUrl += "&vendorid=" + $scope.customerid;
        }
        if ($scope.startDate) {
            newCountUrl += "&startdate=" + $scope.startDate;
            processCountUrl += "&startdate=" + $scope.startDate;
            holdCountUrl += "&startdate=" + $scope.startDate;
            returnCountUrl += "&startdate=" + $scope.startDate;
            cancelledCountUrl += "&startdate=" + $scope.startDate;
            allCountUrl += "&startdate=" + $scope.startDate;
            shippingCountUrl += "&startDate=" + $scope.startDate;
            //deliveredCountUrl += "&startDate=" + $scope.startDate;
        }
        if ($scope.endDate) {
            newCountUrl += "&enddate=" + $scope.endDate;
            processCountUrl += "&enddate=" + $scope.endDate;
            holdCountUrl += "&enddate=" + $scope.endDate;
            returnCountUrl += "&enddate=" + $scope.endDate;
            cancelledCountUrl += "&enddate=" + $scope.endDate;
            allCountUrl += "&enddate=" + $scope.endDate;
            shippingCountUrl += "&endDate=" + $scope.endDate;
            //deliveredCountUrl += "&endDate=" + $scope.endDate;
        }

        console.log("NEW COUNT URL");
        console.log(newCountUrl);
        console.log("PROCESS COUNT URL");
        console.log(processCountUrl);
        console.log("HOLD COUNT URL");
        console.log(holdCountUrl);
        console.log("RETURN COUNT URL");
        console.log(returnCountUrl);
        console.log("CSNCELLED COUNT URL");
        console.log(cancelledCountUrl);
        console.log("SHIPPING COUNT URL");
        console.log(draftCountUrl);
        console.log("DELIVERED COUNT URL");
        //console.log(deliveredCountUrl);
        console.log("ALL COUNT URL");
        console.log(allCountUrl);

        $http.get(allCountUrl).success(function (data) {
            if (data != null) {
                $scope.allCount = data;
                //$scope.callOrderListed();
                if (tabsValue == 'all') {
                    var vm = this;

                    vm.dummyItems = _.range(0, $scope.allCount); // dummy array of items to be paged
                    vm.pager = {};
                    vm.setPage = setPage;

                    if (page == undefined) {
                        initController();

                        function initController() {
                            // initialize to page 1
                            vm.setPage(1);
                        }
                    }

                    if (page != undefined) {
                        vm.setPage(page);

                    }

                    function setPage(page) {
                        if (page < 1 || page > vm.pager.totalPages) {
                            return;
                        }


                        vm.pager = PagerService.GetPager(vm.dummyItems.length, page);
                        console.log(vm.pager);
                        $scope.vmPager = vm.pager;

                        $scope.start = (vm.pager.currentPage - 1) * 5;
                        $scope.orderSize = $scope.start + 5;
                        //$scope.start = 0;
                        //$scope.channel = $scope.channel;
                        //$scope.skuId = $scope.skuId;
                        //$scope.customerid = $scope.customerid;
                        //$scope.stateDate = $scope.stateDate;
                        //$scope.endDate = $scope.endDate;
                        //console.log($scope.start);
                        //console.log($scope.orderSize);
                        // get current page of items
                        vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                        $scope.vmItems = vm.items;

                        if (action == 'clearAction') {
                            $scope.listOfOrders(tabsValue, $scope.start, 'clearAction');
                        } else {
                            $scope.listOfOrders(tabsValue, $scope.start);
                        }
                    }
                }
            }

        });

        $http.get(newCountUrl).success(function (data) {
            //$cookies.remove('Dashdata');
            if (data != null) {
                //$scope.callOrderListed();
                $scope.newCount = data;
                if (tabsValue == 'new') {
                    var vm = this;

                    vm.dummyItems = _.range(0, $scope.newCount); // dummy array of items to be paged
                    vm.pager = {};
                    vm.setPage = setPage;

                    if (page == undefined) {
                        initController();

                        function initController() {
                            // initialize to page 1
                            vm.setPage(1);
                        }
                    }

                    if (page != undefined) {
                        vm.setPage(page);

                    }

                    function setPage(page) {
                        if (page < 1 || page > vm.pager.totalPages) {
                            return;
                        }

                        // get pager object from service
                        vm.pager = PagerService.GetPager(vm.dummyItems.length, page);
                        console.log(vm.pager);
                        $scope.vmPager = vm.pager;
                        //
                        $scope.start = (vm.pager.currentPage - 1) * 5;
                        $scope.orderSize = $scope.start + 5;
                        console.log($scope.start);
                        console.log($scope.orderSize);
                        // get current page of items
                        vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                        $scope.vmItems = vm.items;
                        if (action == 'clearAction') {
                            $scope.listOfOrders(tabsValue, $scope.start, 'clearAction');
                        } else {
                            $scope.listOfOrders(tabsValue, $scope.start);
                        }
                    }
                }
            }
        });


        $http.get(processCountUrl).success(function (data) {
            //$cookies.remove('Dashdata');
            if (data != null) {
                $scope.processCount = data;
                if (tabsValue == 'inprocess') {
                    var vm = this;

                    vm.dummyItems = _.range(0, $scope.processCount); // dummy array of items to be paged
                    vm.pager = {};
                    vm.setPage = setPage;

                    if (page == undefined) {
                        initController();

                        function initController() {
                            // initialize to page 1
                            vm.setPage(1);
                        }
                    }

                    if (page != undefined) {
                        vm.setPage(page);

                    }

                    function setPage(page) {
                        if (page < 1 || page > vm.pager.totalPages) {
                            return;
                        }

                        // get pager object from service
                        vm.pager = PagerService.GetPager(vm.dummyItems.length, page);
                        console.log(vm.pager);
                        $scope.vmPager = vm.pager;

                        $scope.start = (vm.pager.currentPage - 1) * 5;
                        $scope.orderSize = $scope.start + 5;
                        console.log($scope.start);
                        console.log($scope.orderSize);
                        // get current page of items
                        vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                        $scope.vmItems = vm.items;
                        if (action == 'clearAction') {
                            $scope.listOfOrders(tabsValue, $scope.start, 'clearAction');
                        } else {
                            $scope.listOfOrders(tabsValue, $scope.start);
                        }
                    }
                }
            }
        });

        $http.get(holdCountUrl).success(function (data) {
            //$cookies.remove('Dashdata');
            if (data != null) {
                $scope.holdCount = data;
                if (tabsValue == 'intransit') {
                    var vm = this;

                    vm.dummyItems = _.range(0, $scope.holdCount); // dummy array of items to be paged
                    vm.pager = {};
                    vm.setPage = setPage;

                    if (page == undefined) {
                        initController();

                        function initController() {
                            // initialize to page 1
                            vm.setPage(1);
                        }
                    }

                    if (page != undefined) {
                        vm.setPage(page);

                    }

                    function setPage(page) {
                        if (page < 1 || page > vm.pager.totalPages) {
                            return;
                        }

                        // get pager object from service
                        vm.pager = PagerService.GetPager(vm.dummyItems.length, page);
                        console.log(vm.pager);
                        $scope.vmPager = vm.pager;

                        $scope.start = (vm.pager.currentPage - 1) * 5;
                        $scope.orderSize = $scope.start + 5;
                        console.log($scope.start);
                        console.log($scope.orderSize);
                        // get current page of items
                        //vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                        //$scope.vmItems = vm.items;
                        if (action == 'clearAction') {
                            $scope.listOfOrders(tabsValue, $scope.start, 'clearAction');
                        } else {
                            $scope.listOfOrders(tabsValue, $scope.start);
                        }
                    }
                }
            }
        });

        $http.get(returnCountUrl).success(function (data) {
            //$cookies.remove('Dashdata');
            $scope.returnCount = data;
            if (tabsValue == 'grn') {
                var vm = this;

                vm.dummyItems = _.range(0, $scope.returnCount); // dummy array of items to be paged
                vm.pager = {};
                vm.setPage = setPage;

                if (page == undefined) {
                    initController();

                    function initController() {
                        // initialize to page 1
                        vm.setPage(1);
                    }
                }

                if (page != undefined) {
                    vm.setPage(page);

                }

                function setPage(page) {
                    if (page < 1 || page > vm.pager.totalPages) {
                        return;
                    }

                    // get pager object from service
                    vm.pager = PagerService.GetPager(vm.dummyItems.length, page);
                    console.log(vm.pager);
                    $scope.vmPager = vm.pager;

                    $scope.start = (vm.pager.currentPage - 1) * 5;
                    $scope.orderSize = $scope.start + 5;
                    console.log($scope.start);
                    console.log($scope.orderSize);
                    // get current page of items
                    vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                    $scope.vmItems = vm.items;
                    if (action == 'clearAction') {
                        $scope.listOfOrders(tabsValue, $scope.start, 'clearAction');
                    } else {
                        $scope.listOfOrders(tabsValue, $scope.start);
                    }
                }
            }
        });

        $http.get(cancelledCountUrl).success(function (data) {
            //$cookies.remove('Dashdata');
            if (data != null) {
                $scope.cancelledCount = data;
                if (tabsValue == 'cancelled') {
                    var vm = this;

                    vm.dummyItems = _.range(0, $scope.cancelledCount); // dummy array of items to be paged
                    vm.pager = {};
                    vm.setPage = setPage;

                    if (page == undefined) {
                        initController();

                        function initController() {
                            // initialize to page 1
                            vm.setPage(1);
                        }
                    }

                    if (page != undefined) {
                        vm.setPage(page);

                    }

                    function setPage(page) {
                        if (page < 1 || page > vm.pager.totalPages) {
                            return;
                        }

                        // get pager object from service
                        vm.pager = PagerService.GetPager(vm.dummyItems.length, page);
                        console.log(vm.pager);
                        $scope.vmPager = vm.pager;

                        $scope.start = (vm.pager.currentPage - 1) * 5;
                        $scope.orderSize = $scope.start + 5;
                        console.log($scope.start);
                        console.log($scope.orderSize);
                        // get current page of items
                        vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                        $scope.vmItems = vm.items;
                        if (action == 'clearAction') {
                            $scope.listOfOrders(tabsValue, $scope.start, 'clearAction');
                        } else {
                            $scope.listOfOrders(tabsValue, $scope.start);
                        }
                    }
                }
            }
        });
        $http.get(draftCountUrl).success(function(data) {
            //$cookies.remove('Dashdata');
            if (data!=null) {
                $scope.DraftCount = data;
                if (tabsValue == 'draft') {
                    var vm = this;

                    vm.dummyItems = _.range(0, $scope.DraftCount); // dummy array of items to be paged
                    vm.pager = {};
                    vm.setPage = setPage;

                    if (page == undefined) {
                        initController();

                        function initController() {
                            // initialize to page 1
                            vm.setPage(1);
                        }
                    }

                    if (page != undefined) {
                        vm.setPage(page);

                    }

                    function setPage(page) {
                        if (page < 1 || page > vm.pager.totalPages) {
                            return;
                        }

                        // get pager object from service
                        vm.pager = PagerService.GetPager(vm.dummyItems.length, page);
                        console.log(vm.pager);
                        $scope.vmPager = vm.pager;

                        $scope.start = (vm.pager.currentPage - 1) * 5;
                        $scope.orderSize = $scope.start + 5;
                        console.log($scope.start);
                        console.log($scope.orderSize);
                        // get current page of items
                        vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                        $scope.vmItems = vm.items;
                        if (action == 'clearAction') {
                            $scope.listOfOrders(tabsValue, $scope.start, 'clearAction');
                        } else {
                            $scope.listOfOrders(tabsValue, $scope.start);
                        }
                    }
                }
            }
        });
        //$http.get(deliveredCountUrl).success(function(data) {
        //    //$cookies.remove('Dashdata');
        //    if (data!=null) {
        //        $scope.deliveredCount = data;
        //        if (tabsValue == 'delivered') {
        //            var vm = this;
        //
        //            vm.dummyItems = _.range(0, $scope.deliveredCount); // dummy array of items to be paged
        //            vm.pager = {};
        //            vm.setPage = setPage;
        //
        //            if (page == undefined) {
        //                initController();
        //
        //                function initController() {
        //                    // initialize to page 1
        //                    vm.setPage(1);
        //                }
        //            }
        //
        //            if (page != undefined) {
        //                vm.setPage(page);
        //
        //            }
        //
        //            function setPage(page) {
        //                if (page < 1 || page > vm.pager.totalPages) {
        //                    return;
        //                }
        //
        //                // get pager object from service
        //                vm.pager = PagerService.GetPager(vm.dummyItems.length, page);
        //                console.log(vm.pager);
        //                $scope.vmPager = vm.pager;
        //
        //                $scope.start = (vm.pager.currentPage - 1) * 5;
        //                $scope.orderSize = $scope.start + 5;
        //                console.log($scope.start);
        //                console.log($scope.orderSize);
        //                // get current page of items
        //                vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
        //                $scope.vmItems = vm.items;
        //                if (action == 'clearAction') {
        //                    $scope.listOfOrders(tabsValue, $scope.start, 'clearAction');
        //                } else {
        //                    $scope.listOfOrders(tabsValue, $scope.start);
        //                }
        //            }
        //        }
        //    }
        //});
    }
    $scope.transitData = {};
    $scope.intransitData = function (data) {
        console.log(data);
        $scope.transitData.orderID = data.idtablePurchaseOrderId;
    };

    $scope.Drafted = function(){
        console.log($scope.singleorderData);
        console.log(JSON.parse($scope.singleorderData.FromwareHousesData));
        console.log(JSON.parse($scope.singleorderData.TowareHousesData));
        console.log($scope.singleorderData.orderNo);
        console.log(JSON.parse($scope.singleorderData.shipOwner));
        console.log(JSON.parse($scope.singleorderData.shipService));
        console.log($scope.products);
//Test Abhinit
        if ($scope.singleorderData.shipService == undefined) {
            $scope.singleorderData.shipService = null;
        }
        console.log(JSON.parse($scope.singleorderData.shipOwner));
        //console.log(JSON.parse($scope.pickupAddressName))
        //var locateAddress = JSON.parse($scope.pickupAddressName);
        //console.log(locateAddress);
        console.log($scope.singleorderData.tableWorkOrderScheduledStartDatetime);
        console.log($scope.singleorderData.tableWorkOrderScheduledEndDatetime);
        // if ($scope.addOrderForm.orderNumberId.$invalid) {
        //     $scope.orderNumberEntered = true;
        //     growl.error("Please enter an Order Number!");
        // } else if ($scope.addOrderForm.channelObject.$invalid) {
        //     $scope.salesChannelSelected = true;
        //     growl.error("Please choose a sales channel!");
        // } else if ($scope.addOrderForm.pickupAddressName.$invalid) {
        //     $scope.deliveryAddressSelected = true;
        //     growl.error("Please choose a delivery address!");
        // } else {

        if ($scope.products.length == 0) {
            growl.error('you need to add product and its quantity also')
        } else {
            var StoPost = {
                "tableFbaOutboundShippingSpeedCategory": null,
                "tableShippingCarrierServices": JSON.parse($scope.singleorderData.shipService),
                "tableShippingOwnership": JSON.parse($scope.singleorderData.shipOwner),
                "tableWarehouseDetailsByTableStockXferOrderFromLocation": JSON.parse($scope.singleorderData.FromwareHousesData),
                "tableWarehouseDetailsByTableStockXferOrderToLocation": JSON.parse($scope.singleorderData.TowareHousesData),
                "tableStockXferOrderClientOrderNo": $scope.singleorderData.orderNo,
                "tableStockXferOrderDate": null,
                "tableStockXferOrderRemarks": $scope.singleorderData.Remarks,
                "tableStockXferOrderShippingCharges": 2000,
                "tableStockXferOrderShippingTax": 200,
                "tableStockXferOrderType": 1,
                "tableStockXferOrderHasParent": null,
                "tableStockXferOrderHasChildren": null,
                "tableStockXferOrderPickupDatetime": [
                    2016,
                    12,
                    7,
                    0,
                    0,
                    0,
                    0
                ],
                "tableStockXferOrderDropDatetime": [
                    2016,
                    12,
                    10,
                    0,
                    0,
                    0,
                    0
                ],
                "tableStockXferOrderTags": [],
                "tableStockXferOrderSkuses": $scope.products,

                "tableStockXferOrder": null,
                "tableStockXferOrders": []
            };
            console.log(StoPost);
            $http({
                method: 'POST',
                url: baseUrl + '/omsservices/webapi/stock/transfer/draft',
                data: StoPost,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function (res) {
                console.log(res);
                //$scope.callOrderListed();
                if (res) {
                    $scope.singleOrderMsg = 'Submitted successfully';
                    $scope.orderNo = '';
                    $scope.product = '';
                    $scope.pickupAddressName = null;
                    $scope.customer = '';
                    $scope.popupChannel = '';
                    $scope.payment = '';
                    //$scope.singleorderData = null;
                    postData = null;
                    $scope.products = [];
                    //$scope.getPoData();
                    $scope.listOfStatesCount($scope.defaultTab);
                    growl.success("Order Added Successfully");
                    $('#addOrderModal').modal('hide');
                    console.log($scope.products);
                    // $scope.cancelSingleOrder();
                }
            }).error(function (error, status) {
                console.log(error);
                console.log(status);
                if (status == 401) {
                    //$('#AuthError').modal('show');
                    growl.error('Your session has been expired. You need to login again.');
                    $location.path('/login');
                }
                growl.error("Order Cant be Added");
            });
        }
    };

    $scope.inTransit = function () {

        ///omsservices/webapi/purchase/order/1/orderskus/1/intransit
        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/purchase/order/' + $scope.transitData.orderID + '/intransit'
        }).success(function (data) {
            console.log(data);
            $('#intransit').modal('hide');
            $scope.listOfStatesCount($scope.defaultTabs);
        }).error(function (data) {
            console.log(data);
        });
    }


//    ============================================== ADd GRN ====================================== //

    $scope.SkuDetails = {};

    $scope.showGRN = function (file) {
        console.log(file);
        $scope.SkuDetails.GRnData = file;
        $scope.SkuDisabled = true;
        $scope.SkuDetails.ProductModel = file.tableSku.tableSkuDescription;
        $scope.SkuDetails.skuClientCode = file.tableSku.tableSkuClientSkuCode;
        $scope.SkuDetails.warehouseDetails = file.tableSkuInventory.tableWarehouseDetails.tableWarehouseDetailsShortname;
        if (file.tableSkuInventory.tableVendor.tableVendorName != null) {
            $scope.SkuDetails.vendorDetails = file.tableSkuInventory.tableVendor.tableVendorName;
        }
        if (file.tableSkuInventory.tableSkuInventoryMaxRetailPrice != null) {
            $scope.SkuDetails.tableSkuInventoryMaxRetailPrice = file.tableSkuInventory.tableSkuInventoryMaxRetailPrice;
        }
        if (file.tableSkuInventory.tableSkuInventoryMinSalePrice != null) {
            $scope.SkuDetails.tableSkuInventoryMinSalePrice = file.tableSkuInventory.tableSkuInventoryMinSalePrice;

        }
        if (file.tableSkuInventory.tableSkuInventoryExpectedInwardCount != null) {
            $scope.SkuDetails.ExpectedCount = file.tableSkuInventory.tableSkuInventoryExpectedInwardCount;
        }
        console.log(file.tableSkuInventory.tableSkuInventoryExpectedInwardCount);
        //SkuDetails.ExpectedCount, tableSkuInventoryExpectedInwardCount
        $('#AddGrn').modal('show');
    }


    $scope.SubmitGrn = function () {
        console.log($scope.SkuDetails.GRnData);
        console.log($scope.SkuDetails.ExpectedCount);
        console.log($scope.SkuDetails.ActualCount);
        console.log($scope.SkuDetails.QCCount);
        console.log($scope.SkuDetails.QCfailed);
        console.log($scope.SkuDetails.BlockedCount);
        console.log($scope.SkuDetails.GRnData.tableSkuInventory.tableVendor);

        var Postdata = {
            "idtableSkuInventoryId": $scope.SkuDetails.GRnData.idtablePurchaseOrderSkusId,
            "tableSkuInventoryMaxRetailPrice": $scope.SkuDetails.tableSkuInventoryMaxRetailPrice,
            "tableSkuInventoryBatchNo": $scope.SkuDetails.GRnData.tableSkuInventory.tableSkuInventoryBatchNo,
            "tableSkuInventoryMfgDate": $scope.SkuDetails.GRnData.tableSkuInventory.tableSkuInventoryMfgDate,
            "tableSkuInventoryExpiryDate": $scope.SkuDetails.GRnData.tableSkuInventory.tableSkuInventoryExpiryDate,
            "tableSkuInventoryShelfLifeInDays": $scope.SkuDetails.GRnData.tableSkuInventory.tableSkuInventoryShelfLifeInDays,
            "tableSkuInventoryMinSalePrice": $scope.SkuDetails.GRnData.tableSkuInventory.tableSkuInventoryMinSalePrice,
            "tableSkuInventoryWhCount": $scope.SkuDetails.GRnData.tableSkuInventory.tableSkuInventoryWhCount,
            "tableSkuInventoryRackCount": $scope.SkuDetails.GRnData.tableSkuInventory.tableSkuInventoryRackCount,
            "tableSkuInventoryAvailableCount": $scope.SkuDetails.QCCount,
            "tableSkuInventoryAllocatedCount": $scope.SkuDetails.GRnData.tableSkuInventory.tableSkuInventoryAllocatedCount,
            "tableSkuInventorySoldCount": $scope.SkuDetails.GRnData.tableSkuInventory.tableSkuInventorySoldCount,
            "tableSkuInventoryBlockedCount": $scope.SkuDetails.BlockedCount,
            "tableSkuInventoryPutAwayBinCount": $scope.SkuDetails.GRnData.tableSkuInventory.tableSkuInventoryPutAwayBinCount,
            "tableSkuInventoryPickUpBinCount": $scope.SkuDetails.GRnData.tableSkuInventory.tableSkuInventoryPickUpBinCount,
            "tableSkuInventoryInwardQcFailedCount": $scope.SkuDetails.QCfailed,
            "tableSkuInventoryOutwardQcFailedCount": $scope.SkuDetails.GRnData.tableSkuInventory.tableSkuInventoryOutwardQcFailedCount,
            "tableSkuInventoryMismatchCount": $scope.SkuDetails.GRnData.tableSkuInventory.tableSkuInventoryMismatchCount,
            "tableSkuInventoryExpectedInwardCount": $scope.SkuDetails.ExpectedCount,
            "tableSkuInventoryActualInwardCount": $scope.SkuDetails.ActualCount,
            "tableSkuInventoryExpectedOutwardCount": $scope.SkuDetails.GRnData.tableSkuInventory.tableSkuInventoryExpectedOutwardCount,
            "tableSkuInventoryActualOutwardCount": $scope.SkuDetails.GRnData.tableSkuInventory.tableSkuInventoryActualOutwardCount,
            "tableSkuInventoryCreationDate": $scope.SkuDetails.GRnData.tableSkuInventory.tableSkuInventoryCreationDate,
            "tableSku": $scope.SkuDetails.GRnData.tableSku,
            "tableVendor": $scope.SkuDetails.GRnData.tableSkuInventory.tableVendor,
            "tableWarehouseDetails": $scope.SkuDetails.GRnData.tableSkuInventory.tableWarehouseDetails
        }
        //console.log(Postdata);
        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/purchase/order/' + $scope.SkuDetails.GRnData.idtablePurchaseOrderSkusId + '/quickgrn',
            data: Postdata,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function (data) {
            console.log(data);
            $('#AddGrn').modal('hide');
            $scope.listOfStatesCount($scope.defaultTabs);
        }).error(function (data) {
            console.log(data);
        });
    }

    $scope.checkEditButton = function (podata) {
        var v = true;
        angular.forEach(podata.tablePurchaseOrderSkuses, function (item) {
            var value = item.tablePurchaseOrderSkuStateType.idtablePurchaseOrderSkuStateTypeId;
            if (value != 1 && value != 2 && value != 3) {
                v = false;
            }

        });
        return v;
    }

    $scope.clearStartDate = function () {
        $scope.startDate = "";
        $scope.start1Date = undefined;
        $scope.isStartDateDisabled = true;
    };

    $scope.clearEndDate = function () {
        $scope.endDate = "";
        $scope.end1Date = undefined;
        $scope.isEndDateDisabled = true;
    };


//    /omsservices/webapi/purchase/order/1/quickgrn

}
