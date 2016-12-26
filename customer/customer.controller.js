myApp.controller('customerController', customerController);

customerController.$inject = ['$scope', '$http', '$location', '$mdDialog', '$mdMedia', 'baseUrl', 'growl', 'PagerService', '$q', '$cookies'];

function customerController($scope, $http, $location, $mdDialog, $mdMedia, baseUrl, growl, PagerService, $q, $cookies) {
    $scope.searchCustomerClicked = false;
    $scope.customerData = "";
    $scope.customerMode = "add";
    $scope.shipAddressMode = "add";
    $scope.billAddressMode = "add";
    $scope.start = 0;
    $scope.customerSize = 5;
    $scope.baseSkuUrl = baseUrl + '/omsservices/webapi/skus/search?search=';
    $scope.baseCustomerUrl = baseUrl + '/omsservices/webapi/customers/search?search=';
    $scope.tinMode = "";

    //Cust No
    $scope.firstCustNo = 1;
    $scope.secCustNo = 2;
    $scope.thirdCustNo = 3;
    $scope.fourthCustNo = 4;
    $scope.fifthCustNo = 5;
    $scope.modeCustomer = "normal";

    // Add/Edit Customer validators
    $scope.isCustomerCodeValid = false;
    $scope.isCustomerTypeValid = false;
    $scope.isCustomerCrSrcValid = false;
    $scope.isCustomerContactFNameValid = false;
    $scope.isCustomerContactLNameValid = false;
    $scope.isCustomerPhoneNumValid = false;
    $scope.isCustomerEmailValid = false;
    $scope.isCustomerCompNameValid = false;
    $scope.custEmailChangedFlag = false;
    $scope.custPhoneChangedFlag = false;
    $scope.originalEmail = "";
    $scope.originalPhone = "";

    $scope.sortType = "tableCustomerFirstName";
    $scope.directionType = "asc";
    $scope.sortReverse = true; // set the default sort order

    $scope.isSubmitDisabledMutual = true;
    $scope.isResetDisabledMutual = true;

    $scope.isSubmitDisabledSku = true;
    $scope.isResetDisabledSku = true;

    $scope.callDisabledMutual = function() {
        $scope.isSubmitDisabledMutual = false;
    }

    $scope.callDisabledSku = function() {
        $scope.isSubmitDisabledSku = false;
    }

    $scope.$on('$routeChangeSuccess', function() {
        $scope.listOfCustomers($scope.start);
        $scope.listOfCustomerCount();
        $scope.regionsStatesData();
    });

    //Pagination Code for Customer
    $scope.startIncrement = function() {
        var nextVal = $scope.firstCustNo + 5
        console.log(nextVal);
        console.log($scope.custCountWithoutDecimal)

        if (nextVal > $scope.custCountWithoutDecimal) {
            console.log("Customers For that Range Does Not Exist");
            growl.error("Customers For that Range Does Not Exist");
        }
        if (nextVal <= $scope.custCountWithoutDecimal) {
            $scope.firstCustNo = $scope.firstCustNo + 5;
            $scope.secCustNo = $scope.secCustNo + 5;
            $scope.thirdCustNo = $scope.thirdCustNo + 5;
            $scope.fourthCustNo = $scope.fourthCustNo + 5;
            $scope.fifthCustNo = $scope.fifthCustNo + 5;

            console.log($scope.start);
            $scope.start = ($scope.firstCustNo - 1) * 5;
            $scope.customerSize = $scope.start + 5;
            if ($scope.modeCustomer == 'normal') {
                $scope.listOfCustomers();
                $scope.listOfCustomerCount();
            }
            if ($scope.modeCustomer == 'mutual') {
                $scope.listOfMutualCustomers();
                $scope.listOfMutualCustomersCount();
            }
        }
    };

    $scope.startDecrement = function() {

        var prevVal = $scope.firstCustNo - 5;
        console.log(prevVal);
        console.log($scope.custCountWithoutDecimal);

        if (prevVal > $scope.custCountWithoutDecimal) {
            console.log("Customers For that Range Does Not Exist");
            growl.error("Customers For that Range Does Not Exist");
        }
        if (prevVal <= $scope.custCountWithoutDecimal) {
            $scope.firstCustNo = $scope.firstCustNo - 5;
            $scope.secCustNo = $scope.secCustNo - 5;
            $scope.thirdCustNo = $scope.thirdCustNo - 5;
            $scope.fourthCustNo = $scope.fourthCustNo - 5;
            $scope.fifthCustNo = $scope.fifthCustNo - 5;
            console.log($scope.start);
            $scope.start = ($scope.firstCustNo - 1) * 5;
            $scope.customerSize = $scope.start + 5;
            if ($scope.modeCustomer == 'normal') {
                $scope.listOfCustomers();
                $scope.listOfCustomerCount();
            }
            if ($scope.modeCustomer == 'mutual') {
                $scope.listOfMutualCustomers();
                $scope.listOfMutualCustomersCount();
            }
        }
    };

    $scope.zeroDecrement = function() {
        growl.error("Customers for that range does not exist");
    };

    $scope.callCustomerList = function(number) {
        console.log(number);
        console.log($scope.custCountWithoutDecimal);
        if (number <= $scope.custCountWithoutDecimal) {
            console.log(number);
            console.log($scope.start);
            if (number) {
                $scope.start = (number - 1) * 5;
            }
            console.log($scope.start);
            $scope.customerSize = $scope.start + 5;
            if ($scope.modeCustomer == 'normal') {
                $scope.listOfCustomers();
                $scope.listOfCustomerCount();
            }
            if ($scope.modeCustomer == 'mutual') {
                $scope.listOfMutualCustomers();
                $scope.listOfMutualCustomersCount();
            }
        }
        if (number > $scope.custCountWithoutDecimal) {
            console.log("Customers For that Range Does Not Exist");
            growl.error("Customers For that Range Does Not Exist");
        }
    };
    //Pagination Code for Inventory Ends Here

    //Submit Customer Action
    //submit Action for Customer screen when clicking on submit button in main customer screen
    $scope.submitCustomerAction = function(cityid, districtid, stateid) {
        console.log(cityid);
        console.log(districtid);
        console.log(stateid);
        $scope.cityid = cityid;
        $scope.districtid = districtid;
        $scope.stateid = stateid;
        $scope.start = 0;
        $scope.modeCustomer = "normal";
        var page = undefined;
        // $scope.listOfCustomers();
        $scope.listOfCustomerCount(page);
    };

    //clear action for vendor mutual search
    $scope.clearMutualcustomerAction = function() {
        $scope.start = 0;
        $scope.modeCustomer = "normal";
        // $scope.listOfCustomers();
        $scope.isSubmitDisabledMutual = true;
        $scope.isResetDisabledMutual = false;
        var page = undefined;
        $scope.listOfCustomerCount(page);
    }

    $scope.clearMutualSkuAction = function() {
        $scope.start = 0;
        $scope.modeCustomer = "normal";
        $scope.skuFullId = null;
        var page = undefined;
        $scope.listOfCustomerCount(page);
        var productId = 'products';
        if (productId) {
            $scope.$broadcast('angucomplete-alt:clearInput', productId);
        }
        $scope.isSubmitDisabledSku = true;
        $scope.isResetDisabledSku = false;
    }

    $scope.clearStateDistCitycustomerAction = function() {
        $scope.start = 0;
        $scope.cityid = null;
        $scope.districtid = null;
        $scope.stateid = null;
        $scope.modeCustomer = "normal";
        // $scope.listOfCustomers();
        var page = undefined;
        $scope.listOfCustomerCount(page);
    }

    $scope.searchedProduct = function(selected) {
        if (selected != null) {
            console.log(selected);
            $scope.skuFullId = selected.originalObject.idtableSkuId;
            $scope.callDisabledSku();
        }
    }

    $scope.searchLocation = {
        latitude: 28.6139391,
        longitude: 77.20902120000005
    };

    //submit customer action mutual customer
    $scope.submitcustomerSearchAction = function(wordSearch) {
        $scope.sortType = "tableCustomerFirstName";
        $scope.directionType = "asc";
        $scope.wordSearch = wordSearch;
        $scope.modeCustomer = "mutual";
        $scope.sortReverse = true;
        $scope.isSubmitDisabledMutual = true;
        $scope.isResetDisabledMutual = false;
        var page = undefined;
        $scope.listOfMutualCustomersCount(page);
    }

    //submit customer action sku wise
    $scope.submitSkuSearchAction = function(id) {
        // console.log(id);
        $scope.sortType = "tableCustomerFirstName";
        $scope.directionType = "asc";
        // $scope.skuFullId = id;
        $scope.modeCustomer = "skuFull";
        $scope.sortReverse = true;
        $scope.isSubmitDisabledSku = true;
        $scope.isResetDisabledSku = false;
        var page = undefined;
        $scope.listOfMutualSkuCount(page);
    }

    $scope.tableSorting = function(sortType, sortReverse) {
        console.log(sortType);
        console.log(sortReverse);
        $scope.sortType = sortType;
        console.log($scope.directionType);
        if (sortReverse == true) {
            $scope.directionType = 'desc';
        }
        if (sortReverse == false) {
            $scope.directionType = 'asc';
        }
        console.log($scope.directionType);
        $scope.sortReverse = !sortReverse;

        if ($scope.modeCustomer == 'normal') {
            var page = undefined;
            $scope.listOfCustomerCount(page);
        }

        if ($scope.modeCustomer == 'mutual') {
            var page = undefined;
            $scope.listOfMutualCustomersCount(page);
        }

        if ($scope.modeCustomer == 'skuFull') {
            var page = undefined;
            $scope.listOfMutualSkuCount(page);
        }
    };

    $scope.showResult = function(result) {
        console.log(result);
        // $scope.searchLocation = null;
        $scope.searchLocation = {
            latitude: result.geometry.location.lat(),
            longitude: result.geometry.location.lng()
        }
        console.log($scope.searchLocation);
        return true;
    };

    $scope.getLatitudeLongitude = function(callback) {
        var q = $q.defer();
        var address = "";
        if ($scope.customerAddress) {
            if ($scope.customerAddress.adLine1) {
                address = address + $scope.customerAddress.adLine1;
            }
            if ($scope.customerAddress.adLine2) {
                if (address != "") {
                    address = address + ", " + $scope.customerAddress.adLine2;
                } else {
                    address = $scope.customerAddress.adLine2;
                }
            }
            if ($scope.customerAddress.adLine3) {
                if (address != "") {
                    address = address + ", " + $scope.customerAddress.adLine3;
                } else {
                    address = $scope.customerAddress.adLine3;
                }
            }
            if ($scope.cityVal && !$scope.customerAddress.pincode) {
                if (address != "") {
                    address = address + ", " + $scope.cityVal;
                } else {
                    address = $scope.cityVal;
                }
            }
            if ($scope.district && (!$scope.cityVal && !$scope.customerAddress.pincode)) {
                if (address != "") {
                    address = address + ", " + $scope.district;
                } else {
                    address = $scope.district;
                }
            }
            if ($scope.state && !$scope.customerAddress.pincode) {
                if (address != "") {
                    address = address + ", " + $scope.state;
                } else {
                    address = $scope.state;
                }
            }
            if ($scope.customerAddress.pincode) {
                if (address != "") {
                    address = address + ", " + $scope.customerAddress.pincode;
                } else {
                    address = $scope.customerAddress.pincode;
                }
            }
        }

        console.log(address);
        if (address != "") {
            // Initialize the Geocoder
            geocoder = new google.maps.Geocoder();
            console.log(geocoder);
            if (geocoder) {
                geocoder.geocode({
                    'address': address.toString()
                }, function(results, status) {
                    console.log(status);
                    console.log(results);
                    if (status == google.maps.GeocoderStatus.OK) {
                        q.resolve(callback(results[0]));
                    } else {
                        growl.error("Exact location cannot be fetched from the entered address")
                    }
                });
            }
        }
        return q.promise;
    };

    $scope.callGetLatLong = function() {
        $scope.getLatitudeLongitude($scope.showResult).then(
            function(v) {},
            function(err) {}
        );
    };

    //opening and closing search accordian
    $scope.toggleSearchRow = function() {
        console.log($scope.searchCustomerClicked);
        $scope.searchCustomerClicked = !$scope.searchCustomerClicked;
    };
    //opening and closing search accordian ends here


    // fetching list of customers from RestAPI OMS
    $scope.listOfCustomers = function(start) {

        var customersListUrl = baseUrl + "/omsservices/webapi/customers";
        customersListUrl += "?start=" + start + '&size=5&sort=' + $scope.sortType + '&direction=' + $scope.directionType;
        if ($scope.cityid) {
            customersListUrl += "&city=" + $scope.cityid;
        }
        if ($scope.districtid) {
            customersListUrl += "&district=" + $scope.districtid;
        }
        if ($scope.stateid) {
            customersListUrl += "&state=" + $scope.stateid;
        }
        console.log(customersListUrl);
        $http.get(customersListUrl).success(function(data) {
            $scope.customersLists = data;
            $scope.dayDataCollapse = [];

            for (var i = 0; i < $scope.customersLists.length; i += 1) {
                $scope.dayDataCollapse.push(false);
            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to Login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);
                $location.path('/login');
            }
        });
    };

    //fetching list of customers count
    $scope.listOfCustomerCount = function(page) {
        var customerCountUrl = baseUrl + "/omsservices/webapi/customers/filtercount?sort=idtableCustomerId&direction=desc";
        if ($scope.cityid) {
            customerCountUrl += "&city=" + $scope.cityid;
        }
        if ($scope.districtid) {
            customerCountUrl += "&district=" + $scope.districtid;
        }
        if ($scope.stateid) {
            customerCountUrl += "&state=" + $scope.stateid;
        }
        console.log("CUSTOMER COUNT URL");
        console.log(customerCountUrl);
        $http.get(customerCountUrl).success(function(data) {
            $scope.customerCount = data;
            if (data != null) {
                var vm = this;

                vm.dummyItems = _.range(0, $scope.customerCount); // dummy array of items to be paged
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
                    $scope.customerSize = $scope.start + 5;
                    console.log($scope.start);
                    console.log($scope.customerSize);
                    // get current page of items
                    vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                    $scope.vmItems = vm.items;
                    $scope.listOfCustomers($scope.start);
                }
            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to Login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);
                $location.path('/login');
            }
        });
    };
    //fetchng list of customer count ends here

    //fetching list of mutual customers from mutually exlusive search string customers
    $scope.listOfMutualCustomers = function(start) {
        var customersListUrl = baseUrl + "/omsservices/webapi/customers/search?search=" + $scope.wordSearch;
        customersListUrl += '&start=' + start + '&size=5&sort=' + $scope.sortType + '&direction=' + $scope.directionType;
        console.log(customersListUrl);
        $http.get(customersListUrl).success(function(data) {
            console.log(data);
            $scope.customersLists = data;
            $scope.dayDataCollapse = [];

            for (var i = 0; i < $scope.customersLists.length; i += 1) {
                $scope.dayDataCollapse.push(false);
            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to Login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);
                $location.path('/login');
            }
        });
    }

    //fetching list of mutual customers count
    $scope.listOfMutualCustomersCount = function(page) {
        var customerCountUrl = baseUrl + "/omsservices/webapi/customers/searchcount?search=" + $scope.wordSearch;
        console.log("customers MAIN COUNT URL");
        console.log(customerCountUrl);
        $http.get(customerCountUrl).success(function(data) {
            $scope.customerCount = data;
            if (data != null) {
                var vm = this;

                vm.dummyItems = _.range(0, $scope.customerCount); // dummy array of items to be paged
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
                    $scope.customerSize = $scope.start + 5;
                    console.log($scope.start);
                    console.log($scope.customerSize);
                    // get current page of items
                    vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                    $scope.vmItems = vm.items;
                    $scope.listOfMutualCustomers($scope.start);
                }
            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to Login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);
                $location.path('/login');
            }
        });
    };

    //fetching list of mutual customers from mutually exlusive search string customers
    $scope.listOfSkuCustomers = function(start) {
        var skucustomersListUrl = baseUrl + "/omsservices/webapi/customers/skus/" + $scope.skuFullId;
        skucustomersListUrl += "?start=" + start + '&size=5&sort=' + $scope.sortType + '&direction=' + $scope.directionType;
        console.log(skucustomersListUrl);
        $http.get(skucustomersListUrl).success(function(data) {
            console.log(data);
            $scope.customersLists = data;
            $scope.dayDataCollapse = [];

            for (var i = 0; i < $scope.customersLists.length; i += 1) {
                $scope.dayDataCollapse.push(false);
            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
        });
    }

    //fetching list of mutual customers count
    $scope.listOfMutualSkuCount = function(page) {
        var skucustomerCountUrl = baseUrl + "/omsservices/webapi/customers/skuscount/" + $scope.skuFullId;
        console.log("sku customers MAIN COUNT URL");
        console.log(skucustomerCountUrl);
        $http.get(skucustomerCountUrl).success(function(data) {
            $scope.customerCount = data;
            if (data != null) {
                var vm = this;

                vm.dummyItems = _.range(0, $scope.customerCount); // dummy array of items to be paged
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
                    $scope.customerSize = $scope.start + 5;
                    console.log($scope.start);
                    console.log($scope.customerSize);
                    // get current page of items
                    vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                    $scope.vmItems = vm.items;
                    $scope.listOfSkuCustomers($scope.start);
                }
            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
        });
    };
    //fetchng list of vendors mutual count ends here


    //expansion and collapsing of customer rows data
    $scope.tableRowExpanded = false;
    $scope.tableRowIndexExpandedCurr = "";
    $scope.tableRowIndexExpandedPrev = "";
    $scope.storeIdExpanded = "";

    $scope.dayDataCollapseFn = function() {
        $scope.dayDataCollapse = [];

        for (var i = 0; i < $scope.customersLists.length; i += 1) {
            $scope.dayDataCollapse.push(false);
        }
    };


    $scope.selectTableRow = function(index, storeId) {

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

    //expansion and collapsing of customer rows data ends here

    //Creation Source Api Data from saleschannel API
    $scope.creationSourceData = function(saleChannelType) {
        var q = $q.defer();
        $scope.creationSourceArray = [];
        var salesChannelUrl = baseUrl + "/omsservices/webapi/saleschannels";
        $http.get(salesChannelUrl).success(function(data) {
            if (saleChannelType == "Manual") {
                for (var i = 0; i < data.length; i++) {
                    if (data[i].tableSalesChannelMetaInfo.tableSalesChannelMetaInfoName == saleChannelType) {
                        $scope.creationSourceArray.push(data[i]);
                    }
                }
                q.resolve(true);
                console.log($scope.creationSourceArray);
            } else {
                for (var i = 0; i < data.length; i++) {
                    $scope.creationSourceArray.push(data[i]);
                }
                q.resolve(true);
                console.log($scope.creationSourceArray);
            }
        }).error(function(error, status) {
            q.resolve(false);
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to Login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);
                $location.path('/login');
            }
        });
        return q.promise;
    };

    //Regions Data from region generic API
    $scope.regionsStatesData = function() {
        $scope.regionsStatesArray = [];
        var regionsStatesUrl = baseUrl + "/omsservices/webapi/countries/1/states";
        $http.get(regionsStatesUrl).success(function(data) {
            for (var i = 0; i < data.length; i++) {
                $scope.regionsStatesArray.push(data[i]);
            }
            console.log($scope.regionsStatesArray);
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to Login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);
                $location.path('/login');
            }
        });
    };

    //Regions Data from region states generic API
    $scope.regionsStatesDistrictData = function(stateData) {
        $scope.state = stateData.tableStateLongName;
        $scope.getLatitudeLongitude($scope.showResult).then(
            function(v) {
                if (v) {
                    console.log(stateData);
                    $scope.stateId = stateData.idtableStateId;
                    $scope.regionsStatesDistrictArray = [];
                    var regionsStatesDistrictUrl = baseUrl + "/omsservices/webapi/countries/1/states/" + stateData.idtableStateId + "/districts";
                    $http.get(regionsStatesDistrictUrl).success(function(data) {
                        if (data != null) {
                            for (var i = 0; i < data.length; i++) {
                                $scope.regionsStatesDistrictArray.push(data[i]);
                            }
                            console.log($scope.regionsStatesDistrictArray);
                            $scope.customerAddress.districtData = initializeDropdowns($scope.regionsStatesDistrictArray, 'idtableDistrictId', stateData.idtableDistrictId);
                            console.log($scope.customerAddress.districtData);

                        }
                    }).error(function(error, status) {
                        console.log(error);
                        console.log(status);
                        if (status == 401) {
                            growl.error('Your session has been expired. You need to Login again.');
                            //$('#AuthError').modal('show');
                            $cookies.put('isLoggedIn', false);
                            $location.path('/login');
                        }
                    });
                }
            },
            function(err) {}
        );
    };

    //Regions Data from region states distict generic API
    $scope.regionsStatesDistrictsCityData = function(stateData, districtData) {
        if (districtData) {
            $scope.district = districtData.tableDistrictLongName;
            $scope.getLatitudeLongitude($scope.showResult).then(
                function(v) {
                    if (v) {
                        console.log(districtData);
                        $scope.regionsStatesDistrictsCityArray = [];
                        $scope.districtId = districtData.idtableDistrictId;
                        var regionsStatesDistrictsCityUrl = baseUrl + "/omsservices/webapi/countries/1/states/" + stateData.idtableStateId + "/districts/" + districtData.idtableDistrictId + "/cities";
                        $http.get(regionsStatesDistrictsCityUrl).success(function(data) {
                            for (var i = 0; i < data.length; i++) {
                                $scope.regionsStatesDistrictsCityArray.push(data[i]);
                            }
                            console.log($scope.regionsStatesDistrictsCityArray);

                        }).error(function(error, status) {
                            console.log(error);
                            if (status == 401) {
                                //$('#AuthError').modal('show');
                                growl.error('Your session has been expired. You need to Login again.');
                                $location.path('/login');
                            }
                        });
                    }
                },
                function(err) {}
            );
        }
    };

    $scope.changeCity = function(city) {
        if (city) {
            $scope.cityVal = city.tableCityLongName;
            $scope.getLatitudeLongitude($scope.showResult).then(
                function(v) {},
                function(err) {}
            );
        }
    };

    // dialog box to add new customer
    $scope.showCustomerBox = function(ev) {
        $mdDialog.show({
            templateUrl: 'dialog2.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            scope: $scope.$new(),
            escapeToClose: false
        }).then(function(answer) {
            $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
            $scope.status = 'You cancelled the dialog.';
        });
    };

    $scope.custCodeChanged = function(custCode) {
        if (custCode) {
            $scope.isCustomerCodeValid = false;
        } else {
            $scope.isCustomerCodeValid = true;
        }
    };

    $scope.custTypeChanged = function(custType) {
        if (custType) {
            $scope.isCustomerTypeValid = false;
        }
    };

    $scope.custCrSrcChanged = function(custCrSrc) {
        if (custCrSrc) {
            $scope.isCustomerCrSrcValid = false;
        } else {
            $scope.isCustomerCrSrcValid = true;
        }
    };

    $scope.custCompNameChanged = function(custCompName) {
        if (custCompName) {
            $scope.isCustomerCompNameValid = false;
        } else {
            $scope.isCustomerCompNameValid = true;
        }
    };

    $scope.custFNameChanged = function(custFName) {
        if (custFName) {
            $scope.isCustomerContactFNameValid = false;
        } else {
            $scope.isCustomerContactFNameValid = true;
        }
    };

    $scope.custLNameChanged = function(custLName) {
        if (custLName) {
            $scope.isCustomerContactLNameValid = false;
        } else {
            $scope.isCustomerContactLNameValid = true;
        }
    };

    $scope.custEmailChanged = function(custEmail) {
        if (custEmail) {
            $scope.isCustomerEmailValid = false;
        } else {
            if ($scope.originalEmail == custEmail) {
                $scope.custEmailChangedFlag = false;
            } else {
                $scope.custEmailChangedFlag = true;
            }
            $scope.isCustomerEmailValid = true;
        }
    };

    $scope.custPhoneChanged = function(custPhone) {
        if (custPhone) {
            $scope.isCustomerPhoneNumValid = false;
        } else {
            if ($scope.originalPhone == custPhone) {
                $scope.custPhoneChangedFlag = false;
            } else {
                $scope.custPhoneChangedFlag = true;
            }
            $scope.isCustomerPhoneNumValid = true;
        }
    };

    $scope.saveCustomer = function(customersData) {
        console.log(customersData.tableCustomerTypeString);

        var postCustomerData = {
            "idtableCustomerId": 1,
            "tableCustomerClientCustomerCode": customersData.tableCustomerClientCustomerCode,
            "tableCustomerFirstName": customersData.tableCustomerFirstName,
            "tableCustomerLastName": customersData.tableCustomerLastName,
            "tableCustomerCompany": customersData.tableCustomerCompany,
            "tableCustomerIsActive": true,
            "tableSalesChannelValueInfo": customersData.tableSalesChannelValueInfo,
            "tableCustomerGlCode": null,
            "tableCustomerIsBlacklisted": false,
            "tableCustomerEmail": customersData.tableCustomerEmail,
            "tableCustomerPhone": customersData.tableCustomerPhone,
            "tableTaxZone": null
        }

        if (customersData.tableCustomerTypeString == 'B2C') {
            postCustomerData.tableCustomerType = {
                "idtableCustomerTypeId": 1,
                "tableCustomerTypeString": "B2C"
            }
        }

        if (customersData.tableCustomerTypeString == 'B2B') {
            postCustomerData.tableCustomerType = {
                "idtableCustomerTypeId": 2,
                "tableCustomerTypeString": "B2B"
            }
        }

        console.log(postCustomerData);

        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/customers',
            data: postCustomerData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            console.log(res);
            if (res) {
                $scope.customerMode = "add";
                growl.success("New Customer Added Successfully");
                if ($scope.modeCustomer == 'normal') {
                    // $scope.listOfCustomers();
                    $scope.listOfCustomerCount($scope.vmPager.currentPage);
                }
                if ($scope.modeCustomer == 'mutual') {
                    // $scope.listOfMutualCustomers();
                    $scope.listOfMutualCustomersCount($scope.vmPager.currentPage);
                }
                if ($scope.modeCustomer == 'skuFull') {
                    // $scope.listOfMutualCustomers();
                    $scope.listOfMutualSkuCount($scope.vmPager.currentPage);
                }
                $scope.cancelCustomerData();
            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to Login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);
                $location.path('/login');
            }
            growl.error("New Customer Cannot Be Added");
        });
    };

    // Edit Customer Data to backend OMS Customer API
    $scope.editCustomerData = function(customersData) {
        console.log(customersData);
        console.log(customersData.idtableCustomerId);
        console.log(customersData.tableCustomerTypeString);

        var putCustomerData = {
            "idtableCustomerId": customersData.idtableCustomerId,
            "tableCustomerClientCustomerCode": customersData.tableCustomerClientCustomerCode,
            "tableCustomerFirstName": customersData.tableCustomerFirstName,
            "tableCustomerLastName": customersData.tableCustomerLastName,
            "tableCustomerCompany": customersData.tableCustomerCompany,
            "tableCustomerIsActive": customersData.tableCustomerIsActive,
            "tableSalesChannelValueInfo": customersData.tableSalesChannelValueInfo,
            "tableCustomerGlCode": null,
            "tableCustomerIsBlacklisted": customersData.tableCustomerIsBlacklisted,
            "tableCustomerEmail": customersData.tableCustomerEmail,
            "tableCustomerPhone": customersData.tableCustomerPhone,
            "tableTaxZone": null
        }

        if (customersData.tableCustomerTypeString == 'B2C') {
            putCustomerData.tableCustomerType = {
                "idtableCustomerTypeId": 1,
                "tableCustomerTypeString": "B2C"
            }
        }

        if (customersData.tableCustomerTypeString == 'B2B') {
            putCustomerData.tableCustomerType = {
                "idtableCustomerTypeId": 2,
                "tableCustomerTypeString": "B2B"
            }
        }

        console.log(putCustomerData);

        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/customers/' + customersData.idtableCustomerId,
            data: putCustomerData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            console.log(res);
            if (res) {
                $scope.customerMode = "add";
                growl.success("Customer Data Edited Successfully");
                if ($scope.modeCustomer == 'normal') {
                    // $scope.listOfCustomers();
                    $scope.listOfCustomerCount($scope.vmPager.currentPage);
                }
                if ($scope.modeCustomer == 'mutual') {
                    // $scope.listOfMutualCustomers();
                    $scope.listOfMutualCustomersCount($scope.vmPager.currentPage);
                }
                if ($scope.modeCustomer == 'skuFull') {
                    // $scope.listOfMutualCustomers();
                    $scope.listOfMutualSkuCount($scope.vmPager.currentPage);
                }
                $scope.cancelCustomerData();
            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to Login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);
                $location.path('/login');
            }
            growl.error("Customer Data Cannot Be Edited");
        });
    };

    // ADD Customer Data to backend OMS Customer API
    $scope.saveCustomerData = function(customersData, customerMode) {
        // body...

        if (!customersData) {
            growl.error("Please enter the Customer Code");
            $scope.isCustomerCodeValid = true;
        } else if (!customersData.tableCustomerClientCustomerCode) {
            growl.error("Please enter the Customer Code");
            $scope.isCustomerCodeValid = true;
        } else {
            $scope.checkCustomerCode(customersData.tableCustomerClientCustomerCode, customerMode).then(
                function(v) {
                    if (v) {
                        $scope.isCustomerCodeValid = false;
                        if (!customersData.tableCustomerTypeString) {
                            growl.error("Please select the Type of Customer");
                            $scope.isCustomerTypeValid = true;
                        } else if (!customersData.tableSalesChannelValueInfo) {
                            growl.error("Please select the Creation Source");
                            $scope.isCustomerCrSrcValid = true;
                        } else if (customersData.tableCustomerTypeString == "B2B" && !customersData.tableCustomerCompany) {
                            growl.error("Please enter the Company Name");
                            $scope.isCustomerCompNameValid = true;
                        } else if (!customersData.tableCustomerFirstName) {
                            growl.error("Please enter the Contact Person First Name");
                            $scope.isCustomerContactFNameValid = true;
                        } else if (customersData.tableCustomerFirstName.length > 45) {
                            growl.error("First Name cannot be greater than 45 characters");
                            $scope.isCustomerContactFNameValid = true;
                        } else if (!customersData.tableCustomerLastName) {
                            growl.error("Please enter the Contact Person Last Name");
                            $scope.isCustomerContactLNameValid = true;
                        } else if (customersData.tableCustomerLastName.length > 45) {
                            growl.error("Last Name cannot be greater than 45 characters");
                            $scope.isCustomerContactLNameValid = true;
                        } else if (!customersData.tableCustomerEmail) {
                            growl.error("Please enter a valid Email Address");
                            $scope.isCustomerEmailValid = true;
                        } else {
                            $scope.checkEmail(customersData.tableCustomerEmail, customersData.tableCustomerTypeString, customerMode).then(
                                function(v) {
                                    if (v) {
                                        $scope.isCustomerEmailValid = false;

                                        if (!customersData.tableCustomerPhone) {
                                            growl.error("Please enter the Phone Number");
                                            $scope.isCustomerPhoneNumValid = true;
                                        } else {
                                            $scope.checkPhoneNo(customersData.tableCustomerPhone, customersData.tableCustomerTypeString, customerMode).then(
                                                function(v) {
                                                    if (v) {
                                                        $scope.isCustomerPhoneNumValid = false;
                                                        if (customerMode == "add") {
                                                            $scope.saveCustomer(customersData);
                                                        } else if (customerMode == "edit") {
                                                            $scope.editCustomerData(customersData);
                                                        }
                                                    } else {
                                                        $scope.isCustomerPhoneNumValid = true;
                                                    }
                                                },
                                                function(err) {}
                                            );
                                        }
                                    } else {
                                        $scope.isCustomerEmailValid = true;
                                    }
                                },
                                function(err) {}
                            );
                        }
                    } else {
                        $scope.isCustomerCodeValid = true;
                    }
                },
                function(err) {}
            );
        }
    };

    //Blacklist customer
    $scope.blacklistCustomer = function(customersData) {
        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/customers/' + customersData.idtableCustomerId + '/blacklist',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            console.log(res);
            if (res) {
                $scope.customerMode = "add";
                growl.success("Customer Blacklisted Successfully");
                if ($scope.modeCustomer == 'normal') {
                    // $scope.listOfCustomers();
                    $scope.listOfCustomerCount($scope.vmPager.currentPage);
                }
                if ($scope.modeCustomer == 'mutual') {
                    // $scope.listOfMutualCustomers();
                    $scope.listOfMutualCustomersCount($scope.vmPager.currentPage);
                }
                if ($scope.modeCustomer == 'skuFull') {
                    // $scope.listOfMutualCustomers();
                    $scope.listOfMutualSkuCount($scope.vmPager.currentPage);
                }
            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to Login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);
                $location.path('/login');
            }
            growl.error("Customer Cannot Be Blacklisted");
        });
    };

    $scope.whitelistCustomer = function(customersData) {
        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/customers/' + customersData.idtableCustomerId + '/whitelist',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            console.log(res);
            if (res) {
                $scope.customerMode = "add";
                growl.success("Customer Whitelisted Successfully");
                if ($scope.modeCustomer == 'normal') {
                    // $scope.listOfCustomers();
                    $scope.listOfCustomerCount($scope.vmPager.currentPage);
                }
                if ($scope.modeCustomer == 'mutual') {
                    // $scope.listOfMutualCustomers();
                    $scope.listOfMutualCustomersCount($scope.vmPager.currentPage);
                }
                if ($scope.modeCustomer == 'skuFull') {
                    // $scope.listOfMutualCustomers();
                    $scope.listOfMutualSkuCount($scope.vmPager.currentPage);
                }
            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to Login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);
                $location.path('/login');
            }
            growl.error("Customer Cannot Be Whitelisted");
        });
    };

    //Closing Add Customer Dialog Box
    $scope.cancelCustomerData = function() {
        $scope.customerMode = "add";
        $scope.customersData = null;

        // Add/Edit Customer validators
        $scope.isCustomerCodeValid = false;
        $scope.isCustomerTypeValid = false;
        $scope.isCustomerCrSrcValid = false;
        $scope.isCustomerContactFNameValid = false;
        $scope.isCustomerContactLNameValid = false;
        $scope.isCustomerPhoneNumValid = false;
        $scope.isCustomerEmailValid = false;
        $scope.isCustomerCompNameValid = false;
        $scope.custEmailChangedFlag = false;
        $scope.custPhoneChangedFlag = false;
        $scope.originalEmail = "";
        $scope.originalPhone = "";

        $mdDialog.hide();
    };

    //dialog box to add new shipping address
    $scope.addShippingAddress = function(customerId, customerTypeId) {
        console.log(customerTypeId);
        console.log(customerId);

        $scope.shipAddressMode = 'add';

        $scope.customerAddress = [];
        $scope.state = "";
        $scope.district = "";
        $scope.cityVal = "";

        var customersByIDUrl = baseUrl + "/omsservices/webapi/customers/" + customerId;
        $http.get(customersByIDUrl).success(function(data) {
            $scope.customerId = data.idtableCustomerId;
            $scope.customerTypeId = customerTypeId;
            $scope.customerAddress.contactPersonName = data.tableCustomerFirstName;
            if (data.tableCustomerLastName && data.tableCustomerLastName != null && data.tableCustomerLastName != null) {
                $scope.customerAddress.contactPersonName += " " + data.tableCustomerLastName;
            }
            $scope.customerAddress.contactEmail = data.tableCustomerEmail;
            $scope.customerAddress.contactPhone = data.tableCustomerPhone;
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to Login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);
                $location.path('/login');
            }
        });

        $('#shippingAddressModal').modal('show');
    };

    //dialog box to add new billing address
    $scope.addBillingAddress = function(customerId, customerTypeId) {
        console.log(customerTypeId);
        console.log(customerId);

        $scope.billAddressMode = 'add';

        $scope.customerAddress = [];
        $scope.state = "";
        $scope.district = "";
        $scope.cityVal = "";

        var customersByIDUrl = baseUrl + "/omsservices/webapi/customers/" + customerId;
        $http.get(customersByIDUrl).success(function(data) {
            $scope.customerId = data.idtableCustomerId;
            $scope.customerTypeId = customerTypeId;
            $scope.customerAddress.contactPersonName = data.tableCustomerFirstName;
            if (data.tableCustomerLastName && data.tableCustomerLastName != null && data.tableCustomerLastName != null) {
                $scope.customerAddress.contactPersonName += " " + data.tableCustomerLastName;
            }
            $scope.customerAddress.contactEmail = data.tableCustomerEmail;
            $scope.customerAddress.contactPhone = data.tableCustomerPhone;
        }).error(function(error) {
            console.log(error);
        });

        $('#billingAddressModal').modal('show');
    };
    //saving shipping address data based on customer id
    $scope.saveShippingAddressData = function() {
        var latitude = $scope.searchLocation.latitude;
        var longitude = $scope.searchLocation.longitude;

        var postShippingAddressData = {
            "idtableCustomerShippingAddressListId": 1,
            "tableAddress": {
                "idtableAddressId": 1,
                "tableAddress1": $scope.customerAddress.adLine1,
                "tableAddress2": $scope.customerAddress.adLine2,
                "tableAddress3": $scope.customerAddress.adLine3,
                "tableAddress4": null,
                "tableAddressPin": $scope.customerAddress.pincode,
                "tableAddressFax": null,
                "tableAddressContactPerson1": $scope.customerAddress.contactPersonName,
                "tableAddressPhone1": $scope.customerAddress.contactPhone,
                "tableAddressEmail1": $scope.customerAddress.contactEmail,
                "tableAddressLatitude": latitude,
                "tableAddressLongitude": longitude,
                "tableAddressType": {
                    "idtableAddressTypeId": 1,
                    "tableAddressTypeString": "Shipping"
                },
                "tableCity": $scope.customerAddress.city
            }
        }

        console.log(postShippingAddressData);

        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/customers/' + $scope.customerId + '/shippingaddress',
            data: postShippingAddressData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            console.log(res);
            if (res) {
                $scope.shipAddressMode = "add";
                $scope.customerAddress = [];
                $scope.state = "";
                $scope.district = "";
                $scope.cityVal = "";
                growl.success("Customer Shipping Address Added Successfully");
                if ($scope.modeCustomer == 'normal') {
                    $scope.listOfCustomerCount($scope.vmPager.currentPage);
                }
                if ($scope.modeCustomer == 'mutual') {
                    $scope.listOfMutualCustomersCount($scope.vmPager.currentPage);
                }
                if ($scope.modeCustomer == 'skuFull') {
                    $scope.listOfMutualSkuCount($scope.vmPager.currentPage);
                }
                $('#shippingAddressModal').modal('hide');
            }
        }).error(function(error) {
            console.log(error);
            growl.error("Customer Shipping Address Cannot Be Added");
            $('#shippingAddressModal').modal('hide');
        });
    };

    //saving billing address data based on customer id
    $scope.saveBillingAddressData = function() {
        var latitude = $scope.searchLocation.latitude;
        var longitude = $scope.searchLocation.longitude;

        var postBillingAddressData = {
            "idtableCustomerBillingAddressListId": 1,
            "tableAddress": {
                "idtableAddressId": 1,
                "tableAddress1": $scope.customerAddress.adLine1,
                "tableAddress2": $scope.customerAddress.adLine2,
                "tableAddress3": $scope.customerAddress.adLine3,
                "tableAddress4": null,
                "tableAddressPin": $scope.customerAddress.pincode,
                "tableAddressFax": null,
                "tableAddressContactPerson1": $scope.customerAddress.contactPersonName,
                "tableAddressPhone1": $scope.customerAddress.contactPhone,
                "tableAddressEmail1": $scope.customerAddress.contactEmail,
                "tableAddressLatitude": latitude,
                "tableAddressLongitude": longitude,
                "tableAddressType": {
                    "idtableAddressTypeId": 2,
                    "tableAddressTypeString": "Billing"
                },
                "tableCity": $scope.customerAddress.city
            }
        }

        console.log(postBillingAddressData);

        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/customers/' + $scope.customerId + '/billingaddress',
            data: postBillingAddressData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            console.log(res);
            if (res) {
                $scope.billAddressMode = "add";
                $scope.customerAddress = [];
                $scope.state = "";
                $scope.district = "";
                $scope.cityVal = "";
                growl.success("Customer Billing Address Added Successfully");
                if ($scope.modeCustomer == 'normal') {
                    // $scope.listOfCustomers();
                    $scope.listOfCustomerCount($scope.vmPager.currentPage);
                }
                if ($scope.modeCustomer == 'mutual') {
                    // $scope.listOfMutualCustomers();
                    $scope.listOfMutualCustomersCount($scope.vmPager.currentPage);
                }
                if ($scope.modeCustomer == 'skuFull') {
                    // $scope.listOfMutualCustomers();
                    $scope.listOfMutualSkuCount($scope.vmPager.currentPage);
                }
                $('#billingAddressModal').modal('hide');
            }
        }).error(function(error) {
            console.log(error);
            growl.error("Customer Billing Address Cannot Be Added");
            $('#billingAddressModal').modal('hide');
        });
    };

    //EDIT shipping address data based on customer id and ship address id
    $scope.editShippingAddressData = function() {
        var latitude = $scope.searchLocation.latitude;
        var longitude = $scope.searchLocation.longitude;

        var putShippingAddressData = {
            "tableAddress": {
                "idtableAddressId": 1,
                "tableAddress1": $scope.customerAddress.adLine1,
                "tableAddress2": $scope.customerAddress.adLine2,
                "tableAddress3": $scope.customerAddress.adLine3,
                "tableAddress4": null,
                "tableAddressPin": $scope.customerAddress.pincode,
                "tableAddressFax": null,
                "tableAddressContactPerson1": $scope.customerAddress.contactPersonName,
                "tableAddressPhone1": $scope.customerAddress.contactPhone,
                "tableAddressEmail1": $scope.customerAddress.contactEmail,
                "tableAddressLatitude": latitude,
                "tableAddressLongitude": longitude,
                "tableAddressType": {
                    "idtableAddressTypeId": 1,
                    "tableAddressTypeString": "Shipping"
                },
                "tableCity": $scope.customerAddress.city
            }
        }

        console.log(putShippingAddressData);

        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/customers/' + $scope.customerId + '/shippingaddress/' + $scope.addressId,
            data: putShippingAddressData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            console.log(res);
            if (res) {
                $scope.shipAddressMode = "add";
                $scope.customerAddress = [];
                $scope.state = "";
                $scope.district = "";
                $scope.cityVal = "";
                growl.success("Customer Shipping Address Edited Successfully");
                if ($scope.modeCustomer == 'normal') {
                    $scope.listOfCustomerCount($scope.vmPager.currentPage);
                }
                if ($scope.modeCustomer == 'mutual') {
                    $scope.listOfMutualCustomersCount($scope.vmPager.currentPage);
                }
                if ($scope.modeCustomer == 'skuFull') {
                    $scope.listOfMutualSkuCount($scope.vmPager.currentPage);
                }
                $('#shippingAddressModal').modal('hide');
            }
        }).error(function(error) {
            console.log(error);
            growl.error("Customer Shipping Address Cannot Be Edited");
            $('#shippingAddressModal').modal('hide');
        });
    };

    //EDIT billing address data based on customer id and ship address id
    $scope.editBillingAddressData = function() {
        var latitude = $scope.searchLocation.latitude;
        var longitude = $scope.searchLocation.longitude;

        var putBillingAddressData = {
            "tableAddress": {
                "idtableAddressId": 1,
                "tableAddress1": $scope.customerAddress.adLine1,
                "tableAddress2": $scope.customerAddress.adLine2,
                "tableAddress3": $scope.customerAddress.adLine3,
                "tableAddress4": null,
                "tableAddressPin": $scope.customerAddress.pincode,
                "tableAddressFax": null,
                "tableAddressContactPerson1": $scope.customerAddress.contactPersonName,
                "tableAddressPhone1": $scope.customerAddress.contactPhone,
                "tableAddressEmail1": $scope.customerAddress.contactEmail,
                "tableAddressLatitude": latitude,
                "tableAddressLongitude": longitude,
                "tableAddressType": {
                    "idtableAddressTypeId": 2,
                    "tableAddressTypeString": "Billing"
                },
                "tableCity": $scope.customerAddress.city
            }
        }

        console.log(putBillingAddressData);

        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/customers/' + $scope.customerId + '/billingaddress/' + $scope.addressId,
            data: putBillingAddressData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            console.log(res);
            if (res) {
                $scope.billAddressMode = "add";
                $scope.customerAddress = [];
                $scope.state = "";
                $scope.district = "";
                $scope.cityVal = "";
                growl.success("Customer Billing Address Edited Successfully");
                if ($scope.modeCustomer == 'normal') {
                    $scope.listOfCustomerCount($scope.vmPager.currentPage);
                }
                if ($scope.modeCustomer == 'mutual') {
                    $scope.listOfMutualCustomersCount($scope.vmPager.currentPage);
                }
                if ($scope.modeCustomer == 'skuFull') {
                    $scope.listOfMutualSkuCount($scope.vmPager.currentPage);
                }
                $('#billingAddressModal').modal('hide');
            }
        }).error(function(error, status) {
            console.log(error);

            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to Login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);
                $location.path('/login');
            }
            growl.error("Customer Billing Address Cannot Be Edited");
            $('#billingAddressModal').modal('hide');
        });
    };

    $scope.addCustomer = function(ev) {
        $scope.creationSourceData("Manual");
        $scope.customersData = [];
        $scope.showCustomerBox(ev);
    };

    $scope.editCustomer = function(ev, customerId) {
        $scope.customerMode = "edit";
        $http.get(baseUrl + '/omsservices/webapi/customers/' + customerId).success(function(response) {
            console.log(response);
            $scope.customersData = response;
            console.log($scope.creationSourceArray);

            $scope.originalEmail = response.tableCustomerEmail;
            $scope.originalPhone = response.tableCustomerPhone;
            $scope.valueInfoId = response.tableSalesChannelValueInfo.idtableSalesChannelValueInfoId;
            if (response.tableCustomerType != null) {
                $scope.customersData.tableCustomerTypeString = response.tableCustomerType.tableCustomerTypeString;
            }
            if ($scope.customersData != null) {
                $scope.creationSourceData("Manual").then(
                    function(v) {
                        if (v) {
                            console.log(v);
                            $scope.tableSalesChannelValueInfo = initializeDropdowns($scope.creationSourceArray, 'idtableSalesChannelValueInfoId', $scope.valueInfoId);
                        }
                    });
                $scope.showCustomerBox(ev);
            }
        });
    };

    $scope.editShippingAddressCustomer = function(customerId, addressId, customerTypeId) {
        console.log(customerTypeId);
        $scope.customerTypeId = customerTypeId;
        $scope.shipAddressMode = 'edit';
        console.log(addressId);
        console.log(customerId);
        $scope.customerAddress = [];
        $http.get(baseUrl + '/omsservices/webapi/customers/' + customerId + '/shippingaddress/' + addressId).success(function(response) {
            console.log(response);

            $scope.addressId = addressId;
            $scope.customerId = customerId;
            $scope.customerAddress.contactPersonName = response.tableAddress.tableAddressContactPerson1;
            $scope.customerAddress.contactEmail = response.tableAddress.tableAddressEmail1;
            $scope.customerAddress.contactPhone = response.tableAddress.tableAddressPhone1;
            $scope.customerAddress.adLine1 = response.tableAddress.tableAddress1;
            $scope.customerAddress.adLine2 = response.tableAddress.tableAddress2;
            $scope.customerAddress.adLine3 = response.tableAddress.tableAddress3;
            $scope.customerAddress.pincode = parseInt(response.tableAddress.tableAddressPin);
            $scope.customerAddress.stateData = initializeDropdowns($scope.regionsStatesArray, 'idtableStateId', response.tableAddress.tableCity.tableDistrict.tableState.idtableStateId);
            $scope.regionsStatesDistrictArray = [];
            var regionsStatesDistrictUrl = baseUrl + "/omsservices/webapi/countries/1/states/" + $scope.customerAddress.stateData.idtableStateId + "/districts";
            $http.get(regionsStatesDistrictUrl).success(function(data) {
                if (data != null) {
                    for (var i = 0; i < data.length; i++) {
                        $scope.regionsStatesDistrictArray.push(data[i]);
                        $scope.state = data[i].tableState.tableStateLongName;
                    }
                    console.log($scope.regionsStatesDistrictArray);
                    $scope.customerAddress.districtData = initializeDropdowns($scope.regionsStatesDistrictArray, 'idtableDistrictId', response.tableAddress.tableCity.tableDistrict.idtableDistrictId);
                    console.log($scope.customerAddress.districtData);
                }
            }).error(function(error, status) {
                console.log(error);
                console.log(status);
                if (status == 401) {
                    growl.error('Your session has been expired. You need to Login again.');
                    //$('#AuthError').modal('show');
                    $cookies.put('isLoggedIn', false);
                    $location.path('/login');
                }
            });

            $scope.regionsStatesDistrictsCityArray = [];
            var regionsStatesDistrictsCityUrl = baseUrl + "/omsservices/webapi/countries/1/states/" + $scope.customerAddress.stateData.idtableStateId + "/districts/" + response.tableAddress.tableCity.tableDistrict.idtableDistrictId + "/cities";
            $http.get(regionsStatesDistrictsCityUrl).success(function(data1) {
                if (data1 != null) {
                    for (var i = 0; i < data1.length; i++) {
                        $scope.regionsStatesDistrictsCityArray.push(data1[i]);
                        $scope.district = data1[i].tableDistrict.tableDistrictLongName;
                    }
                    console.log($scope.regionsStatesDistrictsCityArray);
                    $scope.customerAddress.city = initializeDropdowns($scope.regionsStatesDistrictsCityArray, 'idtableCityId', response.tableAddress.tableCity.idtableCityId);
                    console.log($scope.customerAddress.city);
                    $scope.cityVal = $scope.customerAddress.city.tableCityLongName;
                }
            }).error(function(error, status) {
                console.log(error);
                console.log(status);
                if (status == 401) {
                    growl.error('Your session has been expired. You need to Login again.');
                    //$('#AuthError').modal('show');
                    $cookies.put('isLoggedIn', false);
                    $location.path('/login');
                }
            });

            $scope.searchLocation = {
                latitude: response.tableAddress.tableAddressLatitude,
                longitude: response.tableAddress.tableAddressLongitude
            }

            $('#shippingAddressModal').modal('show');
        });
    };

    $scope.editBillingAddressCustomer = function(customerId, addressId, customerTypeId) {
        $scope.billAddressMode = 'edit';
        $scope.customerTypeId = customerTypeId;
        console.log(addressId);
        console.log(customerId);
        $scope.customerAddress = [];
        $http.get(baseUrl + '/omsservices/webapi/customers/' + customerId + '/billingaddress/' + addressId).success(function(response) {
            console.log(response);
            $scope.addressId = addressId;
            $scope.customerId = customerId;
            $scope.customerAddress.contactPersonName = response.tableAddress.tableAddressContactPerson1;
            $scope.customerAddress.contactEmail = response.tableAddress.tableAddressEmail1;
            $scope.customerAddress.contactPhone = response.tableAddress.tableAddressPhone1;
            $scope.customerAddress.adLine1 = response.tableAddress.tableAddress1;
            $scope.customerAddress.adLine2 = response.tableAddress.tableAddress2;
            $scope.customerAddress.adLine3 = response.tableAddress.tableAddress3;
            $scope.customerAddress.pincode = parseInt(response.tableAddress.tableAddressPin);

            $scope.customerAddress.stateData = initializeDropdowns($scope.regionsStatesArray, 'idtableStateId', response.tableAddress.tableCity.tableDistrict.tableState.idtableStateId);
            $scope.regionsStatesDistrictArray = [];
            var regionsStatesDistrictUrl = baseUrl + "/omsservices/webapi/countries/1/states/" + $scope.customerAddress.stateData.idtableStateId + "/districts";
            $http.get(regionsStatesDistrictUrl).success(function(data) {
                if (data != null) {
                    for (var i = 0; i < data.length; i++) {
                        $scope.regionsStatesDistrictArray.push(data[i]);
                        $scope.state = data[i].tableState.tableStateLongName;
                    }
                    console.log($scope.regionsStatesDistrictArray);
                    $scope.customerAddress.districtData = initializeDropdowns($scope.regionsStatesDistrictArray, 'idtableDistrictId', response.tableAddress.tableCity.tableDistrict.idtableDistrictId);
                    console.log($scope.customerAddress.districtData);
                }
            }).error(function(error, status) {
                console.log(error);
                console.log(status);
                if (status == 401) {
                    growl.error('Your session has been expired. You need to Login again.');
                    //$('#AuthError').modal('show');
                    $cookies.put('isLoggedIn', false);
                    $location.path('/login');
                }
            });

            $scope.regionsStatesDistrictsCityArray = [];
            var regionsStatesDistrictsCityUrl = baseUrl + "/omsservices/webapi/countries/1/states/" + $scope.customerAddress.stateData.idtableStateId + "/districts/" + response.tableAddress.tableCity.tableDistrict.idtableDistrictId + "/cities";
            $http.get(regionsStatesDistrictsCityUrl).success(function(data1) {
                if (data1 != null) {
                    for (var i = 0; i < data1.length; i++) {
                        $scope.regionsStatesDistrictsCityArray.push(data1[i]);
                        $scope.district = data1[i].tableDistrict.tableDistrictLongName;
                    }
                    console.log($scope.regionsStatesDistrictsCityArray);
                    $scope.customerAddress.city = initializeDropdowns($scope.regionsStatesDistrictsCityArray, 'idtableCityId', response.tableAddress.tableCity.idtableCityId);
                    console.log($scope.customerAddress.city);
                    $scope.cityVal = $scope.customerAddress.city.tableCityLongName;
                }
            }).error(function(error, status) {
                console.log(error);
                console.log(status);
                if (status == 401) {
                    growl.error('Your session has been expired. You need to Login again.');
                    //$('#AuthError').modal('show');
                    $cookies.put('isLoggedIn', false);
                    $location.path('/login');
                }
            });

            $scope.searchLocation = {
                latitude: response.tableAddress.tableAddressLatitude,
                longitude: response.tableAddress.tableAddressLongitude
            }

            $('#billingAddressModal').modal('show');

        });
    };

    function initializeDropdowns(lists, prop, code) {
        lists = lists || [];
        for (var i = 0; i < lists.length; i++) {
            var list = lists[i];
            if (list[prop] === code) {
                return list;
            }
        };
        return null;
    };

    $scope.cancelShippingAddress = function() {
        $scope.shipAddressMode = 'add';
        $scope.customerAddress = [];
        $scope.state = "";
        $scope.district = "";
        $scope.cityVal = "";
        $('#shippingAddressModal').modal('hide');
    };

    $scope.cancelBillingAddress = function() {
        $scope.billAddressMode = 'add';
        $scope.customerAddress = [];
        $scope.state = "";
        $scope.district = "";
        $scope.cityVal = "";
        $('#billingAddressModal').modal('hide');
    };

    $scope.validatePhone = function(phoneCase) {
        growl.error("Please Enter Valid Phone Number");
        document.myForm.phNo.focus();
    };

    //Number Validation not allowing -,+,e
    $scope.Num = function(event) {
        var keys = {
            '0': 48,
            '1': 49,
            '2': 50,
            '3': 51,
            '4': 52,
            '5': 53,
            '6': 54,
            '7': 55,
            '8': 56,
            '9': 57,
            '+': 43
        };
        for (var index in keys) {
            if (!keys.hasOwnProperty(index)) continue;
            if (event.charCode == keys[index] || event.keyCode == keys[index]) {
                return; //default event
            }
        }
        event.preventDefault();
    };

    $scope.checkCustomerCode = function(customercode, customerMode) {
        var q = $q.defer();
        if (customerMode == "add") {
            if (customercode.length > 45) {
                growl.error("Customer Code should be less than 45 characters");
                q.resolve(false);
            } else {
                var checkCustomerCodeUrl = baseUrl + "/omsservices/webapi/customers/checkcustomercode?customercode=" + customercode;
                $http.get(checkCustomerCodeUrl).success(function(data) {
                    console.log(data);
                    if (!data.status) {
                        growl.error(data.statusMessage);
                        q.resolve(false);

                    } else {
                        q.resolve(true);
                    }
                });
            }
        } else if (customerMode == "edit") {
            q.resolve(true);
        }
        return q.promise;
    };

    $scope.checkEmail = function(email, customertype, customerMode) {
        var q = $q.defer();
        if ($scope.custEmailChangedFlag || customerMode == "add") {
            var customerid;
            if (customertype == 'B2C') {
                customerid = 1;
            } else if (customertype == 'B2B') {
                customerid = 2;
            }
            var checkEmailUrl = baseUrl + "/omsservices/webapi/customers/checkemail?email=" + email + "&customertype=" + customerid;
            console.log(checkEmailUrl);
            $http.get(checkEmailUrl).success(function(data) {
                console.log(data);
                if (data.status == false) {
                    growl.error(data.statusMessage);
                    q.resolve(false);
                }

                if (data.status == true) {
                    $scope.isCustomerValid = false;
                    q.resolve(true);
                }
            });
        } else {
            q.resolve(true);
        }
        return q.promise;
    };

    $scope.checkPhoneNo = function(phoneno, customertype, customerMode) {
        var q = $q.defer();
        if ($scope.custPhoneChangedFlag || customerMode == "add") {
            if (phoneno.length != 10) {
                growl.error('Please Enter a 10 digit valid mobile no.');
                q.resolve(false);
            } else {
                var customerid;
                if (customertype == 'B2C') {
                    customerid = 1;
                } else if (customertype == 'B2B') {
                    customerid = 2;
                }
                var checkPhoneUrl = baseUrl + "/omsservices/webapi/customers/checkphonenumber?phone=" + phoneno + "&customertype=" + customerid;
                console.log(checkPhoneUrl);
                $http.get(checkPhoneUrl).success(function(data) {
                    console.log(data);
                    if (data.status == false) {
                        growl.error(data.statusMessage);
                        q.resolve(false);
                    }

                    if (data.status == true) {
                        q.resolve(true);
                    }
                });
            }
        } else {
            q.resolve(true);
        }
        return q.promise;
    };
}
