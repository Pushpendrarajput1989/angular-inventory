myApp.controller('vendorController', vendorController);

vendorController.$inject = ['$scope', '$http', '$location', 'fileUpload', '$mdDialog', '$mdMedia', 'baseUrl', 'growl', 'PagerService', '$q'];

function vendorController($scope, $http, $location, fileUpload, $mdDialog, $mdMedia, baseUrl, growl, PagerService, $q) {

    $scope.baseSkuUrl = baseUrl + '/omsservices/webapi/skus/search?search=';
    $scope.baseCustomerUrl = baseUrl + '/omsservices/webapi/customers/search?search=';
    $scope.searchVendorClicked = false;

    //Vendor No
    $scope.firstVendorNo = 1;
    $scope.secVendorNo = 2;
    $scope.thirdVendorNo = 3;
    $scope.fourthVendorNo = 4;
    $scope.fifthVendorNo = 5;

    $scope.vendorMode = "add";
    $scope.vendorAddressMode = "add";
    $scope.start = 0;
    $scope.vendorSize = 5;

    $scope.uFirstMode = true;
    $scope.uSecMode = false;
    $scope.uThirdMode = false;
    $scope.uFourthMode = false;
    $scope.uFifthMode = false;
    $scope.pricingtierDetailsClicked = false;
    $scope.unitquantityClicked = false;
    $scope.pricingTiers = [];
    $scope.selectedList = [];
    $scope.vendorSkuMapMode = "add";

    $scope.vendorCodeEntered = false;
    $scope.companyNameEntered = false;
    $scope.personNameEntered = false;
    $scope.phoneNumberEntered = false;

    $scope.isSubmitDisabledMutual = true;
    $scope.isResetDisabledMutual = true;

    $scope.isSubmitDisabledSku = true;
    $scope.isResetDisabledSku = true;

    $scope.isOqmStringValid = false;
    $scope.isMultipierValid = false;
    $scope.isOqmTypeValid = false;

    $scope.sortType = "tableVendorName";
    $scope.directionType = "asc";
    $scope.sortReverse = true; // set the default sort order

    $scope.isProductSelected = false;
    $scope.vendorSkuCodeEntered = false;
    $scope.minOrderQtyEntered = false;
    $scope.leadTimeEntered = false;
    $scope.isPTMinQtyEntered = false;
    $scope.isPTMaxQtyEntered = false;
    $scope.isPTPriceEntered = false;

    $scope.callDisabledMutual = function() {
        $scope.isSubmitDisabledMutual = false;
    }

    $scope.callDisabledSku = function() {
        $scope.isSubmitDisabledSku = false;
    }

    $scope.vendorSkuData = {
        tableVendorSystemSkuMapIsActive: false,
        tableVendorSystemSkuMapEnableBackOrder: false
    };


    $scope.$on('$routeChangeSuccess', function() {
        $scope.listOfVendors($scope.start);
        $scope.listOfVendorsCount();
        $scope.regionsStatesData();
        $scope.qcTrueLists();
    });

    $scope.pricingtierDetailRow = function() {
        console.log($scope.pricingtierDetailsClicked);
        $scope.pricingtierDetailsClicked = !$scope.pricingtierDetailsClicked;
    }

    $scope.unittierDetailRow = function() {
        console.log($scope.unitquantityClicked);
        $scope.unitquantityClicked = !$scope.unitquantityClicked;
    }

    $scope.modeVendor = "normal";

    $scope.searchLocation = {
        latitude: 28.6139391,
        longitude: 77.20902120000005
    }

    $scope.qcTrueLists = function() {
        $scope.oqmTypes = [];
        $http.get(baseUrl + '/omsservices/webapi/skuuoqmtypes').success(function(response) {
            console.log(response);
            for (var i = 0; i < response.length; i++) {
                $scope.oqmTypes.push(response[i]);
            }
        });
    }

    $scope.searchedProduct = function(selected) {
        $scope.optionsList = [];
        if (selected != null) {
            $scope.isProductSelected = false;
            $scope.skuSelected = selected;
            $http.get(baseUrl + '/omsservices/webapi/skus/' + $scope.skuSelected.originalObject.idtableSkuId + '/uoqmconfigs').success(function(response) {
                console.log(response);
                for (var i = 0; i < response.length; i++) {
                    $scope.optionsList.push({
                        oqmStr: response[i].tableSkuUoqmType.tableSkuUoqmTypeString,
                        oqmData: response[i]
                    });
                }
            });
        } else {
            $scope.isProductSelected = true;
        }
        $scope.callDisabledSku();
    }

    $scope.saveOqmConfig = function(m, t, s) {
        if (!m) {
            growl.error("Please enter the Oqm Config Multiplier Value.");
            $scope.isMultipierValid = true;
        } else {
            $scope.isMultipierValid = false;
            $scope.multiplier = m;
            if (!t) {
                growl.error("Please enter the Oqm Type.");
                $scope.isOqmTypeValid = true;
            } else {
                $scope.isOqmTypeValid = false;
                console.log(m, t, s);
                var data = {
                    "tableSkuUoqmConfigBaseMultiplier": m,
                    "tableSkuUoqmType": JSON.parse(t)
                }

                console.log(data);
                $http({
                    method: 'POST',
                    url: baseUrl + '/omsservices/webapi/skus/' + s.originalObject.idtableSkuId + '/uoqmconfigs',
                    data: data,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).success(function(res) {
                    console.log(res);
                    if (res != null) {
                        growl.success("New Configuraton Added Successfully");
                        $scope.searchedProduct(s);
                    }
                    $('#myModal1').modal('hide');
                });
            }
        }
    }

    $scope.saveOqmString = function(oqmString) {
        if (!oqmString) {
            growl.error("Please enter the Oqm Type String");
            $scope.isOqmStringValid = true;
        } else {
            var data = {
                "tableSkuUoqmTypeString": oqmString
            }

            console.log(data);
            $http({
                method: 'POST',
                url: baseUrl + '/omsservices/webapi/skuuoqmtypes',
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(res) {
                console.log(res);
                if (res != null) {
                    growl.success("New Oqm Type Sting Added Successfully");
                    $scope.isOqmStringValid = false;
                    $scope.qcTrueLists();
                }
                $('#myModal2').modal('hide');
            });
        }
    }

    $scope.addVendorSkuGetId = function(id) {
        $scope.vendorSkuMapMode = "add";
        $scope.PT = [];
        $scope.vendorId = id;
    };

    $scope.removeProduct = function(index) {
        $scope.pricingTiers.splice(index, 1);
    };

    $scope.addPricingtier = function() {
        if (!$scope.PT) {
            growl.error("Please enter the Minimum Quantity");
            $scope.isPTMinQtyEntered = true;
        } else {
            var min = $scope.PT.tableVendorSkuPricingTiersQtyMin;
            var max = $scope.PT.tableVendorSkuPricingTiersQtyMax;
            var price = $scope.PT.tableVendorSkuPricingTiersPrice;

            if (!min) {
                growl.error("Please enter the Minimum Quantity");
                $scope.isPTMinQtyEntered = true;
            } else if (min < 1) {
                growl.error("Minimum Quantity should be greater than 0");
                $scope.isPTMinQtyEntered = true;
            } else if (!max) {
                growl.error("Please enter the Maximum Quantity");
                $scope.isPTMaxQtyEntered = true;
            } else if (max < min) {
                growl.error("Maximum Quantity should be greater than the Minimum Quantity");
                $scope.isPTMaxQtyEntered = true;
            } else if (!price) {
                growl.error("Please enter the Price");
                $scope.isPTPriceEntered = true;
            } else if (price < 1) {
                growl.error("Price should be greater than 0");
                $scope.isPTPriceEntered = true;
            } else {
                $scope.pricingTiers.push({
                    "tableVendorSkuPricingTiersQtyMin": min,
                    "tableVendorSkuPricingTiersQtyMax": max,
                    "tableVendorSkuPricingTiersPrice": price
                });
                growl.success("Pricing Tier Added");
                $scope.PT = [];
            }
        }
    };

    // fetching list of vendors from RestAPI OMS
    $scope.listOfVendors = function(start) {
        console.log($scope.start);
        var vendorsListUrl = baseUrl + "/omsservices/webapi/vendors";
        vendorsListUrl += "?start=" + start + "&size=5&sort=" + $scope.sortType + "&direction=" + $scope.directionType;
        console.log(vendorsListUrl);
        $http.get(vendorsListUrl).success(function(data) {
            $scope.vendorsLists = data;
            console.log(data);
            $scope.dayDataCollapse = [];

            for (var i = 0; i < $scope.vendorsLists.length; i += 1) {
                $scope.dayDataCollapse.push(false);
            }
        }).error(function(error, status) {
            console.log(error);
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    }

    $scope.listOfVendorsCount = function(page) {
        console.log(page);
        var vendorCountUrl = baseUrl + "/omsservices/webapi/vendors/count";
        $http.get(vendorCountUrl).success(function(data) {
            $scope.vendorCount = data;
            console.log($scope.vendorCount);
            if (data != null) {
                var vm = this;

                vm.dummyItems = _.range(0, $scope.vendorCount); // dummy array of items to be paged
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

                    $scope.vendorstart = (vm.pager.currentPage - 1) * 5;
                    $scope.vendorsize = $scope.vendorstart + 5;
                    console.log($scope.vendorstart);
                    console.log($scope.vendorSize);
                    // get current page of items
                    vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                    $scope.vmItems = vm.items;
                    $scope.listOfVendors($scope.vendorstart);
                }
            }
        }).error(function(error, status) {
            console.log(error);
            if (status == 401) {
                //$('#AuthError').modal('show');
                $location.path('/login');
            }
        });
    }


    //fetching list of mutual vendors from mutually exlusive search string vendor
    $scope.listOfMutualVendors = function(start) {
        var vendorsListUrl = baseUrl + "/omsservices/webapi/vendors/search?search=" + $scope.wordSearch;
        vendorsListUrl += "&start=" + start + "&size=5&sort=" + $scope.sortType + "&direction=" + $scope.directionType;
        console.log(vendorsListUrl);
        $http.get(vendorsListUrl).success(function(data) {
            console.log(data);
            $scope.vendorsLists = data;
            $scope.dayDataCollapse = [];

            for (var i = 0; i < $scope.vendorsLists.length; i += 1) {
                $scope.dayDataCollapse.push(false);
            }
        }).error(function(error, status) {
            console.log(error);
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    }

    //fetching list of mutual vendors count
    $scope.listOfMutualVendorsCount = function(page) {
            var vendorCountUrl = baseUrl + "/omsservices/webapi/vendors/searchcount?search=" + $scope.wordSearch;
            console.log("Vendor MAIN COUNT URL");
            console.log(vendorCountUrl);
            $http.get(vendorCountUrl).success(function(data) {
                $scope.vendorCount = data;
                if (data != null) {
                    var vm = this;

                    vm.dummyItems = _.range(0, $scope.vendorCount); // dummy array of items to be paged
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

                        $scope.vendorstart = (vm.pager.currentPage - 1) * 5;
                        $scope.vendorsize = $scope.vendorstart + 5;
                        console.log($scope.vendorstart);
                        console.log($scope.vendorSize);
                        // get current page of items
                        vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                        $scope.vmItems = vm.items;
                        $scope.listOfMutualVendors($scope.vendorstart);
                    }
                }
            }).error(function(error, status) {
                console.log(error);
                if (status == 401) {
                    //$('#AuthError').modal('show');
                    growl.error('Your session has been expired. You need to Login again.');
                    $location.path('/login');
                }
            });
        }
        //fetchng list of vendors mutual count ends here

    //fetching list of skumap vendors
    $scope.listOfSkuMapVendors = function(start) {
        var vendorsListUrl = baseUrl + "/omsservices/webapi/vendors/vendorsystemskumap/" + $scope.skuId + "/vendorsearch";
        vendorsListUrl += "?start=" + start + "&size=5&sort=" + $scope.sortType + "&direction=" + $scope.directionType;
        console.log(vendorsListUrl);
        $http.get(vendorsListUrl).success(function(data) {
            $scope.vendorsLists = data;
            $scope.dayDataCollapse = [];

            for (var i = 0; i < $scope.vendorsLists.length; i += 1) {
                $scope.dayDataCollapse.push(false);
            }
        }).error(function(error, status) {
            console.log(error);
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    }

    //fetching list of skumap vendors count
    $scope.listOfSkuMapVendorsCount = function(page) {
            var vendorCountUrl = baseUrl + "/omsservices/webapi/vendors/vendorsystemskumap/" + $scope.skuId + "/vendorsearchcount";
            console.log("Vendor MAIN COUNT URL");
            console.log(vendorCountUrl);
            $http.get(vendorCountUrl).success(function(data) {
                console.log(data);
                $scope.vendorCount = data;
                if (data != null) {
                    var vm = this;

                    vm.dummyItems = _.range(0, $scope.vendorCount); // dummy array of items to be paged
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

                        $scope.vendorstart = (vm.pager.currentPage - 1) * 5;
                        $scope.vendorsize = $scope.vendorstart + 5;
                        console.log($scope.vendorstart);
                        console.log($scope.vendorSize);
                        // get current page of items
                        vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                        $scope.vmItems = vm.items;
                        $scope.listOfSkuMapVendors($scope.vendorstart);
                    }
                }
            }).error(function(error, status) {
                console.log(error);
                if (status == 401) {
                    //$('#AuthError').modal('show');
                    growl.error('Your session has been expired. You need to Login again.');
                    $location.path('/login');
                }
            });
        }
        //fetchng list of kumap vendors count ends here

    //Pagination Code for Vendor
    $scope.startIncrement = function() {

        console.log($scope.vendorSize);
        console.log($scope.vendorCount);
        if ($scope.vendorSize >= $scope.vendorCount) {
            console.log("Vendors For that Range Does Not Exist");
            growl.error("Vendors For that Range Does Not Exist");
        }
        if ($scope.vendorSize < $scope.vendorCount) {
            console.log($scope.firstVendorNo);
            $scope.firstVendorNo = $scope.firstVendorNo + 1;
            $scope.secVendorNo = $scope.secVendorNo + 1;
            $scope.thirdVendorNo = $scope.thirdVendorNo + 1;
            $scope.fourthVendorNo = $scope.fourthVendorNo + 1;
            $scope.fifthVendorNo = $scope.fifthVendorNo + 1;

            console.log($scope.start);
            console.log($scope.firstVendorNo);
            $scope.start = ($scope.firstVendorNo - 1) * 5;
            $scope.vendorSize = $scope.start + 5;
            if ($scope.modeVendor == "normal") {
                $scope.listOfVendors($scope.vendorstart);
                $scope.listOfVendorsCount();
            }
            if ($scope.modeVendor == "mutual") {
                $scope.listOfMutualVendors();
                $scope.listOfMutualVendorsCount();
            }
            if ($scope.modeVendor == "skumap") {
                $scope.listOfSkuMapVendors();
                $scope.listOfSkuMapVendorsCount();
            }
        }
    }

    $scope.startDecrement = function() {
        console.log($scope.firstVendorNo);
        if ($scope.firstVendorNo == 1) {
            console.log("Vendors For that Range Does Not Exist");
            growl.error("Vendors For that Range Does Not Exist");
        }
        if ($scope.firstVendorNo > 1) {
            $scope.firstVendorNo = $scope.firstVendorNo - 1;
            $scope.secVendorNo = $scope.secVendorNo - 1;
            $scope.thirdVendorNo = $scope.thirdVendorNo - 1;
            $scope.fourthVendorNo = $scope.fourthVendorNo - 1;
            $scope.fifthVendorNo = $scope.fifthVendorNo - 1;

            console.log($scope.start);
            console.log($scope.firstVendorNo);
            $scope.start = ($scope.firstVendorNo - 1) * 5;
            $scope.vendorSize = $scope.start + 5;
            if ($scope.modeVendor == "normal") {
                $scope.listOfVendors($scope.vendorstart);
                $scope.listOfVendorsCount();
            }
            if ($scope.modeVendor == "mutual") {
                $scope.listOfMutualVendors();
                $scope.listOfMutualVendorsCount();
            }
            if ($scope.modeVendor == "skumap") {
                $scope.listOfSkuMapVendors();
                $scope.listOfSkuMapVendorsCount();
            }
        }
    }

    $scope.zeroDecrement = function() {
        growl.error("Customers for that range does not exist");
    }

    $scope.callVendorList = function(number, underlinemode) {
            console.log(number);
            console.log($scope.vendorCountWithoutDecimal);
            if (number <= $scope.vendorCountWithoutDecimal) {
                console.log(underlinemode);
                if (underlinemode == 'uFirstMode') {
                    $scope.uFirstMode = true;
                    $scope.uSecMode = false;
                    $scope.uThirdMode = false;
                    $scope.uFouthMode = false;
                    $scope.uFifthMode = false;
                }

                if (underlinemode == 'uSecMode') {
                    $scope.uFirstMode = false;
                    $scope.uSecMode = true;
                    $scope.uThirdMode = false;
                    $scope.uFouthMode = false;
                    $scope.uFifthMode = false;
                }

                if (underlinemode == 'uThirdMode') {
                    $scope.uFirstMode = false;
                    $scope.uSecMode = false;
                    $scope.uThirdMode = true;
                    $scope.uFouthMode = false;
                    $scope.uFifthMode = false;
                }

                if (underlinemode == 'uFourthMode') {
                    $scope.uFirstMode = false;
                    $scope.uSecMode = false;
                    $scope.uThirdMode = false;
                    $scope.uFouthMode = true;
                    $scope.uFifthMode = false;
                }

                if (underlinemode == 'uFifthMode') {
                    $scope.uFirstMode = false;
                    $scope.uSecMode = false;
                    $scope.uThirdMode = false;
                    $scope.uFouthMode = false;
                    $scope.uFifthMode = true;
                }
                console.log(number);
                console.log($scope.start);
                if (number) {
                    $scope.start = (number - 1) * 5;
                }
                console.log($scope.start);
                $scope.vendorSize = $scope.start + 5;
                if ($scope.modeVendor == "normal") {
                    $scope.listOfVendors($scope.vendorstart);
                    $scope.listOfVendorsCount();
                }
                if ($scope.modeVendor == "mutual") {
                    $scope.listOfMutualVendors($scope.vendorstart);
                    $scope.listOfMutualVendorsCount();
                }
                if ($scope.modeVendor == "skumap") {
                    $scope.listOfSkuMapVendors($scope.vendorstart);
                    $scope.listOfSkuMapVendorsCount();
                }
            }
            if (number > $scope.vendorCountWithoutDecimal) {
                console.log("Vendors For that Range Does Not Exist");
                growl.error("Vendors For that Range Does Not Exist");
            }
        }
        //Pagination Code for Vendor Ends Here

    //clear action for vendor mutual search
    $scope.clearMutualVendorAction = function() {
        $scope.sortType = "tableVendorName";
        $scope.directionType = "asc";
        $scope.sortReverse = true;
        $scope.vendorstart = 0;
        $scope.modeVendor = "normal";
        // $scope.listOfVendors($scope.vendorstart);
        $scope.isSubmitDisabledMutual = true;
        $scope.isResetDisabledMutual = false;
        var page = undefined;
        $scope.listOfVendorsCount(page);
    }

    $scope.clearSkuMapVendorAction = function() {
        $scope.sortType = "tableVendorName";
        $scope.directionType = "asc";
        $scope.sortReverse = true;
        $scope.vendorstart = 0;
        $scope.modeVendor = "normal";
        var productId = 'products';
        if (productId) {
            $scope.$broadcast('angucomplete:clearInput', productId);
            $scope.skuId = "";
        }
        // $scope.listOfVendors($scope.vendorstart);
        $scope.isSubmitDisabledSku = true;
        $scope.isResetDisabledSku = false;
        var page = undefined;
        $scope.listOfVendorsCount(page);
    }

    //submit vendor action mutual sku
    $scope.submitvendorAction = function(wordSearch) {

        $scope.sortType = "tableVendorName";
        $scope.directionType = "asc";
        $scope.sortReverse = true; // set the default sort order
        $scope.wordSearch = wordSearch;
        $scope.modeVendor = "mutual";
        // $scope.listOfMutualVendors();
        $scope.isSubmitDisabledMutual = true;
        $scope.isResetDisabledMutual = false;
        var page = undefined;
        $scope.listOfMutualVendorsCount(page);
    }

    $scope.submitSkuMapCendorAction = function(skuId) {

            $scope.sortType = "tableVendorName";
            $scope.directionType = "asc";
            $scope.sortReverse = true; // set the default sort order
            $scope.skuId = skuId;
            $scope.modeVendor = "skumap";
            // $scope.listOfSkuMapVendors();
            $scope.isSubmitDisabledSku = true;
            $scope.isResetDisabledSku = false;
            var page = undefined;
            $scope.listOfSkuMapVendorsCount(page);
        }
        //opening and closing search accordian
    $scope.toggleSearchRow = function() {
            console.log($scope.searchVendorClicked);
            $scope.searchVendorClicked = !$scope.searchVendorClicked;
        }
        //opening and closing search accordian ends here

    //expansion and collapsing of vendor rows data
    $scope.tableRowExpanded = false;
    $scope.tableRowIndexExpandedCurr = "";
    $scope.tableRowIndexExpandedPrev = "";
    $scope.storeIdExpanded = "";

    $scope.dayDataCollapseFn = function() {
        $scope.dayDataCollapse = [];

        for (var i = 0; i < $scope.vendorsLists.length; i += 1) {
            $scope.dayDataCollapse.push(false);
        }
    };

    $scope.selectTableRow = function(index, storeId) {
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
    //expansion and collapsing of vendor rows data ends here

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
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };

    //Regions Data from region states generic API
    $scope.regionsStatesDistrictData = function(stateData, vendorId) {
        console.log(stateData);
        $scope.stateId = stateData.idtableStateId;
        $scope.regionsStatesDistrictArray = [];
        var regionsStatesDistrictUrl = baseUrl + "/omsservices/webapi/countries/1/states/" + stateData.idtableStateId + "/districts";
        $http.get(regionsStatesDistrictUrl).success(function(data) {
            if (data != null) {
                for (var i = 0; i < data.length; i++) {
                    $scope.regionsStatesDistrictArray.push(data[i]);
                    $scope.state = data[i].tableState.tableStateLongName;
                }
                console.log($scope.regionsStatesDistrictArray);
                $scope.vendorAddress.districtData = initializeDropdowns($scope.regionsStatesDistrictArray, 'idtableDistrictId', stateData.idtableDistrictId);
                console.log($scope.vendorAddress.districtData);
                $scope.getLatitudeLongitude($scope.showResult);
                $scope.getTinNo(vendorId, stateData);
            }
        }).error(function(error, status) {
            console.log(error);
            if (status == 401) {
                //$('#AuthError').modal('show');
                $location.path('/login');
            }
        });
    };

    //Regions Data from region states distict generic API
    $scope.regionsStatesDistrictsCityData = function(stateData, districtData) {
        console.log(districtData);
        $scope.regionsStatesDistrictsCityArray = [];
        $scope.districtId = districtData.idtableDistrictId;
        $scope.district = districtData.tableDistrictLongName;
        var regionsStatesDistrictsCityUrl = baseUrl + "/omsservices/webapi/countries/1/states/" + stateData.idtableStateId + "/districts/" + districtData.idtableDistrictId + "/cities";
        $http.get(regionsStatesDistrictsCityUrl).success(function(data) {
            for (var i = 0; i < data.length; i++) {
                $scope.regionsStatesDistrictsCityArray.push(data[i]);
            }
            console.log($scope.regionsStatesDistrictsCityArray);
            $scope.getLatitudeLongitude($scope.showResult);
        }).error(function(error, status) {
            console.log(error);
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };

    $scope.changeCity = function(city) {
        var cityM = city;
        console.log(cityM);
        $scope.cityVal = cityM.tableCityLongName;
        $scope.getLatitudeLongitude($scope.showResult);
    };

    //vendor add dialog box
    $scope.showvendorAddBox = function(ev) {
        $scope.vendorCodeEntered = false;
        $scope.companyNameEntered = false;
        $scope.personNameEntered = false;
        $scope.phoneNumberEntered = false;
        if ($scope.vendorMode == 'add') {
            $scope.vendorsData = null;
        }
        $mdDialog.show({
                templateUrl: 'dialog2.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                scope: $scope.$new()
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };
    //vendor add dialog box ends here

    $scope.vendorCodeChanged = function(val) {
        if (val) {
            $scope.vendorCodeEntered = false;
        } else {
            $scope.vendorCodeEntered = true;
        }
    };

    $scope.companyNameChanged = function(val) {
        if (val) {
            $scope.companyNameEntered = false;
        } else {
            $scope.companyNameEntered = true;
        }
    };

    $scope.personNameChanged = function(val) {
        if (val) {
            $scope.personNameEntered = false;
        } else {
            $scope.personNameEntered = true;
        }
    };

    $scope.phoneNumberChanged = function(val) {
        if (val) {
            $scope.phoneNumberEntered = false;
        } else {
            $scope.phoneNumberEntered = true;
        }
    };

    //add vendor data to database OMS Api
    $scope.savevendorData = function(vendorsData) {
        if (!vendorsData) {
            $scope.vendorCodeEntered = true;
            growl.error("Please enter a Vendor Code!");
        } else if (!vendorsData.tableVendorClientVendorCode) {
            $scope.vendorCodeEntered = true;
            growl.error("Please enter a Vendor Code!");
        } else {
            $scope.checkVendorCode(vendorsData.tableVendorClientVendorCode).then(
                function(v) {
                    if (v) {
                        if (!vendorsData.tableVendorName) {
                            $scope.companyNameEntered = true;
                            growl.error("Please enter a Company Name!");
                        } else {
                            $scope.checkCompany(vendorsData.tableVendorName).then(
                                function(v) {
                                    if (v) {
                                        if (!vendorsData.tableVendorContactPerson) {
                                            $scope.personNameEntered = true;
                                            growl.error("Please enter a Contact Person Name!");
                                        } else if (!vendorsData.tableVendorPhoneNumber) {
                                            $scope.phoneNumberEntered = true;
                                            growl.error("Please enter a Phone Number!");
                                        } else if (vendorsData.tableVendorPhoneNumber.length < 10 || vendorsData.tableVendorPhoneNumber.length > 10) {
                                            $scope.phoneNumberEntered = true;
                                            growl.error("Please enter a valid 10 digit Phone Number!");
                                        } else {
                                            $scope.checkPhone(vendorsData.tableVendorPhoneNumber).then(
                                                function(v) {
                                                    if (v) {
                                                        if ($scope.vendorMode == "add") {
                                                            $scope.saveVendor(vendorsData);
                                                        } else if ($scope.vendorMode == "edit") {
                                                            $scope.editVendorData(vendorsData);
                                                        }
                                                    }
                                                },
                                                function(err) {}
                                            );
                                        }
                                    }
                                },
                                function(err) {}
                            );
                        }


                    }
                },
                function(err) {}
            );
        }

    };
    //add vendor data to database OMS Api ends here

    $scope.saveVendor = function(vendorsData) {
        var postVendorData = {
            "idtableVendorId": 2,
            "tableVendorClientVendorCode": vendorsData.tableVendorClientVendorCode,
            "tableVendorName": vendorsData.tableVendorName,
            "tableVendorShortname": null,
            "tableVendorCstNo": null,
            "tableVendorReturn": null,
            "tableVendorPanNo": null,
            "tableVendorStNo": null,
            "tableVendorMinOrderValue": null,
            "tableVendorLeadTime": null,
            "tableVendorTacDocId": null,
            "tableVendorRemarks": null,
            "tableVendorDocListId": null,
            "tableVendorStateWiseVats": [],
            "tableVendorDocLists": [],
            "tableCreditDays": {
                "idtableCreditDaysId": 1,
                "tableCreditDaysString": "1 week",
                "tableCreditDaysNoOfDays": 7
            },
            "tableCurrencyCode": {
                "idtableCurrencyCodeId": 1,
                "tableCurrencyCodeShortname": "INR",
                "tableCurrencyCodeLongname": "Indian Rupee"
            },
            "tableTaxZone": null,
            "tableVendorStatusType": {
                "idtableVendorStatusTypeId": 1,
                "tableVendorStatusTypeString": "Active"
            },
            "tableVendorType": {
                "idtableVendorTypeId": 1,
                "tableVendorTypeString": "Supplier"
            },
            "tableVendorContactPerson": vendorsData.tableVendorContactPerson,
            "tableVendorEmailId": vendorsData.tableVendorEmailId,
            "tableVendorPhoneNumber": vendorsData.tableVendorPhoneNumber,
            "tableVendorSearchTag": null
        }


        console.log(postVendorData);

        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/vendors',
            data: postVendorData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            console.log(res);
            if (res) {
                console.log($scope.vendorstart);
                $scope.vendorMode = 'add';
                $scope.vendorsData = null;
                growl.success("New Vendor Added Successfully")
                if ($scope.modeVendor == "normal") {
                    // $scope.listOfVendors($scope.vendorstart);`
                    $scope.listOfVendorsCount($scope.vmPager.currentPage);
                }
                if ($scope.modeVendor == "mutual") {
                    // $scope.listOfMutualVendors($scope.vendorstart);
                    $scope.listOfMutualVendorsCount($scope.vmPager.currentPage);
                }
                if ($scope.modeVendor == "skumap") {
                    // $scope.listOfSkuMapVendors($scope.vendorstart);
                    $scope.listOfSkuMapVendorsCount($scope.vmPager.currentPage);
                }
                // $mdDialog.hide();
                $scope.cancelvendorData();
            }
        }).error(function(error, status) {
            console.log(error);
            if (status == 401) {
                //$('#AuthError').modal('show');
                $location.path('/login');
            }
            $mdDialog.hide();
        });
    };

    //opening dialog box in edit mode
    $scope.editVendor = function(ev, vendorId) {
            $scope.vendorMode = "edit";
            $http.get(baseUrl + '/omsservices/webapi/vendors/' + vendorId).success(function(response) {
                console.log(response);
                $scope.vendorsData = response;
                $scope.originalVendorCode = response.tableVendorClientVendorCode;
                $scope.originalCompanyName = response.tableVendorName;
                $scope.originalContactPersonName = response.tableVendorContactPerson;
                $scope.originalPhoneNumber = response.tableVendorPhoneNumber;
                if ($scope.vendorsData != null) {
                    $scope.showvendorAddBox(ev);
                }
            });
        }
        //opening dialog box in edit mode ends here

    // Edit Vendor Data when clicking on update button to backend OMS Customer API
    $scope.editVendorData = function(vendorsData) {
            console.log(vendorsData);
            console.log(vendorsData.idtableVendorId);

            var putVendorData = {
                "idtableVendorId": 2,
                "tableVendorClientVendorCode": vendorsData.tableVendorClientVendorCode,
                "tableVendorName": vendorsData.tableVendorName,
                "tableVendorShortname": null,
                "tableVendorCstNo": null,
                "tableVendorReturn": null,
                "tableVendorPanNo": null,
                "tableVendorStNo": null,
                "tableVendorMinOrderValue": null,
                "tableVendorLeadTime": null,
                "tableVendorTacDocId": null,
                "tableVendorRemarks": null,
                "tableVendorDocListId": null,
                "tableVendorStateWiseVats": [],
                "tableVendorDocLists": [],
                "tableCreditDays": {
                    "idtableCreditDaysId": 1,
                    "tableCreditDaysString": "1 week",
                    "tableCreditDaysNoOfDays": 7
                },
                "tableCurrencyCode": {
                    "idtableCurrencyCodeId": 1,
                    "tableCurrencyCodeShortname": "INR",
                    "tableCurrencyCodeLongname": "Indian Rupee"
                },
                "tableTaxZone": null,
                "tableVendorStatusType": {
                    "idtableVendorStatusTypeId": 1,
                    "tableVendorStatusTypeString": "Active"
                },
                "tableVendorType": {
                    "idtableVendorTypeId": 1,
                    "tableVendorTypeString": "Supplier"
                },
                "tableVendorContactPerson": vendorsData.tableVendorContactPerson,
                "tableVendorEmailId": vendorsData.tableVendorEmailId,
                "tableVendorPhoneNumber": vendorsData.tableVendorPhoneNumber,
                "tableVendorSearchTag": null
            }

            console.log(putVendorData);

            $http({
                method: 'PUT',
                url: baseUrl + '/omsservices/webapi/vendors/' + vendorsData.idtableVendorId,
                data: putVendorData,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(res) {
                console.log(res);
                if (res) {
                    $scope.vendorMode = 'add';
                    $scope.vendorsData = null;
                    growl.success("Vendor Edited Successfully");
                    if ($scope.modeVendor == "normal") {
                        // $scope.listOfVendors($scope.vendorstart);`
                        $scope.listOfVendorsCount($scope.vmPager.currentPage);
                    }
                    if ($scope.modeVendor == "mutual") {
                        // $scope.listOfMutualVendors($scope.vendorstart);
                        $scope.listOfMutualVendorsCount($scope.vmPager.currentPage);
                    }
                    if ($scope.modeVendor == "skumap") {
                        // $scope.listOfSkuMapVendors($scope.vendorstart);
                        $scope.listOfSkuMapVendorsCount($scope.vmPager.currentPage);
                    }
                    // $mdDialog.hide();
                    $scope.cancelvendorData();
                }
            }).error(function(error, status) {
                console.log(error);
                if (status == 401) {
                    //$('#AuthError').modal('show');
                    growl.error('Your session has been expired. You need to Login again.');
                    $location.path('/login');
                }
            });
        }
        // Edit Vendor Data when clicking on update button to backend OMS Customer API ends here

    $scope.cancelvendorData = function() {
        $scope.vendorMode = 'add';
        $scope.vendorsData = null;
        $mdDialog.hide();
    }

    //VENDOR ADDRESS SCREEN CONTROLLER CODE

    //dialog box to add new shipping address
    $scope.addAddress = function(vendorId) {
        console.log(vendorId);

        $scope.vendorAddress = [];
        $scope.state = "";
        $scope.district = "";
        $scope.cityVal = "";

        $scope.vendorId = vendorId;
        if ($scope.vendorAddressMode == 'add') {
            var customersByIDUrl = baseUrl + "/omsservices/webapi/vendors/" + vendorId;
            $http.get(customersByIDUrl).success(function(data) {
                $scope.vendorId = data.idtableVendorId;
                $scope.vendorAddress.contactPersonName = data.tableVendorContactPerson;
                $scope.vendorAddress.contactEmail = data.tableVendorEmailId;
                $scope.vendorAddress.contactPhone = data.tableVendorPhoneNumber;
            }).error(function(error, status) {
                console.log(error);
                if (status == 401) {
                    //$('#AuthError').modal('show');
                    growl.error('Your session has been expired. You need to Login again.');
                    $location.path('/login');
                }
            });
        }
        $('#vendorAddressModal').modal('show');
    }

    //saving shipping address data based on customer id
    $scope.saveShippingAddressData = function() {
        var latitude = $scope.searchLocation.latitude;
        var longitude = $scope.searchLocation.longitude;

        var postShippingAddressData = {
            "tableAddress": {
                "idtableAddressId": 1,
                "tableAddress1": $scope.vendorAddress.adLine1,
                "tableAddress2": $scope.vendorAddress.adLine2,
                "tableAddress3": $scope.vendorAddress.adLine3,
                "tableAddress4": null,
                "tableAddressPin": $scope.vendorAddress.pincode,
                "tableAddressFax": null,
                "tableAddressContactPerson1": $scope.vendorAddress.contactPersonName,
                "tableAddressPhone1": $scope.vendorAddress.contactPhone,
                "tableAddressEmail1": $scope.vendorAddress.contactEmail,
                "tableAddressLatitude": latitude,
                "tableAddressLongitude": longitude,
                "tableAddressType": {
                    "idtableAddressTypeId": 1,
                    "tableAddressTypeString": "Shipping"
                },
                "tableCity": $scope.vendorAddress.city
            }
        }

        console.log(postShippingAddressData);

        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/vendors/' + $scope.vendorId + '/address',
            data: postShippingAddressData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            console.log(res);
            if (res) {
                console.log($scope.tinMode);
                var tinMode = $scope.tinMode;
                console.log($scope.vendorAddress.tinNo);
                var vatNo = $scope.vendorAddress.tinNo;
                console.log($scope.vendorAddress.stateData);
                var stateData = $scope.vendorAddress.stateData;
                if (tinMode == 'post') {
                    var tinPostData = {
                        "idtableVendorStateWiseVatId": 1,
                        "tableVendorStateWiseVatNo": vatNo,
                        "tableState": stateData
                    }
                    $http({
                        method: 'POST',
                        url: baseUrl + '/omsservices/webapi/vendors/' + $scope.vendorId + '/vats',
                        data: tinPostData,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).success(function(res) {
                        if (res) {
                            console.log(res);
                            growl.success("TIN NO Added Successfully");
                        }
                    }).error(function(error) {
                        console.log(error);
                        growl.error("TIN/VAT cannot be added");
                    });
                }


                if (tinMode == 'put') {
                    var tinPutData = {
                        "tableVendorStateWiseVatNo": vatNo,
                        "tableState": stateData
                    }

                    $http({
                        method: 'PUT',
                        url: baseUrl + '/omsservices/webapi/vendors/' + vendorId + '/vats/' + tinVatId,
                        data: tinPutData,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).success(function(res) {
                        if (res) {
                            console.log(res);
                        }
                    }).error(function(error) {
                        console.log(error);
                    });
                }

                growl.success("Address added successfully");
                $scope.vendorAddress = [];
                $scope.state = "";
                $scope.district = "";
                $scope.cityVal = "";
                $scope.vendorAddressMode = "add";
                if ($scope.modeVendor == "normal") {
                    $scope.listOfVendorsCount($scope.vmPager.currentPage);
                }
                if ($scope.modeVendor == "mutual") {
                    $scope.listOfMutualVendorsCount($scope.vmPager.currentPage);
                }
                if ($scope.modeVendor == "skumap") {
                    $scope.listOfSkuMapVendorsCount($scope.vmPager.currentPage);
                }
            }
        }).error(function(error, status) {
            console.log(error);
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
        $('#vendorAddressModal').modal('hide');
    }


    //EDIT shipping address data based on customer id and ship address id
    $scope.editShippingAddressData = function() {
        var latitude = $scope.searchLocation.latitude;
        var longitude = $scope.searchLocation.longitude;

        var putShippingAddressData = {
            "tableAddress": {
                "idtableAddressId": 1,
                "tableAddress1": $scope.vendorAddress.adLine1,
                "tableAddress2": $scope.vendorAddress.adLine2,
                "tableAddress3": $scope.vendorAddress.adLine3,
                "tableAddress4": null,
                "tableAddressPin": $scope.vendorAddress.pincode,
                "tableAddressFax": null,
                "tableAddressContactPerson1": $scope.vendorAddress.contactPersonName,
                "tableAddressPhone1": $scope.vendorAddress.contactPhone,
                "tableAddressEmail1": $scope.vendorAddress.contactEmail,
                "tableAddressLatitude": latitude,
                "tableAddressLongitude": longitude,
                "tableAddressType": {
                    "idtableAddressTypeId": 1,
                    "tableAddressTypeString": "Shipping"
                },
                "tableCity": $scope.vendorAddress.city
            }
        }

        console.log(putShippingAddressData);

        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/vendors/' + $scope.vendorId + '/address/' + $scope.addressId,
            data: putShippingAddressData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            console.log(res);
            if (res) {
                var tinMode = $scope.tinMode;
                var vatNo = $scope.tinVatId;
                var stateData = $scope.vendorAddress.stateData;
                if (tinMode == 'post') {
                    var tinPostData = {
                        "idtableVendorStateWiseVatId": 1,
                        "tableVendorStateWiseVatNo": vatNo,
                        "tableState": stateData
                    }
                    $http({
                        method: 'POST',
                        url: baseUrl + '/omsservices/webapi/vendors/' + $scope.vendorId + '/vats',
                        data: tinPostData,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).success(function(res) {
                        if (res) {
                            console.log(res);
                            growl.success("TIN NO Added Successfully");
                        }
                    }).error(function(error) {
                        console.log(error);
                        growl.error("TIN/VAT cannot be added");
                    });
                }


                if (tinMode == 'put') {
                    var tinPutData = {
                        "tableVendorStateWiseVatNo": vatNo,
                        "tableState": stateData
                    }
                    console.log(tinPutData);
                    $http({
                        method: 'PUT',
                        url: baseUrl + '/omsservices/webapi/vendors/' + $scope.vendorId + '/vats/' + $scope.tinVatId,
                        data: tinPutData,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).success(function(res) {
                        if (res) {
                            console.log(res);
                        }
                    }).error(function(error) {
                        console.log(error);
                    });
                }
                growl.success("Address updated successfully");

                $scope.vendorAddress = [];
                $scope.state = "";
                $scope.district = "";
                $scope.cityVal = "";
                $scope.vendorAddressMode = "add";
                if ($scope.modeVendor == "normal") {
                    $scope.listOfVendorsCount($scope.vmPager.currentPage);
                }
                if ($scope.modeVendor == "mutual") {
                    $scope.listOfMutualVendorsCount($scope.vmPager.currentPage);
                }
                if ($scope.modeVendor == "skumap") {
                    $scope.listOfSkuMapVendorsCount($scope.vmPager.currentPage);
                }
            }
        }).error(function(error, status) {
            console.log(error);
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
        $('#vendorAddressModal').modal('hide');
    }

    $scope.editShippingAddressVendor = function(vendorId, addressId) {
        $scope.vendorAddressMode = 'edit';
        console.log(addressId);
        console.log(vendorId);
        $http.get(baseUrl + '/omsservices/webapi/vendors/' + vendorId + '/address/' + addressId).success(function(response) {
            console.log(response);
            $scope.addressId = addressId;
            $scope.vendorId = vendorId;
            $scope.vendorAddress = [];
            $scope.vendorAddress.contactPersonName = response.tableAddress.tableAddressContactPerson1;
            $scope.vendorAddress.contactEmail = response.tableAddress.tableAddressEmail1;
            $scope.vendorAddress.contactPhone = response.tableAddress.tableAddressPhone1;
            $scope.vendorAddress.adLine1 = response.tableAddress.tableAddress1;
            $scope.vendorAddress.adLine2 = response.tableAddress.tableAddress2;
            $scope.vendorAddress.adLine3 = response.tableAddress.tableAddress3;
            $scope.vendorAddress.pincode = parseInt(response.tableAddress.tableAddressPin);
            console.log(response.tableAddress);
            $scope.vendorAddress.stateData = initializeDropdowns($scope.regionsStatesArray, 'idtableStateId', response.tableAddress.tableCity.tableDistrict.tableState.idtableStateId);
            console.log($scope.vendorAddress.stateData);
            $scope.district = response.tableAddress.tableCity.tableDistrict.tableDistrictLongName;
            $scope.state = response.tableAddress.tableCity.tableDistrict.tableState.tableStateLongName;
            $scope.regionsStatesDistrictArray = [];
            var regionsStatesDistrictUrl = baseUrl + "/omsservices/webapi/countries/1/states/" + response.tableAddress.tableCity.tableDistrict.tableState.idtableStateId + "/districts";
            $http.get(regionsStatesDistrictUrl).success(function(data) {
                if (data != null) {
                    for (var i = 0; i < data.length; i++) {
                        $scope.regionsStatesDistrictArray.push(data[i]);
                    }
                    console.log($scope.regionsStatesDistrictArray);
                    $scope.vendorAddress.districtData = initializeDropdowns($scope.regionsStatesDistrictArray, 'idtableDistrictId', response.tableAddress.tableCity.tableDistrict.idtableDistrictId);
                    console.log($scope.vendorAddress.districtData);
                }
            }).error(function(error, status) {
                console.log(error);
                if (status == 401) {
                    $location.path('/login');
                }
            });

            $scope.regionsStatesDistrictsCityArray = [];
            var regionsStatesDistrictsCityUrl = baseUrl + "/omsservices/webapi/countries/1/states/" + $scope.vendorAddress.stateData.idtableStateId + "/districts/" + response.tableAddress.tableCity.tableDistrict.idtableDistrictId + "/cities";
            $http.get(regionsStatesDistrictsCityUrl).success(function(data1) {
                if (data1 != null) {
                    for (var i = 0; i < data1.length; i++) {
                        $scope.regionsStatesDistrictsCityArray.push(data1[i]);
                    }
                    console.log($scope.regionsStatesDistrictsCityArray);
                    $scope.vendorAddress.city = initializeDropdowns($scope.regionsStatesDistrictsCityArray, 'idtableCityId', response.tableAddress.tableCity.idtableCityId);
                    console.log($scope.vendorAddress.city);
                    $scope.cityVal = $scope.vendorAddress.city.tableCityLongName;
                }
            }).error(function(error, status) {
                console.log(error);
                if (status == 401) {
                    //$('#AuthError').modal('show');
                    growl.error('Your session has been expired. You need to Login again.');
                    $location.path('/login');
                }
            });

            $scope.getTinNo(vendorId, $scope.vendorAddress.stateData);


            $scope.searchLocation = {
                latitude: response.tableAddress.tableAddressLatitude,
                longitude: response.tableAddress.tableAddressLongitude
            }

            $('#vendorAddressModal').modal('show');

        });
    }

    $scope.cancelAddress = function() {
        $scope.vendorAddressMode = 'add';

        $scope.state = "";
        $scope.district = "";
        $scope.cityVal = "";

        $scope.vendorAddress = [];

        $('#vendorAddressModal').modal('hide');
    }

    $scope.validateEmail = function(emailCase) {
        if (emailCase == false) {
            growl.error("Please Enter Valid Email Id");
            document.vendForm.vendEmail.focus();
        }
    }

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

    $scope.getTinNo = function(vendorId, stateData) {
        console.log(vendorId);
        console.log(stateData.idtableStateId);
        var getTinurl = baseUrl + "/omsservices/webapi/vendors/" + vendorId + "/vats/checkvat/" + stateData.idtableStateId;
        $http.get(getTinurl).success(function(data1) {
            console.log(data1);
            if (data1) {
                $scope.tinMode = "put";
                if (!$scope.vendorAddress) {
                    $scope.vendorAddress = [];
                }
                $scope.vendorAddress.tinNo = data1.idtableVendorStateWiseVatId;
            }
        }).error(function(error) {
            // console.log(error);
        });
    }

    function initializeDropdowns(lists, prop, code) {
        lists = lists || [];
        for (var i = 0; i < lists.length; i++) {
            var list = lists[i];
            if (list[prop] === code) {
                return list;
            }
        };
        return null;
    }

    $scope.checkPhone = function(phone) {
        var q = $q.defer();
        if ($scope.vendorMode == "edit") {
            if ($scope.originalPhoneNumber == phone) {
                q.resolve(true);
            } else {
                var checkPhone = baseUrl + "/omsservices/webapi/vendors/checkphone?phone=" + phone;
                $http.get(checkPhone).success(function(data) {
                    console.log(data);
                    if (data.status == false) {
                        growl.error(data.statusMessage);
                        $scope.phoneNumberEntered = true;
                        q.resolve(false);
                    } else if (data.status == true) {
                        $scope.phoneNumberEntered = false;
                        q.resolve(true);
                    }
                });
            }
        } else if ($scope.vendorMode == "add") {
            var checkPhone = baseUrl + "/omsservices/webapi/vendors/checkphone?phone=" + phone;
            $http.get(checkPhone).success(function(data) {
                console.log(data);
                if (data.status == false) {
                    growl.error(data.statusMessage);
                    $scope.phoneNumberEntered = true;
                    q.resolve(false);
                } else if (data.status == true) {
                    $scope.phoneNumberEntered = false;
                    q.resolve(true);
                }
            });
        }
        return q.promise;
    };

    $scope.checkCompany = function(company) {
        var q = $q.defer();
        if ($scope.vendorMode == "edit") {
            if ($scope.originalCompanyName == company) {
                q.resolve(true);
            } else {
                var checkCompany = baseUrl + "/omsservices/webapi/vendors/checkcompany?company=" + company;
                $http.get(checkCompany).success(function(data) {
                    console.log(data);
                    if (data.status == false) {
                        growl.error(data.statusMessage);
                        $scope.companyNameEntered = true;
                        q.resolve(false);
                    } else if (data.status == true) {
                        $scope.companyNameEntered = false;
                        q.resolve(true);
                    }
                });
            }
        } else if ($scope.vendorMode == "add") {
            var checkCompany = baseUrl + "/omsservices/webapi/vendors/checkcompany?company=" + company;
            $http.get(checkCompany).success(function(data) {
                console.log(data);
                if (data.status == false) {
                    growl.error(data.statusMessage);
                    $scope.companyNameEntered = true;
                    q.resolve(false);
                } else if (data.status == true) {
                    $scope.companyNameEntered = false;
                    q.resolve(true);
                }
            });
        }
        return q.promise;
    };

    $scope.checkVendorCode = function(vendorcode) {
        var q = $q.defer();
        if ($scope.vendorMode == "edit") {
            if ($scope.originalVendorCode == vendorcode) {
                q.resolve(true);
            } else {
                var checkVendorCode = baseUrl + "/omsservices/webapi/vendors/checkvendorcode?vendorcode=" + vendorcode;
                console.log(checkVendorCode);
                $http.get(checkVendorCode).success(function(data) {
                    console.log(data);
                    if (data.status == false) {
                        growl.error(data.statusMessage);
                        $scope.vendorCodeEntered = true;
                        q.resolve(false);
                    } else if (data.status == true) {
                        $scope.vendorCodeEntered = false;
                        q.resolve(true);
                    }
                });
            }
        } else if ($scope.vendorMode == "add") {
            var checkVendorCode = baseUrl + "/omsservices/webapi/vendors/checkvendorcode?vendorcode=" + vendorcode;
            console.log(checkVendorCode);
            $http.get(checkVendorCode).success(function(data) {
                console.log(data);
                if (data.status == false) {
                    growl.error(data.statusMessage);
                    $scope.vendorCodeEntered = true;
                    q.resolve(false);
                } else if (data.status == true) {
                    $scope.vendorCodeEntered = false;
                    q.resolve(true);
                }
            });
        }
        return q.promise;
    };

    $scope.callVendorSkuMapRepeatData = function(vendorId) {
        console.log(vendorId);
        var callSkuMapUrl = baseUrl + "/omsservices/webapi/vendors/" + vendorId + "/skumap/";
        $http.get(callSkuMapUrl).success(function(data) {

            if (data != null) {
                $scope.skuMapData = data;
                console.log($scope.skuMapData);
            }
        })
    }

    $scope.editVendorSkuMap = function(vendorId, skuMapId) {
        $scope.vendorSkuMapMode = "edit";
        var editSkuMapUrl = baseUrl + "/omsservices/webapi/vendors/" + vendorId + "/skumap/" + skuMapId;
        $http.get(editSkuMapUrl).success(function(data) {
            if (data != null) {
                $scope.pricingTiers = [];
                $scope.PT = [];
                $scope.vendorSkuData = data;
                $scope.vendorId = vendorId;
                console.log($scope.vendorSkuData);
                // $scope.skuString = data.tableSku.tableSkuDescription;
                $scope.$broadcast("angucomplete-alt:changeInput", "products", data.tableSku.tableSkuName);
                $scope.skuSelected = {
                    originalObject: data.tableSku
                };
                for (var i = 0; i < data.tableVendorSkuPricingTierses.length; i++) {
                    $scope.pricingTiers.push({
                        "tableVendorSkuPricingTiersQtyMin": data.tableVendorSkuPricingTierses[i].tableVendorSkuPricingTiersQtyMin,
                        "tableVendorSkuPricingTiersQtyMax": data.tableVendorSkuPricingTierses[i].tableVendorSkuPricingTiersQtyMax,
                        "tableVendorSkuPricingTiersPrice": data.tableVendorSkuPricingTierses[i].tableVendorSkuPricingTiersPrice
                    })
                }
                for (var i = 0; i < data.tableVendorSkuUoqmses.length; i++) {
                    $scope.selectedList.push({
                        oqmStr: data.tableVendorSkuUoqmses[i].tableSkuUoqmConfig.tableSkuUoqmType.tableSkuUoqmTypeString,
                        oqmData: data.tableVendorSkuUoqmses[i].tableSkuUoqmConfig
                    });
                }
                $('#addVendorSku').modal('show');
            }
        })
    };

    $scope.cancelCleanData = function() {
        $scope.vendorSkuData = null;
        $scope.pricingTiers = [];
        $scope.selectedList = [];
        $scope.pricingtierDetailsClicked = false;
        $scope.unitquantityClicked = false;
        var productId = 'products';
        if (productId) {
            $scope.$broadcast('angucomplete-alt:clearInput', productId);
        }
        $scope.isProductSelected = false;
        $scope.vendorSkuCodeEntered = false;
        $scope.minOrderQtyEntered = false;
        $scope.leadTimeEntered = false;
        $scope.isPTMinQtyEntered = false;
        $scope.isPTMaxQtyEntered = false;
        $scope.isPTPriceEntered = false;
        $('#addVendorSku').modal('hide');
    }

    $scope.vendorSkuCodeChanged = function(val) {
        if (val) {
            $scope.vendorSkuCodeEntered = false;
        } else {
            $scope.vendorSkuCodeEntered = true;
        }
    };

    $scope.minOrderQtyChanged = function(val) {
        if (val) {
            $scope.minOrderQtyEntered = false;
        } else {
            $scope.minOrderQtyEntered = true;
        }
    };

    $scope.leadTimeChanged = function(val) {
        if (val) {
            $scope.leadTimeEntered = false;
        } else {
            $scope.leadTimeEntered = true;
        }
    };

    $scope.PTMinQtyChanged = function(val) {
        if (val) {
            $scope.isPTMinQtyEntered = false;
        } else {
            $scope.isPTMinQtyEntered = true;
        }
    };

    $scope.PTMaxQtyChanged = function(val) {
        if (val) {
            $scope.isPTMaxQtyEntered = false;
        } else {
            $scope.isPTMaxQtyEntered = true;
        }
    };

    $scope.PTPriceChanged = function(val) {
        if (val) {
            $scope.isPTPriceEntered = false;
        } else {
            $scope.isPTPriceEntered = true;
        }
    };



    $scope.saveVendorSkuMap = function() {

        if (!$scope.skuSelected) {
            growl.error("Please select a Product");
            $scope.isProductSelected = true;
        } else if (!$scope.skuSelected.originalObject) {
            growl.error("Please select a Product");
            $scope.isProductSelected = true;
        } else if (!$scope.vendorSkuData.tableVendorSystemSkuMapVendorSkuCode) {
            growl.error("Please enter the Vendor SKU Code");
            $scope.vendorSkuCodeEntered = true;
        } else if (!$scope.vendorSkuData.tableVendorSystemSkuMapMinOrderQty) {
            growl.error("Please enter the Minimum Order Quantity");
            $scope.minOrderQtyEntered = true;
        } else if (!$scope.vendorSkuData.tableVendorSystemSkuMapLeadTime) {
            growl.error("Please enter the Lead Time (In Days)");
            $scope.leadTimeEntered = true;
        } else if (!$scope.pricingTiers) {
            growl.error("Please enter atleast one Pricing Tier");
            $scope.pricingtierDetailsClicked = true;
            $scope.isPTMinQtyEntered = true;
        } else if ($scope.pricingTiers.length < 1) {
            growl.error("Please enter atleast one Pricing Tier");
            $scope.pricingtierDetailsClicked = true;
            $scope.isPTMinQtyEntered = true;
        } else {

            if ($scope.vendorSkuMapMode == "add") {
                var data = $scope.vendorSkuData;
                data.tableSku = $scope.skuSelected.originalObject;
                $scope.oqmses = [];
                console.log($scope.selectedList);
                for (var i = 0; i < $scope.selectedList.length; i++) {
                    $scope.oqmses.push({
                        'tableSkuUoqmConfig': $scope.selectedList[i].oqmData
                    });
                }
                data.tableVendorSkuPricingTierses = $scope.pricingTiers;
                data.tableVendorSkuUoqmses = $scope.oqmses;
                console.log(data);
                $http({
                    method: 'POST',
                    url: baseUrl + '/omsservices/webapi/vendors/' + $scope.vendorId + '/skumap',
                    data: data,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).success(function(res) {
                    console.log(res);
                    if (res != null) {
                        var productId = 'products';
                        if (productId) {
                            $scope.$broadcast('angucomplete-alt:clearInput', productId);
                        }
                        growl.success("New Vendor Sku Map Added Successfully");
                        $scope.vendorSkuMapMode = "add";
                        $scope.callVendorSkuMapRepeatData($scope.vendorId);
                        $scope.cancelCleanData();
                    }
                });
            } else if ($scope.vendorSkuMapMode == "edit") {
                $scope.updateVendorSkuMap();
            }
        }
    };

    $scope.updateVendorSkuMap = function() {
        var data = $scope.vendorSkuData;
        data.tableSku = $scope.skuSelected.originalObject;
        $scope.oqmses = [];
        console.log($scope.selectedList);
        for (var i = 0; i < $scope.selectedList.length; i++) {
            $scope.oqmses.push({
                'tableSkuUoqmConfig': $scope.selectedList[i].oqmData
            });
        }
        data.tableVendorSkuPricingTierses = $scope.pricingTiers;
        data.tableVendorSkuUoqmses = $scope.oqmses;
        console.log(data);
        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/vendors/' + $scope.vendorId + '/skumap/' + data.idtableVendorSystemSkuMapId,
            data: data,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            console.log(res);
            if (res != null) {
                var productId = 'products';
                if (productId) {
                    $scope.$broadcast('angucomplete-alt:clearInput', productId);
                }
                growl.success("Vendor Sku Updated Successfully");
                $scope.vendorSkuMapMode = "add";
                $scope.callVendorSkuMapRepeatData($scope.vendorId);
                $scope.cancelCleanData();
            }
        });
    };

    $scope.showResult = function(result) {
        console.log(result);
        // $scope.searchLocation = null;
        $scope.searchLocation = {
            latitude: result.geometry.location.lat(),
            longitude: result.geometry.location.lng()
        }
        console.log($scope.searchLocation);
    };


    $scope.getLatitudeLongitude = function(callback) {

        // If adress is not supplied, use default value 'New Delhi,India'
        var address = "";

        if ($scope.vendorAddress) {
            if ($scope.vendorAddress.adLine1) {
                address = address + $scope.vendorAddress.adLine1;
            }
            if ($scope.vendorAddress.adLine2) {
                address = address + ", " + $scope.vendorAddress.adLine2;
            }
            if ($scope.vendorAddress.adLine3) {
                address = address + ", " + $scope.vendorAddress.adLine3;
            }
            if ($scope.cityVal) {
                address = address + ", " + $scope.cityVal;
            }
            if ($scope.district) {
                address = address + ", " + $scope.district;
            }
            if ($scope.state) {
                address = address + ", " + $scope.state;
            }
            if ($scope.vendorAddress.pincode) {
                address = address + ", " + $scope.vendorAddress.pincode;
            }
        }

        console.log(address);
        if (address != "") {
            // Initialize the Geocoder
            geocoder = new google.maps.Geocoder();
            console.log(geocoder);
            if (geocoder) {
                geocoder.geocode({
                    'address': address
                }, function(results, status) {
                    console.log(status);
                    console.log(results);
                    if (status == google.maps.GeocoderStatus.OK) {
                        callback(results[0]);
                    }
                });
            }
        }
    };

    $scope.callGetLatLong = function(src) {
        var valid = true;
        if (src == "pincode") {
            if ($scope.vendorAddress.pincode) {
                if ($scope.vendorAddress.pincode < 0) {
                    growl.error("Pincode cannot be negative!");
                    $scope.vendorAddress.pincode = "";
                    document.getElementById("pincode").focus();
                    valid = false;
                } else if ($scope.vendorAddress.pincode.length != 6) {
                    growl.error("Pincode should be of 6 digits!");
                    $scope.vendorAddress.pincode = "";
                    document.getElementById("pincode").focus();
                    valid = false;
                }
            }
        }
        if (valid) {
            $scope.getLatitudeLongitude($scope.showResult).then(
                function(v) {},
                function(err) {}
            );
        }
    };

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

        if ($scope.modeVendor == "normal") {
            var page = undefined;
            $scope.listOfVendorsCount(page);
        }
        if ($scope.modeVendor == "mutual") {
            var page = undefined;
            $scope.listOfMutualVendorsCount(page);
        }
        if ($scope.modeVendor == "skumap") {
            var page = undefined;
            $scope.listOfSkuMapVendorsCount(page);
        }

    }

    //Number Validation not allowing -,+,e,.
    $scope.Num1 = function(event) {
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
            '9': 57
        };
        for (var index in keys) {
            if (!keys.hasOwnProperty(index)) continue;
            if (event.charCode == keys[index] || event.keyCode == keys[index]) {
                return; //default event
            }
        }
        event.preventDefault();
    };

}
