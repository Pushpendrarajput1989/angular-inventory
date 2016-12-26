myApp.controller('secureNavController', secureNavController);

secureNavController.$inject = ['$scope', '$location', '$http', 'baseUrl', '$cookies'];

function secureNavController($scope, $location, $http, baseUrl, $cookies) {
    $scope.userNavData = $cookies.get("username");
    $scope.isSettingsClicked = false;

    $scope.showHideSettingsDropdown = function() {
        $scope.isSettingsClicked = !$scope.isSettingsClicked;
    };

    $scope.hideSettingsDropdown = function() {
        $scope.isSettingsClicked = false;
    };

    $scope.showHideOmsDropdown = function() {
        $scope.isOmsClicked = !$scope.isOmsClicked;
    };

    $scope.hideOmsDropdown = function() {
        $scope.isOmsClicked = false;
    };

    $scope.navData = [{
        "name": "Dashboard",
        "href": "/Dashboard/",
        "imageUrl": "images/svg/dashboard_icon.svg"
    }, {
        "name": "Orders",
        "href": "/order/",
        "imageUrl": "images/svg/order_icon.svg"
    },
      {
        "name": "Inventory",
        "href": "/inventory/",
        "imageUrl": "images/svg/invantory_icon.svg"
    },
        {
            "name": "Stock Transfer",
            "href": "/stocktransfer/",
            "imageUrl": "images/svg/order_icon.svg"
        },
        {
        "name": "SKU",
        "href": "/sku/",
        "imageUrl": "images/svg/sku_icon.svg"
    }, {
        "name": "P.O.",
        "href": "/po/",
        "imageUrl": "images/svg/po_icon.svg"
    }, {
        "name": "Customers",
        "href": "/customer/",
        "imageUrl": "images/svg/customer_icon.svg"
    }, {
        "name": "Vendors",
        "href": "/vendor/",
        "imageUrl": "images/svg/vendor_new.svg"
    }, {
        "name": "Analytics",
        "href": "/analytics/",
        "imageUrl": "images/svg/analytics.svg"
    }, {
        "name": "VAS",
        "href": "/vas/",
        "imageUrl": "images/svg/billing_icon.svg"
    }];

    $scope.navOmsData = [{
        "name": "Oms",
        "imageUrl": "images/svg/order_icon.svg",
        "subMenu": [{
            "name": "Inbound (PO and ST-IN)",
            "href": "/inbound/"
        }, {
            "name": "Outbound (Sale Orders and ST-OUT (Including FBA))",
            "href": "/outbound/"
        }, {
            "name": "Inventory",
            "href": "/inventory/"
        }]
    }];

    $scope.navSettingData = [{
        "name": "Settings",
        "imageUrl": "images/svg/settings_icons.svg",
        "subMenu": [{
            "name": "Warehouses",
            "href": "/warehouses/"
        }, {
            "name": "Sales Channels",
            "href": "/saleschannels/"
        }, {
            "name": "Templates",
            "href": "/templates/"
        }, {
            "name": "Shipping Partners",
            "href": "/shippingpartners/"
        }, {
            "name": "User Administration",
            "href": "/useradmin/"
        }, {
            "name": "Bulk Uploads",
            "href": "/bulkuploads/"
        }]
    }];
    $scope.isActive = function(data) {
        if (data.href == $location.path()) {
            return true;
        }
        if (data.subMenu) {
            for (var i = 0; i < data.subMenu.length; i++) {
                if (data.name == "Settings" && data.subMenu[i].href == $location.path()) {
                    return true;
                }
            }
        }
        return false;
    };

    $scope.isActiveDropDown = function(data) {
        if (data.href == $location.path()) {
            return true;
        }
        return false;
    }

    $scope.logout = function() {
        var leftUrl = "/omsservices/webapi/login/logout";
        $http({
            method: 'POST',
            url: baseUrl + leftUrl
        }).success(function(res) {
            console.log(res);
            $cookies.remove("username");
            $cookies.put('isLoggedIn', false);
            $location.path('/login');

        }).error(function(error) {
            console.log(error)
        });
    }
};
