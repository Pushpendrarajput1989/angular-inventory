myApp.controller('orderController', orderController);

orderController.$inject = ['$scope', '$http', '$location', 'baseUrl', '$mdDialog', '$mdMedia', 'growl', '$window', 'downloadOrderTemplateUrl', 'Upload', 'PagerService', '$q', 'imageUrl', '$routeParams', '$cookies'];

function orderController($scope, $http, $location, baseUrl, $mdDialog, $mdMedia, growl, $window, downloadOrderTemplateUrl, Upload, PagerService, $q, imageUrl, $routeParams, $cookies) {

    $scope.addDeliveryClicked = false;
    $scope.singleorderData = "";
    $scope.bulkOrderSettingData = "";
    $scope.start = 0;
    $scope.orderSize = 5;
    if ($cookies.get('Dashdata')) {
        $scope.defaultTab = $cookies.get('Dashdata');
    } else {
        $scope.defaultTab = "all";
    }

    $scope.products = [];
    $scope.array = [];
    $scope.singleOrderTab = true;
    $scope.singleOrderMode = "add";
    $scope.bulkOrderTab = false;
    $scope.incrVar = false;
    $scope.decrVar = false;
    $scope.arrayHeaderList = [];
    $scope.arrayList = [];
    $scope.myList = [];
    $scope.bulkUploadSettingMode = "add";
    $scope.bulkUploadOrderFielsClicked = false;
    $scope.bulkUploadMapElemClicked = false;
    $scope.baseSkuUrl = baseUrl + '/omsservices/webapi/skus/search?search=';
    $scope.baseCustomerUrl = baseUrl + '/omsservices/webapi/customers/search?search=';
    $scope.baseBulkUploadSettingsUrl = baseUrl + '/omsservices/webapi/bulkuploadsettings?search=';
    $scope.downloadOrderTemplateUrl = downloadOrderTemplateUrl;
    $scope.csvTrue = true;
    $scope.baseSchedulePickUpUrl = baseUrl + "/omsservices/webapi/orders/schedulepickup";
    $scope.imageUrl = imageUrl;
    // $scope.initialSelected = "";

    $scope.firstNo = 1;
    $scope.secNo = 2;
    $scope.thirdNo = 3;
    $scope.fourthNo = 4;
    $scope.fifthNo = 5;

    $scope.salesChannelSelected = false;
    $scope.deliveryAddressSelected = false;
    $scope.orderNumberEntered = false;
    $scope.isCancelReasonSelected = false;
    $scope.isProductSelected = false;
    $scope.isPriceEntered = false;
    $scope.isQuantityEntered = false;

    $scope.isSubmitDisabled = true;
    $scope.isResetDisabled = true;
    $scope.isStartDateDisabled = true;
    $scope.isEndDateDisabled = true;

    $scope.sortType = "tableSaleOrder.tableSaleOrderClientOrderNo";
    $scope.directionType = "asc";
    $scope.sortReverse = true; // set the default sort order

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

    $scope.$on('$routeChangeSuccess', function() {
        alert('order');
        var customerId = $routeParams.customerId;
        if (customerId != null) {
            $scope.customerid = customerId;
            $http.get(baseUrl + '/omsservices/webapi/customers/' + customerId).success(function(data) {
                $scope.customerString = data.tableCustomerFirstName;
                if (data.tableCustomerLastName && data.tableCustomerLastName != null && data.tableCustomerLastName != null) {
                    $scope.customerString += " " + data.tableCustomerLastName;
                }
            }).error(function(error, status) {
                console.log(error);
                console.log(status);
                if (status == 401) {
                    //$('#AuthError').modal('show');
                    $cookies.put('isLoggedIn', false);


                    $location.path('/login');
                }
            });
        }
        $scope.listOfStatesCount($scope.defaultTab);
        // $scope.listOfOrders($scope.defaultTab);
        $scope.listOfCustomers();
        $scope.listOfChannels();
        $scope.listOfPayments();
        $scope.dateFormatsBulkUpload();
        $scope.regionsStatesData();
    });

    $scope.callDisabled = function() {
        $scope.isSubmitDisabled = false;
    }

    $scope.searchLocation = {
        latitude: 28.6139391,
        longitude: 77.20902120000005
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

    $scope.getLatitudeLongitude = function(callback, address) {
        // If adress is not supplied, use default value 'New Delhi,India'
        console.log(address);
        address = address;
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

    $scope.cancelShippingAddress = function() {
        $scope.adLine1 = "";
        $scope.adLine2 = "";
        $scope.adLine3 = "";
        $scope.pincode = "";
        $scope.stateData = "";
        $scope.districtData = "";
        $scope.city = "";
        $scope.state = "";
        $scope.district = "";
        $scope.cityVal = "";
        $('#orderShippingAddressModal').modal('hide');
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
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);

                $location.path('/login');
            }
        });
    };

    //Regions Data from region states generic API
    $scope.regionsStatesDistrictData = function(stateData) {
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
                $scope.districtData = initializeDropdowns($scope.regionsStatesDistrictArray, 'idtableDistrictId', stateData.idtableDistrictId);
                console.log($scope.districtData);
            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {

                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);
                $location.path('/login');
            }
        });
    };

    //Regions Data from region states distict generic API
    $scope.regionsStatesDistrictsCityData = function(stateData, districtData) {
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
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);

                $location.path('/login');
            }
        });
    };

    $scope.changeCity = function(city) {
        var cityM = city;
        console.log(cityM);
        $scope.cityVal = cityM.tableCityLongName;
    };

    //saving shipping address data based on customer id
    $scope.saveShippingAddressData = function(customerId, adLine1, adLine2, adLine3, city, pincode, contactPersonName, contactEmail, contactPhone, tinMode, vatNo, stateData, tinVatId, customerTypeId) {
        var latitude = $scope.searchLocation.latitude;
        var longitude = $scope.searchLocation.longitude;

        var postShippingAddressData = {
            "idtableCustomerShippingAddressListId": 1,
            "tableAddress": {
                "idtableAddressId": 1,
                "tableAddress1": adLine1,
                "tableAddress2": adLine2,
                "tableAddress3": adLine3,
                "tableAddress4": null,
                "tableAddressPin": pincode,
                "tableAddressFax": null,
                "tableAddressContactPerson1": contactPersonName,
                "tableAddressPhone1": contactPhone,
                "tableAddressEmail1": contactEmail,
                "tableAddressLatitude": latitude,
                "tableAddressLongitude": longitude,
                "tableAddressType": {
                    "idtableAddressTypeId": 1,
                    "tableAddressTypeString": "Shipping"
                },
                "tableCity": city
            }
        }

        console.log(postShippingAddressData);

        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/customers/' + customerId + '/shippingaddress',
            data: postShippingAddressData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            console.log(res);
            if (res) {
                console.log(customerId);
                console.log(tinMode);
                console.log(vatNo);
                console.log(stateData);
                console.log(tinVatId);
                if (tinMode == 'post' && customerTypeId == 2) {
                    var tinPostData = {
                        "idtableCustomerStateWiseVatId": 1,
                        "tableCustomerStateWiseVatNo": vatNo,
                        "tableState": stateData
                    }
                    $http({
                        method: 'POST',
                        url: baseUrl + '/omsservices/webapi/customers/' + customerId + '/vats',
                        data: tinPostData,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).success(function(res) {
                        if (res) {
                            console.log(res);
                            growl.success("TIN NO Added Successfully");
                            $scope.tinArray = null;
                        }
                    }).error(function(error, status) {
                        console.log(error);
                        console.log(status);
                        if (status == 401) {
                            //$('#AuthError').modal('show');
                            $cookies.put('isLoggedIn', false);

                            $location.path('/login');
                        }
                        growl.error("TIN/VAT cannot be added");
                    });
                }


                if (tinMode == 'put' && customerTypeId == 2) {
                    var tinPutData = {
                        "tableCustomerStateWiseVatNo": vatNo,
                        "tableState": stateData
                    }

                    $http({
                        method: 'PUT',
                        url: baseUrl + '/omsservices/webapi/customers/' + customerId + '/vats/' + tinVatId,
                        data: tinPutData,
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }).success(function(res) {
                        if (res) {
                            console.log(res);
                            $scope.tinArray = null;
                        }
                    }).error(function(error, status) {
                        console.log(error);
                        console.log(status);
                        if (status == 401) {
                            //$('#AuthError').modal('show');
                            $cookies.put('isLoggedIn', false);

                            $location.path('/login');
                        }
                    });
                }

                $scope.stateData = "";
                $scope.districtData = "";
                $scope.city = "";
                $scope.state = "";
                $scope.district = "";
                $scope.cityVal = "";
                $scope.deliveryAddresses(customerId).then(
                    function(v) {
                        growl.success("Customer Shipping Address Added Successfully");
                        if ($scope.modeCustomer == 'normal') {
                            $scope.listOfCustomers();
                            $scope.listOfCustomerCount();
                        }
                        if ($scope.modeCustomer == 'mutual') {
                            $scope.listOfMutualCustomers();
                            $scope.listOfMutualCustomersCount();
                        }
                    },
                    function(err) {}
                );

                $('#orderShippingAddressModal').modal('hide');

            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);

                $location.path('/login');
            }
            growl.error("Customer Shipping Address Cannot Be Added");
        });
    };

    $scope.getTinNo = function(customerId, stateData) {
        console.log(customerId);
        console.log(stateData.idtableStateId);
        var getTinurl = baseUrl + "/omsservices/webapi/customers/" + customerId + "/vats/checkvat/" + stateData.idtableStateId;
        $http.get(getTinurl).success(function(data1) {
            console.log(data1);
            if (data1 != null || data1 != undefined || data1 != "") {
                $scope.tinMode = "put"
                $scope.tinArray = data1;
                $scope.tinVatId = data1.idtableCustomerStateWiseVatId;
            }
            if (data1 == null || data1 == undefined || data1 == "") {
                $scope.tinMode = "post";
                $scope.tinArray = data1;
            }
        }).error(function(error) {
            console.log(error);
        });
    };

    $scope.validateEmail = function(emailCase) {
        if (emailCase == false) {
            growl.error("Please Enter Valid Email Id");
            document.myForm.custEmail.focus();
        }
    };

    $scope.uploadBulkOrderMapFile = function() {
        file = $scope.bulkOrderMapFile;
        if (file) {
            if (!file.$error) {
                var reader = new FileReader();
                reader.readAsText(file);
                reader.onload = $scope.loadHandler;
            }
        }
    };

    $scope.loadHandler = function(event) {
        $scope.contents = event.target.result;
        var data = {
            csv: null,
            separator: ','
        };
        // Get the contents of the reader
        var contents = $scope.contents;

        // Set our contents to our data model
        data.csv = contents;

        var results = $scope.convertToJSON(data);
        $scope.createHeaderList(results);
    };

    $scope.convertToJSON = function(content) {

        // Declare our variables
        var lines = content.csv.replace(/[\r]/g, '').split('\n'),
            headers = lines[0].split(content.separator),
            results = [];

        // For each row
        for (var i = 1; i < lines.length - 1; i++) {

            // Declare an object
            var obj = {};

            // Get our current line
            var line = lines[i].split(new RegExp(content.separator + '(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)'));

            // For each header
            for (var j = 0; j < headers.length; j++) {

                // Populate our object
                obj[headers[j]] = line[j];
            }

            // Push our object to our result array
            results.push(obj);
        }

        // Return our array
        return results;
    };

    $scope.ViewDownloadBtn = 'success';
    $scope.downloadLink = function(value) {
        console.log(value);
        $scope.ViewDownloadBtn = value;
    }

    $scope.uploadBulkOrderFile = function(bulkOrderUploadfile, bulkOrderSettingData) {
        file = bulkOrderUploadfile;
        console.log(file);
        if (file) {
            if (!file.$error) {
                console.log('file is ');
                console.dir(file);
                var uploadUrl = baseUrl + '/omsservices/webapi/saleschannels/' + bulkOrderSettingData.channelId + '/uploadbulkorders';

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
                    // file is uploaded successfully
                    console.log('file ' + file.name + 'is uploaded successfully. Response: ' + resp.data);
                    // $scope.listOfOrders($scope.defaultTab, 0);
                    $scope.listOfStatesCount($scope.defaultTab, $scope.vmPager.currentPage);
                    //growl.success("Orders Uploaded successfully");
                    $mdDialog.hide();
                    console.log(resp.data.existingDTO);
                    console.log(resp.data);
                    $scope.successLink = baseUrl + '/omsservices/webapi/saleschannels/file?path=' + resp.data.successLink;
                    $scope.duplicateLink = baseUrl + '/omsservices/webapi/saleschannels/file?path=' + resp.data.duplicateLink;
                    $scope.existingLink = baseUrl + '/omsservices/webapi/saleschannels/file?path=' + resp.data.existingLink;
                    $scope.errorLink = baseUrl + '/omsservices/webapi/saleschannels/file?path=' + resp.data.errorLink;


                    $scope.existingDatatable = resp.data.existingDTO;
                    $scope.successDatatable = resp.data.successDTO;
                    $scope.duplicateDatatable = resp.data.duplicateDTO;
                    $scope.errorDatatable = resp.data.errorDTO;
                    $('#BulkedaddOrderModal').modal('show');
                }, function(resp) {
                    growl.error("Error in Uploading Bulk Order");
                }, function(evt) {
                    // progress notify
                    console.log('progress: ' + parseInt(100.0 * evt.loaded / evt.total) + '% file :' + file.name);
                });
            }
        }
    };

    // fetching count details of states of different orders.
    $scope.listOfStatesCount = function(tabsValue, page, action) {
        console.log(tabsValue);
        console.log(page);
        console.log($scope.channel);
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

        var newCountUrl = baseUrl + "/omsservices/webapi/orders/filtercount?state=new";
        var processCountUrl = baseUrl + "/omsservices/webapi/orders/filtercount?state=process";
        var holdCountUrl = baseUrl + "/omsservices/webapi/orders/filtercount?state=hold";
        var returnCountUrl = baseUrl + "/omsservices/webapi/orders/filtercount?state=return";
        var cancelledCountUrl = baseUrl + "/omsservices/webapi/orders/filtercount?state=cancelled";
        var shippingCountUrl = baseUrl + "/omsservices/webapi/orders/filtercount?state=shipping";
        var deliveredCountUrl = baseUrl + "/omsservices/webapi/orders/filtercount?state=delivered";
        var allCountUrl = baseUrl + "/omsservices/webapi/orders/filtercount?";

        if (!$scope.channel) {
            newCountUrl += "&salesChannel=0";
            processCountUrl += "&salesChannel=0";
            holdCountUrl += "&salesChannel=0";
            returnCountUrl += "&salesChannel=0";
            cancelledCountUrl += "&salesChannel=0";
            shippingCountUrl += "&salesChannel=0";
            deliveredCountUrl += "&salesChannel=0";
            allCountUrl += "salesChannel=0";
        } else {
            newCountUrl += "&salesChannel=" + $scope.channel;
            processCountUrl += "&salesChannel=" + $scope.channel;
            holdCountUrl += "&salesChannel=" + $scope.channel;
            returnCountUrl += "&salesChannel=" + $scope.channel;
            cancelledCountUrl += "&salesChannel=" + $scope.channel;
            allCountUrl += "salesChannel=" + $scope.channel;
            shippingCountUrl += "&salesChannel=" + $scope.channel;
            deliveredCountUrl += "&salesChannel=" + $scope.channel;
        }
        if ($scope.skuId) {
            newCountUrl += "&skuid=" + $scope.skuId;
            processCountUrl += "&skuid=" + $scope.skuId;
            holdCountUrl += "&skuid=" + $scope.skuId;
            returnCountUrl += "&skuid=" + $scope.skuId;
            cancelledCountUrl += "&skuid=" + $scope.skuId;
            allCountUrl += "&skuid=" + $scope.skuId;
            shippingCountUrl += "&skuid=" + $scope.skuId;
            deliveredCountUrl += "&skuid=" + $scope.skuId;
        }
        if ($scope.customerid) {
            newCountUrl += "&customerid=" + $scope.customerid;
            processCountUrl += "&customerid=" + $scope.customerid;
            holdCountUrl += "&customerid=" + $scope.customerid;
            returnCountUrl += "&customerid=" + $scope.customerid;
            cancelledCountUrl += "&customerid=" + $scope.customerid;
            allCountUrl += "&customerid=" + $scope.customerid;
            shippingCountUrl += "&customerid=" + $scope.customerid;
            deliveredCountUrl += "&customerid=" + $scope.customerid;
        }
        if ($scope.startDate) {
            newCountUrl += "&startDate=" + $scope.startDate;
            processCountUrl += "&startDate=" + $scope.startDate;
            holdCountUrl += "&startDate=" + $scope.startDate;
            returnCountUrl += "&startDate=" + $scope.startDate;
            cancelledCountUrl += "&startDate=" + $scope.startDate;
            allCountUrl += "&startDate=" + $scope.startDate;
            shippingCountUrl += "&startDate=" + $scope.startDate;
            deliveredCountUrl += "&startDate=" + $scope.startDate;
        }
        if ($scope.endDate) {
            newCountUrl += "&endDate=" + $scope.endDate;
            processCountUrl += "&endDate=" + $scope.endDate;
            holdCountUrl += "&endDate=" + $scope.endDate;
            returnCountUrl += "&endDate=" + $scope.endDate;
            cancelledCountUrl += "&endDate=" + $scope.endDate;
            allCountUrl += "&endDate=" + $scope.endDate;
            shippingCountUrl += "&endDate=" + $scope.endDate;
            deliveredCountUrl += "&endDate=" + $scope.endDate;
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
        console.log(shippingCountUrl);
        console.log("DELIVERED COUNT URL");
        console.log(deliveredCountUrl);
        console.log("ALL COUNT URL");
        console.log(allCountUrl);

        $http.get(allCountUrl).success(function(data) {
            if (data != null) {
                $scope.allCount = data;
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

                        // get pager object from service
                        vm.pager = PagerService.GetPager(vm.dummyItems.length, page);
                        console.log(vm.pager);
                        $scope.vmPager = vm.pager;

                        $scope.start = (vm.pager.currentPage - 1) * 5;
                        $scope.orderSize = $scope.start + 5;
                        $scope.channel = $scope.channel;
                        $scope.skuId = $scope.skuId;
                        $scope.customerid = $scope.customerid;
                        $scope.stateDate = $scope.stateDate;
                        $scope.endDate = $scope.endDate;
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

        $http.get(newCountUrl).success(function(data) {
            $cookies.remove('Dashdata');
            if (data != null) {
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


        $http.get(processCountUrl).success(function(data) {
            $cookies.remove('Dashdata');
            if (data != null) {
                $scope.processCount = data;
                if (tabsValue == 'process') {
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

        $http.get(holdCountUrl).success(function(data) {
            $cookies.remove('Dashdata');
            if (data != null) {
                $scope.holdCount = data;
                if (tabsValue == 'hold') {
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

        $http.get(returnCountUrl).success(function(data) {
            $cookies.remove('Dashdata');
            if (data != null) {
                $scope.returnCount = data;
                if (tabsValue == 'return') {
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
            }
        });

        $http.get(cancelledCountUrl).success(function(data) {
            $cookies.remove('Dashdata');
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
        $http.get(shippingCountUrl).success(function(data) {
            $cookies.remove('Dashdata');
            if (data != null) {
                $scope.shippingCount = data;
                if (tabsValue == 'shipping') {
                    var vm = this;

                    vm.dummyItems = _.range(0, $scope.shippingCount); // dummy array of items to be paged
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
        $http.get(deliveredCountUrl).success(function(data) {
            $cookies.remove('Dashdata');
            if (data != null) {
                $scope.deliveredCount = data;
                if (tabsValue == 'delivered') {
                    var vm = this;

                    vm.dummyItems = _.range(0, $scope.deliveredCount); // dummy array of items to be paged
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
    }


    // getting all list of orders (all the orders)
    $scope.listOfOrders = function(tabsValue, start, action) {

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
        if (tabsValue == 'process') {
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

        if (tabsValue == 'shipping') {
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
        if (tabsValue == 'return') {
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
        if (tabsValue == 'delivered') {
            $scope.tabsColor7 = {
                "background-color": "#E9EEEF",
                "outline": "none"
            }
            $scope.tabsColor = {}
            $scope.tabsColor1 = {}
            $scope.tabsColor2 = {}
            $scope.tabsColor3 = {}
            $scope.tabsColor4 = {}
            $scope.tabsColor5 = {}
            $scope.tabsColor6 = {}
        }

        $scope.defaultTab = tabsValue;

        var orderListUrl = baseUrl + "/omsservices/webapi/orders";

        if ($scope.defaultTab == 'all')
            orderListUrl += "?start=" + start + "&size=5&sort=" + $scope.sortType + "&direction=" + $scope.directionType;

        if ($scope.defaultTab != 'all')
            orderListUrl += "?start=" + start + "&size=5&sort=" + $scope.sortType + "&direction=" + $scope.directionType + "&state=" + tabsValue;

        if (!$scope.channel) {
            orderListUrl += "&salesChannel=0";
        } else {
            orderListUrl += "&salesChannel=" + $scope.channel;
        }
        if ($scope.skuId) {
            orderListUrl += "&skuid=" + $scope.skuId;
        }
        if ($scope.customerid) {
            orderListUrl += "&customerid=" + $scope.customerid;
        }
        if ($scope.startDate) {
            orderListUrl += "&startDate=" + $scope.startDate;
        }
        if ($scope.endDate) {
            orderListUrl += "&endDate=" + $scope.endDate;
        }
        console.log("ORDER LIST URL");
        console.log(orderListUrl);
        $http.get(orderListUrl).success(function(data) {
            // console.log(data);
            $scope.orderLists = data;

            $scope.dayDataCollapse = [];

            for (var i = 0; i < $scope.orderLists.length; i += 1) {
                $scope.dayDataCollapse.push(false);
            }
        }).error(function(error, status) {

            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);

                $location.path('/login');
            }
        });
    }

    $scope.startIncrement = function() {
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

        if ($scope.defaultTab == 'hold') {
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
    }

    $scope.startDecrement = function() {
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

    $scope.zeroDecrement = function() {
        growl.error("Order for that Range does not exist");
    }
    $scope.callOrderList = function(number) {
        console.log(number);
        console.log($scope.newCountWithoutDecimal);
        console.log($scope.defaultTab);

        if ($scope.defaultTab == 'all') {
            console.log(number);
            console.log($scope.allCountWithoutDecimal);
            if (number <= $scope.allCountWithoutDecimal) {
                console.log(number);
                console.log($scope.start);
                if (number) {
                    $scope.start = (number - 1) * 5;
                }
                console.log($scope.start);
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
            if (number > $scope.allCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
        }

        if ($scope.defaultTab == 'new') {
            console.log(number);
            console.log($scope.newCountWithoutDecimal);
            if (number <= $scope.newCountWithoutDecimal) {
                console.log(number);
                console.log($scope.start);
                if (number) {
                    $scope.start = (number - 1) * 5;
                }
                console.log($scope.start);
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
            if (number > $scope.newCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
        }

        if ($scope.defaultTab == 'process') {
            console.log(number);
            console.log($scope.processCountWithoutDecimal);
            if (number <= $scope.processCountWithoutDecimal) {
                console.log(number);
                console.log($scope.start);
                if (number) {
                    $scope.start = (number - 1) * 5;
                }
                console.log($scope.start);
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
            if (number > $scope.processCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
        }

        if ($scope.defaultTab == 'shipping') {
            console.log(number);
            console.log($scope.shippingCountWithoutDecimal);
            if (number <= $scope.shippingCountWithoutDecimal) {
                console.log(number);
                console.log($scope.start);
                if (number) {
                    $scope.start = (number - 1) * 5;
                }
                console.log($scope.start);
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
            if (number > $scope.shippingCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
        }

        if ($scope.defaultTab == 'return') {
            console.log(number);
            console.log($scope.returnCountWithoutDecimal);
            if (number <= $scope.returnCountWithoutDecimal) {
                console.log(number);
                console.log($scope.start);
                if (number) {
                    $scope.start = (number - 1) * 5;
                }
                console.log($scope.start);
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
            if (number > $scope.returnCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
        }

        if ($scope.defaultTab == 'hold') {
            console.log(number);
            console.log($scope.holdCountWithoutDecimal);
            if (number <= $scope.holdCountWithoutDecimal) {
                console.log(number);
                console.log($scope.start);
                if (number) {
                    $scope.start = (number - 1) * 5;
                }
                console.log($scope.start);
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
            if (number > $scope.holdCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
        }

        if ($scope.defaultTab == 'cancelled') {
            console.log(number);
            console.log($scope.cancelledCountWithoutDecimal);
            if (number <= $scope.cancelledCountWithoutDecimal) {
                console.log(number);
                console.log($scope.start);
                if (number) {
                    $scope.start = (number - 1) * 5;
                }
                console.log($scope.start);
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
            if (number > $scope.cancelledCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
        }

        if ($scope.defaultTab == 'delivered') {
            console.log(number);
            console.log($scope.deliveredCountWithoutDecimal);
            if (number <= $scope.deliveredCountWithoutDecimal) {
                console.log(number);
                console.log($scope.start);
                if (number) {
                    $scope.start = (number - 1) * 5;
                }
                console.log($scope.start);
                $scope.orderSize = $scope.start + 5;
                $scope.listOfOrders($scope.defaultTab);
            }
            if (number > $scope.deliveredCountWithoutDecimal) {
                console.log("Order for that Range does not exist");
                growl.error("Order for that Range does not exist");
            }
        }
        $scope.dayDataCollapse = [];

        for (var i = 0; i < $scope.orderLists.length; i += 1) {
            $scope.dayDataCollapse.push(false);
        }
    }

    $scope.listOfCustomers = function() {
        $scope.customerNamesData = [];
        var customerListUrl = baseUrl + "/omsservices/webapi/customers";
        // console.log(customerListUrl);
        $http.get(customerListUrl).success(function(data) {
            // console.log(data);
            $scope.customerLists = data;

            for (var i = 0; i < $scope.customerLists.length; i++) {
                $scope.customerNamesData.push($scope.customerLists[i].tableCustomerName);
            }
        }).error(function(error, status) {
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

    $scope.listOfChannels = function() {
        $scope.channelNamesData = []
        var channelListUrl = baseUrl + "/omsservices/webapi/saleschannels";
        // console.log(channelListUrl);
        $http.get(channelListUrl).success(function(data) {
            console.log(data);
            $scope.channelLists = data;

            for (var i = 0; i < $scope.channelLists.length; i++) {
                if ($scope.channelLists[i].tableSalesChannelMetaInfo.tableSalesChannelType.idtableSalesChannelTypeId == 2) {
                    $scope.channelNamesData.push($scope.channelLists[i]);
                }
            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);

                $location.path('/login');
            }
        });
    }

    $scope.listOfPayments = function() {
        $scope.paymentNamesData = []
        var paymentListUrl = baseUrl + "/omsservices/webapi/saleorderpaymenttypes";
        // console.log(paymentListUrl);
        $http.get(paymentListUrl).success(function(data) {
            // console.log(data);
            $scope.paymentLists = data;

            for (var i = 0; i < $scope.paymentLists.length; i++) {
                $scope.paymentNamesData.push($scope.paymentLists[i]);
            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);

                $location.path('/login');
            }
        });
    }


    $scope.submitAction = function(saleChannelId, skuId, startDate, endDate, customerid) {
        $scope.sortType = "tableSaleOrder.tableSaleOrderClientOrderNo";
        $scope.directionType = "asc";
        $scope.sortReverse = true;
        console.log(saleChannelId);
        console.log(skuId);
        console.log(startDate);
        console.log(endDate);
        console.log(customerid);
        if (saleChannelId != undefined) {
            $scope.channel = saleChannelId;
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
        $scope.isSubmitDisabled = true;
        $scope.isResetDisabled = false;
        $scope.listOfStatesCount($scope.defaultTab, 1);
    }

    //clear filter for clearing applied filters
    $scope.clearAction = function(saleChannelId, skuId, startDate, endDate, customerid) {
        // $scope.listOfOrders($scope.defaultTab, 0);
        $scope.sortType = "tableSaleOrderClientOrderNo";
        $scope.directionType = "asc";
        $scope.sortReverse = true;
        $scope.channel = "";
        $scope.skuId = "";
        $scope.customerid = "";
        $scope.saleChannelId = undefined;
        $scope.startDate = "";
        $scope.endDate = "";
        $scope.start1Date = undefined;
        $scope.end1Date = undefined;
        var productId = 'products';
        var customerId = 'customersMain';
        if (productId) {
            $scope.$broadcast('angucomplete-alt:clearInput', productId);
        }
        if (customerId) {
            $scope.$broadcast('angucomplete-alt:clearInput', customerId);
        }
        $scope.isSubmitDisabled = true;
        $scope.isResetDisabled = false;
        $scope.listOfStatesCount($scope.defaultTab, 1, 'clearAction');
    }

    $scope.searchedProduct = function(selected) {
        if (selected != null) {
            $scope.skuId = selected.originalObject.idtableSkuId;
        }
        $scope.callDisabled();
    }

    $scope.searchedCustomer = function(selected) {
        if (selected != null) {
            $scope.customerid = selected.originalObject.idtableCustomerId;
        }
        $scope.callDisabled();
    }

    $scope.getTotal = function(tableSkuData) {
        var total = 0;
        for (var i = 0; i < tableSkuData.tableSaleOrderSkusChargeses.length; i++) {
            var product = tableSkuData.tableSaleOrderSkusChargeses[i].tableSaleOrderSkusChargesValue;
            total += product;
        }
        return total;
    }

    $scope.totalCostPerProduct = function(tableSkuData) {
        // console.log(tableSkuData.tableSaleOrderSkusChargeses.length);
        var total = 0;
        var totalCost = 0;
        for (var i = 0; i < tableSkuData.tableSaleOrderSkusChargeses.length; i++) {
            var product = tableSkuData.tableSaleOrderSkusChargeses[i].tableSaleOrderSkusChargesValue;
            total += product;
        }

        var totalCost = total * tableSkuData.tableSaleOrderSkusSkuQuantity;

        return totalCost;
    }

    $scope.totalQuantity = function(allSkus){
        var total = 0;
        for (var i = 0; i < allSkus.length; i++) {
            var quantity = allSkus[i].tableSaleOrderSkusSkuQuantity;
            total += quantity;
        }
        return total;
    }

    $scope.totalCostAmount = function(allSkus) {
        // console.log(allSkus);
        var total = 0;
        var totalCost = 0;
        var totalCostAmount = 0;
        var totalCostAll = [];
        for (var i = 0; i < allSkus.length; i++) {
            for (var j = 0; j < allSkus[i].tableSaleOrderSkusChargeses.length; j++) {
                var product = allSkus[i].tableSaleOrderSkusChargeses[j].tableSaleOrderSkusChargesValue;
                total += product;
            }
            totalCostAmount += total * allSkus[i].tableSaleOrderSkusSkuQuantity;
            totalCostAll.push(totalCostAmount);
            total = 0;
        }
        return totalCostAmount;
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

    $scope.addDeliveryAddressMode = function() {
        $scope.addDeliveryClicked = true;
    };

    $scope.chooseDeliveryAddressMode = function() {
        $scope.addDeliveryClicked = false;
    };

    $scope.customerObj = function(selected) {
        var q = $q.defer();
        if (selected != null) {
            console.log(selected);
            $scope.isCustomerSelected = false;
            $scope.singleorderData.customerObj = selected.originalObject;

            $scope.deliveryAddresses(selected.originalObject.idtableCustomerId).then(
                function(v) {
                    $scope.custName = selected.originalObject.tableCustomerFirstName;
                    if (selected.originalObject.tableCustomerLastName && selected.originalObject.tableCustomerLastName != null && selected.originalObject.tableCustomerLastName != null) {
                        $scope.custName += " " + selected.originalObject.tableCustomerLastName;
                    }
                    $scope.$broadcast("angucomplete-alt:changeInput", "customers", $scope.custName);
                    q.resolve(true);
                },
                function(err) {
                    q.reject(false);
                }
            );
        } else {
            $scope.isCustomerSelected = true;
        }
        return q.promise;
    }


    $scope.productObject = function(selected) {
        if (selected != null) {
            console.log(selected);
            console.log($scope.channelId);
            $scope.isProductSelected = false;
            $scope.singleorderData.productObject = selected.originalObject;
            if ($scope.channelId != undefined) {
                $scope.getPriceOfProduct(selected.originalObject.idtableSkuId, $scope.channelId);
            }
        } else {
            $scope.isProductSelected = true;
        }
    }

    $scope.customerChanged = function(str) {
        console.log(str);
        if (str == '') {
            $scope.custName = null;
            $scope.deliveryAddressArray = null;
        }
    }
    $scope.showAddOrderModal = function() {
        $scope.addOrderForm.submitted = false;
        $scope.salesChannelSelected = false;
        $scope.deliveryAddressSelected = false;
        $scope.orderNumberEntered = false;

        $('#addOrderModal').modal('show');
    };

    $scope.toggleDeliveryAddressSubmittedValue = function(deliveryAddressName) {
        if (deliveryAddressName) {
            $scope.deliveryAddressSelected = false;
        } else {
            $scope.deliveryAddressSelected = true;
        }
    };

    $scope.togglePaymentTypeSubmittedValue = function(paymentType) {
        if (paymentType) {
            $scope.paymentTypeSelected = false;
        } else {
            $scope.paymentTypeSelected = true;
        }
    };

    $scope.saveSingleOrder = function() {

        console.log($scope.singleorderData);
        if ($scope.addOrderForm.orderNumberId.$invalid) {
            $scope.orderNumberEntered = true;
            growl.error("Please enter an Order Number!");
        } else {
            $scope.checkOrderNumber($scope.singleorderData.orderNo).then(
                function(v) {
                    if (v) {
                        if ($scope.addOrderForm.channelObject.$invalid) {
                            $scope.salesChannelSelected = true;
                            growl.error("Please choose a sales channel!");
                        } else if ($scope.products.length < 1) {
                            growl.error("Please add atleast one Product!");
                            $scope.isProductSelected = true;
                        } else if (!$scope.singleorderData.customerObj) {
                            $scope.isCustomerSelected = true;
                            growl.error("Please choose a Customer!");
                        } else if ($scope.addOrderForm.deliveryAddressName.$invalid) {
                            $scope.deliveryAddressSelected = true;
                            growl.error("Please choose a delivery address!");
                        } else if (!$scope.singleorderData.paymentObject) {
                            $scope.paymentTypeSelected = true;
                            growl.error("Please choose a payment type!");
                        } else {
                            var postData = {
                                "idtableSaleOrderId": 1,
                                "tableSaleOrderClientOrderNo": $scope.singleorderData.orderNo,
                                "tableSalesChannelValueInfo": $scope.singleorderData.channelObject,
                                "tableAddressByTableSaleOrderShipToAddressId": $scope.singleorderData.deliveryAddress,
                                "tableCustomer": $scope.singleorderData.customerObj,
                                "tableSaleOrderPaymentType": $scope.singleorderData.paymentObject,
                                "tableSaleOrderSkuses": $scope.products
                            }
                            console.log(postData);
                            $http({
                                method: 'POST',
                                url: baseUrl + '/omsservices/webapi/orders',
                                data: postData,
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            }).success(function(res) {
                                console.log(res);
                                if (res) {
                                    $scope.singleOrderMsg = 'Submitted successfully';
                                    $scope.orderNo = '';
                                    $scope.product = '';
                                    $scope.deliveryAddress = '';
                                    $scope.customer = '';
                                    $scope.popupChannel = '';
                                    $scope.payment = '';
                                    $scope.singleorderData = null;
                                    postData = null;
                                    $scope.products = [];
                                    // $scope.listOfOrders($scope.defaultTab, 0);
                                    $scope.listOfStatesCount($scope.defaultTab, $scope.vmPager.currentPage);
                                    if ($scope.singleOrderMode == "add") {
                                        growl.success("Order Added Successfully");
                                    } else if ($scope.singleOrderMode == "copy") {
                                        growl.success("Order Copied Successfully");
                                    }
                                    $scope.cancelSingleOrder();
                                }
                            }).error(function(error, status) {
                                console.log(error);
                                console.log(status);
                                if (status == 401) {
                                    growl.error('Your session has been expired. You need to login again.');
                                    //$('#AuthError').modal('show');
                                    $cookies.put('isLoggedIn', false);

                                    $location.path('/login');
                                }
                                growl.error("Order Cant be Added");
                            });
                        }
                    }
                },
                function(err) {

                }
            );
        }
    };

    $scope.updateSingleOrder = function() {
        console.log($scope.singleorderData);
        if ($scope.addOrderForm.channelObject.$invalid) {
            $scope.salesChannelSelected = true;
            growl.error("Please choose a sales channel!");
        } else if ($scope.addOrderForm.deliveryAddressName.$invalid) {
            $scope.deliveryAddressSelected = true;
            growl.error("Please choose a delivery address!");
        } else {
            $('#confirmEditOrder').modal('show');
        }
    };

    $scope.updateSingleOrderConfirmed = function() {
        var postData = {
            "idtableSaleOrderId": $scope.updateOrderId,
            "tableSaleOrderClientOrderNo": $scope.singleorderData.orderNo,
            "tableSalesChannelValueInfo": $scope.singleorderData.channelObject,
            "tableAddressByTableSaleOrderShipToAddressId": $scope.singleorderData.deliveryAddress,
            "tableCustomer": $scope.singleorderData.customerObj,
            "tableSaleOrderPaymentType": $scope.singleorderData.paymentObject,
            "tableSaleOrderSkuses": $scope.products
        }
        console.log(postData);
        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/orders/' + $scope.updateOrderId + '/update',
            data: postData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            console.log(res);
            if (res) {
                $scope.singleOrderMsg = 'Submitted successfully';
                $scope.orderNo = '';
                $scope.product = '';
                $scope.deliveryAddress = '';
                $scope.customer = '';
                $scope.popupChannel = '';
                $scope.payment = '';
                $scope.singleorderData = null;
                postData = null;
                $scope.products = [];
                // $scope.listOfOrders($scope.defaultTab, 0);
                $scope.listOfStatesCount($scope.defaultTab, $scope.vmPager.currentPage);
                growl.success("Order Updated Successfully");
                $scope.cancelSingleOrder();
            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);

                $location.path('/login');
            }
            growl.error("Order Cant be Added");
        });
    };

    //cancel single order
    $scope.cancelSingleOrder = function() {
        $scope.$broadcast("angucomplete-alt:clearInput", "customers");
        $scope.singleorderData = "";
        $scope.products = [];
        $scope.deliveryAddressArray = [];
        $scope.custName = null;
        $scope.salesChannelSelected = false;
        $scope.deliveryAddressSelected = false;
        $scope.orderNumberEntered = false;
        $scope.isProductSelected = false;
        $scope.isCustomerSelected = false;
        $scope.isPriceEntered = false;
        $scope.isQuantityEntered = false;
        $scope.singleOrderMode = "add";
        $('#addOrderModal').modal('hide');
        $('#confirmEditOrder').modal('hide');
    };

    $scope.deliveryAddresses = function(customerId) {
        var q = $q.defer();

        console.log("Hello");
        $scope.deliveryAddressArray = [];
        var deliveryAddressUrl = baseUrl + '/omsservices/webapi/customers/' + customerId + '/shippingaddress';
        // console.log(channelListUrl);
        $http.get(deliveryAddressUrl).success(function(data) {
            console.log(data);
            $scope.deliveryAddArray = data;

            for (var i = 0; i < $scope.deliveryAddArray.length; i++) {
                $scope.deliveryAddressArray.push($scope.deliveryAddArray[i]);
            }
            console.log($scope.deliveryAddressArray);
            q.resolve(true);
        }).error(function(error, status) {
            q.reject(false);
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);

                $location.path('/login');
            }
        });
        return q.promise;
    }

    $scope.createHeaderList = function(headers) {
        console.log(headers);
        $scope.arrayHeaderList = [];
        console.log(headers[0]);
        var a = headers[0];
        // // $scope.headerList = SplitTheString(headers[0]);
        // // console.log($scope.headerList);
        // for(var i=0;i<a.length;i++)
        // {
        // 	$scope.arrayHeaderList.push(a[i]);
        // 	$scope.list1 = $scope.arrayHeaderList;
        // }

        angular.forEach(headers[0], function(value, key) {
            $scope.arrayHeaderList.push(key);
            $scope.list1 = $scope.arrayHeaderList;
        });
    }

    $scope.generateHeaders = function() {
        var omsColUrl = baseUrl + '/omsservices/webapi/bulkuploadomscol';

        $http.get(omsColUrl).success(function(data) {
            for (var i = 0; i < data.length; i++) {
                $scope.arrayList.push(data[i].tableSalesChannelBulkUploadOmsColString);
            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);

                $location.path('/login');
            }
        });
    }
    $scope.generateHeaders();
    $scope.changeIndex = function(index) {
        console.log(index);
    }

    $scope.stateTrials = function(saleordskus) {
        console.log(saleordskus);
        console.log(saleordskus.length);
        $scope.trialsDataArray = [];
        $scope.trialIdArray = [];
        $scope.trialsLength = [];
        $scope.fullTrialsArray = [];
        $scope.fullIdArray = [];
        for (var i = 0; i < saleordskus.length; i++) {
            console.log(i);
            console.log(saleordskus[i]);
            var trials = saleordskus[i].tableSaleOrderSkuStateTrails;
            $scope.trialsLength.push(trials.length);
            console.log(trials);
            console.log($scope.trialsLength);
            if (trials.length < 4) {
                for (var j = 0; j < trials.length; j++) {
                    $scope.trialsDataArray.push(trials[j].tableSaleOrderSkuStateType.tableSaleOrderSkuStateTypeString);
                    $scope.trialIdArray.push(trials[j].tableSaleOrderSkuStateType.idtableSaleOrderSkuStateTypeId);
                }
            }

            if (trials.length == 4) {
                for (var j = 0; j < trials.length; j++) {
                    console.log(trials[j].tableSaleOrderSkuStateType.tableSaleOrderSkuStateTypeString);
                    $scope.trialsDataArray.push(trials[j].tableSaleOrderSkuStateType.tableSaleOrderSkuStateTypeString);
                    $scope.trialIdArray.push(trials[j].tableSaleOrderSkuStateType.idtableSaleOrderSkuStateTypeId);
                }
            }

            if (trials.length > 4) {
                console.log(trials.length - 4);
                var totalLength = trials.length - 4;
                for (var j = totalLength; j < trials.length; j++) {
                    console.log(trials[j].tableSaleOrderSkuStateType.tableSaleOrderSkuStateTypeString);
                    $scope.trialsDataArray.push(trials[j].tableSaleOrderSkuStateType.tableSaleOrderSkuStateTypeString);
                    $scope.trialIdArray.push(trials[j].tableSaleOrderSkuStateType.idtableSaleOrderSkuStateTypeId);
                }
            }


            $scope.fullTrialsArray.push($scope.trialsDataArray);
            $scope.fullIdArray.push($scope.trialIdArray);

            $scope.trialsDataArray = [];
            $scope.trialIdArray = [];

            console.log($scope.fullTrialsArray);
        }
    };

    $scope.priceEntered = function(price) {
        if (price) {
            $scope.isPriceEntered = false;
        } else {
            $scope.isPriceEntered = true;
        }
    };

    $scope.qtyEntered = function(qty) {
        if (qty) {
            $scope.isQuantityEntered = false;
        } else {
            $scope.isQuantityEntered = true;
        }
    };

    // adding the product in table one by one
    $scope.addProduct = function(tableSku, tableSaleOrderSkusSkuQuantity, id, price) {

        if (!$scope.singleorderData.productObject) {
            growl.error("Please select a Product first!");
            $scope.isProductSelected = true;
        } else if (!price) {
            growl.error("Please enter the Product's Price!");
            $scope.isPriceEntered = true;
        } else if (price < 1) {
            growl.error("Please enter a valid Product's Price!");
            $scope.isPriceEntered = true;
        } else if (!tableSaleOrderSkusSkuQuantity) {
            growl.error("Please enter the Product's Quantity!");
            $scope.isQuantityEntered = true;
        } else if (tableSaleOrderSkusSkuQuantity < 1) {
            growl.error("Please enter a valid Product's Quantity!");
            $scope.isQuantityEntered = true;
        } else {
            console.log(tableSaleOrderSkusSkuQuantity);
            tableSku = $scope.singleorderData.productObject;

            var tempObject = {
                tableSku: tableSku,
                tableSaleOrderSkusSkuQuantity: tableSaleOrderSkusSkuQuantity,
                tableSaleOrderSkusChargeses: [{
                    "tableSaleOrderSkusChargesValue": price,
                    "tableSaleOrderSkuChargesType": {
                        "idtableSaleOrderSkuChargesTypeId": 1,
                        "tableSaleOrderSkuChargesTypeString": "Item Price"
                    }
                }]
            };

            var dirty = false;

            for (var i = 0; i < $scope.products.length; i++) {
                if ($scope.products[i].tableSku.idtableSkuId == tableSku.idtableSkuId) {
                    dirty = true;
                }
            }


            if (dirty) {
                growl.error("The selected SKU is already part of the current order. Delete the existing item first to add updated quantity.");
                $scope.isProductSelected = true;
            } else {
                $scope.products.push(tempObject);
                console.log($scope.products);
                var id = 'products'
                if (id) {
                    $scope.$broadcast('angucomplete-alt:clearInput', id);
                    tableSku = null;
                    tableSaleOrderSkusSkuQuantity = null;
                    $scope.singleorderData.productObj = null;
                    $scope.singleorderData.quantityNo = null;
                    $scope.singleorderData.priceProd = null;
                    $scope.isProductSelected = false;
                    $scope.isPriceEntered = false;
                    $scope.isQuantityEntered = false;
                } else {
                    $scope.$broadcast('angucomplete-alt:clearInput');
                }

                $scope.singleorderData.productObject = undefined;
            }
        }
    };

    //remove the product
    $scope.removeProduct = function(index) {
        $scope.products.splice(index, 1);
    };
    //load the warehouses from backenf for select warehouse in timeline feature.
    $scope.loadWareHouses = function(orderId, tableSaleOrderId) {
        console.log(orderId);
        console.log(tableSaleOrderId);
        // orderId = 1;
        // tableSaleOrderId = 1;
        console.log("Hello");
        $scope.wareHousesArray = [];
        var wareHousesUrl = baseUrl + '/omsservices/webapi/orders/' + orderId + '/orderskus/' + tableSaleOrderId + '/warehouses';
        // console.log(channelListUrl);
        $http.get(wareHousesUrl).success(function(data) {
            for (var i = 0; i < data.length; i++) {
                $scope.wareHousesArray.push(data[i]);
            }
            console.log($scope.wareHousesArray);
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);

                $location.path('/login');
            }
        });
    }

    //load the return warehouses from backend for select return warehouse in timeline feature.
    $scope.loadReturnWareHouses = function(orderId, tableSaleOrderId) {
        console.log(orderId);
        console.log(tableSaleOrderId);
        orderId = 1;
        tableSaleOrderId = 1;
        console.log("Hello");
        $scope.returnwareHousesArray = [];
        var returnwareHousesUrl = baseUrl + '/omsservices/webapi/orders/' + orderId + '/orderskus/' + tableSaleOrderId + '/returnwarehouses';
        $http.get(returnwareHousesUrl).success(function(data) {
            for (var i = 0; i < data.length; i++) {
                $scope.returnwareHousesArray.push(data[i]);
            }
            console.log($scope.returnwareHousesArray);
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);

                $location.path('/login');
            }
        });
    }

    //load the shipping carriers from backend in timeline feature.
    $scope.loadShippingCarriers = function(orderId, tableSaleOrderId, tableSkuData, saleChannelId) {
        console.log(orderId);
        console.log(tableSaleOrderId);
        if (saleChannelId != 1) {
            $scope.shippingCarrierArray = [];
            var shippingCarrierUrl = baseUrl + '/omsservices/webapi/orders/' + orderId + '/shipping/' + tableSaleOrderId;
            $http.get(shippingCarrierUrl).success(function(data) {
                console.log(data);
                $scope.shippingCarrierArray = data.availableShippingServices;
                console.log($scope.shippingCarrierArray);
            }).error(function(error, status) {
                console.log(error);
                console.log(status);
                if (status == 401) {
                    //$('#AuthError').modal('show');
                    $cookies.put('isLoggedIn', false);

                    $location.path('/login');
                }
            });
        }

        if (saleChannelId == 1) {
            $scope.shippingCarrierArray = [];
            var shippingCarrierUrl = baseUrl + '/omsservices/webapi/orders/schedulepickup/' + orderId + '/' + tableSaleOrderId;
            $http({
                method: 'GET',
                url: shippingCarrierUrl,
                headers: {
                    'Content-Type': 'application/octet-stream'
                }
            }).success(function(res) {
                console.log(res);
                $scope.redirectToFileUploadUrl = function() {
                    $window.open('https://www.google.com', '_blank');
                };
                $scope.redirectToFileUploadUrl();
            }).error(function(error, status) {
                console.log(error);
                console.log(status);
                if (status == 401) {
                    growl.error('Your session has been expired. You need to login again.');
                    //$('#AuthError').modal('show');
                    $cookies.put('isLoggedIn', false);

                    $location.path('/login');
                }
                $scope.redirectToFileUploadUrl = function() {
                    $window.open('https://www.google.com', '_blank');
                };
                $scope.redirectToFileUploadUrl();
            });
        }
    }

    $scope.redirectToFileUploadUrl = function() {
        $window.open('https://sellercentral.amazon.in/gp/transactions/uploadSchedulePickup.html', '_blank');
    };
    // $scope.redirectToFileUploadUrl();

    $scope.loadCancelReasons = function() {
        var cancelReasonsUrl = baseUrl + '/omsservices/webapi/saleordercancelreasons';
        $http.get(cancelReasonsUrl).success(function(data) {
            console.log(data);
            $scope.cancelReasonArray = data;
            console.log($scope.cancelReasonArray);
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);

                $location.path('/login');
            }
        });
    }

    $scope.list1 = $scope.arrayHeaderList;
    $scope.list2 = [];

    $scope.sortableOptions = {
        // placeholder: "app",
        // connectWith: ".apps-container",
        cursor: "move",
        update: function(e, ui) {
            fromIndex = ui.item.sortable.index;
            toIndex = ui.item.sortable.dropindex;
            console.log(fromIndex);
            console.log(toIndex);
            var a = $scope.arrayHeaderList;
            $scope.arrayHeaderList = arraymove(a, fromIndex, toIndex);
        }
    };

    $scope.ansortableOptions = {
        placeholder: "app",
        connectWith: ".apps-container"
    };

    $scope.deleteFunc = function(index) {
        console.log(index);
        $scope.arrayHeaderList.splice(index, 1);
    }

    function arraymove(arr, fromIndex, toIndex) {
        if (fromIndex <= arr.length && toIndex <= arr.length) {
            var element = arr[fromIndex];
            arr.splice(fromIndex, 1);
            arr.splice(toIndex, 0, element);
            console.log(arr);
            return arr;
        } else {
            console.log("No Choice");
            return arr;
        }
    }

    function htmlToPlaintext(text) {
        return text ? String(text).replace(/<[^>]+>/gm, '') : '';
    }
    //action after selecting warehouse in the timeline feature(active state)
    $scope.selectWareHouseAction = function(orderId, tableSaleOrderId, wareHouseObject) {
        console.log(orderId);
        console.log(tableSaleOrderId);
        console.log(wareHouseObject);
        if (wareHouseObject == undefined) {
            growl.error("Warehouse Cannot Be Allocated");
        }
        if (wareHouseObject != undefined) {
            var wareHousesUrl = baseUrl + '/omsservices/webapi/orders/' + orderId + '/orderskus/' + tableSaleOrderId + '/warehouse';
            $http.put(wareHousesUrl, wareHouseObject).success(function(data) {
                console.log(data);
                if (data) {
                    growl.success("Warehouse Allocated Successfully");
                    // $scope.listOfOrders($scope.defaultTab, 0);
                    $scope.listOfStatesCount($scope.defaultTab, $scope.vmPager.currentPage);
                    for (var i = 0; i < $scope.orderLists.length; i += 1) {
                        $scope.dayDataCollapse[i] = false;
                    }
                }
            }).error(function(error, status) {
                console.log(error);
                console.log(status);
                if (status == 401) {
                    growl.error('Your session has been expired. You need to login again.');
                    //$('#AuthError').modal('show');
                    $cookies.put('isLoggedIn', false);

                    $location.path('/login');
                }
                growl.error("Warehouse Cannot Be Allocated");
            });
            $mdDialog.hide();
        }
    }

    //action after selecting shipping carrier in the timeline feature(active state)
    $scope.selectShippingCarrierAction = function(orderId, tableSaleOrderId, shippingObject) {
        console.log(orderId);
        console.log(tableSaleOrderId);
        console.log(shippingObject);
        if (shippingObject == undefined) {
            growl.error("Shipping Carrier cannot be allocated");
        }
        if (shippingObject != undefined) {
            var shippingAllocateUrl = baseUrl + '/omsservices/webapi/orders/' + orderId + '/shipping/' + tableSaleOrderId;
            $http.put(shippingAllocateUrl, shippingObject).success(function(data) {
                console.log(data);
                if (data) {
                    growl.success("Shipping Carrier Allocated Successfully");
                    // $scope.listOfOrders($scope.defaultTab, 0);
                    $scope.listOfStatesCount($scope.defaultTab, $scope.vmPager.currentPage);
                    for (var i = 0; i < $scope.orderLists.length; i += 1) {
                        $scope.dayDataCollapse[i] = false;
                    }
                }
            }).error(function(error, status) {
                console.log(error);
                console.log(status);
                if (status == 401) {
                    growl.error('Your session has been expired. You need to login again.');
                    //$('#AuthError').modal('show');
                    $cookies.put('isLoggedIn', false);

                    $location.path('/login');
                }
                growl.error("Shipping Carrier cannot be allocated");
            });
            $mdDialog.hide();
        }
    }

    $scope.checkCancelReasonSelected = function(remarks) {
        if (remarks) {
            $scope.isCancelReasonSelected = false;
        } else {
            $scope.isCancelReasonSelected = true;
        }
    };

    //action after cancel warehouse in the timeline feature(active state)
    $scope.selectCancelAction = function(orderId, tableSaleOrderId, remarks) {
        if (!remarks) {
            $scope.isCancelReasonSelected = true;
            growl.error("Please select a reason for cancellation");
        } else {
            console.log(orderId);
            console.log(tableSaleOrderId);
            console.log(remarks);
            if (remarks != undefined) {
                var cancelUrl = baseUrl + '/omsservices/webapi/orders/' + orderId + '/orderskus/' + tableSaleOrderId + '/cancel/?remarks=' + remarks;
                $http.put(cancelUrl).success(function(data) {
                    console.log(data);
                    $mdDialog.hide();
                    if (data) {
                        growl.success("Order Cancelled Successfully");
                        // $scope.listOfOrders($scope.defaultTab, 0);
                        $scope.listOfStatesCount($scope.defaultTab, $scope.vmPager.currentPage);
                        for (var i = 0; i < $scope.orderLists.length; i += 1) {
                            $scope.dayDataCollapse[i] = false;
                        }
                    }
                }).error(function(error, status) {
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
        }
    }

    //Bulk Upload Functionality Starts

    //getting date formats from bulk uploads settings backend
    $scope.dateFormatsBulkUpload = function() {
            $scope.dateFormatsArray = [];
            var dateFormatsUrl = baseUrl + '/omsservices/webapi/dateformat';
            $http.get(dateFormatsUrl).success(function(data) {
                console.log(data);
                for (var i = 0; i < data.length; i++) {
                    $scope.dateFormatsArray.push(data[i].tableSalesChannelDateFormatString);
                }
            }).error(function(error, status) {
                console.log(error);
                console.log(status);
                if (status == 401) {
                    //$('#AuthError').modal('show');
                    $cookies.put('isLoggedIn', false);

                    $location.path('/login');
                }
            });
        }
        //getting date format ends here

    //saving bulk upload settings
    $scope.bulkUploadsSettingSave = function() {
        var mappingCols = [];
        console.log($scope.bulkOrderSettingData);
        console.log($scope.arrayHeaderList.length);
        for (var i = 0; i < $scope.arrayHeaderList.length; i++) {
            mappingCols.push({
                tableSalesChannelBulkUploadMapOmsCol: $scope.arrayList[i],
                tableSalesChannelBulkUploadMapScCol: $scope.arrayHeaderList[i]
            });
        }
        console.log(mappingCols);
        var postData = {
            "tableSalesChannelBulkUploadSettingsName": $scope.bulkOrderSettingData.tableSalesChannelBulkUploadSettingsName,
            "tableSalesChannelBulkUploadSettingsDateFormat": $scope.bulkOrderSettingData.tableSalesChannelBulkUploadSettingsDateFormat,
            "tableSalesChannelBulkUploadMapCols": mappingCols
        }


        console.log(postData);
        var channelId = $scope.bulkOrderSettingData.channelId;
        delete $scope.bulkOrderSettingData.channelId;

        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/bulkuploadsettings',
            data: postData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            console.log(res);
            if (res) {
                growl.success("Bulk Order Map Setting Added Successfully");
            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);

                $location.path('/login');
            }
            growl.error("Bulk Order Map Setting Cannot Be Added");
        });
    }

    //editing bulk upload settings
    $scope.bulkUploadsSettingEdit = function() {
        console.log($scope.bulkUploadSettingId);
        var mappingCols = [];
        console.log($scope.bulkOrderSettingData);
        console.log($scope.arrayHeaderList.length);
        for (var i = 0; i < $scope.arrayHeaderList.length; i++) {
            mappingCols.push({
                tableSalesChannelBulkUploadMapOmsCol: $scope.arrayList[i],
                tableSalesChannelBulkUploadMapScCol: $scope.arrayHeaderList[i]
            });
        }
        console.log(mappingCols);
        var putData = {
            "idtableSalesChannelBulkUploadSettingsId": $scope.bulkUploadSettingId,
            "tableSalesChannelBulkUploadSettingsName": $scope.bulkOrderSettingData.tableSalesChannelBulkUploadSettingsName,
            "tableSalesChannelBulkUploadSettingsDateFormat": $scope.bulkOrderSettingData.tableSalesChannelBulkUploadSettingsDateFormat,
            "tableSalesChannelBulkUploadMapCols": mappingCols
        }


        console.log(putData);

        $http({
            method: 'PUT',
            // url : baseUrl+'/omsservices/webapi/saleschannels/'+channelId+'/bulkuploadsetting',
            url: baseUrl + '/omsservices/webapi/bulkuploadsettings/' + $scope.bulkUploadSettingId,
            data: putData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            console.log(res);
            if (res) {
                growl.success("Bulk Order Map Setting Edited Successfully");
            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);

                $location.path('/login');
            }
            growl.error("Bulk Order Map Setting Cannot Be Edited");
        });
    }

    //saving bulk upload settings channel wise
    $scope.savebulkUploadSettingChannelWise = function(bulkOrderchannelId) {
        console.log($scope.arrayHeaderList);
        var channelId = bulkOrderchannelId;
        // delete $scope.bulkOrderSettingData.channelId;

        var mappingCols = [];
        // console.log($scope.bulkOrderSettingData);
        console.log(channelId);
        if (channelId == undefined) {
            growl.error("Bulk Order Cannot Be Saved");
        }
        $http.get(baseUrl + "/omsservices/webapi/saleschannels/" + channelId).success(function(data) {
            // console.log(data);

            // console.log($scope.arrayHeaderList.length);
            for (var i = 0; i < $scope.arrayHeaderList.length; i++) {
                mappingCols.push({
                    tableSalesChannelBulkUploadMapOmsCol: $scope.arrayList[i],
                    tableSalesChannelBulkUploadMapScCol: $scope.arrayHeaderList[i]
                });
            }
            // console.log(mappingCols);
            var putData = {
                "idtableSalesChannelBulkUploadSettingsId": $scope.bulkUploadSettingId,
                "tableSalesChannelBulkUploadSettingsName": $scope.bulkOrderSettingData.tableSalesChannelBulkUploadSettingsName,
                "tableSalesChannelBulkUploadSettingsDateFormat": $scope.bulkOrderSettingData.tableSalesChannelBulkUploadSettingsDateFormat,
                "tableSalesChannelBulkUploadMapCols": mappingCols
            }


            // console.log(putData);
            if ($scope.bulkOrderSettingData.tableSalesChannelBulkUploadSettingsName != null) {
                data.tableSalesChannelBulkUploadSettings = putData;
            }
            if ($scope.bulkOrderSettingData.tableSalesChannelBulkUploadSettingsName == null) {
                data.tableSalesChannelBulkUploadSettings = null;
            }
            console.log(data);
            $http({
                method: 'PUT',
                url: baseUrl + '/omsservices/webapi/saleschannels/' + channelId,
                // url : baseUrl+ '/omsservices/webapi/bulkuploadsettings',
                data: data,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(res) {
                console.log(res);
                $scope.arrayList = [];
                $scope.arrayHeaderList = [];
                $scope.bulkOrderSettingData = null;
                $scope.dateFormat = null;
                $scope.bulkOrderchannelId = null;
                $scope.initialSelected = null;
                $scope.bulkOrderSettingData = "";
                $scope.bulkOrderSettingData.tableSalesChannelBulkUploadSettingsDateFormat = "";
                $scope.bulkOrderSettingData.tableSalesChannelBulkUploadSettingsName = "";
                $scope.bulkUploadMapElemClicked = false;
                $scope.arrayHeaderList = [];
                $scope.dateFormat = "";
                var id = 'settingName'
                if (id) {
                    $scope.$broadcast('angucomplete-alt:clearInput', id);
                }
                $scope.generateHeaders();
                growl.success("Bulk Order Saved Successfully");
            }).error(function(error, status) {
                console.log(error);
                console.log(status);
                if (status == 401) {
                    growl.error('Your session has been expired. You need to login again.');
                    //$('#AuthError').modal('show');
                    $cookies.put('isLoggedIn', false);

                    $location.path('/login');
                }
                growl.error("Bulk Order Cannot Be Saved");
                $scope.arrayList = [];
                $scope.arrayHeaderList = [];
                $scope.bulkOrderSettingData = null;
                $scope.dateFormat = null;
                $scope.bulkOrderchannelId = null;
                $scope.initialSelected = null;
                $scope.bulkOrderSettingData = "";
                $scope.bulkOrderSettingData.tableSalesChannelBulkUploadSettingsDateFormat = "";
                $scope.bulkOrderSettingData.tableSalesChannelBulkUploadSettingsName = "";
                $scope.bulkUploadMapElemClicked = false;
                $scope.arrayHeaderList = [];
                $scope.dateFormat = "";
                var id = 'settingName'
                if (id) {
                    $scope.$broadcast('angucomplete-alt:clearInput', id);
                }
                $scope.generateHeaders();
            });
        });
    }

    //singleOrder Tab Mode
    $scope.singleOrderTabMode = function() {
        $scope.singleOrderTab = true;
        $scope.bulkOrderTab = false;
    }

    //bulkOrder Tab Mode
    $scope.bulkOrderTabMode = function() {
        $scope.singleOrderTab = false;
        $scope.bulkOrderTab = true;
    }


    $scope.uploadFile = function() {
        console.log($scope.bulkOrderSettingData.channelId);
        var file = $scope.myFile;
        console.log('file is ');
        console.dir(file);
        var uploadUrl = baseUrl + '/omsservices/webapi/saleschannels/' + $scope.bulkOrderSettingData.channelId + '/uploadbulkorders';
        // fileUpload1.uploadFileToUrl(file,uploadUrl);

        var fd = new FormData();
        fd.append('uploadFile', file);
        console.log(uploadUrl);
        console.log('uploadFile' + file);
        console.log('fd' + fd);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).success(function(res) {
            console.log(res);
            if (res) {
                // $scope.listOfOrders($scope.defaultTab, 0);
                $scope.listOfStatesCount($scope.defaultTab, $scope.vmPager.currentPage);
                growl.success("Bulk Order Uploaded successfully");
            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);

                $location.path('/login');
            }
            if (error != null) {
                growl.error("Error in Uploading Bulk Order");
                $scope.bulkOrderSettingData = "";
                $scope.csvTrue = true;
                angular.element("input[type='file']").val(null);
            }
            if (error == null) {
                growl.error("Error in Uploading Bulk Order");
                $scope.bulkOrderSettingData = "";
                $scope.csvTrue = true;
                angular.element("input[type='file']").val(null);
            }
        });
    }

    //dialog box to open warehouse selection dialog box
    $scope.openWareHouseBox = function(ev, orderId, tableSaleOrderId, orderNo) {
        $scope.orderId = orderId;
        $scope.tableSaleOrderId = tableSaleOrderId;
        $scope.loadWareHouses(orderId, tableSaleOrderId);
        $scope.orderNo = orderNo;
        $mdDialog.show({
                templateUrl: 'dialog1.tmpl.html',
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
    }

    $scope.cancelWarehouseSelection = function() {
        $mdDialog.hide();
    }

    $scope.onvalue = function(radio) {
        // console.log(radio);
        $scope.wareHouseObject = JSON.parse(radio);
    }

    //dialog box to open shipping selection dialog box
    $scope.openShippingCarrierBox = function(ev, orderId, tableSaleOrderId, tableSkuData, orderNo, saleChannelId) {
        $scope.orderId = orderId;
        $scope.tableSaleOrderId = tableSaleOrderId;
        console.log(tableSkuData);
        $scope.loadShippingCarriers(orderId, tableSaleOrderId, tableSkuData, saleChannelId);
        $scope.orderNo = orderNo;
        if (saleChannelId != 1) {
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
        }
    }

    $scope.cancelWarehouseSelection = function() {
        $mdDialog.hide();
    }

    $scope.onvalue1 = function(radio1) {
        console.log(radio1);
        $scope.shippingObject = JSON.parse(radio1);
        console.log($scope.shippingObject);
    }

    //dialog box to open cancel order dialog box
    $scope.cancelSaleOrderBox = function(ev, orderId, tableSaleOrderId, orderNo) {
        $scope.isCancelReasonSelected = false;
        $scope.orderId = orderId;
        $scope.tableSaleOrderId = tableSaleOrderId;
        $scope.orderNo = orderNo;
        $scope.loadCancelReasons();
        $mdDialog.show({
                templateUrl: 'dialog3.tmpl.html',
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
    }

    //info box to show full state trials for the order
    $scope.openInfoBox = function(ev, stateTrials) {
        $scope.steps = [];
        console.log(stateTrials);
        for (var i = 0; i < stateTrials.length; i++) {
            var a = stateTrials.length - 1;
            var fulldate = stateTrials[i].tableSaleOrderSkuStateTrailTimestamp[2] + "/" + stateTrials[i].tableSaleOrderSkuStateTrailTimestamp[1] + "/" + stateTrials[i].tableSaleOrderSkuStateTrailTimestamp[0];
            if (i < a) {
                $scope.steps.push({
                    title: stateTrials[i].tableSaleOrderSkuStateType.tableSaleOrderSkuStateTypeString,
                    active: true,
                    orderState: "Successful",
                    remarks: stateTrials[i].tableSaleOrderSkuStateTrailRemarks,
                    fulldate: fulldate
                });
            }
            if (i == a) {
                $scope.steps.push({
                    title: stateTrials[i].tableSaleOrderSkuStateType.tableSaleOrderSkuStateTypeString,
                    orderState: "In Process",
                    remarks: stateTrials[i].tableSaleOrderSkuStateTrailRemarks,
                    fulldate: fulldate
                });
            }
        }
        console.log($scope.steps);
        $mdDialog.show({
                templateUrl: 'infoDialog.tmpl.html',
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
    }

    $scope.cancelInfoBox = function() {
            $mdDialog.hide();
        }
        //testing 123
    $scope.testObj = function(selected) {
        if (selected != undefined || selected != null) {
            $scope.arrayList = [];
            $scope.bulkUploadSettingMode = "edit";
            console.log(selected);
            console.log(selected.originalObject.tableSalesChannelBulkUploadMapCols);
            var uploadMapcols = selected.originalObject.tableSalesChannelBulkUploadMapCols;
            $scope.dateFormat = selected.originalObject.tableSalesChannelBulkUploadSettingsDateFormat;
            $scope.bulkUploadSettingId = selected.originalObject.idtableSalesChannelBulkUploadSettingsId;
            $scope.bulkOrderSettingData.tableSalesChannelBulkUploadSettingsName = selected.originalObject.tableSalesChannelBulkUploadSettingsName;
            console.log($scope.dateFormat);
            for (var i = 0; i < uploadMapcols.length; i++) {
                $scope.arrayList.push(uploadMapcols[i].tableSalesChannelBulkUploadMapOmsCol);
                $scope.arrayHeaderList.push(uploadMapcols[i].tableSalesChannelBulkUploadMapScCol);
                $scope.list1 = $scope.arrayHeaderList;
            }
            if (selected) {
                window.alert('You have selected ' + selected.title);
            } else {
                console.log('cleared');
            }
        }
    };

    $scope.inputChanged = function(str) {
        $scope.arrayList = [];
        $scope.console10 = str;
        console.log($scope.console10);
        $scope.bulkOrderSettingData.tableSalesChannelBulkUploadSettingsName = $scope.console10;
        console.log($scope.bulkOrderSettingData);
        if ($scope.console10.length < 4) {
            $scope.arrayList = [];
            $scope.bulkOrderSettingData = "";
            $scope.dateFormat = "";
            $scope.arrayHeaderList = [];
            $scope.list1 = $scope.arrayHeaderList;
            $scope.bulkUploadSettingMode = "add";
            $scope.generateHeaders();
        }
        if ($scope.console10.length >= 4) {
            $scope.arrayList = [];
            $scope.generateHeaders();
        }
    }

    //getting price of Product
    $scope.getPriceOfProduct = function(skuId, saleChannelId) {
        $http({
            method: 'GET',
            url: baseUrl + '/omsservices/webapi/skus/' + skuId + '/saleschannel/' + saleChannelId + '/price',
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            console.log(res);
            $scope.singleorderData.priceProd = res;
        }).error(function(error, status) {
            $scope.singleorderData.priceProd = 0;
            console.log(status);
            if (status == 401) {
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);

                $location.path('/login');
            }
        });
    }

    $scope.getChannelId = function(channel) {
        if (!channel) {
            $scope.salesChannelSelected = true;
        } else {
            var channelData = channel;
            $scope.channelId = channelData.idtableSalesChannelValueInfoId;
            console.log($scope.singleorderData.productObject);
            if ($scope.singleorderData.productObject != undefined) {
                $scope.getPriceOfProduct($scope.singleorderData.productObject.idtableSkuId, $scope.channelId);
            }
            $scope.salesChannelSelected = false;
        }
    };

    //opening and closing bulk upload order fields accordian
    $scope.selectinvRow = function() {
        console.log($scope.bulkUploadOrderFielsClicked);
        if ($scope.bulkUploadOrderFielsClicked == false) {
            $scope.bulkUploadOrderFielsClicked = true;
        }

    }

    $scope.selectotherRow = function() {
        if ($scope.bulkUploadOrderFielsClicked == true) {
            $scope.bulkUploadOrderFielsClicked = false;
        }
    }

    //opening and closing bulk upload map elem fields accordian
    $scope.selectmapElemRow = function() {
        console.log($scope.bulkUploadMapElemClicked);
        if ($scope.bulkUploadMapElemClicked == false) {
            $scope.bulkUploadMapElemClicked = true;
        }

    }

    $scope.selectothermapElemRow = function() {
        if ($scope.bulkUploadMapElemClicked == true) {
            $scope.bulkUploadMapElemClicked = false;
        }
    }

    $scope.checkbulkMappingSettingsAvailable = function(channelId) {
        console.log(channelId);
        $http.get(baseUrl + "/omsservices/webapi/saleschannels/" + channelId).success(function(data) {
            console.log(data.tableSalesChannelBulkUploadSettings);
            if (data.tableSalesChannelBulkUploadSettings == null) {
                $scope.csvTrue = false;
            }
            if (data.tableSalesChannelBulkUploadSettings != null) {
                $scope.csvTrue = true;
            }
        });
    }

    $scope.setMappingName = function(channelId) {
        $scope.arrayList = [];
        // $scope.initialSelected = "";
        console.log(channelId);
        $http.get(baseUrl + "/omsservices/webapi/saleschannels/" + channelId).success(function(data) {
            console.log(data.tableSalesChannelBulkUploadSettings);
            var settings = data.tableSalesChannelBulkUploadSettings;
            var mapCols = settings.tableSalesChannelBulkUploadMapCols;
            if (settings != null) {
                $scope.initialSelected = settings.tableSalesChannelBulkUploadSettingsName;
                var id = 'settingName'
                if (id) {
                    $scope.$broadcast('angucomplete-alt:createInput', id, $scope.initialSelected);
                }
                $scope.bulkOrderSettingData.tableSalesChannelBulkUploadSettingsName = settings.tableSalesChannelBulkUploadSettingsName;
                $scope.bulkUploadSettingId = settings.idtableSalesChannelBulkUploadSettingsId;
                $scope.dateFormat = settings.tableSalesChannelBulkUploadSettingsDateFormat;
                for (var i = 0; i < mapCols.length; i++) {
                    $scope.arrayList.push(mapCols[i].tableSalesChannelBulkUploadMapOmsCol);
                    $scope.arrayHeaderList.push(mapCols[i].tableSalesChannelBulkUploadMapScCol);
                    $scope.list1 = $scope.arrayHeaderList;
                }
            }
        });
    }

    function setFocus() {
        document.getElementById("settingName").focus();
    }

    function setBlur() {
        document.getElementById("settingName").blur();
    }
    $scope.closebulkOrderUploadCsv = function() {
        console.log("hello");
        $scope.csvTrue = true;
        $mdDialog.hide();
        $('#addOrderModal').modal('show');
    }

    $scope.closebulkOrderMapSettings = function() {
        $scope.bulkOrderchannelId = null;
        $scope.initialSelected = null;
        $scope.bulkOrderSettingData = "";
        $scope.bulkOrderSettingData.tableSalesChannelBulkUploadSettingsDateFormat = "";
        $scope.bulkOrderSettingData.tableSalesChannelBulkUploadSettingsName = "";
        $scope.arrayHeaderList = [];
        $scope.dateFormat = "";
        $scope.bulkUploadMapElemClicked = false;
        var id = 'settingName'
        if (id) {
            $scope.$broadcast('angucomplete-alt:clearInput', id);
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
            '.': 46
        };
        for (var index in keys) {
            if (!keys.hasOwnProperty(index)) continue;
            if (event.charCode == keys[index] || event.keyCode == keys[index]) {
                return; //default event
            }
        }
        event.preventDefault();
    };

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

    //Start Date and End Date Validations Starts Here
    $scope.todayDate = new Date();
    $scope.startmaxDate = new Date(
        $scope.todayDate.getFullYear(),
        $scope.todayDate.getMonth(),
        $scope.todayDate.getDate());

    $scope.endmaxDate = new Date(
        $scope.todayDate.getFullYear(),
        $scope.todayDate.getMonth(),
        $scope.todayDate.getDate());

    $scope.sendStartDate = function(date) {
        console.log(date);
        $scope.startDateData = new Date(date);
        $scope.endminDate = new Date(
            $scope.startDateData.getFullYear(),
            $scope.startDateData.getMonth(),
            $scope.startDateData.getDate());
        $scope.callDisabled();
        $scope.isStartDateDisabled = false;
    }

    $scope.sendEndDate = function(date) {
        console.log(date);
        $scope.endDateData = new Date(date);
        $scope.startmaxDate = new Date(
            $scope.endDateData.getFullYear(),
            $scope.endDateData.getMonth(),
            $scope.endDateData.getDate());
        $scope.callDisabled();
        $scope.isEndDateDisabled = false;
    }

    $scope.getFileType = function(file) {
        console.log(file);
        // $scope.ControllerVariable = $window.ScriptVariable;
        // console.log($scope.ControllerVariable);
    }

    $scope.editOrder = function(orderId) {
        $scope.singleOrderMode = "edit";
        $scope.updateOrderId = orderId;
        var editOrderUrl = baseUrl + '/omsservices/webapi/orders/' + orderId;
        $http({
            method: 'GET',
            url: editOrderUrl
        }).success(function(res) {
            if (res) {
                console.log(res);
                $scope.singleorderData.orderNo = res.tableSaleOrderClientOrderNo;
                $scope.singleorderData.channelObject = initializeDropdowns($scope.channelNamesData, 'idtableSalesChannelValueInfoId', res.tableSalesChannelValueInfo.idtableSalesChannelValueInfoId);
                $scope.singleorderData.paymentObject = initializeDropdowns($scope.paymentNamesData, 'idtableSaleOrderPaymentTypeId', res.tableSaleOrderPaymentType.idtableSaleOrderPaymentTypeId);
                $scope.custDataObj = {};
                $scope.custDataObj.originalObject = res.tableCustomer;
                $scope.customerObj($scope.custDataObj).then(
                    function(v) {
                        console.log(res.tableSaleOrderSkuses);
                        var abc = res.tableSaleOrderSkuses;
                        for (var i = 0; i < abc.length; i++) {
                            console.log(abc[i]);
                            $scope.products.push({
                                tableSku: abc[i].tableSku,
                                tableSaleOrderSkusSkuQuantity: res.tableSaleOrderSkuses[i].tableSaleOrderSkusSkuQuantity,
                                tableSaleOrderSkusChargeses: [{
                                    "tableSaleOrderSkusChargesValue": res.tableSaleOrderSkuses[i].tableSaleOrderSkusChargeses[0].tableSaleOrderSkusChargesValue,
                                    "tableSaleOrderSkuChargesType": {
                                        "idtableSaleOrderSkuChargesTypeId": 1,
                                        "tableSaleOrderSkuChargesTypeString": "Item Price"
                                    }
                                }]
                            });
                        }
                        $scope.singleorderData.deliveryAddress = JSON.stringify(res.tableAddressByTableSaleOrderShipToAddressId.idtableAddressId);
                        $scope.deliveryAddressName = initializeAddressDropdowns($scope.deliveryAddressArray, 'idtableAddressId', res.tableAddressByTableSaleOrderShipToAddressId.idtableAddressId);
                    },
                    function(err) {}

                );
                $('#addOrderModal').modal('show');
            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);

                $location.path('/login');
            }
            growl.error("Order Cannot Be Copied");
        })
    };

    $scope.copyOrder = function(orderId) {
        $scope.singleOrderMode = "copy";
        $scope.updateOrderId = orderId;
        var copyOrderUrl = baseUrl + '/omsservices/webapi/orders/' + orderId;
        $http({
            method: 'GET',
            url: copyOrderUrl
        }).success(function(res) {
            if (res) {
                console.log(res);
                $scope.singleorderData.channelObject = initializeDropdowns($scope.channelNamesData, 'idtableSalesChannelValueInfoId', res.tableSalesChannelValueInfo.idtableSalesChannelValueInfoId);
                $scope.singleorderData.paymentObject = initializeDropdowns($scope.paymentNamesData, 'idtableSaleOrderPaymentTypeId', res.tableSaleOrderPaymentType.idtableSaleOrderPaymentTypeId);
                $scope.custDataObj = {};
                $scope.custDataObj.originalObject = res.tableCustomer;
                $scope.customerObj($scope.custDataObj).then(
                    function(v) {
                        console.log(res.tableSaleOrderSkuses);
                        var abc = res.tableSaleOrderSkuses;
                        for (var i = 0; i < abc.length; i++) {
                            console.log(abc[i]);
                            $scope.products.push({
                                tableSku: abc[i].tableSku,
                                tableSaleOrderSkusSkuQuantity: res.tableSaleOrderSkuses[i].tableSaleOrderSkusSkuQuantity,
                                tableSaleOrderSkusChargeses: [{
                                    "tableSaleOrderSkusChargesValue": res.tableSaleOrderSkuses[i].tableSaleOrderSkusChargeses[0].tableSaleOrderSkusChargesValue,
                                    "tableSaleOrderSkuChargesType": {
                                        "idtableSaleOrderSkuChargesTypeId": 1,
                                        "tableSaleOrderSkuChargesTypeString": "Item Price"
                                    }
                                }]
                            });
                        }
                        $scope.singleorderData.deliveryAddress = JSON.stringify(res.tableAddressByTableSaleOrderShipToAddressId.idtableAddressId);
                        $scope.deliveryAddressName = initializeAddressDropdowns($scope.deliveryAddressArray, 'idtableAddressId', res.tableAddressByTableSaleOrderShipToAddressId.idtableAddressId);
                    },
                    function(err) {}

                );
                $('#addOrderModal').modal('show');
            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);

                $location.path('/login');
            }
            growl.error("Order Cannot Be Copied");
        })
    };

    $scope.concatenateAddresses = function(addr1, addr2, addr3) {
        return addr1 + ", " + addr2 + ", " + addr3;
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
    }

    function initializeAddressDropdowns(lists, prop, code) {
        lists = lists || [];
        for (var i = 0; i < lists.length; i++) {
            var list = lists[i];
            if (list.tableAddress[prop] === code) {
                return list;
            }
        };
        return null;
    }

    $scope.orderNumberChanged = function(orderNo) {
        if (orderNo) {
            $scope.orderNumberEntered = false;
        } else {
            $scope.orderNumberEntered = true;
        }
    };

    //check Order Number
    $scope.checkOrderNumber = function(orderNo) {
        var q = $q.defer();
        console.log(orderNo);
        var checkOrderNo = baseUrl + "/omsservices/webapi/orders/clientordernumber/" + orderNo;
        $http.get(checkOrderNo).success(function(data) {
            console.log(data);
            if (data != "") {
                growl.error("Order ID Already Exists.Please Enter New and Unique Order Id");
                $('#ordernumberId').val('');
                $scope.isOrderNoValid = true;
                $scope.orderNumberEntered = true;
                q.resolve(false);
            }

            if (data == "") {
                $scope.isOrderNoValid = false;
                $scope.orderNumberEntered = false;
                q.resolve(true);
            }
        });
        return q.promise;
    }

    //dialog box to add new delivery address
    $scope.addShippingAddress = function(customerId, customerTypeId) {
        console.log(customerTypeId);
        console.log(customerId);

        var customersByIDUrl = baseUrl + "/omsservices/webapi/customers/" + customerId;
        $http.get(customersByIDUrl).success(function(data) {
            $scope.customerId = data.idtableCustomerId;
            $scope.customerTypeId = customerTypeId;
            $scope.contactPersonName = data.tableCustomerFirstName + " " + data.tableCustomerLastName;
            $scope.contactEmail = data.tableCustomerEmail;
            $scope.contactPhone = data.tableCustomerPhone;

        }).error(function(error, status) {
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

    // dialog box to add new invoice template
    $scope.uploadFileBulkOrder = function(ev) {
        $('#addOrderModal').modal('hide');
        $mdDialog.show({
                templateUrl: 'bulkorder.tmpl.html',
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
    }

    $scope.tableSorting = function(sortType, sortReverse, defaultTab) {
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

        var page = undefined;
        $scope.listOfStatesCount(defaultTab, page);
    }

    $scope.tableSorting = function(sortType, sortReverse,defaultTab) {
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

        var page = undefined;
        $scope.listOfStatesCount(defaultTab,page);
    }

    //    ======================================= quick ship ================================== //

    $scope.Packing = {};
    $scope.Packing.containerQuantity = [];
    $scope.tableSalesOrderSkuQuantityDetails = [];
    $scope.quickShipData = function(data){
        console.log(data);
        $('#QuickShipDialog').modal('show');
        //$scope.Packing.containerQuantity
        $scope.quickShipDataTable = data.tableSaleOrderSkuses;
        $scope.quickShipDataTable.orderID = data.idtableSaleOrderId;
    };

    $scope.btnDisable = true;

    $scope.ShippingDetailsBtn = function(value){
        //console.log(value);
        if(value.SkuType == 'Heavy'){
            if(value.VehicleNumber != '' && value.VehicleType != '' && value.DriverNumber != '' && value.VehicleNumber != '' && value.DriverName != ''){
                $scope.btnDisable = false;
                //console.log($scope.btnDisable);
            }else{
                $scope.btnDisable = true;
            }
        }
       else if(value.SkuType == 'Parcel'){
            if(value.tableSaleOrderShippingDetailsMasterAwb != ''){
                $scope.btnDisable = false;
                //console.log($scope.btnDisable);
            }else{
                $scope.btnDisable = true;
            }
        }
        console.log($scope.btnDisable);
    };



    $scope.SelectVehicleType = function(){
        var vehicletypeUrl = baseUrl+'/omsservices/webapi/vehicletypes';
        $http.get(vehicletypeUrl).success(function(data) {
            $scope.SKUvehicleType = data;
        }).error(function(data){
            console.log(data);
        });
    };
    $scope.SelectVehicleType();

    $scope.sum = function(items, prop){
        console.log(items);
        return items.reduce( function(a, b){
            return parseInt(a) + parseInt(b[prop]);
        }, 0);
    };

    $scope.PackingContainerNumber = function(value,dimensions,shippedDetails,IndexValue){
        console.log('array value:',value);
        console.log('array value:',shippedDetails);
        console.log('array value:',IndexValue);
        console.log('dimensions:',dimensions);
        //document.getElementById('hide').value = '';
        //var LengthUnit = JSON.parse(dimensions.LengthUnit);
        //dimensions.Breadth =

        dimensions.tableSaleOrderSkus = value;
        dimensions.SKUcarrierDetails = shippedDetails;
        dimensions.SalesorderID = value.orderID;
        //if($scope.boxSequenceNo == null)
        //{
        //    $scope.boxSequenceNo = 1;
        //}
        //else
        //{
        //    $scope.boxSequenceNo++;
        //}
        //tableSaleOrderSkuses
        //$scope.Packing = '';
        //value.tableSkusSkuQuantity = '';
        //$scope.tableSalesOrderSkuDetails = [];
        //angular.forEach(value,function(data,index){
        //    console.log(data);
        //    var newSkupackingData = {
        //        'tableSaleOrderSkus': _.omit(data,'tableSkusSkuQuantity'),
        //            'tableSaleOrderPackingDetails':{
        //        'tableSaleOrderPackingDetailsLength':dimensions.Length,
        //            'tableSaleOrderPackingDetailsWidth':dimensions.Breadth,
        //            'tableSaleOrderPackingDetailsHeight':dimensions.Height,
        //            'tableSaleOrderPackingDetailsWeight':dimensions.Weight,
        //            "tableSkuUodmType" : {
        //            "idtableSkuUodmTypeId": 1,
        //                "tableSkuUodmTypeString": "CM",
        //                "tableSkuUodmTypeMultiplier": 1
        //        },
        //        "tableSkuUowmType" : {
        //            "idtableSkuUowmTypeId": 2,
        //                "tableSkuUowmTypeString": "grams",
        //                "tableSkuUowmTypeMultiplier": 1000
        //        }
        //    },
        //        "skuQuantity" : data.tableSkusSkuQuantity,
        //        "boxSequenceNo" : $scope.boxSequenceNo
        //};
        //    //var SkuItemDetails = {
        //    //    'idtableSaleOrderSkusId':data.idtableSaleOrderSkusId,
        //    //    'tableSaleOrderSkusSkuQuantity':data.tableSaleOrderSkusSkuQuantity,
        //    //    'skuId':data.tableSku.idtableSkuId,
        //    //    'tableSkuClientSkuCode':data.tableSku.tableSkuClientSkuCode,
        //    //    'tableSkuName':data.tableSku.tableSkuName
        //    //};
        //    //$scope.tableSalesOrderSkuDetails.push(SkuItemDetails);
            $scope.tableSalesOrderSkuQuantityDetails.push(angular.copy(dimensions));
            angular.forEach(value,function(source){
                console.log(source);
                //source.tableSkusSkuQuantity = '';
            });

        //});
        //
        //
        //console.log($scope.tableSalesOrderSkuQuantityDetails);
        console.log($scope.tableSalesOrderSkuQuantityDetails);
        angular.forEach($scope.tableSalesOrderSkuQuantityDetails,function(source){
            $scope.TotalInputQuantity = $scope.sum(source.tableSaleOrderSkus,'tableSkusSkuQuantity');
            angular.forEach(source.tableSaleOrderSkus,function(res){

            });
        });
        console.log(typeof $scope.TotalInputQuantity);
        console.log($scope.TotalInputQuantity);
    };

    $scope.LengthMeasureUnitDropDown = function(){
        var UnitUrl = baseUrl+'/omsservices/webapi/skuuodmtypes';
        var WeightUnitUrl = baseUrl+'/omsservices/webapi/skuuowmtypes';
        $http.get(UnitUrl).success(function(data) {
            console.log(data);
            $scope.lengthUnitDropdown = data;
        }).error(function(data){
            console.log(data);
            });
        $http.get(WeightUnitUrl).success(function(data) {
            console.log(data);
            $scope.weightUnitDropdown = data;
        }).error(function(data){
            console.log(data);
        });
    };

    $scope.LengthMeasureUnitDropDown();
    var SalesOrderSkuID;
    $scope.AddPacckingDetails = function(data){
        console.log(data);
        $scope.boxSequenceNo = 1;
        var QuickShipTable = [];

        var SKUDto,SKuQuanity,newSkupackingData;
        angular.forEach(data,function(value){
            console.log(value);
            SalesOrderSkuID = value.SalesorderID;
            if(value.SKUcarrierDetails.tableSaleOrderShippingDetailsMasterAwb == null || value.SKUcarrierDetails.tableSaleOrderShippingDetailsMasterAwb == undefined){
                var SKUcarrierValue = null
            }else{
                SKUcarrierValue = value.SKUcarrierDetails.tableSaleOrderShippingDetailsMasterAwb;
            }
            if(value.SKUcarrierDetails.DriverName == null || value.SKUcarrierDetails.DriverName == undefined){
                var SkuDriverName = null;
            }else{
                SkuDriverName = value.SKUcarrierDetails.DriverName
            }
            if(value.SKUcarrierDetails.DriverNumber == null || value.SKUcarrierDetails.DriverNumber == undefined){
                var SkuDriverNumber = null;
            }else{
                SkuDriverNumber = value.SKUcarrierDetails.DriverNumber
            }
            if(value.SKUcarrierDetails.VehicleNumber){
                var SkuVehicleNumber = value.SKUcarrierDetails.VehicleNumber;
            }else{
                SkuVehicleNumber = null;
            }
            angular.forEach(value.tableSaleOrderSkus,function(response){
                console.log(response);
                SKUDto = _.omit(response,'tableSkusSkuQuantity','tableSaleOrderShippingDetailsShippingAwb','SalesorderID');
                SKuQuanity = response.tableSkusSkuQuantity;
                if(SKUcarrierValue == 'undefined' && SKUcarrierValue == null) {
                    var vehicleDriverMap = {
                        "tableClientShippingCarrierDriverDetails": {
                            "tableClientShippingCarrierDriverDetailsName": SkuDriverName,
                            "tableClientShippingCarrierDriverDetailsPhoneNo": SkuDriverNumber
                        },
                        "tableClientShippingCarrierVehicle": {
                            "tableClientShippingCarrierVehicleRegNo": SkuVehicleNumber,
                            "tableClientShippingCarrierVehicleTypeByTableClientShippingCarrierVehicleType": null
                        }
                    };
                }
                newSkupackingData = {
                    'tableSaleOrderSkus':SKUDto,
                    'skuQuantity':SKuQuanity,
                        'tableSaleOrderPackingDetails':{
                            'tableSaleOrderPackingDetailsLength':value.Length,
                            'tableSaleOrderPackingDetailsWidth':value.Breadth,
                            'tableSaleOrderPackingDetailsHeight':value.Height,
                            'tableSaleOrderPackingDetailsWeight':value.Weight,
                            "tableSkuUodmType" : JSON.parse(value.LengthUnit),
                            "tableSkuUowmType" :JSON.parse(value.WeightUnit),
                            "tableSaleOrderShippingDetails":{
                                "tableSaleOrderShippingDetailsMasterAwb":SKUcarrierValue,
                                "tableSaleOrderShippingDetailsShippingAwb":response.tableSaleOrderShippingDetailsShippingAwb,
                                "tableClientShippingCarrierVehicleDriverMap":vehicleDriverMap
                            }
                        },
                        "boxSequenceNo" : $scope.boxSequenceNo
                    };
                QuickShipTable.push(newSkupackingData);
            });
            $scope.boxSequenceNo++;

        });
        console.log(QuickShipTable);

        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/orders/'+SalesOrderSkuID+'/packinginfo',
            data: QuickShipTable,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data){
            console.log(data);
        }).error(function(data){
            console.log(data);
        })
    };


    $scope.blurred = true;
    $scope.skuPackingDisable =function(){
    $scope.blurred = false;
    };

    $scope.RemoveContainerPackage = function(index){
        console.log(index);
        $scope.tableSalesOrderSkuQuantityDetails.splice(index, 1);
        console.log($scope.tableSalesOrderSkuQuantityDetails);
    };


    $scope.shippingDetails  = {};

    //$scope.shippingDetails.SkuType = 'Parcel';

}

function SplitTheString(CommaSepStr) {
    var ResultArray = null;

    if (CommaSepStr != null) {
        var SplitChars = ',';
        if (CommaSepStr.indexOf(SplitChars) >= 0) {
            ResultArray = CommaSepStr.split(SplitChars);

        }
    }
    return ResultArray;
}

//--------------------------------------- circleAdmin ---------------------------------------//
/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function() {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function(val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function(date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d: d,
                dd: pad(d),
                ddd: dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m: m + 1,
                mm: pad(m + 1),
                mmm: dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy: String(y).slice(2),
                yyyy: y,
                h: H % 12 || 12,
                hh: pad(H % 12 || 12),
                H: H,
                HH: pad(H),
                M: M,
                MM: pad(M),
                s: s,
                ss: pad(s),
                l: pad(L, 3),
                L: pad(L > 99 ? Math.round(L / 10) : L),
                t: H < 12 ? "a" : "p",
                tt: H < 12 ? "am" : "pm",
                T: H < 12 ? "A" : "P",
                TT: H < 12 ? "AM" : "PM",
                Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default": "ddd mmm dd yyyy HH:MM:ss",
    shortDate: "m/d/yy",
    mediumDate: "mmm d, yyyy",
    longDate: "mmmm d, yyyy",
    fullDate: "dddd, mmmm d, yyyy",
    shortTime: "h:MM TT",
    mediumTime: "h:MM:ss TT",
    longTime: "h:MM:ss TT Z",
    isoDate: "yyyy-mm-dd",
    isoTime: "HH:MM:ss",
    isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function(mask, utc) {
    return dateFormat(this, mask, utc);
};
