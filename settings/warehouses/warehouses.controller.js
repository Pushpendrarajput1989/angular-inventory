myApp.controller('warehousesController', warehousesController);

warehousesController.$inject = ['$scope', '$http', '$location', 'fileUpload', 'baseUrl', 'growl', 'Upload', 'formsUrl', 'PagerService'];

function warehousesController($scope, $http, $location, fileUpload, baseUrl, growl, Upload, formsUrl, PagerService) {
    $scope.searchWarehousesClicked = false;
    $scope.isStateWarehouseSelected = false;
    $scope.isDistrictWarehouseSelected = false;
    $scope.isCityWarehouseSelected = false;
    $scope.selected = [];
    $scope.basicUrl = baseUrl;
    $scope.formsUrl = formsUrl;
    $scope.start = 0;
    $scope.size = 5;
    $scope.modeWarehouse = "normal";
    $scope.vatTinEntered = false;
    $scope.glVatTinEntered = false;
    $scope.glStateDataSelected = false;
    $scope.glWarehouseSelected = false;
    $scope.showDownloadVatLink = false;

    $scope.ownStateDataSelected = false;
    $scope.ownDistrictDataSelected = false;
    $scope.ownCityDataSelected = false;
    $scope.ownShortNameEntered = false;
    $scope.ownLongNameEntered = false;
    $scope.ownCPersonNameEntered = false;
    $scope.ownPersonEmailEntered = false;
    $scope.ownPersonPhoneEntered = false;
    $scope.ownAddrLine1Entered = false;
    $scope.ownPinCodeEntered = false;

    $scope.$on('$routeChangeSuccess', function() {
        $scope.listOfWarehouses($scope.start);
        $scope.listOfWarehousesCount();
        $scope.regionsStatesData();
        $scope.listOfGlaucusWarehouses();
    });

    $scope.items = ["Poisonous", "Stackable", "Fragile", "Is Saleable", "Is individual item barcoded"];

    $scope.warehouseAction = function(status, tableState, warehouseId) {
        if (status.toLowerCase() == "vat not provided") {
            $scope.vatTinEntered = false;
            $scope.stateData = tableState;
            $scope.warehouseId = warehouseId;
            $scope.updateVatTinTableState = tableState;
            $("#vatTinDialog").modal("show");
        } else if (status.toLowerCase() == "apob registration pending") {
            $scope.warehouseId = warehouseId;
            $("#uploadAppDocModal").modal("show");
        } else if (status.toLowerCase() == "apob verification pending") {
            $("#apobVerificationPending").modal("show");
        }
    };

    $scope.checkEmptyValue = function() {
        if ($scope.vatTinNo != undefined) {
            $scope.vatTinEntered = false;
        } else {
            $scope.vatTinEntered = true;
        }
    };

    $scope.updateVatTinInfo = function() {
        if (!$scope.vatTinNo) {
            $scope.vatTinEntered = true;
            growl.error("Please enter the VAT/TIN No.");
        } else {
            if ($scope.apobDocs != undefined) {
                var file = $scope.apobDocs;
            }
            console.log(file);

            var vatPostData = {
                "idtableClientStateWiseVatId": 1,
                "tableClientStateWiseVatNo": $scope.vatTinNo,
                "tableClientStateWiseVatCreatedOn": null,
                "tableState": {
                    "idtableStateId": $scope.stateData.idtableStateId,
                    "tableStateShortName": $scope.stateData.tableStateShortName,
                    "tableStateLongName": $scope.stateData.tableStateLongName,
                    "tableCountry": {
                        "idtableCountryId": 1,
                        "tableCountryShortName": "IN",
                        "tableCountryLongName": "India"
                    }
                }
            };
            // vatTinPostData.tableState = $scope.updateVatTinTableState;

            $http({
                method: "POST",
                url: baseUrl + "/omsservices/webapi/vat/" + $scope.stateData.idtableStateId,
                data: vatPostData,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(res) {
                console.log(res);
                if (res) {
                    if (file) {
                        if (!file.$error) {
                            console.log("file is ");
                            console.dir(file);
                            var uploadUrl = baseUrl + "/omsservices/webapi/clients/docs/uploadapob?warehouseid=" + $scope.warehouseId;

                            var fd = new FormData();
                            fd.append("uploadFile", file);
                            console.log(uploadUrl);
                            console.log("uploadFile" + file);
                            console.log("fd" + fd);
                            var upload = Upload.http({
                                url: uploadUrl,
                                method: "POST",
                                data: fd,
                                headers: {
                                    "Content-Type": undefined
                                }
                            });
                            upload.then(function(resp) {
                                growl.success("Warehouse Updated Successfully");
                                $scope.clearWareHouseData();
                                $scope.listOfWarehouses(0);
                            }, function(resp) {
                                growl.error("Error in Uploading VAT DOC");
                            }, function(evt) {
                                // progress notify
                                console.log("progress: " + parseInt(100.0 * evt.loaded / evt.total) + "% file :" + file.name);
                            });
                        }
                    } else {
                        growl.success("Warehouse Updated Successfully");
                        $scope.clearWareHouseData();
                        $scope.listOfWarehouses(0);
                    }

                }
            }).error(function(error, status) {
                console.log(error);
                if (status == 401) {
                    //$('#AuthError').modal('show');
                    growl.error('Your session has been expired. You need to Login again.');
                    $location.path('/login');
                }
                growl.error("VAT/TIN No cannot be added");
            });
        }
    };

    $scope.warehouseSelected = function(glwarehouseData) {
        if (glwarehouseData) {
            $scope.isWarehouseSelected = true;
            $scope.glWarehouseSelected = false;
        } else {
            $scope.glWarehouseSelected = true;
        }
    };

    $scope.toggleSearchRow = function() {
        console.log($scope.searchWarehousesClicked);
        $scope.searchWarehousesClicked = !$scope.searchWarehousesClicked;
    }

    // fetching list of warehouses from RestAPI OMS
    $scope.listOfWarehouses = function(start) {
        var wareHouseListUrl = baseUrl + "/omsservices/webapi/warehouses";
        wareHouseListUrl += "?start=" + start + '&size=5&direction=desc';
        // var wareHouseListUrl = baseUrl+"/omsservices/webapi/warehouses";
        $http.get(wareHouseListUrl).success(function(data) {
            $scope.wareHouseLists = data;
            console.log(data);
            $scope.dayDataCollapse = [];

            for (var i = 0; i < $scope.wareHouseLists.length; i += 1) {
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

    $scope.listOfWarehousesCount = function(page) {
        console.log(page);
        var warehousesCountUrl = baseUrl + "/omsservices/webapi/warehouses/count";
        $http.get(warehousesCountUrl).success(function(data) {
            $scope.warehousesCount = data;
            console.log($scope.warehousesCount);
            if (data != null) {
                var vm = this;

                vm.dummyItems = _.range(0, $scope.warehousesCount); // dummy array of items to be paged
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
                    $scope.size = $scope.start + 5;
                    console.log($scope.start);
                    console.log($scope.size);
                    // get current page of items
                    vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                    $scope.vmItems = vm.items;
                    $scope.listOfWarehouses($scope.start);
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

    //fetching list of mutual vendors from mutually exlusive search string vendor
    $scope.listOfMutualWarehouses = function(start) {
        var warehouseListUrl = baseUrl + "/omsservices/webapi/warehouses/search?search=" + $scope.wordSearch;
        warehouseListUrl += "&start=" + start + "&size=5";
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
    $scope.listOfMutualWarehousesCount = function(page) {
        var vendorCountUrl = baseUrl + "/omsservices/webapi/warehouses/searchcount?search=" + $scope.wordSearch;
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
                    $scope.listOfMutualWarehouses($scope.vendorstart);
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

    //submit warehouse action mutual
    $scope.submitwarehouseAction = function(wordSearch) {
        $scope.wordSearch = wordSearch;
        $scope.modeWarehouse = "mutual";
        // $scope.listOfMutualVendors();
        var page = undefined;
        $scope.listOfMutualWarehousesCount(page);
    }

    $scope.tableRowExpanded = false;
    $scope.tableRowIndexExpandedCurr = "";
    $scope.tableRowIndexExpandedPrev = "";
    $scope.storeIdExpanded = "";

    $scope.dayDataCollapseFn = function() {
        $scope.dayDataCollapse = [];

        for (var i = 0; i < $scope.orderLists.length; i += 1) {
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

    $scope.selectedStates = function(warehousesId) {
        console.log(warehousesId);
        var warehouseStateUrl = baseUrl + '/omsservices/webapi/warehouses/' + warehousesId + '/states';
        $http.get(warehouseStateUrl).success(function(data) {
            if (data) {
                $scope.warehouseStatesById = data;
            }
        }).error(function(error, status) {
            console.log(error);
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });

        var nonwarehouseStateUrl = baseUrl + '/omsservices/webapi/warehouses/' + warehousesId + '/states/remaining';
        $http.get(nonwarehouseStateUrl).success(function(data) {
            if (data) {
                $scope.nonwarehouseStatesById = data;
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

    $scope.exists = function(item, list) {
        return list.indexOf(item) > -1;
    };

    $scope.toggle = function(item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
        } else {
            list.push(item);
        }
    };

    //add states
    $scope.addStates = function(selectedStatesData, warehousesId) {
        console.log($scope.selected);
        for (var i = 0; i < selectedStatesData.length; i++) {
            $http({
                method: 'POST',
                url: baseUrl + '/omsservices/webapi/warehouses/' + warehousesId + '/states',
                data: selectedStatesData[i],
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(res) {
                if (res) {
                    console.log(res)
                    $scope.selectedStates(warehousesId);
                    $scope.selected = [];
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
    };

    // fetching list of glaucus warehouses
    $scope.listOfGlaucusWarehouses = function() {
        var glwareHouseListUrl = baseUrl + "/omsservices/webapi/glwarehouses";
        // glwareHouseListUrl += "?start=" + $scope.start + '&size=5&sort=idtableVendorId&direction=desc';
        $http.get(glwareHouseListUrl).success(function(data) {
            $scope.glwareHouseLists = data;
        }).error(function(error, status) {
            console.log(error);
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
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
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };

    //Regions Data from region states generic API
    $scope.regionsStatesDistrictData = function(stateData) {
        if (stateData) {
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
                    console.log($scope.districtData);
                    $scope.isStateWarehouseSelected = true;
                    $scope.ownStateDataSelected = false;
                }
            }).error(function(error, status) {
                console.log(error);
                if (status == 401) {
                    //$('#AuthError').modal('show');
                    growl.error('Your session has been expired. You need to Login again.');
                    $location.path('/login');
                }
            });
        } else {
            $scope.isStateWarehouseSelected = false;
            $scope.isOwnStateWarehouseSelected = true;
        }
    };

    //Regions Data from region states distict generic API
    $scope.regionsStatesDistrictsCityData = function(stateData, districtData) {
        if (stateData && districtData) {
            console.log(districtData);
            $scope.regionsStatesDistrictsCityArray = [];
            $scope.districtId = districtData.idtableDistrictId;
            var regionsStatesDistrictsCityUrl = baseUrl + "/omsservices/webapi/countries/1/states/" + stateData.idtableStateId + "/districts/" + districtData.idtableDistrictId + "/cities";
            $http.get(regionsStatesDistrictsCityUrl).success(function(data) {
                for (var i = 0; i < data.length; i++) {
                    $scope.regionsStatesDistrictsCityArray.push(data[i]);
                    $scope.district = data[i].tableDistrict.tableDistrictLongName;
                }
                console.log($scope.regionsStatesDistrictsCityArray);
                $scope.isDistrictWarehouseSelected = true;
                $scope.ownDistrictDataSelected = false;
            }).error(function(error, status) {
                console.log(error);
                if (status == 401) {
                    //$('#AuthError').modal('show');
                    growl.error('Your session has been expired. You need to Login again.');
                    $location.path('/login');
                }
            });
        } else {
            $scope.isDistrictWarehouseSelected = false;
            $scope.ownDistrictDataSelected = true;
        }
    };

    $scope.changeCity = function(city) {
        if (city) {
            var cityM = city;
            console.log(cityM);
            $scope.cityVal = cityM;
            $scope.isCityWarehouseSelected = true;
            $scope.ownCityDataSelected = false;
        } else {
            $scope.isCityWarehouseSelected = false;
            $scope.ownCityDataSelected = true;
        }
    };

    $scope.getVatTin = function(stateData) {
        $scope.glWarehouseSelected = false;
        if (stateData) {
            console.log(stateData);
            $scope.tableClientStateWiseVatNo = "";
            var vatTinUrl = baseUrl + "/omsservices/webapi/vat/" + stateData.idtableStateId;
            // glwareHouseListUrl += "?start=" + $scope.start + '&size=5&sort=idtableVendorId&direction=desc';
            $http.get(vatTinUrl).success(function(data) {
                $scope.vatTinData = data;
                $scope.showDownloadVatLink = true;
                $scope.glStateDataSelected = false;
                console.log(data);
            }).error(function(error, status) {
                console.log(error);
                if (status == 401) {
                    //$('#AuthError').modal('show');
                    growl.error('Your session has been expired. You need to Login again.');
                    $location.path('/login');
                }
            });
        } else {
            $scope.vatTinData = undefined;
            $scope.showDownloadVatLink = true;
            $scope.glStateDataSelected = true;
        }
    }

    $scope.getStateWiseWarehouses = function(stateData) {
        if (stateData) {
            console.log(stateData);
            var stateWiseWarehouseUrl = baseUrl + "/omsservices/webapi/glwarehouses/states/" + stateData.idtableStateId;
            $http.get(stateWiseWarehouseUrl).success(function(data) {
                console.log(data);
                $scope.stateWareHouses = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].tableWarehouseType.idtableWarehouseTypeId == 1) {
                        $scope.stateWareHouses.push(data[i])
                    }
                }
                $scope.isStateWarehouseSelected = true;
            }).error(function(error, status) {
                console.log(error);
                if (status == 401) {
                    //$('#AuthError').modal('show');
                    growl.error('Your session has been expired. You need to Login again.');
                    $location.path('/login');
                }
            });
        } else {
            $scope.isStateWarehouseSelected = false;
        }
    }

    $scope.isValidApobDocs = function() {
        if ($scope.apobDocs) {
            if ($scope.apobDocs.name) {
                $scope.glApobDocsSelected = false;
            }
        }
    };

    $scope.addGlaucusWarehouse = function() {

        var canSubmit = false;
        if (!$scope.stateData) {
            growl.error("Please select a State!");
            $scope.glStateDataSelected = true;
        } else if (!$scope.glwarehouseData) {
            growl.error("Please select a Warehouse!");
            $scope.glWarehouseSelected = true;
        } else if ($scope.apobOrNot) {
            if ($scope.apobOrNot == "apob" && (!$scope.vatTinData || $scope.vatTinData == "") && (!$scope.tableClientStateWiseVatNo || $scope.tableClientStateWiseVatNo == "")) {
                growl.error("Please enter the VAT/TIN No.");
                $scope.glVatTinEntered = true;
            } else if ($scope.apobOrNot == "apob" && (($scope.vatTinData && $scope.vatTinData != "") || ($scope.tableClientStateWiseVatNo && $scope.tableClientStateWiseVatNo != ""))) {
                if (!$scope.apobDocs) {
                    growl.error("Please select the APOB Documents");
                    $scope.glApobDocsSelected = true;
                } else {
                    canSubmit = true;
                }
            }
        } else if (!scope.apobOrNot) {
            canSubmit = true;

        }
        if (canSubmit == true) {
            console.log($scope.glwarehouseData);
            console.log($scope.vatTinData);
            if (!$scope.vatTinData) {
                var vatTinNo = $scope.tableClientStateWiseVatNo;
            } else {
                var vatTinNo = $scope.vatTinData.tableClientStateWiseVatNo
            }
            if ($scope.apobDocs != undefined) {
                var file = $scope.apobDocs;
            }
            console.log(file);
            console.log(vatTinNo);
            console.log($scope.stateData);

            if (vatTinNo != "") {
                var vatPostData = {
                    "idtableClientStateWiseVatId": 1,
                    "tableClientStateWiseVatNo": vatTinNo,
                    "tableClientStateWiseVatCreatedOn": null,
                    "tableState": {
                        "idtableStateId": $scope.stateData.idtableStateId,
                        "tableStateShortName": $scope.stateData.tableStateShortName,
                        "tableStateLongName": $scope.stateData.tableStateLongName,
                        "tableCountry": {
                            "idtableCountryId": 1,
                            "tableCountryShortName": "IN",
                            "tableCountryLongName": "India"
                        }
                    }
                };

                $http({
                    method: "POST",
                    url: baseUrl + "/omsservices/webapi/vat/" + $scope.stateData.idtableStateId,
                    data: vatPostData,
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).success(function(res) {
                    console.log(res);
                }).error(function(error, status) {
                    console.log(error);
                    if (status == 401) {
                        $('#AuthError').modal('show');
                        $location.path('/login');
                    }
                    growl.error("VAT/TIN No cannot be added");
                });
            }

            var postGlaucusWarehouseData = $scope.glwarehouseData;
            $http({
                method: 'POST',
                url: baseUrl + '/omsservices/webapi/warehouses',
                data: postGlaucusWarehouseData,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(res) {
                console.log(res);
                if ($scope.apobOrNot) {
                    if ($scope.apobOrNot == "apob") {
                        if (file) {
                            if (!file.$error) {
                                console.log('file is ');
                                console.dir(file);
                                var uploadUrl = baseUrl + '/omsservices/webapi/clients/docs/uploadapob?warehouseid=' + res.tableWarehouseDetails.idtableWarehouseDetailsId;

                                var fd = new FormData();
                                fd.append('uploadFile', file);
                                console.log(uploadUrl);
                                console.log('uploadFile' + file);
                                console.log('fd' + fd);
                                var upload = Upload.http({
                                    url: uploadUrl,
                                    method: 'POST',
                                    data: fd,
                                    headers: {
                                        'Content-Type': undefined
                                    }
                                });
                                upload.then(function(resp) {
                                    growl.success("Glaucus Warehouse Added Successfully");
                                    $scope.clearWareHouseData();
                                    $scope.listOfWarehousesCount($scope.vmPager.currentPage);
                                }, function(resp) {
                                    growl.error("Error in Uploading VAT DOC");
                                }, function(evt) {
                                    // progress notify
                                    console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :' + file.name);
                                });
                            }
                        }
                    }
                } else {
                    growl.success("Glaucus Warehouse Added Successfully");
                    $scope.clearWareHouseData();
                    $scope.listOfWarehousesCount($scope.vmPager.currentPage);
                }
            }).error(function(error, status) {
                console.log(error);
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
                growl.error("Warehouse Cant be Added");
            });
        }
    };

    $scope.checkOwnShortName = function(shortName) {
        if (shortName) {
            $scope.ownShortNameEntered = false;
        } else {
            $scope.ownShortNameEntered = true;
        }
    };

    $scope.checkOwnLongName = function(longName) {
        if (longName) {
            $scope.ownLongNameEntered = false;
        } else {
            $scope.ownLongNameEntered = true;
        }
    };

    $scope.checkOwnCPersonName = function(personName) {
        if (personName) {
            $scope.ownCPersonNameEntered = false;
        } else {
            $scope.ownCPersonNameEntered = true;
        }
    };

    $scope.checkOwnPersonEmail = function(email) {
        if (email) {
            $scope.ownPersonEmailEntered = false;
        } else {
            $scope.ownPersonEmailEntered = true;
        }
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

    $scope.checkOwnPersonPhone = function(phone) {
        if (phone) {
            $scope.ownPersonPhoneEntered = false;
        } else {
            $scope.ownPersonPhoneEntered = true;
        }
    };

    $scope.checkOwnAddrLine1 = function(addrLine1) {
        if (addrLine1) {
            $scope.ownAddrLine1Entered = false;
        } else {
            $scope.ownAddrLine1Entered = true;
        }
    };

    $scope.checkOwnPinCode = function(pinCode) {
        if (pinCode) {
            $scope.ownPinCodeEntered = false;
        } else {
            $scope.ownPinCodeEntered = true;
        }
    };

    $scope.addOwnGlaucusWareHouses = function() {

        var canSubmit = false;
        if (!$scope.stateData) {
            growl.error("Please select a State!");
            $scope.ownStateDataSelected = true;
        } else if (!$scope.districtData) {
            growl.error("Please select a District!");
            $scope.ownDistrictDataSelected = true;
        } else if (!$scope.cityData) {
            growl.error("Please select a City!");
            $scope.ownCityDataSelected = true;
        } else if (!$scope.tableAddress) {
            growl.error("Please enter the Warehouse Short Name!");
            $scope.ownShortNameEntered = true;
        } else if (!$scope.tableAddress.tableWarehouseDetailsShortname) {
            growl.error("Please enter the Warehouse Short Name!");
            $scope.ownShortNameEntered = true;
        } else if (!$scope.tableAddress.tableWarehouseDetailsLongname) {
            growl.error("Please enter the Warehouse Long Name!");
            $scope.ownLongNameEntered = true;
        } else if (!$scope.tableAddress.tableAddressContactPerson1) {
            growl.error("Please enter the Contact Person Name!");
            $scope.ownCPersonNameEntered = true;
        } else if (!$scope.tableAddress.tableAddressEmail1) {
            growl.error("Please enter a valid Email!");
            $scope.ownPersonEmailEntered = true;
        } else if (!$scope.tableAddress.tableAddressPhone1) {
            growl.error("Please enter the Contact Person Phone!");
            $scope.ownPersonPhoneEntered = true;
        } else if ($scope.tableAddress.tableAddressPhone1 && $scope.tableAddress.tableAddressPhone1.length != 10) {
            growl.error("Please enter a valid Contact Person Phone!");
            $scope.ownPersonPhoneEntered = true;
        } else if (!$scope.tableAddress.tableAddress1) {
            growl.error("Please enter the Address Line 1!");
            $scope.ownAddrLine1Entered = true;
        } else if (!$scope.tableAddress.tableAddressPin) {
            growl.error("Please enter the Pin Code!");
            $scope.ownPinCodeEntered = true;
        } else {
            console.log($scope.vatTinData);
            console.log($scope.tableAddress);
            var tableAddress = $scope.tableAddress;
            if (!$scope.vatTinData) {
                var vatTinNo = $scope.tableClientStateWiseVatNo;
            } else {
                var vatTinNo = $scope.vatTinData.tableClientStateWiseVatNo
            }
            if ($scope.vatTinDocs != undefined) {
                var file = $scope.vatTinDocs;
            }
            if ($scope.apobDocs != undefined) {
                var file = $scope.apobDocs;
            }
            console.log(file);
            console.log(vatTinNo);
            console.log($scope.stateData);

            var postOwnGlaucusWarehouseData = {
                "tableWarehouseDetailsShortname": tableAddress.tableWarehouseDetailsShortname,
                "tableWarehouseDetailsLongname": tableAddress.tableWarehouseDetailsLongname,
                "tableWarehouseDetailsActualArea": 40000,
                "tableWarehouseDetailsEffectiveArea": 50000,
                "tableWarehouseDetailsIsClientDedicated": true,
                "tableAddress": {
                    "tableAddress1": tableAddress.tableAddress1,
                    "tableAddress2": tableAddress.tableAddress2,
                    "tableAddress3": tableAddress.tableAddress3,
                    "tableAddress4": null,
                    "tableAddressPin": tableAddress.tableAddressPin,
                    "tableAddressFax": null,
                    "tableAddressContactPerson1": tableAddress.tableAddressContactPerson1,
                    "tableAddressPhone1": tableAddress.tableAddressPhone1,
                    "tableAddressEmail1": tableAddress.tableAddressEmail1,
                    "tableAddressType": {
                        "idtableAddressTypeId": 3,
                        "tableAddressTypeString": "General"
                    },
                    "tableCity": $scope.cityVal,
                },
                "tableWarehouseType": {
                    "idtableWarehouseTypeId": 2,
                    "tableWarehouseTypeString": "SelfOwned"
                },
                "tableWarehouseFacilitieses": [],
                "tableWarehouseStorageTypeWiseCapacities": []
            }

            console.log(postOwnGlaucusWarehouseData);
            $http({
                method: 'POST',
                url: baseUrl + '/omsservices/webapi/glwarehouses',
                data: postOwnGlaucusWarehouseData,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(res) {
                console.log(res);
                if (res) {
                    growl.success("Your Warehouse Added Successfully");
                    $scope.clearWareHouseData();
                    $scope.listOfWarehousesCount($scope.vmPager.currentPage);
                }
            }).error(function(error, status) {
                console.log(error);
                if (status == 401) {
                    //$('#AuthError').modal('show');
                    growl.error('Your session has been expired. You need to Login again.');
                    $location.path('/login');
                }
                growl.error("Warehouse Cant be Added");
            });
        }
    };

    $scope.hideShowDownloadVatLink = function(tableClientStateWiseVatNo) {
        if (tableClientStateWiseVatNo) {
            $scope.showDownloadVatLink = false;
            $scope.glVatTinEntered = false;
        } else {
            $scope.showDownloadVatLink = true;
            $scope.glVatTinEntered = true;
        }
    };

    $scope.clearWareHouseData = function() {
        $scope.vatTinData = null;
        $scope.glwarehouseData = null;
        $scope.stateData = null;
        $scope.vatTinDocs = null;
        $scope.apobDocs = null;
        $scope.tableAddress = null;
        $scope.stateData = null;
        $scope.districtData = null;
        $scope.cityVal = null;
        $scope.cityData = null;
        $scope.isStateWarehouseSelected = false;
        $scope.isDistrictWarehouseSelected = false;
        $scope.isCityWarehouseSelected = false;
        $scope.vatTinInfo = null;
        $scope.isWarehouseSelected = false;
        $scope.showDownloadVatLink = false;
        $scope.glStateDataSelected = false;
        $scope.glWarehouseSelected = false;
        $scope.glVatTinEntered = false;
        $scope.glApobDocsSelected = false;
        $scope.apobOrNot = undefined;
        $scope.ownStateDataSelected = false;
        $scope.ownDistrictDataSelected = false;
        $scope.ownCityDataSelected = false;
        $scope.ownShortNameEntered = false;
        $scope.ownLongNameEntered = false;
        $scope.ownCPersonNameEntered = false;
        $scope.ownPersonEmailEntered = false;
        $scope.ownPersonPhoneEntered = false;
        $scope.ownAddrLine1Entered = false;
        $scope.ownPinCodeEntered = false;

        $('#addOwnWarehouseModal').modal('hide');
        $('#addGlaucusWarehouseModal').modal('hide');
        $('#uploadAppDocModal').modal('hide');
        $('#uploadAppDocModal').modal('hide');
        $("#vatTinDialog").modal("hide");
    };

    $scope.deleteStatesForWarehouses = function(wid, stateId) {
        console.log(wid);
        console.log(stateId);

        var deleteStateWiseurl = baseUrl + '/omsservices/webapi/warehouses/' + wid + '/states/' + stateId;
        console.log(deleteStateWiseurl);
        $http({
            url:  deleteStateWiseurl,
              
            method:   'DELETE',
        }).success(function (data)  { 
            console.log(data);
            if (data) {
                $scope.selectedStates(wid);
            }
        })
    };

    $scope.uploadApplicationDocs = function(warehouseId) {
        if ($scope.apobDocs != undefined) {
            var file = $scope.apobDocs;
            if (file) {
                if (!file.$error) {
                    console.log('file is ');
                    console.dir(file);
                    var uploadUrl = baseUrl + '/omsservices/webapi/clients/docs/uploadapob?warehouseid=' + warehouseId;

                    var fd = new FormData();
                    fd.append('uploadFile', file);
                    console.log(uploadUrl);
                    console.log('uploadFile' + file);
                    console.log('fd' + fd);
                    var upload = Upload.http({
                        url: uploadUrl,
                        method: 'POST',
                        data: fd,
                        headers: {
                            'Content-Type': undefined
                        }
                    });
                    upload.then(function(resp) {
                        growl.success('APOB Application Form Successfully Added');
                        $scope.clearWareHouseData();
                        $scope.listOfWarehouses(0);
                    }, function(resp) {
                        console.log(resp);
                        growl.error("Error in Uploading Apob Application Form");
                    }, function(evt) {
                        // progress notify
                        console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :' + file.name);
                    });

                }
            }
        }
    };

    //dialog box to open contact glaucus succesfull message
    $scope.contactGlaucus = function() {
        var data = {
            "subject": "VAT/APOB assistance required by {seller}",
            "body": "Dear Executive, \n Please contact {seller} through email {emailid} or call on {phone} for VAT/APOB assistance. \n OMS System"
        }
        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/warehouses/vatquery',
            data: data,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            console.log(res);
        }).error(function(error, status) {
            console.log(error);
            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
            growl.error("Warehouse Cant be Added");
        });

    }

    $scope.cancelGlContact = function() {
        $('#contactGlaucus').modal('hide');
    }

}
