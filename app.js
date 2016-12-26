var myApp = angular.module('tableApp', ['ngRoute', 'angucomplete', 'ngMaterial', 'ngCsvImport',
    'dndLists', 'ui.sortable', 'isteven-multi-select', 'multipleSelect',
    'ngStepwise', 'angucomplete-alt', 'angular-growl', 'ngAnimate', 'ngFileUpload', 'nvd3', 'ui.tinymce', 'ngCookies', 'offClick', 'ngPatternRestrict','ui.bootstrap'
]);

// myApp.constant('baseUrl', 'http://54.191.40.152:8080');
myApp.constant('imageUrl', 'https://s3-us-west-2.amazonaws.com/glaucusdev/');
myApp.constant('baseUrl', 'http://54.244.180.40:8080');
//myApp.constant('baseUrl', 'http://192.168.1.40:8080');
// myApp.constant('baseUrl', 'http://localhost:8080');
myApp.constant('downloadOrderTemplateUrl', 'https://s3-us-west-2.amazonaws.com/glmetadata/templates/Glaucus_Sale_Order_Bulk_Upload_Template.xls');
myApp.constant('downloadSkuTemplateUrl', 'https://s3-us-west-2.amazonaws.com/glmetadata/templates/Glaucus_SKU_Bulk_Upload_Template.xls');
myApp.constant('formsUrl', 'https://s3-us-west-2.amazonaws.com/glmetadata/forms/');

myApp.config(['$routeProvider', '$httpProvider', '$locationProvider',
    function($routeProvider, $httpProvider, $locationProvider) {
        $httpProvider.defaults.withCredentials = true;
        $routeProvider.when('/signUp/', {
            templateUrl: 'signUp/signUp.view.html',
            controller: 'signUpController'
        }).when('/signUpSuccess/', {
            templateUrl: 'signUp/signUpSuccess/signUpSuccess.view.html',
            controller: 'signUpSuccess'
        }).when('/login/', {
            templateUrl: 'login/login.view.html',
            controller: 'loginController'
        }).when('/forgotPassword/', {
            templateUrl: 'forgotPassword/forgotPassword.view.html',
            controller: 'forgotPasswordController'
        }).when('/resetpassword', {
            templateUrl: 'resetPassword/resetPassword.view.html',
            controller: 'resetPasswordController'
        }).when('/order/', {
            templateUrl: 'order/order.view.html',
            controller: 'orderController',
            requireAuth: true
        }).when('/inbound/', {
            templateUrl: 'inbound/inbound.view.html',
            controller: 'inboundController',
            requireAuth: true
        }).when('/outbound/', {
            templateUrl: 'outbound/outbound.view.html',
            controller: 'outboundController',
            requireAuth: true
        }).when('/order/customer/:customerId', {
            templateUrl: 'order/order.view.html',
            controller: 'orderController',
            requireAuth: true
        }).when('/po/', {
            templateUrl: 'po/po.view.html',
            controller: 'poController'
        }).when('/inventory/', {
            templateUrl: 'inventory/inventory.view2.html',
            controller: 'inventoryController'
        }).when('/sku/', {
            templateUrl: 'sku/sku.view.html',
            controller: 'skuController'
        }).when('/sku/:skuLabel', {
            templateUrl: 'sku/sku.view.html',
            controller: 'skuController'
        }).when('/customer/', {
            templateUrl: 'customer/customer.view.html',
            controller: 'customerController'
        }).when('/vendor/', {
            templateUrl: 'vendor/vendor.view.html',
            controller: 'vendorController'
        }).when('/verifySuccess', {
            templateUrl: 'verify/success.html',
            controller: 'verifyUserController'
        }).when('/verifyFail', {
            templateUrl: 'verify/failure.html',
            controller: 'verifyUserController'
        }).when('/forgotPasswordSuccess/', {
            templateUrl: 'forgotPassword/forgotPasswordSuccess/forgotPasswordSuccess.view.html',
            controller: 'forgotPwdSuccessController'
        }).when('/error/', {
            templateUrl: 'errorPage/errorPage.view.html',
            controller: 'errorPageController'
        }).when('/analytics/', {
            templateUrl: 'analytics/analytics.view.html',
            controller: 'analyticsController'
        }).when('/warehouses/', {
            templateUrl: 'settings/warehouses/warehouses.view.html',
            controller: 'warehousesController'
        }).when('/saleschannels/', {
            templateUrl: 'settings/saleschannels/saleschannels.view.html',
            controller: 'saleschannelsController'
        }).when('/templates/', {
            templateUrl: 'settings/templates/templates.view.html',
            controller: 'templatesController'
        }).when('/shippingpartners/', {
            templateUrl: 'settings/shippingpartners/shippingpartners.view.html',
            controller: 'shippingpartnersController'
        }).when('/useradmin/', {
            templateUrl: 'settings/useradmin/useradmin.view.html',
            controller: 'useradminController'
        }).when('/bulkuploads/', {
            templateUrl: 'settings/bulkuploads/bulkuploads.view.html',
            controller: 'bulkuploadsController'
        }).when('/Dashboard/', {
            templateUrl: 'Dashboard/dashboard.view.html',
            controller: 'dashboardController'
        }).when('/vas/', {
            templateUrl: 'workOrderVas/workOrderTabs.view2.html',
            controller: 'workOrderVasController'
        })
        .when('/stocktransfer/', {
                templateUrl: 'stockTransfer/stockTransfer.html',
                controller: 'stockTransfer'
            })
         .otherwise({
            redirectTo: '/login'
        });

        $locationProvider.html5Mode(false);
    }
]);


myApp.run(['$http', function($http) {
    $http.defaults.headers.common['glhashcode'] = '$2a$10$7e60CWkOczJ8GiQiY6pRMOsYhFKaTbMehc81YpmqOx4jadEe/mpZG';
    // $http.defaults.headers.common['Accept'] = 'application/json;odata=verbose';
}]);

myApp.directive('loading', ['$http', function($http) {
    return {
        restrict: 'A',
        link: function(scope, elm, attrs) {
            scope.isLoading = function() {
                return $http.pendingRequests.length > 0;
            };

            scope.$watch(scope.isLoading, function(v) {
                if (v) {
                    elm.show();
                } else {
                    elm.hide();
                }
            });
        }
    };

}]);

//====================================== directive for number only ===================== //

myApp.directive('numbersOnly', function(){
    return {
        require: 'ngModel',
        link: function(scope, element, attrs, modelCtrl) {
            modelCtrl.$parsers.push(function (inputValue) {
// this next if is necessary for when using ng-required on your input.
// In such cases, when a letter is typed first, this parser will be called
// again, and the 2nd time, the value will be undefined
                if (inputValue == undefined) return ''
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput!=inputValue) {
                    modelCtrl.$setViewValue(transformedInput);
                    modelCtrl.$render();
                }

                return transformedInput;
            });
        }
    };
});



myApp.directive('demoMap', function() {
    return {
        restrict: 'EA',
        require: '?ngModel',
        scope: {
            myModel: '=ngModel'
        },
        link: function(scope, element, attrs, ngModel) {

            var mapOptions;
            var googleMap;
            var searchMarker;
            var searchLatLng;

            ngModel.$render = function() {
                searchLatLng = new google.maps.LatLng(scope.myModel.latitude, scope.myModel.longitude);

                mapOptions = {
                    center: searchLatLng,
                    zoom: 12,
                    mapTypeId: google.maps.MapTypeId.ROADMAP
                };

                googleMap = new google.maps.Map(element[0], mapOptions);
                searchMarker = new google.maps.Marker({
                    position: searchLatLng,
                    map: googleMap,
                    draggable: true
                });

                google.maps.event.addListener(searchMarker, 'idle', function() {
                    scope.$apply(function() {
                        scope.myModel.latitude = searchMarker.getPosition().lat();
                        scope.myModel.longitude = searchMarker.getPosition().lng();
                    });
                }.bind(this));

                $('#billingAddressModal').on('shown.bs.modal', function(e) {
                    var currentCenter = googleMap.getCenter(); // Get current center before resizing
                    google.maps.event.trigger(googleMap, "resize");
                    googleMap.setCenter(currentCenter); // Re-set previous center
                });
                $('#shippingAddressModal').on('shown.bs.modal', function(e) {
                    var currentCenter = googleMap.getCenter(); // Get current center before resizing
                    google.maps.event.trigger(googleMap, "resize");
                    googleMap.setCenter(currentCenter); // Re-set previous center
                });
                $('#orderShippingAddressModal').on('shown.bs.modal', function(e) {
                    var currentCenter = googleMap.getCenter(); // Get current center before resizing
                    google.maps.event.trigger(googleMap, "resize");
                    googleMap.setCenter(currentCenter); // Re-set previous center
                });
                $('#vendorAddressModal').on('shown.bs.modal', function(e) {
                    var currentCenter = googleMap.getCenter(); // Get current center before resizing
                    google.maps.event.trigger(googleMap, "resize");
                    googleMap.setCenter(currentCenter); // Re-set previous center
                });

            };

            scope.$watch('myModel', function(value) {
                var myPosition = new google.maps.LatLng(scope.myModel.latitude, scope.myModel.longitude);
                searchMarker.setPosition(myPosition);
            }, true);
        }
    }
});

myApp.config(['growlProvider', function(growlProvider) {
    growlProvider.globalReversedOrder(true);
    growlProvider.globalTimeToLive({
        success: 3000,
        error: 3000,
        warning: 3000,
        info: 3000
    });
    growlProvider.globalDisableCountDown(true);
    growlProvider.globalPosition('top-center');
}]);

myApp.config(function($mdDateLocaleProvider) {
    $mdDateLocaleProvider.formatDate = function(date) {

        if (date != undefined) {
            var day = date.getDate();

            var month = new Array();
            month[0] = "JAN";
            month[1] = "FEB";
            month[2] = "MAR";
            month[3] = "APR";
            month[4] = "MAY";
            month[5] = "JUN";
            month[6] = "JUL";
            month[7] = "AUG";
            month[8] = "SEP";
            month[9] = "OCT";
            month[10] = "NOV";
            month[11] = "DEC";
            var monthName = month[date.getMonth()];

            // var monthIndex = date.getMonth();
            var year = date.getFullYear();

            return day + '-' + monthName + '-' + year;
        }

        if (date == undefined) {
            return null;
        }
    };
});

myApp.config(function($sceDelegateProvider) {
    $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'http://54.191.40.152:8080/omsservices/webapi/**'
    ]);

    // The blacklist overrides the whitelist so the open redirect here is blocked.
    $sceDelegateProvider.resourceUrlBlacklist([
        'http://myapp.example.com/clickThru**'
    ]);
});

myApp.factory('PagerService', PagerService)

function PagerService() {
    // service definition
    var service = {};

    service.GetPager = GetPager;

    return service;

    // service implementation
    function GetPager(totalItems, currentPage, pageSize) {
        // default to first page
        currentPage = currentPage || 1;

        // default page size is 5
        pageSize = pageSize || 5;

        // calculate total pages
        var totalPages = Math.ceil(totalItems / pageSize);
        var startPage, endPage;
        if (totalPages <= 5) {
            // less than 5 total pages so show all
            startPage = 1;
            endPage = totalPages;
        } else {
            // more than 5 total pages so calculate start and end pages
            if (currentPage <= 3) {
                startPage = 1;
                endPage = 5;
            } else if (currentPage + 2 >= totalPages) {
                startPage = totalPages - 4;
                endPage = totalPages;
            } else {
                startPage = currentPage - 2;
                endPage = currentPage + 2;
            }
        }

        // calculate start and end item indexes
        var startIndex = (currentPage - 1) * pageSize;
        var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);

        // create an array of pages to ng-repeat in the pager control
        var pages = _.range(startPage, endPage + 1);

        // return object with all pager properties required by the view
        return {
            totalItems: totalItems,
            currentPage: currentPage,
            pageSize: pageSize,
            totalPages: totalPages,
            startPage: startPage,
            endPage: endPage,
            startIndex: startIndex,
            endIndex: endIndex,
            pages: pages
        };
    }
}
//myApp.directive('ngFocus', ['$parse', function ($parse) {
//        return function (scope, element, attr) {
//            var fn = $parse(attr['ngFocus']);
//            element.bind('focus', function (event) {
//                scope.$apply(function () {
//                    fn(scope, {
//                        $event: event
//                    });
//                });
//            });
//        }
//}
//
//]);
//myApp.directive('ngBlur', ['$parse', function ($parse) {
//        return function (scope, element, attr) {
//            var fn = $parse(attr['ngBlur']);
//            element.bind('blur', function (event) {
//                scope.$apply(function () {
//                    fn(scope, {
//                        $event: event
//                    });
//                });
//            });
//        }
//}
//
//]);
