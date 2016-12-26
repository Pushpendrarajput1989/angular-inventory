myApp.controller('skuController', skuController);
myApp.directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function() {
                scope.$apply(function() {
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);
/**
 *File Input - custom call when the file has changed
 */
myApp.directive('onFileChange', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var onChangeHandler = scope.$eval(attrs.onFileChange);

            element.bind('change', function() {
                scope.$apply(function() {
                    var files = element[0].files;
                    if (files) {
                        onChangeHandler(files);
                    }
                });
            });

        }
    };
});
myApp.service('fileUpload', ['$http', function($http) {
    this.uploadFileToUrl = function(file, uploadUrl) {
        var fd = new FormData();
        fd.append('uploadFile', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        }).success(function() {}).error(function() {});
    };
}]);
skuController.$inject = ['$scope', '$http', '$location', '$mdDialog', '$mdMedia', 'fileUpload', 'baseUrl', 'growl', 'downloadSkuTemplateUrl', 'Upload', 'PagerService', '$q', '$routeParams'];

function skuController($scope, $http, $location, $mdDialog, $mdMedia, fileUpload, baseUrl, growl, downloadSkuTemplateUrl, Upload, PagerService, $q, $routeParams) {
    $scope.productDimClicked = false;
    $scope.shelfLifeClicked = false;
    $scope.attributesClicked = false;
    $scope.propertiesClicked = false;
    $scope.kitDetailsClicked = false;
    $scope.virtualkitDetailsClicked = false;
    $scope.inventoryDetailsClicked = false;

    $scope.dialogBoxSkuMode = "add";
    $scope.dialogBoxKitMode = "add";
    $scope.dialogBoxVirtualKitMode = "add";

    $scope.searchSKUClicked = false;
    $scope.searchNormalSKUClicked = false;
    $scope.searchKitSKUClicked = false;
    $scope.searchVKitSKUClicked = false;

    $scope.skuData = "";
    $scope.skuKitList = [];
    $scope.skuvirtualKitList = [];
    $scope.kitData = "";
    $scope.virtualkitData = "";
    $scope.shelfTypeID = "";
    $scope.start = 0;
    $scope.skuSize = 5;
    $scope.normalSkuStart = 0;
    $scope.normalSkuSize = 5;
    $scope.kitSkuStart = 0;
    $scope.kitSkuSize = 5;
    $scope.virtualKitStart = 0;
    $scope.virtualKitSize = 5;
    $scope.baseSkuUrl = baseUrl + '/omsservices/webapi/skus/search?search=';
    $scope.baseCustomerUrl = baseUrl + '/omsservices/webapi/customers/search?search=';
    $scope.items = ["Poisonous", "Stackable", "Fragile", "Is Saleable", "Is individual item barcoded"];
    $scope.selected = [];
    $scope.brandName = "";
    $scope.categoryName = "";

    $scope.modeSku = "normal";
    $scope.modeNormalSku = "normal";
    $scope.modeKitSku = "normal";
    $scope.modeVKitSku = "normal";

    //MAIN SKU No
    $scope.firstMainSkuNo = 1;
    $scope.secMainSkuNo = 2;
    $scope.thirdMainSkuNo = 3;
    $scope.fourthMainSkuNo = 4;
    $scope.fifthMainSkuNo = 5;

    //NORMAL SKU No
    $scope.firstNormalSkuNo = 1;
    $scope.secNormalSkuNo = 2;
    $scope.thirdNormalSkuNo = 3;
    $scope.fourthNormalSkuNo = 4;
    $scope.fifthNormalSkuNo = 5;

    //KIT SKU No
    $scope.firstKitSkuNo = 1;
    $scope.secKitSkuNo = 2;
    $scope.thirdKitSkuNo = 3;
    $scope.fourthKitSkuNo = 4;
    $scope.fifthKitSkuNo = 5;

    //VKIT SKU No
    $scope.firstVKitSkuNo = 1;
    $scope.secVKitSkuNo = 2;
    $scope.thirdVKitSkuNo = 3;
    $scope.fourthVKitSkuNo = 4;
    $scope.fifthVKitSkuNo = 5;

    $scope.downloadSkuTemplateUrl = downloadSkuTemplateUrl;

    $scope.skuImgUrl1 = "images/svg/add_image_active.svg";
    $scope.skuImgUrl2 = "images/svg/add_image_active.svg";
    $scope.skuImgUrl3 = "images/svg/add_image_active.svg";
    $scope.skuImgUrl4 = "images/svg/add_image_active.svg";

    $scope.img1PresentId = 0;
    $scope.img2PresentId = 0;
    $scope.img3PresentId = 0;
    $scope.img4PresentId = 0;
    $scope.fromDelete1 = false;
    $scope.fromDelete2 = false;
    $scope.fromDelete3 = false;
    $scope.fromDelete4 = false;

    $scope.isSubmitDisabledAll = true;
    $scope.isResetDisabledAll = true;
    $scope.isSubmitDisabledSku = true;
    $scope.isResetDisabledSku = true;
    $scope.isSubmitDisabledKit = true;
    $scope.isResetDisabledKit = true;
    $scope.isSubmitDisabledVkit = true;
    $scope.isResetDisabledVkit = true;

    $scope.selectedTab = "All";
    $scope.callDisabledAll = function() {
        $scope.isSubmitDisabledAll = false;
    }

    $scope.callDisabledSku = function() {
        $scope.isSubmitDisabledSku = false;
    }

    $scope.callDisabledKit = function() {
        $scope.isSubmitDisabledKit = false;
    }

    $scope.callDisabledVkit = function() {
        $scope.isSubmitDisabledVkit = false;
    }

    $scope.skuClientCodeChanged = function(skuSellerId) {
        if (skuSellerId) {
            if ($scope.originalSellerSkuId == skuSellerId) {
                $scope.sellerSkuIdChangedFlag = false;
            } else {
                $scope.sellerSkuIdChangedFlag = true;
            }
            $scope.isSellerSkuIdEntered = false;
        } else {
            $scope.isSellerSkuIdEntered = true;
        }
    };

    $scope.skuNameChanged = function(skuName) {
        if (skuName) {
            $scope.isSkuNameEntered = false;
        } else {
            $scope.isSkuNameEntered = true;
        }
    };

    $scope.upcCodeChanged = function(upcCode) {
        if (upcCode) {
            if ($scope.originalupcCode == upcCode) {
                $scope.upcCodeChangedFlag = false;
            } else {
                $scope.upcCodeChangedFlag = true;
            }
            $scope.isUpcCodeEntered = false;
        }
    };

    $scope.skuCategoryChanged = function(catg) {
        if (catg) {
            $scope.isSkuCategorySelected = false;
        } else {
            $scope.isSkuCategorySelected = true;
        }
    };

    $scope.skuBrandChanged = function(brand) {
        if (brand) {
            $scope.isSkuBrandSelected = false;
        } else {
            $scope.isSkuBrandSelected = true;
        }
    };

    $scope.skuDescChanged = function(desc) {
        if (desc) {
            $scope.isSkuDescEntered = false;
        } else {
            $scope.isSkuDescEntered = true;
        }
    };

    $scope.skuLengthChanged = function(len) {
        if (len) {
            $scope.isSkuLengthEntered = false;
        } else {
            $scope.isSkuLengthEntered = true;
        }
    };

    $scope.skuWidthChanged = function(width) {
        if (width) {
            $scope.isSkuWidthEntered = false;
        } else {
            $scope.isSkuWidthEntered = true;
        }
    };

    $scope.skuHeightChanged = function(height) {
        if (height) {
            $scope.isSkuHeightEntered = false;
        } else {
            $scope.isSkuHeightEntered = true;
        }
    };

    $scope.skuWeightChanged = function(weight) {
        if (weight) {
            $scope.isSkuWeightEntered = false;
        } else {
            $scope.isSkuWeightEntered = true;
        }
    };

    $scope.dimUnitChanged = function(dimUnit) {
        if (dimUnit) {
            $scope.isDimUnitSelected = false;
        } else {
            $scope.isDimUnitSelected = true;
        }
    };

    $scope.weightUnitChanged = function(weightUnit) {
        if (weightUnit) {
            $scope.isWeightUnitSelected = false;
        } else {
            $scope.isWeightUnitSelected = true;
        }
    };

    $scope.shelfTypeChanged = function(shelfType) {
        if (shelfType) {
            $scope.isShelfTypeSelected = false;
            $scope.shelfTypeID = shelfType.idtableSkuShelfLifeTypeId;
        } else {
            $scope.isShelfTypeSelected = true;
        }
    };

    $scope.skuMrpChanged = function(mrp) {
        if (mrp) {
            $scope.isSkuMrpEntered = false;
        } else {
            $scope.isSkuMrpEntered = true;
        }
    };

    $scope.skuMspChanged = function(msp) {
        if (msp) {
            $scope.isSkuMspEntered = false;
        } else {
            $scope.isSkuMspEntered = true;
        }
    };

    $scope.batchNoChanged = function(batchNo) {
        if (batchNo) {
            $scope.isBatchNoEntered = false;
        } else {
            $scope.isBatchNoEntered = true;
        }
    };

    $scope.mfgDateSelected = function(mfgDate) {
        if (mfgDate) {
            $scope.isMfgDateSelected = false;
        } else {
            $scope.isMfgDateSelected = true;
        }
    };

    $scope.expDateSelected = function(expDate) {
        if (expDate) {
            $scope.isExpDateSelected = false;
        } else {
            $scope.isExpDateSelected = true;
        }
    };

    $scope.shelfLifeEntered = function(shelfLife) {
        if (shelfLife) {
            $scope.isShelfLifeEntered = false;
        } else {
            $scope.isShelfLifeEntered = true;
        }
    };

    $scope.$on('$routeChangeSuccess', function() {

        var skuLabel = $routeParams.skuLabel;
        if (skuLabel != null) {
            $scope.searchSKUClicked = true;
            $scope.skuString = skuLabel;
            $scope.submitMainSkuAction(skuLabel);
        }

        $scope.isSellerSkuIdEntered = false;
        $scope.isSkuNameEntered = false;
        $scope.isUpcCodeEntered = false;
        $scope.isSkuCategorySelected = false;
        $scope.isSkuBrandSelected = false;
        $scope.isSkuDescEntered = false;
        $scope.isSkuLengthEntered = false;
        $scope.isSkuWidthEntered = false;
        $scope.isSkuHeightEntered = false;
        $scope.isSkuWeightEntered = false;
        $scope.isDimUnitSelected = false;
        $scope.isWeightUnitSelected = false;
        $scope.isShelfTypeSelected = false;
        $scope.isSkuMrpEntered = false;
        $scope.isSkuMspEntered = false;
        $scope.isBatchNoEntered = false;
        $scope.isMfgDateSelected = false;
        $scope.isExpDateSelected = false;
        $scope.isShelfLifeEntered = false;
        $scope.sellerSkuIdChangedFlag = false;
        $scope.upcCodeChangedFlag = false;
        $scope.isNewCatgNameEntered = false;
        $scope.isNewBrandNameEntered = false;
        $scope.isNewAttributeNameEntered = false;

        $scope.originalSellerSkuId = "";
        $scope.originalupcCode = "";

        $scope.listOfSkus($scope.start);
        $scope.listOfSkusCount();
        $scope.listOfNormalSkus($scope.normalSkuStart);
        $scope.listOfNormalSkusCount();
        $scope.listOfKitSkus($scope.kitSkuStart);
        $scope.listOfKitSkusCount();
        $scope.listOfVirtualKitSkus($scope.virtualKitStart);
        $scope.listOfVirtualKitSkusCount();
        $scope.dimensionsArray();
        $scope.weightArray();
        $scope.attributeArray();
        $scope.categoryTypeArray();
        $scope.shelfTypeArray();
        $scope.brandTypeArray();
    });

    $scope.skuImageHover1 = function() {
        if ($scope.skuImgUrl1 == "images/svg/add_image_active.svg") {
            $scope.skuImgUrl1 = "images/svg/add_image_hover.svg";
        } else if ($scope.skuImgUrl1 == "images/svg/add_image_hover.svg") {
            $scope.skuImgUrl1 = "images/svg/add_image_active.svg";
        }
    };

    $scope.skuImageHover2 = function() {
        if ($scope.skuImgUrl2 == "images/svg/add_image_active.svg") {
            $scope.skuImgUrl2 = "images/svg/add_image_hover.svg";
        } else if ($scope.skuImgUrl2 == "images/svg/add_image_hover.svg") {
            $scope.skuImgUrl2 = "images/svg/add_image_active.svg";
        }
    };

    $scope.skuImageHover3 = function() {
        if ($scope.skuImgUrl3 == "images/svg/add_image_active.svg") {
            $scope.skuImgUrl3 = "images/svg/add_image_hover.svg";
        } else if ($scope.skuImgUrl3 == "images/svg/add_image_hover.svg") {
            $scope.skuImgUrl3 = "images/svg/add_image_active.svg";
        }
    };

    $scope.skuImageHover4 = function() {
        if ($scope.skuImgUrl4 == "images/svg/add_image_active.svg") {
            $scope.skuImgUrl4 = "images/svg/add_image_hover.svg";
        } else if ($scope.skuImgUrl4 == "images/svg/add_image_hover.svg") {
            $scope.skuImgUrl4 = "images/svg/add_image_active.svg";
        }
    };

    $scope.changeSkuImgUrl1 = function(input) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $scope.skuImgUrl1 = e.target.result;
            $scope.skuImgFile1 = input;
            $scope.fromDelete1 = false;
        }
        if (input) {
            reader.readAsDataURL(input);
        }
    };

    $scope.changeSkuImgUrl2 = function(input) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $scope.skuImgUrl2 = e.target.result;
            $scope.skuImgFile2 = input;
            $scope.fromDelete2 = false;
        }
        if (input) {
            reader.readAsDataURL(input);
        }
    };

    $scope.changeSkuImgUrl3 = function(input) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $scope.skuImgUrl3 = e.target.result;
            $scope.skuImgFile3 = input;
            $scope.fromDelete3 = false;
        }
        if (input) {
            reader.readAsDataURL(input);
        }
    };

    $scope.changeSkuImgUrl4 = function(input) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $scope.skuImgUrl4 = e.target.result;
            $scope.skuImgFile4 = input;
            $scope.fromDelete4 = false;
        }
        if (input) {
            reader.readAsDataURL(input);
        }
    };

    $scope.uploadBulkOrderFile = function() {
        file = $scope.bulkOrderUploadfile;
        if (file) {
            if (!file.$error) {
                var uploadUrl = baseUrl + '/omsservices/webapi/skus/skubulkupload';

                var fd = new FormData();
                fd.append('uploadFile', file);
                var upload = Upload.http({
                    url: uploadUrl,
                    method: 'POST',
                    data: fd,
                    headers: {
                        'Content-Type': undefined
                    }
                });
                upload.then(function(resp) {
                    if ($scope.modeSku == 'normal') {
                        $scope.listOfSkusCount($scope.vmPager.currentPage);
                    }
                    if ($scope.modeSku == 'mutual') {
                        $scope.listOfMutualSkusCount($scope.vmPager.currentPage);
                    }
                    if ($scope.modeNormalSku == 'normal') {
                        $scope.listOfNormalSkusCount($scope.vmPagerNormal.currentPage);
                    }
                    if ($scope.modeNormalSku == 'mutual') {
                        $scope.listOfNormalMutualSkusCount($scope.vmPagerNormal.currentPage);
                    }
                    $scope.dialogBoxSkuMode = "add";
                    $scope.cancelSkuData();
                    growl.success("SKUs Uploaded successfully");
                }, function(resp) {
                    growl.error("Error in Uploading Bulk SKU");
                }, function(evt) {
                    // progress notify
                });
            }
        }
    };

    $scope.callShelfId = function(shelfiD) {
        var a = JSON.parse(shelfiD);
        $scope.shelfTypeID = a.idtableSkuShelfLifeTypeId;
    };

    $scope.toggle = function(item, list) {
        var idx = list.indexOf(item);
        if (idx > -1) {
            list.splice(idx, 1);
        } else {
            list.push(item);
        }
    };

    $scope.exists = function(item, list) {
        return list.indexOf(item) > -1;
    };

    // fetching list of skus from RestAPI OMS
    $scope.listOfSkus = function(start) {
        var skuListUrl = baseUrl + "/omsservices/webapi/skus?start=" + start + "&size=5";
        $http.get(skuListUrl).success(function(data) {
            $scope.skuLists = data;
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };
    //fetching all skus code ends here

    //fetching list of skus count
    $scope.listOfSkusCount = function(page) {
        var skuMainCountUrl = baseUrl + "/omsservices/webapi/skus/countbytype";
        $http.get(skuMainCountUrl).success(function(data) {
            $scope.skuMainCount = data;
            if (data != null) {
                var vm = this;

                vm.dummyItems = _.range(0, $scope.skuMainCount); // dummy array of items to be paged
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
                    $scope.vmPager = vm.pager;

                    $scope.start = (vm.pager.currentPage - 1) * 5;
                    $scope.skuSize = $scope.start + 5;
                    // get current page of items
                    vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                    $scope.vmItems = vm.items;
                    $scope.listOfSkus($scope.start);
                }
            }
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };
    //fetchng list of skus count ends here

    //fetching list of skus from mutually exlusive search SKU
    $scope.listOfMutualSkus = function(start) {
        var skuListUrl = baseUrl + "/omsservices/webapi/skus/search?search=" + $scope.wordSearch;
        skuListUrl += "&start=" + start + "&size=5";
        $http.get(skuListUrl).success(function(data) {
            $scope.skuLists = data;
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };

    //fetching list of mutual skus count
    $scope.listOfMutualSkusCount = function(page) {
        var skuMainCountUrl = baseUrl + "/omsservices/webapi/skus/searchcount?search=" + $scope.wordSearch;
        $http.get(skuMainCountUrl).success(function(data) {
            $scope.skuMainCount = data;
            if (data != null) {
                var vm = this;

                vm.dummyItems = _.range(0, $scope.skuMainCount); // dummy array of items to be paged
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
                    $scope.vmPager = vm.pager;

                    $scope.start = (vm.pager.currentPage - 1) * 5;
                    $scope.skuSize = $scope.start + 5;
                    // get current page of items
                    vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                    $scope.vmItems = vm.items;
                    $scope.listOfMutualSkus($scope.start);
                }
            }
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };
    //fetchng list of skus count ends here

    $scope.submitMainSkuAction = function(wordSearch) {
        $scope.wordSearch = wordSearch;
        $scope.modeSku = "mutual";
        // $scope.listOfMutualSkus();
        $scope.isSubmitDisabledAll = true;
        $scope.isResetDisabledAll = false;
        var page = undefined;
        $scope.listOfMutualSkusCount(page);
    };

    //clear filter for clearing applied filters
    $scope.clearAllSkuAction = function() {
        $scope.isSubmitDisabledAll = true;
        $scope.isResetDisabledAll = false;
        $scope.listOfSkusCount(1);
    }

    $scope.clearNormalSkuAction = function() {
        $scope.isSubmitDisabledSku = true;
        $scope.isResetDisabledSku = false;
        $scope.listOfNormalSkusCount(1);
    }

    $scope.clearKitSkuAction = function() {
        $scope.isSubmitDisabledKit = true;
        $scope.isResetDisabledKit = false;
        $scope.listOfKitSkusCount(1);
    }

    $scope.clearVkitSkuAction = function() {
        $scope.isSubmitDisabledVkit = true;
        $scope.isResetDisabledVkit = false;
        $scope.listOfVirtualKitSkusCount(1);
    }


    $scope.toggleAllSkuSearchRow = function() {
        $scope.searchSKUClicked = !$scope.searchSKUClicked;
    };


    //Pagination Code for SKU Starts Here
    $scope.startIncrement = function() {
        var nextVal = $scope.firstMainSkuNo + 5

        if (nextVal > $scope.skuMainCountWithoutDecimal) {
            growl.error("SKUS for that Range Does Not Exist");
        }
        if (nextVal <= $scope.skuMainCountWithoutDecimal) {
            $scope.firstMainSkuNo = $scope.firstMainSkuNo + 5;
            $scope.secMainSkuNo = $scope.secMainSkuNo + 5;
            $scope.thirdMainSkuNo = $scope.thirdMainSkuNo + 5;
            $scope.fourthMainSkuNo = $scope.fourthMainSkuNo + 5;
            $scope.fifthMainSkuNo = $scope.fifthMainSkuNo + 5;

            $scope.start = ($scope.firstMainSkuNo - 1) * 5;
            $scope.skuSize = $scope.start + 5;
            if ($scope.modeSku == 'normal') {
                $scope.listOfSkus();
            }
            if ($scope.modeSku == 'mutual') {
                $scope.listOfMutualSkus();
            }
        }
    };

    $scope.startDecrement = function() {
        var prevVal = $scope.firstMainSkuNo - 5;

        if (prevVal > $scope.skuMainCountWithoutDecimal) {
            growl.error("SKUS for that Range Does Not Exist");
        }
        if (prevVal <= $scope.skuMainCountWithoutDecimal) {
            $scope.firstMainSkuNo = $scope.firstMainSkuNo - 5;
            $scope.secMainSkuNo = $scope.secMainSkuNo - 5;
            $scope.thirdMainSkuNo = $scope.thirdMainSkuNo - 5;
            $scope.fourthMainSkuNo = $scope.fourthMainSkuNo - 5;
            $scope.fifthMainSkuNo = $scope.fifthMainSkuNo - 5;
            $scope.start = ($scope.firstMainSkuNo - 1) * 5;
            $scope.skuSize = $scope.start + 5;
            if ($scope.modeSku == 'normal') {
                $scope.listOfSkus();
            }
            if ($scope.modeSku == 'mutual') {
                $scope.listOfMutualSkus();
            }
        }
    };

    $scope.zeroDecrement = function() {
        growl.error("SKUS for that range does not exist");
    };

    $scope.callSKUList = function(number) {
        if (number <= $scope.skuMainCountWithoutDecimal) {
            if (number) {
                $scope.start = (number - 1) * 5;
            }
            $scope.skuSize = $scope.start + 5;
            if ($scope.modeSku == 'normal') {
                $scope.listOfSkus();
            }
            if ($scope.modeSku == 'mutual') {
                $scope.listOfMutualSkus();
            }
        }
        if (number > $scope.skuMainCountWithoutDecimal) {
            growl.error("SKUS For that Range Does Not Exist");
        }
    };
    //Pagination Code for SKU Ends here

    //Fetching Normal SKU List from Normal SKU Rest API OMS
    $scope.listOfNormalSkus = function(start) {
        var normalskuListUrl = baseUrl + "/omsservices/webapi/skus?type=normal&start=" + start + "&size=5";
        $http.get(normalskuListUrl).success(function(data) {
            $scope.normalSkuLists = data;
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };
    //Fetching Normal SKU List from Normal SKU Rest API OMS Ends Here

    //fetching list of skus count
    $scope.listOfNormalSkusCount = function(page) {
        var normalskuMainCountUrl = baseUrl + "/omsservices/webapi/skus/countbytype?type=normal";
        $http.get(normalskuMainCountUrl).success(function(data) {
            $scope.normalskuMainCount = data;
            if (data != null) {
                var vm = this;

                vm.dummyItems = _.range(0, $scope.normalskuMainCount); // dummy array of items to be paged
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
                    $scope.vmPagerNormal = vm.pager;

                    $scope.normalSkuStart = (vm.pager.currentPage - 1) * 5;
                    $scope.normalSkuSize = $scope.normalSkuStart + 5;
                    // get current page of items
                    vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                    $scope.vmItems = vm.items;
                    $scope.listOfNormalSkus($scope.normalSkuStart);
                }
            }
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };
    //fetchng list of skus count ends here

    //fetching list of skus from mutually exlusive search SKU
    $scope.listOfNormalMutualSkus = function(start) {
        var normalskuListUrl = baseUrl + "/omsservices/webapi/skus/search?search=" + $scope.wordSearch + "&skutype=1";
        normalskuListUrl += "&start=" + start + "&size=5";
        $http.get(normalskuListUrl).success(function(data) {
            $scope.normalSkuLists = data;
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };

    //fetching list of mutual skus count
    $scope.listOfNormalMutualSkusCount = function(page) {
        var normalskuMainCountUrl = baseUrl + "/omsservices/webapi/skus/searchcount?search=" + $scope.wordSearch + "&skutype=1";
        $http.get(normalskuMainCountUrl).success(function(data) {
            $scope.normalskuMainCount = data;
            if (data != null) {
                var vm = this;

                vm.dummyItems = _.range(0, $scope.normalskuMainCount); // dummy array of items to be paged
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
                    $scope.vmPagerNormal = vm.pager;

                    $scope.normalSkuStart = (vm.pager.currentPage - 1) * 5;
                    $scope.normalSkuSize = $scope.normalSkuStart + 5;
                    // get current page of items
                    vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                    $scope.vmItems = vm.items;
                    $scope.listOfNormalMutualSkus($scope.normalSkuStart);
                }
            }
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };
    //fetchng list of skus count ends here

    $scope.submitNormalMainSkuAction = function(wordSearch) {
        $scope.wordSearch = wordSearch;
        $scope.modeNormalSku = "mutual";
        // $scope.listOfNormalMutualSkus();
        $scope.isSubmitDisabledSku = true;
        $scope.isResetDisabledSku = false;
        var page = undefined;
        $scope.listOfNormalMutualSkusCount(page);
    };

    $scope.toggleNormalSkuSearchRow = function() {
        $scope.searchNormalSKUClicked = !$scope.searchNormalSKUClicked;
    };

    //Pagination Code for Normal SKU Starts Here
    $scope.normalskustartIncrement = function() {
        var nextVal = $scope.firstNormalSkuNo + 5

        if (nextVal > $scope.normalskuMainCountWithoutDecimal) {
            growl.error("Normal SKUS for that Range Does Not Exist");
        }
        if (nextVal <= $scope.normalskuMainCountWithoutDecimal) {
            $scope.firstNormalSkuNo = $scope.firstNormalSkuNo + 5;
            $scope.secNormalSkuNo = $scope.secNormalSkuNo + 5;
            $scope.thirdNormalSkuNo = $scope.thirdNormalSkuNo + 5;
            $scope.fourthNormalSkuNo = $scope.fourthNormalSkuNo + 5;
            $scope.fifthNormalSkuNo = $scope.fifthNormalSkuNo + 5;

            $scope.normalSkuStart = ($scope.firstNormalSkuNo - 1) * 5;
            $scope.normalSkuSize = $scope.normalSkuStart + 5;
            if ($scope.modeNormalSku == 'normal') {
                $scope.listOfNormalSkus();
            }
            if ($scope.modeNormalSku == 'mutual') {
                $scope.listOfNormalMutualSkus();
            }
        }
    };

    $scope.normalskustartDecrement = function() {
        var prevVal = $scope.firstNormalSkuNo - 5;

        if (prevVal > $scope.normalskuMainCountWithoutDecimal) {
            growl.error("Normal SKUS for that Range Does Not Exist");
        }
        if (prevVal <= $scope.normalskuMainCountWithoutDecimal) {
            $scope.firstNormalSkuNo = $scope.firstNormalSkuNo - 5;
            $scope.secNormalSkuNo = $scope.secNormalSkuNo - 5;
            $scope.thirdNormalSkuNo = $scope.thirdNormalSkuNo - 5;
            $scope.fourthNormalSkuNo = $scope.fourthNormalSkuNo - 5;
            $scope.fifthNormalSkuNo = $scope.fifthNormalSkuNo - 5;
            $scope.normalSkuStart = ($scope.firstMainSkuNo - 1) * 5;
            $scope.normalSkuSize = $scope.normalSkuStart + 5;
            if ($scope.modeNormalSku == 'normal') {
                $scope.listOfNormalSkus();
            }
            if ($scope.modeNormalSku == 'mutual') {
                $scope.listOfNormalMutualSkus();
            }
        }
    };

    $scope.zeroNormalDecrement = function() {
        growl.error("Normal SKUS for that range does not exist");
    };

    $scope.callnormalSKUList = function(number) {
        if (number <= $scope.normalskuMainCountWithoutDecimal) {
            if (number) {
                $scope.normalSkuStart = (number - 1) * 5;
            }
            $scope.normalSkuSize = $scope.normalSkuStart + 5;
            if ($scope.modeNormalSku == 'normal') {
                $scope.listOfNormalSkus();
            }
            if ($scope.modeNormalSku == 'mutual') {
                $scope.listOfNormalMutualSkus();
            }
        }
        if (number > $scope.normalskuMainCountWithoutDecimal) {
            growl.error("Normal SKUS for that Range Does Not Exist");
        }
    };
    //Pagination Code for Normal SKU Ends here

    //Fetching Kit List from Kit SKU Rest API OMS
    $scope.listOfKitSkus = function(start) {
        var kitListUrl = baseUrl + "/omsservices/webapi/skus?type=kit&start=" + start + "&size=5";
        $http.get(kitListUrl).success(function(data) {
            $scope.kitSkuLists = data;
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };
    //Fetching Kit List from Kit SKU Rest API OMS Ends Here

    //fetching list of kit count
    $scope.listOfKitSkusCount = function(page) {
        var kitskuMainCountUrl = baseUrl + "/omsservices/webapi/skus/countbytype?type=kit";
        $http.get(kitskuMainCountUrl).success(function(data) {
            $scope.kitskuMainCount = data;
            if (data != null) {
                var vm = this;

                vm.dummyItems = _.range(0, $scope.kitskuMainCount); // dummy array of items to be paged
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
                    $scope.vmPagerKit = vm.pager;

                    $scope.kitSkuStart = (vm.pager.currentPage - 1) * 5;
                    $scope.kitSkuSize = $scope.kitSkuStart + 5;
                    // get current page of items
                    vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                    $scope.vmItems = vm.items;
                    $scope.listOfKitSkus($scope.kitSkuStart);
                }
            }
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };
    //fetchng list of skus count ends here

    //fetching list of skus from mutually exlusive search SKU
    $scope.listOfKitMutualSkus = function(start) {
        var kitskuListUrl = baseUrl + "/omsservices/webapi/skus/search?search=" + $scope.wordSearch + "&skutype=2";
        kitskuListUrl += "&start=" + start + "&size=5";
        $http.get(kitskuListUrl).success(function(data) {
            $scope.kitSkuLists = data;
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };

    //fetching list of mutual skus count
    $scope.listOfKitMutualSkusCount = function(page) {
        var kitskuMainCountUrl = baseUrl + "/omsservices/webapi/skus/searchcount?search=" + $scope.wordSearch + "&skutype=2";
        $http.get(kitskuMainCountUrl).success(function(data) {
            $scope.kitskuMainCount = data;
            if (data != null) {
                var vm = this;

                vm.dummyItems = _.range(0, $scope.kitskuMainCount); // dummy array of items to be paged
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
                    $scope.vmPagerKit = vm.pager;

                    $scope.kitSkuStart = (vm.pager.currentPage - 1) * 5;
                    $scope.kitSkuSize = $scope.kitSkuStart + 5;
                    // get current page of items
                    vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                    $scope.vmItems = vm.items;
                    $scope.listOfKitMutualSkus($scope.kitSkuStart);
                }
            }
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };
    //fetchng list of skus count ends here

    $scope.submitKitMainSkuAction = function(wordSearch) {
        $scope.wordSearch = wordSearch;
        $scope.modeKitSku = "mutual";
        // $scope.listOfKitMutualSkus();
        $scope.isSubmitDisabledKit = true;
        $scope.isResetDisabledKit = false;
        var page = undefined;
        $scope.listOfKitMutualSkusCount(page);
    };

    $scope.toggleKitSearchRow = function() {
        $scope.searchKitSKUClicked = !$scope.searchKitSKUClicked;
    };

    //Pagination Code for Kit Starts Here
    $scope.kitstartIncrement = function() {
        var nextVal = $scope.firstKitSkuNo + 5

        if (nextVal > $scope.kitskuMainCountWithoutDecimal) {
            growl.error("Kit for that Range Does Not Exist");
        }
        if (nextVal <= $scope.kitskuMainCountWithoutDecimal) {
            $scope.firstKitSkuNo = $scope.firstKitSkuNo + 5;
            $scope.secKitSkuNo = $scope.secKitSkuNo + 5;
            $scope.thirdKitSkuNo = $scope.thirdKitSkuNo + 5;
            $scope.fourthKitSkuNo = $scope.fourthKitSkuNo + 5;
            $scope.fifthKitSkuNo = $scope.fifthKitSkuNo + 5;

            $scope.kitSkuStart = ($scope.firstKitSkuNo - 1) * 5;
            $scope.kitSkuSize = $scope.kitSkuStart + 5;
            if ($scope.modeKitSku == 'normal') {
                $scope.listOfKitSkus();
            }
            if ($scope.modeKitSku == 'mutual') {
                $scope.listOfKitMutualSkus();
            }
        }
    };

    $scope.kitstartDecrement = function() {
        var prevVal = $scope.firstKitSkuNo - 5;

        if (prevVal > $scope.kitskuMainCountWithoutDecimal) {
            growl.error("Kit for that Range Does Not Exist");
        }
        if (prevVal <= $scope.kitskuMainCountWithoutDecimal) {
            $scope.firstKitSkuNo = $scope.firstKitSkuNo - 5;
            $scope.secKitSkuNo = $scope.secKitSkuNo - 5;
            $scope.thirdKitSkuNo = $scope.thirdKitSkuNo - 5;
            $scope.fourthKitSkuNo = $scope.fourthKitSkuNo - 5;
            $scope.fifthKitSkuNo = $scope.fifthKitSkuNo - 5;
            $scope.kitSkuStart = ($scope.firstKitSkuNo - 1) * 5;
            $scope.kitSkuSize = $scope.kitSkuStart + 5;
            if ($scope.modeKitSku == 'normal') {
                $scope.listOfKitSkus();
            }
            if ($scope.modeKitSku == 'mutual') {
                $scope.listOfKitMutualSkus();
            }
        }
    };

    $scope.zeroKitDecrement = function() {
        growl.error("Kit for that range does not exist");
    };

    $scope.callkitSKUList = function(number) {
        if (number <= $scope.kitskuMainCountWithoutDecimal) {
            if (number) {
                $scope.kitSkuStart = (number - 1) * 5;
            }
            $scope.kitSkuSize = $scope.kitSkuStart + 5;
            if ($scope.modeKitSku == 'normal') {
                $scope.listOfKitSkus();
            }
            if ($scope.modeKitSku == 'mutual') {
                $scope.listOfKitMutualSkus();
            }
        }
        if (number > $scope.kitskuMainCountWithoutDecimal) {
            growl.error("Kit for that Range Does Not Exist");
        }
    };
    //Pagination Code for Kit Ends here

    //Fetching Virtual Kit List from Virtual Kit SKU Rest API OMS
    $scope.listOfVirtualKitSkus = function(start) {
        var virtualkitListUrl = baseUrl + "/omsservices/webapi/skus?type=virtualkit&start=" + start + "&size=5";
        $http.get(virtualkitListUrl).success(function(data) {
            $scope.virtualkitSkuLists = data;
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };
    //Fetching Virtual Kit List from Virtual Kit SKU Rest API OMS Ends Here

    //fetching list of virtual kit count
    $scope.listOfVirtualKitSkusCount = function(page) {
        var virtualkitskuMainCountUrl = baseUrl + "/omsservices/webapi/skus/countbytype?type=virtualkit";
        $http.get(virtualkitskuMainCountUrl).success(function(data) {
            $scope.virtualkitskuMainCount = data;
            if (data != null) {
                var vm = this;

                vm.dummyItems = _.range(0, $scope.virtualkitskuMainCount); // dummy array of items to be paged
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
                    $scope.vmPagerVKit = vm.pager;

                    $scope.virtualKitStart = (vm.pager.currentPage - 1) * 5;
                    $scope.virtualKitSize = $scope.kitSkuStart + 5;
                    // get current page of items
                    vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                    $scope.vmItems = vm.items;
                    $scope.listOfVirtualKitSkus($scope.virtualKitStart);
                }
            }
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };
    //fetchng list of skus count ends here

    //fetching list of virtual kit from mutually exlusive search SKU
    $scope.listOfVirtualKitMutualSkus = function(start) {
        var virtualkitskuListUrl = baseUrl + "/omsservices/webapi/skus/search?search=" + $scope.wordSearch + "&skutype=3";
        virtualkitskuListUrl += "&start=" + start + "&size=5";
        $http.get(virtualkitskuListUrl).success(function(data) {
            $scope.virtualkitSkuLists = data;
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };

    //fetching list of mutual skus count
    $scope.listOfVirtualKitMutualSkusCount = function(page) {
        var virtualkitskuMainCountUrl = baseUrl + "/omsservices/webapi/skus/searchcount?search=" + $scope.wordSearch + "&skutype=3";
        $http.get(virtualkitskuMainCountUrl).success(function(data) {
            $scope.virtualkitskuMainCount = data;
            if (data != null) {
                var vm = this;

                vm.dummyItems = _.range(0, $scope.virtualkitskuMainCount); // dummy array of items to be paged
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
                    $scope.vmPagerVKit = vm.pager;

                    $scope.virtualKitStart = (vm.pager.currentPage - 1) * 5;
                    $scope.virtualKitSize = $scope.kitSkuStart + 5;
                    // get current page of items
                    vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                    $scope.vmItems = vm.items;
                    $scope.listOfVirtualKitMutualSkus($scope.virtualKitStart);
                }
            }

        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };
    //fetchng list of skus count ends here

    $scope.submitVirtualKitMainSkuAction = function(wordSearch) {
        $scope.wordSearch = wordSearch;
        $scope.modeVKitSku = "mutual";
        // $scope.listOfVirtualKitMutualSkus();
        $scope.isSubmitDisabledVkit = true;
        $scope.isResetDisabledVkit = false;
        var page = undefined;
        $scope.listOfVirtualKitMutualSkusCount(page);
    };

    $scope.toggleVirtualKitSearchRow = function() {
        $scope.searchVKitSKUClicked = !$scope.searchVKitSKUClicked;
    };

    //Pagination Code for Kit Starts Here
    $scope.VkitstartIncrement = function() {
        var nextVal = $scope.firstVKitSkuNo + 5

        if (nextVal > $scope.virtualkitskuMainCountWithoutDecimal) {
            growl.error("Vitual Kit for that Range Does Not Exist");
        }
        if (nextVal <= $scope.virtualkitskuMainCountWithoutDecimal) {
            $scope.firstVKitSkuNo = $scope.firstVKitSkuNo + 5;
            $scope.secVKitSkuNo = $scope.secVKitSkuNo + 5;
            $scope.thirdVKitSkuNo = $scope.thirdVKitSkuNo + 5;
            $scope.fourthVKitSkuNo = $scope.fourthVKitSkuNo + 5;
            $scope.fifthVKitSkuNo = $scope.fifthVKitSkuNo + 5;

            $scope.virtualKitStart = ($scope.firstVKitSkuNo - 1) * 5;
            $scope.virtualKitSize = $scope.virtualKitStart + 5;
            if ($scope.modeVKitSku == 'normal') {
                $scope.listOfVirtualKitSkus();
            }
            if ($scope.modeVKitSku == 'mutual') {
                $scope.listOfVirtualKitMutualSkus();
            }
        }
    };

    $scope.VkitstartDecrement = function() {
        var prevVal = $scope.firstVKitSkuNo - 5;

        if (prevVal > $scope.virtualkitskuMainCountWithoutDecimal) {
            growl.error("Vitual Kit for that Range Does Not Exist");
        }
        if (prevVal <= $scope.virtualkitskuMainCountWithoutDecimal) {
            $scope.firstVKitSkuNo = $scope.firstVKitSkuNo - 5;
            $scope.secVKitSkuNo = $scope.secVKitSkuNo - 5;
            $scope.thirdVKitSkuNo = $scope.thirdVKitSkuNo - 5;
            $scope.fourthVKitSkuNo = $scope.fourthVKitSkuNo - 5;
            $scope.fifthVKitSkuNo = $scope.fifthVKitSkuNo - 5;
            $scope.virtualKitStart = ($scope.firstVKitSkuNo - 1) * 5;
            $scope.virtualKitSize = $scope.virtualKitStart + 5;
            if ($scope.modeVKitSku == 'normal') {
                $scope.listOfVirtualKitSkus();
            }
            if ($scope.modeVKitSku == 'mutual') {
                $scope.listOfVirtualKitMutualSkus();
            }
        }
    };

    $scope.zeroVKitDecrement = function() {
        growl.error("Vitual Kit for that range does not exist");
    };

    $scope.callVkitSKUList = function(number) {
        if (number <= $scope.virtualkitskuMainCountWithoutDecimal) {
            if (number) {
                $scope.virtualKitStart = (number - 1) * 5;
            }
            $scope.virtualKitSize = $scope.virtualKitStart + 5;
            if ($scope.modeVKitSku == 'normal') {
                $scope.listOfVirtualKitSkus();
            }
            if ($scope.modeVKitSku == 'mutual') {
                $scope.listOfVirtualKitMutualSkus();
            }
        }
        if (number > $scope.kitskuMainCountWithoutDecimal) {
            growl.error("Virtual Kit for that Range Does Not Exist");
        }
    };
    //Pagination Code for Kit Ends here

    // dialog box to add new sku
    $scope.showskuAddBox = function(ev) {
        $scope.productDimClicked = false;
        $scope.shelfLifeClicked = false;
        $scope.attributesClicked = false;
        $scope.propertiesClicked = false;
        $scope.kitDetailsClicked = false;
        $scope.virtualkitDetailsClicked = false;
        $scope.inventoryDetailsClicked = false;
        if ($scope.dialogBoxSkuMode == 'add') {
            $scope.attributeArray();
            $scope.skuClientCode = "";
            $scope.skuImgUrl1 = "images/svg/add_image_active.svg";
            $scope.skuImgUrl2 = "images/svg/add_image_active.svg";
            $scope.skuImgUrl3 = "images/svg/add_image_active.svg";
            $scope.skuImgUrl4 = "images/svg/add_image_active.svg";
        }
        $mdDialog.show({
                templateUrl: 'dialog2.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                scope: $scope.$new(),
                escapeToClose: false
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    //dialog box to choose sku type
    $scope.showskuTypeBox = function(ev) {
        $mdDialog.show({
                templateUrl: 'dialog10.tmpl.html',
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
    //generic cancel to call everywhere.
    $scope.cancelGeneric = function() {
        $mdDialog.hide();
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

    $scope.getNormalSku = function(id) {
        var q = $q.defer();

        $http.get(baseUrl + '/omsservices/webapi/skus/' + id).success(function(response) {
            $scope.skuData = response;
            $scope.skuClientCode = response.idtableSkuId;
            $scope.originalSellerSkuId = response.idtableSkuId;
            $scope.originalupcCode = response.tableSkuPrimaryUpcEan;
            $scope.skuData.tableSkuCategoryType = initializeDropdowns($scope.categoryTypeLists, 'idtableSkuCategoryTypeId', response.tableSkuCategoryType.idtableSkuCategoryTypeId);
            $scope.skuData.tableSkuBrandCode = initializeDropdowns($scope.brandTypeLists, 'idtableSkuBrandCodeId', response.tableSkuBrandCode.idtableSkuBrandCodeId);
            $scope.skuData.tableSkuUodmType = initializeDropdowns($scope.dimLists, 'idtableSkuUodmTypeId', response.tableSkuUodmType.idtableSkuUodmTypeId);
            $scope.skuData.tableSkuUowmType = initializeDropdowns($scope.weightLists, 'idtableSkuUowmTypeId', response.tableSkuUowmType.idtableSkuUowmTypeId);
            $scope.skuData.tableSkuShelfLifeType = initializeDropdowns($scope.shelfTypeLists, 'idtableSkuShelfLifeTypeId', response.tableSkuShelfLifeType.idtableSkuShelfLifeTypeId);

            $scope.attributeListArray = [];
            if (response.tableSkuAttributeses.length != 0) {
                for (var i = 0; i < response.tableSkuAttributeses.length; i++) {
                    $scope.attributeListArray.push({
                        tableSkuAttributeKeys: response.tableSkuAttributeses[i].tableSkuAttributeKeys.tableSkuAttributeKeysString,
                        tableSkuAttributeValue: response.tableSkuAttributeses[i].tableSkuAttributesAttributeValue
                    });
                }
            }

            if (response.tableSkuAttributeses.length == 0) {
                $scope.attributeArray();
            }

            if (response.tableSkuIsIndividualItemBarcoded == true) {
                $scope.selected.push("Is individual item barcoded");
            }

            if (response.tableSkuIsStackable == true) {
                $scope.selected.push("Stackable");
            }

            if (response.tableSkuIsPoisonous == true) {
                $scope.selected.push("Poisonous");
            }

            if (response.tableSkuIsSaleable == true) {
                $scope.selected.push("Is Saleable");
            }

            if (response.tableSkuIsFragile == true) {
                $scope.selected.push("Fragile");
            }
            q.resolve(true);
        }).error(function(error) {
            q.reject(false);
        });
        return q.promise;
    };

    $scope.getSkuImages = function(id) {
        var q = $q.defer();

        $scope.skuImgUrl1 = "images/svg/add_image_active.svg"
        $scope.skuImgUrl2 = "images/svg/add_image_active.svg"
        $scope.skuImgUrl3 = "images/svg/add_image_active.svg"
        $scope.skuImgUrl4 = "images/svg/add_image_active.svg"

        $http.get(baseUrl + "/omsservices/webapi/skus/" + id + "/images").success(function(responseImages) {
            if (responseImages != null) {
                if (responseImages[0] != null) {
                    $scope.skuImgUrl1 = responseImages[0].tableSkuImageUrl;
                    $scope.img1PresentId = responseImages[0].idtableSkuImageImageId;
                }
                if (responseImages[1] != null) {
                    $scope.skuImgUrl2 = responseImages[1].tableSkuImageUrl;
                    $scope.img2PresentId = responseImages[1].idtableSkuImageImageId;
                }
                if (responseImages[2] != null) {
                    $scope.skuImgUrl3 = responseImages[2].tableSkuImageUrl;
                    $scope.img3PresentId = responseImages[2].idtableSkuImageImageId;
                }
                if (responseImages[3] != null) {
                    $scope.skuImgUrl4 = responseImages[3].tableSkuImageUrl;
                    $scope.img4PresentId = responseImages[3].idtableSkuImageImageId;
                }
                q.resolve(true);
            }
        }).error(function(error) {
            q.reject(false);
        });
        return q.promise;
    };

    $scope.getKit = function(id) {
        var q = $q.defer();

        $http.get(baseUrl + '/omsservices/webapi/skus/kit/' + id).success(function(response) {
            $scope.kitData = response.parentSku;
            $scope.skuClientCode = response.parentSku.idtableSkuId;
            $scope.originalSellerSkuId = response.parentSku.idtableSkuId;
            $scope.originalupcCode = response.parentSku.tableSkuPrimaryUpcEan;
            $scope.kitData.tableSkuCategoryType = initializeDropdowns($scope.categoryTypeLists, 'idtableSkuCategoryTypeId', response.parentSku.tableSkuCategoryType.idtableSkuCategoryTypeId);
            $scope.kitData.tableSkuBrandCode = initializeDropdowns($scope.brandTypeLists, 'idtableSkuBrandCodeId', response.parentSku.tableSkuBrandCode.idtableSkuBrandCodeId);
            $scope.kitData.tableSkuUodmType = initializeDropdowns($scope.dimLists, 'idtableSkuUodmTypeId', response.parentSku.tableSkuUodmType.idtableSkuUodmTypeId);
            $scope.kitData.tableSkuUowmType = initializeDropdowns($scope.weightLists, 'idtableSkuUowmTypeId', response.parentSku.tableSkuUowmType.idtableSkuUowmTypeId);
            $scope.kitData.tableSkuShelfLifeType = initializeDropdowns($scope.shelfTypeLists, 'idtableSkuShelfLifeTypeId', response.parentSku.tableSkuShelfLifeType.idtableSkuShelfLifeTypeId);

            $scope.attributeListArray = [];
            if (response.parentSku.tableSkuAttributeses.length != 0) {
                for (var i = 0; i < response.parentSku.tableSkuAttributeses.length; i++) {
                    $scope.attributeListArray.push({
                        tableSkuAttributeKeys: response.parentSku.tableSkuAttributeses[i].tableSkuAttributeKeys.tableSkuAttributeKeysString,
                        tableSkuAttributeValue: response.parentSku.tableSkuAttributeses[i].tableSkuAttributesAttributeValue
                    });
                }
            }

            if (response.parentSku.tableSkuAttributeses.length == 0) {
                $scope.attributeArray();
            }

            if (response.parentSku.tableSkuIsIndividualItemBarcoded == true) {
                $scope.selected.push("Is individual item barcoded");
            }

            if (response.parentSku.tableSkuIsStackable == true) {
                $scope.selected.push("Stackable");
            }

            if (response.parentSku.tableSkuIsPoisonous == true) {
                $scope.selected.push("Poisonous");
            }

            if (response.parentSku.tableSkuIsSaleable == true) {
                $scope.selected.push("Is Saleable");
            }

            if (response.parentSku.tableSkuIsFragile == true) {
                $scope.selected.push("Fragile");
            }
            //
            for (var i = 0; i < response.skuKitList.length; i++) {
                $scope.skuKitList.push({
                    sku: response.skuKitList[i].skuname,
                    quantity: response.skuKitList[i].quantity
                });
            }
            q.resolve(true);
        }).error(function(error) {
            q.reject(false);
        });
        return q.promise;
    };

    $scope.getVirtualKit = function(id) {
        var q = $q.defer();

        $http.get(baseUrl + '/omsservices/webapi/skus/virtualkit/' + id).success(function(response) {
            $scope.virtualkitData = response.parentSku;

            $scope.skuClientCode = response.parentSku.idtableSkuId;
            $scope.originalSellerSkuId = response.parentSku.idtableSkuId;
            $scope.originalupcCode = response.parentSku.tableSkuPrimaryUpcEan;
            $scope.virtualkitData.tableSkuCategoryType = initializeDropdowns($scope.categoryTypeLists, 'idtableSkuCategoryTypeId', response.parentSku.tableSkuCategoryType.idtableSkuCategoryTypeId);
            $scope.virtualkitData.tableSkuBrandCode = initializeDropdowns($scope.brandTypeLists, 'idtableSkuBrandCodeId', response.parentSku.tableSkuBrandCode.idtableSkuBrandCodeId);
            $scope.virtualkitData.tableSkuUodmType = initializeDropdowns($scope.dimLists, 'idtableSkuUodmTypeId', response.parentSku.tableSkuUodmType.idtableSkuUodmTypeId);
            $scope.virtualkitData.tableSkuUowmType = initializeDropdowns($scope.weightLists, 'idtableSkuUowmTypeId', response.parentSku.tableSkuUowmType.idtableSkuUowmTypeId);
            $scope.virtualkitData.tableSkuShelfLifeType = initializeDropdowns($scope.shelfTypeLists, 'idtableSkuShelfLifeTypeId', response.parentSku.tableSkuShelfLifeType.idtableSkuShelfLifeTypeId);

            $scope.attributeListArray = [];
            if (response.parentSku.tableSkuAttributeses.length != 0) {
                for (var i = 0; i < response.parentSku.tableSkuAttributeses.length; i++) {
                    $scope.attributeListArray.push({
                        tableSkuAttributeKeys: response.parentSku.tableSkuAttributeses[i].tableSkuAttributeKeys.tableSkuAttributeKeysString,
                        tableSkuAttributeValue: response.parentSku.tableSkuAttributeses[i].tableSkuAttributesAttributeValue
                    });
                }
            }

            if (response.parentSku.tableSkuAttributeses.length == 0) {
                $scope.attributeArray();
            }

            if (response.parentSku.tableSkuIsIndividualItemBarcoded == true) {
                $scope.selected.push("Is individual item barcoded");
            }

            if (response.parentSku.tableSkuIsStackable == true) {
                $scope.selected.push("Stackable");
            }

            if (response.parentSku.tableSkuIsPoisonous == true) {
                $scope.selected.push("Poisonous");
            }

            if (response.parentSku.tableSkuIsSaleable == true) {
                $scope.selected.push("Is Saleable");
            }

            if (response.parentSku.tableSkuIsFragile == true) {
                $scope.selected.push("Fragile");
            }
            for (var i = 0; i < response.skuKitList.length; i++) {
                $scope.skuvirtualKitList.push({
                    sku: response.skuKitList[i],
                    quantity: response.skuKitList[i].quantity
                });
            }

            if (response.parentSku.tableSkuShelfLifeType == 1) {
                $scope.shelfTypeID = 1;

            }

            if (response.parentSku.tableSkuShelfLifeType == 2) {
                $scope.shelfTypeID = 2;
            }

            $scope.virtualkitData.tableSkuInventory = [];

            $scope.virtualkitData.tableSkuInventory.tableSkuInventoryMaxRetailPrice = response.tableSkuInventory.tableSkuInventoryMaxRetailPrice;
            $scope.virtualkitData.tableSkuInventory.tableSkuInventoryMinSalePrice = response.tableSkuInventory.tableSkuInventoryMinSalePrice;
            $scope.virtualkitData.tableSkuInventory.tableSkuInventoryBatchNo = response.tableSkuInventory.tableSkuInventoryBatchNo;
            $scope.virtualkitData.tableSkuInventory.tableSkuInventoryShelfLifeInDays = response.tableSkuInventory.tableSkuInventoryShelfLifeInDays;
            $scope.virtualkitData.tableSkuInventory.tableSkuInventoryMfgDate = response.tableSkuInventory.tableSkuInventoryMfgDate;
            $scope.virtualkitData.tableSkuInventory.tableSkuInventoryExpiryDate = response.tableSkuInventory.tableSkuInventoryExpiryDate;

            q.resolve(true);

        }).error(function(error) {
            q.reject(false);
        });
        return q.promise;
    };

    // dialog box to edit sku by id
    $scope.editSku = function(ev, id, type) {
        if (type == "Normal") {
            $scope.dialogBoxSkuMode = "edit";
            $scope.attributeListArray = [];
            $scope.getNormalSku(id).then(
                function(v) {
                    $scope.getSkuImages(id).then(
                        function(v) {
                            if ($scope.skuData != null) {
                                $scope.showskuAddBox(ev);
                            }
                        },
                        function(err) {}
                    );
                },
                function(err) {}
            );
        }

        if (type == 'Kit') {
            $scope.dialogBoxKitMode = "edit";
            $scope.attributeListArray = [];
            $scope.getKit(id).then(
                function(v) {
                    $scope.getSkuImages(id).then(
                        function(v) {
                            if ($scope.kitData != null) {
                                $scope.showkitAddBox(ev);
                            }
                        },
                        function(err) {}
                    );
                },
                function(err) {}
            );
        }

        if (type == 'VirtualKit') {
            $scope.dialogBoxVirtualKitMode = "edit";
            $scope.attributeListArray = [];
            $scope.getVirtualKit(id).then(
                function(v) {
                    $scope.getSkuImages(id).then(
                        function(v) {
                            if ($scope.virtualkitData != null) {
                                $scope.showvirtualKitAddBox(ev);
                            }
                        },
                        function(err) {}
                    );
                },
                function(err) {}
            );
        }
    };

    // dialog box to add new kit
    $scope.showkitAddBox = function(ev) {
        $scope.productDimClicked = false;
        $scope.shelfLifeClicked = false;
        $scope.attributesClicked = false;
        $scope.propertiesClicked = false;
        $scope.kitDetailsClicked = false;
        $scope.virtualkitDetailsClicked = false;
        $scope.inventoryDetailsClicked = false;
        if ($scope.dialogBoxKitMode == 'add') {
            $scope.attributeArray();
            $scope.skuClientCode = "";
            $scope.selected = [];
            $scope.skuImgUrl1 = "images/svg/add_image_active.svg";
            $scope.skuImgUrl2 = "images/svg/add_image_active.svg";
            $scope.skuImgUrl3 = "images/svg/add_image_active.svg";
            $scope.skuImgUrl4 = "images/svg/add_image_active.svg";
        }
        $mdDialog.show({
                templateUrl: 'addKit.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                scope: $scope.$new(),
                escapeToClose: false
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    // dialog box to add new virtual kit
    $scope.showvirtualKitAddBox = function(ev) {
        var todayDate = new Date();
        $scope.mfgDateMax = new Date(
            todayDate.getFullYear(),
            todayDate.getMonth(),
            todayDate.getDate()
        );
        $scope.productDimClicked = false;
        $scope.shelfLifeClicked = false;
        $scope.attributesClicked = false;
        $scope.propertiesClicked = false;
        $scope.kitDetailsClicked = false;
        $scope.virtualkitDetailsClicked = false;
        $scope.inventoryDetailsClicked = false;
        if ($scope.dialogBoxVirtualKitMode == 'add') {
            $scope.attributeArray();
            $scope.skuClientCode = "";
            $scope.selected = [];
            $scope.skuImgUrl1 = "images/svg/add_image_active.svg";
            $scope.skuImgUrl2 = "images/svg/add_image_active.svg";
            $scope.skuImgUrl3 = "images/svg/add_image_active.svg";
            $scope.skuImgUrl4 = "images/svg/add_image_active.svg";
        }
        $mdDialog.show({
                templateUrl: 'addVirtualKit.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: false,
                scope: $scope.$new(),
                escapeToClose: false
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    //getting the dimensions from backend
    $scope.dimensionsArray = function() {
        var dimUrl = baseUrl + "/omsservices/webapi/skuuodmtypes"
        $http.get(dimUrl).success(function(data) {
            $scope.dimLists = data;
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };
    //ends here getting the dimensions from backend

    //getting the weight units from backend
    $scope.weightArray = function() {
        var wieghtUrl = baseUrl + "/omsservices/webapi/skuuowmtypes"
        $http.get(wieghtUrl).success(function(data) {
            $scope.weightLists = data;
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };
    //ends here - getting the weight unit from backend

    //getting the attributes from backend
    $scope.attributeArray = function() {
        $scope.attributeListArray = [];
        var attrUrl = baseUrl + "/omsservices/webapi/skuattributekeys"
        $http.get(attrUrl).success(function(data) {
            $scope.attrLists = data;
            for (var i = 0; i < $scope.attrLists.length; i++) {
                $scope.attributeListArray.push({
                    tableSkuAttributeKeys: $scope.attrLists[i].tableSkuAttributeKeysString,
                    tableSkuAttributeValue: null
                })
            }
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });

    };
    //ends here - getting the attributes from backend

    //getting the shelf types from backend
    $scope.shelfTypeArray = function() {
        var shelfTypeUrl = baseUrl + "/omsservices/webapi/skushelflifetypes"
        $http.get(shelfTypeUrl).success(function(data) {
            $scope.shelfTypeLists = data;
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };
    //ends here - getting the shelf types from backend

    //getting category types from backend
    $scope.categoryTypeArray = function() {
        var categoryTypeUrl = baseUrl + "/omsservices/webapi/skucategorytypes";
        $http.get(categoryTypeUrl).success(function(data) {
            $scope.categoryTypeLists = data;
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };
    //ends here - getting the category types from backend

    //getting brand types from backend
    $scope.brandTypeArray = function() {
        var brandTypeUrl = baseUrl + "/omsservices/webapi/skubrandcodes";
        $http.get(brandTypeUrl).success(function(data) {
            $scope.brandTypeLists = data;
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };
    //ends here - getting the category types from backend

    //opening and closing search accordian for different properties and accordian
    $scope.productDiminvRow = function() {
        $scope.productDimClicked = !$scope.productDimClicked;
        $scope.shelfLifeClicked = false;
        $scope.attributesClicked = false;
        $scope.propertiesClicked = false;
        $scope.kitDetailsClicked = false;
        $scope.virtualkitDetailsClicked = false;
        $scope.inventoryDetailsClicked = false;
    };

    $scope.attributesinvRow = function() {
        $scope.attributesClicked = !$scope.attributesClicked;
        $scope.productDimClicked = false;
        $scope.shelfLifeClicked = false;
        $scope.propertiesClicked = false;
        $scope.kitDetailsClicked = false;
        $scope.virtualkitDetailsClicked = false;
        $scope.inventoryDetailsClicked = false;
    };

    $scope.shelfLifeinvRow = function() {
        $scope.shelfLifeClicked = !$scope.shelfLifeClicked;
        $scope.productDimClicked = false;
        $scope.attributesClicked = false;
        $scope.propertiesClicked = false;
        $scope.kitDetailsClicked = false;
        $scope.virtualkitDetailsClicked = false;
        $scope.inventoryDetailsClicked = false;
    };

    $scope.propinvRow = function() {
        $scope.propertiesClicked = !$scope.propertiesClicked;
        $scope.productDimClicked = false;
        $scope.shelfLifeClicked = false;
        $scope.attributesClicked = false;
        $scope.kitDetailsClicked = false;
        $scope.virtualkitDetailsClicked = false;
        $scope.inventoryDetailsClicked = false;
    };


    $scope.kitDetinvRow = function() {
        $scope.kitDetailsClicked = !$scope.kitDetailsClicked;
        $scope.productDimClicked = false;
        $scope.shelfLifeClicked = false;
        $scope.attributesClicked = false;
        $scope.propertiesClicked = false;
        $scope.virtualkitDetailsClicked = false;
        $scope.inventoryDetailsClicked = false;
    };

    $scope.virtualkitDetinvRow = function() {
        $scope.virtualkitDetailsClicked = !$scope.virtualkitDetailsClicked;
        $scope.productDimClicked = false;
        $scope.shelfLifeClicked = false;
        $scope.attributesClicked = false;
        $scope.propertiesClicked = false;
        $scope.kitDetailsClicked = false;
        $scope.inventoryDetailsClicked = false;
    };

    $scope.inventoryDetinvRow = function() {
        $scope.inventoryDetailsClicked = !$scope.inventoryDetailsClicked;
        $scope.productDimClicked = false;
        $scope.shelfLifeClicked = false;
        $scope.attributesClicked = false;
        $scope.propertiesClicked = false;
        $scope.kitDetailsClicked = false;
        $scope.virtualkitDetailsClicked = false;
    };

    //opening and closing search accordian for different properties and accordian ends here

    //dynamic upload file code
    $scope.uploadFile = function() {
        var file = $scope.myFile;
    };

    $scope.onFilesSelected = function(files) {
        $scope.myFile = files[0];
    };

    $scope.onFilesSelected1 = function(files) {
        $scope.myFile1 = files[0];
    };

    $scope.onFilesSelected2 = function(files) {
        $scope.myFile2 = files[0];
    };

    $scope.onFilesSelected3 = function(files) {
        $scope.myFile3 = files[0];
    };
    //ends here dynamic file code ends here

    //code for adding kit details in table
    $scope.addKitDetails = function(tableSku, tableSaleOrderSkusSkuQuantity, id) {
        $scope.skuKitList.push({
            sku: tableSku.originalObject,
            quantity: tableSaleOrderSkusSkuQuantity
        });

        var id = 'kits'
        if (id) {
            $scope.$broadcast('angucomplete:clearInput', id);
            tableSku = null;
            tableSaleOrderSkusSkuQuantity = null;
            $scope.kitData.productObj = null;
            $scope.kitData.quantityNo = null;
        } else {
            $scope.$broadcast('angucomplete:clearInput');
        }
    }; //ends here

    //code for adding virtual kit details in table
    $scope.addVirtualKitDetails = function(tableSku, tableSaleOrderSkusSkuQuantity, id) {
        $scope.skuvirtualKitList.push({
            sku: tableSku.originalObject,
            quantity: tableSaleOrderSkusSkuQuantity
        });

        var id = 'virtualkits';
        if (id) {
            $scope.$broadcast('angucomplete:clearInput', id);
            tableSku = null;
            tableSaleOrderSkusSkuQuantity = null;
            $scope.virtualkitData.productObj = null;
            $scope.virtualkitData.quantityNo = null;
        } else {
            $scope.$broadcast('angucomplete:clearInput');
        }
    }; //ends here

    //code for saving the sku data in skuspi to backend
    $scope.saveSkuDataInDb = function(skuData) {
        $scope.tableSkuAttributeses = [];
        for (var i = 0; i < $scope.attributeListArray.length; i++) {
            $scope.tableSkuAttributeses.push({
                "tableSkuAttributesAttributeValue": $scope.attributeListArray[i].tableSkuAttributeValue,
                "tableSkuAttributeKeys": {
                    "tableSkuAttributeKeysString": $scope.attributeListArray[i].tableSkuAttributeKeys
                }
            })
        }

        $scope.tableSkuIsPoisonous = false;
        $scope.tableSkuIsIndividualItemBarcoded = false;
        $scope.tableSkuIsStackable = false;
        $scope.tableSkuIsSaleable = false;
        $scope.tableSkuIsFragile = false;
        for (var i = 0; i < $scope.selected.length; i++) {
            if ($scope.selected[i] == 'Poisonous') {
                $scope.tableSkuIsPoisonous = true;
            }

            if ($scope.selected[i] == 'Stackable') {
                $scope.tableSkuIsStackable = true;
            }

            if ($scope.selected[i] == 'Fragile') {
                $scope.tableSkuIsFragile = true;
            }

            if ($scope.selected[i] == 'Is Saleable') {
                $scope.tableSkuIsSaleable = true;
            }

            if ($scope.selected[i] == 'Is individual item barcoded') {
                $scope.tableSkuIsIndividualItemBarcoded = true;
            }
        }

        var postSkuData = {
            "idtableSkuId": 7,
            "tableSkuClientSkuCode": skuData.tableSkuClientSkuCode,
            "tableSkuName": skuData.tableSkuName,
            "tableSkuDescription": skuData.tableSkuDescription,
            "tableSkuPrimaryUpcEan": skuData.tableSkuPrimaryUpcEan,
            "tableSkuHeight": parseInt(skuData.tableSkuHeight),
            "tableSkuWidth": parseInt(skuData.tableSkuWidth),
            "tableSkuLength": parseInt(skuData.tableSkuLength),
            "tableSkuWeight": parseInt(skuData.tableSkuWeight),
            "tableSkuIsIndividualItemBarcoded": $scope.tableSkuIsIndividualItemBarcoded,
            "tableSkuIsStackable": $scope.tableSkuIsStackable,
            "tableSkuIsPoisonous": $scope.tableSkuIsPoisonous,
            "tableSkuIsSaleable": $scope.tableSkuIsSaleable,
            "tableSkuIsFragile": $scope.tableSkuIsFragile,
            "tableSkuAttributeses": $scope.tableSkuAttributeses,
            "tableSkuBrandCode": skuData.tableSkuBrandCode,
            "tableSkuCategoryType": skuData.tableSkuCategoryType,
            "tableSkuShelfLifeType": skuData.tableSkuShelfLifeType,
            "tableSkuUodmType": skuData.tableSkuUodmType,
            "tableSkuUowmType": skuData.tableSkuUowmType,
            "tableSkuStatusType": {
                "idtableSkuStatusTypeId": 1,
                "tableSkuStatusTypeString": "Active"
            },
            "tableSkuType": {
                "idtableSkuTypeId": 1,
                "tableSkuTypeString": "Normal"
            }
        }



        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/skus',
            data: postSkuData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {

            if (res) {
                skuData = null;
                var uploadUrl = baseUrl + '/omsservices/webapi/skus/' + res.idtableSkuId + '/images/';
                $scope.uploadSkuImages(uploadUrl).then(
                    function(v) {
                        if ($scope.modeSku == 'normal') {
                            // $scope.listOfSkus();
                            $scope.listOfSkusCount($scope.vmPager.currentPage);
                        }
                        if ($scope.modeSku == 'mutual') {
                            // $scope.listOfMutualSkus();
                            $scope.listOfMutualSkusCount($scope.vmPager.currentPage);
                        }
                        if ($scope.modeNormalSku == 'normal') {
                            // $scope.listOfNormalSkus();
                            $scope.listOfNormalSkusCount($scope.vmPagerNormal.currentPage);
                        }
                        if ($scope.modeNormalSku == 'mutual') {
                            // $scope.listOfNormalMutualSkus();
                            $scope.listOfNormalMutualSkusCount($scope.vmPagerNormal.currentPage);
                        }
                        $scope.dialogBoxSkuMode = "add";
                        $scope.cancelSkuData();
                        growl.success("Normal SKU Added Successfully");
                    },
                    function(err) {}
                );
            }
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
            growl.error("Normal SKU Cannot Be Added");
            $scope.dialogBoxSkuMode = "add";
        });
    };
    //ends here-code for saving the sku data in skuspi to backend

    $scope.cancelSkuData = function() {
        $scope.skuData = null;
        $scope.kitData = null;
        $scope.virtualkitData = null;
        $scope.dialogBoxSkuMode = "add";
        $scope.dialogBoxKitMode = "add";
        $scope.dialogBoxVirtualKitMode = "add";
        $scope.selected = [];
        $scope.skuvirtualKitList = [];

        $scope.img1PresentId = 0;
        $scope.img2PresentId = 0;
        $scope.img3PresentId = 0;
        $scope.img4PresentId = 0;

        $scope.skuImgFile1 = undefined;
        $scope.skuImgFile2 = undefined;
        $scope.skuImgFile3 = undefined;
        $scope.skuImgFile4 = undefined;

        $scope.isSellerSkuIdEntered = false;
        $scope.isSkuNameEntered = false;
        $scope.isUpcCodeEntered = false;
        $scope.isSkuCategorySelected = false;
        $scope.isSkuBrandSelected = false;
        $scope.isSkuDescEntered = false;
        $scope.isSkuLengthEntered = false;
        $scope.isSkuWidthEntered = false;
        $scope.isSkuHeightEntered = false;
        $scope.isSkuWeightEntered = false;
        $scope.isDimUnitSelected = false;
        $scope.isWeightUnitSelected = false;
        $scope.isShelfTypeSelected = false;
        $scope.isSkuMrpEntered = false;
        $scope.isSkuMspEntered = false;
        $scope.isBatchNoEntered = false;
        $scope.isMfgDateSelected = false;
        $scope.isExpDateSelected = false;
        $scope.isShelfLifeEntered = false;
        $scope.sellerSkuIdChangedFlag = false;
        $scope.upcCodeChangedFlag = false;

        $scope.originalSellerSkuId = "";
        $scope.originalupcCode = "";

        $mdDialog.hide();
    };

    $scope.saveKitData = function(kitData) {
        if (kitData) {
            if (kitData.tableSkuClientSkuCode) {
                $scope.checkClientCode(kitData.tableSkuClientSkuCode, "kit").then(
                    function(v) {
                        if (v) {
                            if (!kitData.tableSkuName) {
                                growl.error("Please enter the Name");
                                $scope.isSkuNameEntered = true;
                            } else {
                                $scope.checkUpcCode(kitData.tableSkuPrimaryUpcEan, "kit").then(
                                    function(v) {
                                        if (v) {
                                            if (!kitData.tableSkuCategoryType) {
                                                growl.error("Please select a Category");
                                                $scope.isSkuCategorySelected = true;
                                            } else {
                                                if (!kitData.tableSkuBrandCode) {
                                                    growl.error("Please select a Brand");
                                                    $scope.isSkuBrandSelected = true;
                                                } else {
                                                    if (!kitData.tableSkuDescription) {
                                                        growl.error("Please enter the Description");
                                                        $scope.isSkuDescEntered = true;
                                                    } else {
                                                        if (!kitData.tableSkuLength) {
                                                            $scope.productDimClicked = true;
                                                            $scope.shelfLifeClicked = false;
                                                            $scope.attributesClicked = false;
                                                            $scope.propertiesClicked = false;
                                                            document.skuForm.tableSkuLength.focus();
                                                            growl.error("Please enter the SKU Length");
                                                            $scope.isSkuLengthEntered = true;
                                                        } else {
                                                            if (!kitData.tableSkuWidth) {
                                                                $scope.productDimClicked = true;
                                                                $scope.shelfLifeClicked = false;
                                                                $scope.attributesClicked = false;
                                                                $scope.propertiesClicked = false;
                                                                document.skuForm.tableSkuWidth.focus();
                                                                growl.error("Please enter the SKU Width");
                                                                $scope.isSkuWidthEntered = true;
                                                            } else {
                                                                if (!kitData.tableSkuHeight) {
                                                                    $scope.productDimClicked = true;
                                                                    $scope.shelfLifeClicked = false;
                                                                    $scope.attributesClicked = false;
                                                                    $scope.propertiesClicked = false;
                                                                    document.skuForm.tableSkuHeight.focus();
                                                                    growl.error("Please enter the SKU Height");
                                                                    $scope.isSkuHeightEntered = true;
                                                                } else {
                                                                    if (!kitData.tableSkuWeight) {
                                                                        $scope.productDimClicked = true;
                                                                        $scope.shelfLifeClicked = false;
                                                                        $scope.attributesClicked = false;
                                                                        $scope.propertiesClicked = false;
                                                                        $scope.kitDetailsClicked = false;
                                                                        growl.error("Please enter the SKU Weight");
                                                                        $scope.isSkuWeightEntered = true;
                                                                    } else {
                                                                        if (!kitData.tableSkuUodmType) {
                                                                            $scope.productDimClicked = true;
                                                                            $scope.shelfLifeClicked = false;
                                                                            $scope.attributesClicked = false;
                                                                            $scope.propertiesClicked = false;
                                                                            document.skuForm.tableSkuUodmType.focus();
                                                                            growl.error("Please select the Dimention Unit");
                                                                            $scope.isDimUnitSelected = true;
                                                                        } else {
                                                                            if (!kitData.tableSkuUowmType) {
                                                                                $scope.productDimClicked = true;
                                                                                $scope.shelfLifeClicked = false;
                                                                                $scope.attributesClicked = false;
                                                                                $scope.propertiesClicked = false;
                                                                                document.skuForm.tableSkuUowmType.focus();
                                                                                growl.error("Please select the Weight Unit");
                                                                                $scope.isWeightUnitSelected = true;
                                                                            } else {
                                                                                if (!kitData.tableSkuShelfLifeType) {
                                                                                    $scope.productDimClicked = false;
                                                                                    $scope.shelfLifeClicked = true;
                                                                                    $scope.attributesClicked = false;
                                                                                    $scope.propertiesClicked = false;
                                                                                    growl.error("Please select the Shelf Type");
                                                                                    $scope.isShelfTypeSelected = true;
                                                                                    if (document.skuForm.tableSkuShelfLifeType) {
                                                                                        document.skuForm.tableSkuShelfLifeType.focus();
                                                                                    }
                                                                                } else {
                                                                                    if ($scope.dialogBoxKitMode == "add") {
                                                                                        $scope.saveKitDataInDb(kitData);
                                                                                    } else if ($scope.dialogBoxKitMode == "edit") {
                                                                                        $scope.updateKitData(kitData, $scope.skuClientCode);
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
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
            } else {
                growl.error("Please enter the Seller SKU ID");
                $scope.isSellerSkuIdEntered = true;
            }
        } else {
            growl.error("Please enter the Seller SKU ID");
            $scope.isSellerSkuIdEntered = true;
        }
    };

    //code for saving the kit data in kitapi to backend
    $scope.saveKitDataInDb = function(kitData) {
        $scope.kitDetList = [];
        $scope.tableSkuAttributeses = [];
        for (var i = 0; i < $scope.attributeListArray.length; i++) {
            $scope.tableSkuAttributeses.push({
                "tableSkuAttributesAttributeValue": $scope.attributeListArray[i].tableSkuAttributeValue,
                "tableSkuAttributeKeys": {
                    "tableSkuAttributeKeysString": $scope.attributeListArray[i].tableSkuAttributeKeys
                }
            })
        }

        for (var i = 0; i < $scope.skuKitList.length; i++) {
            $scope.kitDetList.push({
                skuid: $scope.skuKitList[i].sku.idtableSkuId,
                quantity: parseInt($scope.skuKitList[i].quantity)
            });
        }
        $scope.tableSkuIsPoisonous = false;
        $scope.tableSkuIsIndividualItemBarcoded = false;
        $scope.tableSkuIsStackable = false;
        $scope.tableSkuIsSaleable = false;
        $scope.tableSkuIsFragile = false;
        for (var i = 0; i < $scope.selected.length; i++) {
            if ($scope.selected[i] == 'Poisonous') {
                $scope.tableSkuIsPoisonous = true;
            }

            if ($scope.selected[i] == 'Stackable') {
                $scope.tableSkuIsStackable = true;
            }

            if ($scope.selected[i] == 'Fragile') {
                $scope.tableSkuIsFragile = true;
            }

            if ($scope.selected[i] == 'Is Saleable') {
                $scope.tableSkuIsSaleable = true;
            }

            if ($scope.selected[i] == 'Is individual item barcoded') {
                $scope.tableSkuIsIndividualItemBarcoded = true;
            }
        }

        var postKitData = {};
        postKitData.parentSku = {
            "idtableSkuId": 7,
            "tableSkuClientSkuCode": kitData.tableSkuClientSkuCode,
            "tableSkuName": kitData.tableSkuName,
            "tableSkuDescription": kitData.tableSkuDescription,
            "tableSkuPrimaryUpcEan": kitData.tableSkuPrimaryUpcEan,
            "tableSkuHeight": parseInt(kitData.tableSkuHeight),
            "tableSkuWidth": parseInt(kitData.tableSkuWidth),
            "tableSkuLength": parseInt(kitData.tableSkuLength),
            "tableSkuWeight": parseInt(kitData.tableSkuWeight),
            "tableSkuIsIndividualItemBarcoded": $scope.tableSkuIsIndividualItemBarcoded,
            "tableSkuIsStackable": $scope.tableSkuIsStackable,
            "tableSkuIsPoisonous": $scope.tableSkuIsPoisonous,
            "tableSkuIsSaleable": $scope.tableSkuIsSaleable,
            "tableSkuIsFragile": $scope.tableSkuIsFragile,
            "tableSkuAttributeses": $scope.tableSkuAttributeses,
            "tableSkuBrandCode": kitData.tableSkuBrandCode,
            "tableSkuCategoryType": kitData.tableSkuCategoryType,
            "tableSkuShelfLifeType": kitData.tableSkuShelfLifeType,
            "tableSkuUodmType": kitData.tableSkuUodmType,
            "tableSkuUowmType": kitData.tableSkuUowmType,
            "tableSkuStatusType": {
                "idtableSkuStatusTypeId": 1,
                "tableSkuStatusTypeString": "Active"
            },
            "tableSkuType": {
                "idtableSkuTypeId": 2,
                "tableSkuTypeString": "Kit"
            }
        }

        postKitData.skuKitList = $scope.kitDetList;



        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/skus/kit',
            data: postKitData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {

            if (res) {
                kitData = null;
                var uploadUrl = baseUrl + '/omsservices/webapi/skus/' + res.parentSku.idtableSkuId + '/images/';
                $scope.uploadSkuImages(uploadUrl).then(
                    function(v) {
                        if ($scope.modeSku == 'normal') {
                            $scope.listOfSkusCount($scope.vmPager.currentPage);
                        }
                        if ($scope.modeSku == 'mutual') {
                            $scope.listOfMutualSkusCount($scope.vmPager.currentPage);
                        }
                        if ($scope.modeKitSku == 'normal') {
                            $scope.listOfKitSkusCount($scope.vmPager.currentPage);
                        }
                        if ($scope.modeKitSku == 'mutual') {
                            $scope.listOfKitMutualSkusCount($scope.vmPager.currentPage);
                        }
                        $scope.dialogBoxKitMode = "add";
                        $scope.cancelSkuData();
                        growl.success("Kit Added Successfully");
                    },
                    function(err) {}
                );
            }
        }).error(function(error, status) {
            if (status == 401) {
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
            growl.error("Kit cannot be Added");
            $scope.dialogBoxKitMode = "add";
        });
    };
    //ends here-code for saving the kit data in kitapi to backend

    $scope.addVirtualKitToDb = function(virtualkitData) {
        // save virtual kit
        var mfgDate = "";
        var expDate = "";
        $scope.tableSkuAttributeses = [];
        for (var i = 0; i < $scope.attributeListArray.length; i++) {
            $scope.tableSkuAttributeses.push({
                "tableSkuAttributesAttributeValue": $scope.attributeListArray[i].tableSkuAttributeValue ? $scope.attributeListArray[i].tableSkuAttributeValue : "",
                "tableSkuAttributeKeys": {
                    "tableSkuAttributeKeysString": $scope.attributeListArray[i].tableSkuAttributeKeys
                }
            })
        }

        if (virtualkitData.tableSkuInventory.tableSkuInventoryMfgDate != null) {
            mfgDate = dateFormat(new Date(virtualkitData.tableSkuInventory.tableSkuInventoryMfgDate), 'yyyy-mm-dd');
        }
        if (virtualkitData.tableSkuInventory.tableSkuInventoryExpiryDate != null) {
            expDate = dateFormat(new Date(virtualkitData.tableSkuInventory.tableSkuInventoryExpiryDate), 'yyyy-mm-dd');
        }
        $scope.virtualkitDetList = [];
        for (var i = 0; i < $scope.skuvirtualKitList.length; i++) {
            $scope.virtualkitDetList.push({
                skuid: $scope.skuvirtualKitList[i].sku.idtableSkuId,
                quantity: parseInt($scope.skuvirtualKitList[i].quantity)
            });
        }
        $scope.tableSkuIsPoisonous = false;
        $scope.tableSkuIsIndividualItemBarcoded = false;
        $scope.tableSkuIsStackable = false;
        $scope.tableSkuIsSaleable = false;
        $scope.tableSkuIsFragile = false;
        for (var i = 0; i < $scope.selected.length; i++) {
            if ($scope.selected[i] == 'Poisonous') {
                $scope.tableSkuIsPoisonous = true;
            }

            if ($scope.selected[i] == 'Stackable') {
                $scope.tableSkuIsStackable = true;
            }

            if ($scope.selected[i] == 'Fragile') {
                $scope.tableSkuIsFragile = true;
            }

            if ($scope.selected[i] == 'Is Saleable') {
                $scope.tableSkuIsSaleable = true;
            }

            if ($scope.selected[i] == 'Is individual item barcoded') {
                $scope.tableSkuIsIndividualItemBarcoded = true;
            }
        }

        var postvirtualKitData = {};
        postvirtualKitData.parentSku = {
            "idtableSkuId": 7,
            "tableSkuClientSkuCode": virtualkitData.tableSkuClientSkuCode,
            "tableSkuName": virtualkitData.tableSkuName,
            "tableSkuDescription": virtualkitData.tableSkuDescription,
            "tableSkuPrimaryUpcEan": virtualkitData.tableSkuPrimaryUpcEan,
            "tableSkuHeight": parseInt(virtualkitData.tableSkuHeight),
            "tableSkuWidth": parseInt(virtualkitData.tableSkuWidth),
            "tableSkuLength": parseInt(virtualkitData.tableSkuLength),
            "tableSkuWeight": parseInt(virtualkitData.tableSkuWeight),
            "tableSkuIsIndividualItemBarcoded": $scope.tableSkuIsIndividualItemBarcoded,
            "tableSkuIsStackable": $scope.tableSkuIsStackable,
            "tableSkuIsPoisonous": $scope.tableSkuIsPoisonous,
            "tableSkuIsSaleable": $scope.tableSkuIsSaleable,
            "tableSkuIsFragile": $scope.tableSkuIsFragile,
            "tableSkuAttributeses": $scope.tableSkuAttributeses,
            "tableSkuBrandCode": virtualkitData.tableSkuBrandCode,
            "tableSkuCategoryType": virtualkitData.tableSkuCategoryType,
            "tableSkuShelfLifeType": virtualkitData.tableSkuShelfLifeType,
            "tableSkuUodmType": virtualkitData.tableSkuUodmType,
            "tableSkuUowmType": virtualkitData.tableSkuUowmType,
            "tableSkuStatusType": {
                "idtableSkuStatusTypeId": 1,
                "tableSkuStatusTypeString": "Active"
            },
            "tableSkuType": {
                "idtableSkuTypeId": 3,
                "tableSkuTypeString": "VirtualKit"
            }
        }

        postvirtualKitData.skuKitList = $scope.virtualkitDetList;
        postvirtualKitData.tableSkuInventory = {
            "idtableSkuInventoryId": 1,
            "tableSkuInventoryMaxRetailPrice": parseInt(virtualkitData.tableSkuInventory.tableSkuInventoryMaxRetailPrice),
            "tableSkuInventoryBatchNo": virtualkitData.tableSkuInventory.tableSkuInventoryBatchNo,
            "tableSkuInventoryMfgDate": mfgDate,
            "tableSkuInventoryExpiryDate": expDate,
            "tableSkuInventoryShelfLifeInDays": parseInt(virtualkitData.tableSkuInventory.tableSkuInventoryShelfLifeInDays),
            "tableSkuInventoryMinSalePrice": parseInt(virtualkitData.tableSkuInventory.tableSkuInventoryMinSalePrice)
        }


        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/skus/virtualkit',
            data: postvirtualKitData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {

            if (res) {
                virtualkitData = null;
                var uploadUrl = baseUrl + '/omsservices/webapi/skus/' + res.parentSku.idtableSkuId + '/images/';
                $scope.uploadSkuImages(uploadUrl).then(
                    function(v) {
                        if ($scope.modeSku == 'normal') {
                            $scope.listOfSkusCount($scope.vmPager.currentPage);
                        }
                        if ($scope.modeSku == 'mutual') {
                            $scope.listOfMutualSkusCount($scope.vmPager.currentPage);
                        }
                        if ($scope.modeVKitSku == 'normal') {
                            $scope.listOfVirtualKitSkusCount($scope.vmPager.currentPage);
                        }
                        if ($scope.modeVKitSku == 'mutual') {
                            $scope.listOfVirtualKitMutualSkusCount($scope.vmPager.currentPage);
                        }
                        $scope.dialogBoxVirtualKitMode = "add";
                        $scope.cancelSkuData();
                        growl.success("Virtual Kit Added Successfully");
                    },
                    function(err) {}
                );
            }
        }).error(function(error, status) {
            if (status == 401) {
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
            growl.error("Virtual Kit Cannot Be Added");
            $scope.dialogBoxVirtualKitMode = "add";
        });
    };

    //code for saving the virtual kit data in virtualkitapi to backend
    $scope.savevirtualKitData = function(virtualkitData) {
        if (virtualkitData) {
            if (virtualkitData.tableSkuClientSkuCode) {
                $scope.checkClientCode(virtualkitData.tableSkuClientSkuCode, "virtual").then(
                    function(v) {
                        if (v) {
                            if (!virtualkitData.tableSkuName) {
                                growl.error("Please enter the Name");
                                $scope.isSkuNameEntered = true;
                            } else {
                                $scope.checkUpcCode(virtualkitData.tableSkuPrimaryUpcEan, "virtual").then(
                                    function(v) {
                                        if (v) {
                                            if (!virtualkitData.tableSkuCategoryType) {
                                                growl.error("Please select a Category");
                                                $scope.isSkuCategorySelected = true;
                                            } else {
                                                if (!virtualkitData.tableSkuBrandCode) {
                                                    growl.error("Please select a Brand");
                                                    $scope.isSkuBrandSelected = true;
                                                } else {
                                                    if (!virtualkitData.tableSkuDescription) {
                                                        growl.error("Please enter the Description");
                                                        $scope.isSkuDescEntered = true;
                                                    } else {
                                                        if (!virtualkitData.tableSkuLength) {
                                                            $scope.productDimClicked = true;
                                                            $scope.shelfLifeClicked = false;
                                                            $scope.attributesClicked = false;
                                                            $scope.propertiesClicked = false;
                                                            $scope.kitDetailsClicked = false;
                                                            $scope.virtualkitDetailsClicked = false;
                                                            $scope.inventoryDetailsClicked = false;
                                                            document.skuForm.tableSkuLength.focus();
                                                            growl.error("Please enter the SKU Length");
                                                            $scope.isSkuLengthEntered = true;
                                                        } else {
                                                            if (!virtualkitData.tableSkuWidth) {
                                                                $scope.productDimClicked = true;
                                                                $scope.shelfLifeClicked = false;
                                                                $scope.attributesClicked = false;
                                                                $scope.propertiesClicked = false;
                                                                $scope.kitDetailsClicked = false;
                                                                $scope.virtualkitDetailsClicked = false;
                                                                $scope.inventoryDetailsClicked = false;
                                                                document.skuForm.tableSkuWidth.focus();
                                                                growl.error("Please enter the SKU Width");
                                                                $scope.isSkuWidthEntered = true;
                                                            } else {
                                                                if (!virtualkitData.tableSkuHeight) {
                                                                    $scope.productDimClicked = true;
                                                                    $scope.shelfLifeClicked = false;
                                                                    $scope.attributesClicked = false;
                                                                    $scope.propertiesClicked = false;
                                                                    $scope.kitDetailsClicked = false;
                                                                    $scope.virtualkitDetailsClicked = false;
                                                                    $scope.inventoryDetailsClicked = false;
                                                                    document.skuForm.tableSkuHeight.focus();
                                                                    growl.error("Please enter the SKU Height");
                                                                    $scope.isSkuHeightEntered = true;
                                                                } else {
                                                                    if (!virtualkitData.tableSkuWeight) {
                                                                        $scope.productDimClicked = true;
                                                                        $scope.shelfLifeClicked = false;
                                                                        $scope.attributesClicked = false;
                                                                        $scope.propertiesClicked = false;
                                                                        $scope.kitDetailsClicked = false;
                                                                        $scope.virtualkitDetailsClicked = false;
                                                                        $scope.inventoryDetailsClicked = false;
                                                                        document.skuForm.tableSkuWeight.focus();
                                                                        growl.error("Please enter the SKU Weight");
                                                                        $scope.isSkuWeightEntered = true;
                                                                    } else {
                                                                        if (!virtualkitData.tableSkuUodmType) {
                                                                            $scope.productDimClicked = true;
                                                                            $scope.shelfLifeClicked = false;
                                                                            $scope.attributesClicked = false;
                                                                            $scope.propertiesClicked = false;
                                                                            $scope.kitDetailsClicked = false;
                                                                            $scope.virtualkitDetailsClicked = false;
                                                                            $scope.inventoryDetailsClicked = false;
                                                                            document.skuForm.tableSkuUodmType.focus();
                                                                            growl.error("Please select the Dimention Unit");
                                                                            $scope.isDimUnitSelected = true;
                                                                        } else {
                                                                            if (!virtualkitData.tableSkuUowmType) {
                                                                                $scope.productDimClicked = true;
                                                                                $scope.shelfLifeClicked = false;
                                                                                $scope.attributesClicked = false;
                                                                                $scope.propertiesClicked = false;
                                                                                $scope.kitDetailsClicked = false;
                                                                                $scope.virtualkitDetailsClicked = false;
                                                                                $scope.inventoryDetailsClicked = false;
                                                                                document.skuForm.tableSkuUowmType.focus();
                                                                                growl.error("Please select the Weight Unit");
                                                                                $scope.isWeightUnitSelected = true;
                                                                            } else {
                                                                                if (!virtualkitData.tableSkuShelfLifeType) {
                                                                                    $scope.productDimClicked = false;
                                                                                    $scope.shelfLifeClicked = true;
                                                                                    $scope.attributesClicked = false;
                                                                                    $scope.propertiesClicked = false;
                                                                                    $scope.kitDetailsClicked = false;
                                                                                    $scope.virtualkitDetailsClicked = false;
                                                                                    $scope.inventoryDetailsClicked = false;
                                                                                    growl.error("Please select the Shelf Type");
                                                                                    $scope.isShelfTypeSelected = true;
                                                                                    if (document.skuForm.tableSkuShelfLifeType) {
                                                                                        document.skuForm.tableSkuShelfLifeType.focus();
                                                                                    }
                                                                                } else {
                                                                                    if (virtualkitData.tableSkuInventory || $scope.dialogBoxVirtualKitMode == "edit") {
                                                                                        if (!virtualkitData.tableSkuInventory.tableSkuInventoryMaxRetailPrice && $scope.dialogBoxVirtualKitMode == "add") {
                                                                                            $scope.productDimClicked = false;
                                                                                            $scope.shelfLifeClicked = false;
                                                                                            $scope.attributesClicked = false;
                                                                                            $scope.propertiesClicked = false;
                                                                                            $scope.kitDetailsClicked = false;
                                                                                            $scope.virtualkitDetailsClicked = false;
                                                                                            $scope.inventoryDetailsClicked = true;
                                                                                            growl.error("Please enter the MRP");
                                                                                            $scope.isSkuMrpEntered = true;
                                                                                            if (document.skuForm.tableSkuInventoryMaxRetailPrice) {
                                                                                                document.skuForm.tableSkuInventoryMaxRetailPrice.focus();
                                                                                            }
                                                                                        } else {
                                                                                            if (!virtualkitData.tableSkuInventory.tableSkuInventoryMinSalePrice && $scope.dialogBoxVirtualKitMode == "add") {
                                                                                                $scope.productDimClicked = false;
                                                                                                $scope.shelfLifeClicked = false;
                                                                                                $scope.attributesClicked = false;
                                                                                                $scope.propertiesClicked = false;
                                                                                                $scope.kitDetailsClicked = false;
                                                                                                $scope.virtualkitDetailsClicked = false;
                                                                                                $scope.inventoryDetailsClicked = true;
                                                                                                growl.error("Please enter the MSP");
                                                                                                $scope.isSkuMspEntered = true;
                                                                                                if (document.skuForm.tableSkuInventoryMinSalePrice) {
                                                                                                    document.skuForm.tableSkuInventoryMinSalePrice.focus();
                                                                                                }
                                                                                            } else {
                                                                                                if (!virtualkitData.tableSkuInventory.tableSkuInventoryBatchNo && $scope.dialogBoxVirtualKitMode == "add") {
                                                                                                    $scope.productDimClicked = false;
                                                                                                    $scope.shelfLifeClicked = false;
                                                                                                    $scope.attributesClicked = false;
                                                                                                    $scope.propertiesClicked = false;
                                                                                                    $scope.kitDetailsClicked = false;
                                                                                                    $scope.virtualkitDetailsClicked = false;
                                                                                                    $scope.inventoryDetailsClicked = true;
                                                                                                    growl.error("Please enter the Batch No.");
                                                                                                    $scope.isBatchNoEntered = true;
                                                                                                    if (document.skuForm.tableSkuInventoryBatchNo) {
                                                                                                        document.skuForm.tableSkuInventoryBatchNo.focus();
                                                                                                    }
                                                                                                } else {
                                                                                                    if ($scope.shelfTypeID == 1 && !virtualkitData.tableSkuInventory.tableSkuInventoryMfgDate && $scope.dialogBoxVirtualKitMode == "add") {
                                                                                                        $scope.productDimClicked = false;
                                                                                                        $scope.shelfLifeClicked = false;
                                                                                                        $scope.attributesClicked = false;
                                                                                                        $scope.propertiesClicked = false;
                                                                                                        $scope.kitDetailsClicked = false;
                                                                                                        $scope.virtualkitDetailsClicked = false;
                                                                                                        $scope.inventoryDetailsClicked = true;
                                                                                                        growl.error("Please select the Mfg Date.");
                                                                                                        $scope.isMfgDateSelected = true;
                                                                                                        if (document.skuForm.tableSkuInventoryMfgDate) {
                                                                                                            document.skuForm.tableSkuInventoryMfgDate.focus();
                                                                                                        }
                                                                                                    } else {
                                                                                                        if ($scope.shelfTypeID == 2 && !virtualkitData.tableSkuInventory.tableSkuInventoryExpiryDate && $scope.dialogBoxVirtualKitMode == "add") {
                                                                                                            $scope.productDimClicked = false;
                                                                                                            $scope.shelfLifeClicked = false;
                                                                                                            $scope.attributesClicked = false;
                                                                                                            $scope.propertiesClicked = false;
                                                                                                            $scope.kitDetailsClicked = false;
                                                                                                            $scope.virtualkitDetailsClicked = false;
                                                                                                            $scope.inventoryDetailsClicked = true;
                                                                                                            growl.error("Please select the Exp Date.");
                                                                                                            $scope.isExpDateSelected = true;
                                                                                                            if (document.skuForm.tableSkuInventoryExpiryDate) {
                                                                                                                document.skuForm.tableSkuInventoryExpiryDate.focus();
                                                                                                            }
                                                                                                        } else {
                                                                                                            if ($scope.shelfTypeID == 1 && !virtualkitData.tableSkuInventory.tableSkuInventoryShelfLifeInDays && $scope.dialogBoxVirtualKitMode == "add") {
                                                                                                                $scope.productDimClicked = false;
                                                                                                                $scope.shelfLifeClicked = false;
                                                                                                                $scope.attributesClicked = false;
                                                                                                                $scope.propertiesClicked = false;
                                                                                                                $scope.kitDetailsClicked = false;
                                                                                                                $scope.virtualkitDetailsClicked = false;
                                                                                                                $scope.inventoryDetailsClicked = true;
                                                                                                                growl.error("Please enter the Shelf Life");
                                                                                                                $scope.isShelfLifeEntered = true;
                                                                                                                if (document.skuForm.tableSkuInventoryShelfLifeInDays) {
                                                                                                                    document.skuForm.tableSkuInventoryShelfLifeInDays.focus();
                                                                                                                }
                                                                                                            } else {
                                                                                                                if ($scope.dialogBoxVirtualKitMode == "add") {
                                                                                                                    $scope.addVirtualKitToDb(virtualkitData);
                                                                                                                } else if ($scope.dialogBoxVirtualKitMode == "edit") {
                                                                                                                    $scope.updatevirtualKitData(virtualkitData, $scope.skuClientCode);
                                                                                                                }
                                                                                                            }
                                                                                                        }
                                                                                                    }
                                                                                                }
                                                                                            }
                                                                                        }
                                                                                    } else {
                                                                                        $scope.productDimClicked = false;
                                                                                        $scope.shelfLifeClicked = false;
                                                                                        $scope.attributesClicked = false;
                                                                                        $scope.propertiesClicked = false;
                                                                                        $scope.kitDetailsClicked = false;
                                                                                        $scope.virtualkitDetailsClicked = false;
                                                                                        $scope.inventoryDetailsClicked = true;
                                                                                        growl.error("Please enter the MRP");
                                                                                        $scope.isSkuMrpEntered = true;
                                                                                        if (document.skuForm.tableSkuInventoryMaxRetailPrice) {
                                                                                            document.skuForm.tableSkuInventoryMaxRetailPrice.focus();
                                                                                        }
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
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
            } else {
                growl.error("Please enter the Seller SKU ID");
                $scope.isSellerSkuIdEntered = true;
            }
        } else {
            growl.error("Please enter the Seller SKU ID");
            $scope.isSellerSkuIdEntered = true;
        }
    };
    //ends here-code for saving the kit data in kitapi to backend

    //code for saving the virtual kit data in virtualkitapi to backend
    $scope.saveSkuData = function(skuData) {
        if (skuData) {
            if (skuData.tableSkuClientSkuCode) {
                $scope.checkClientCode(skuData.tableSkuClientSkuCode, "normal").then(
                    function(v) {
                        if (v) {
                            if (!skuData.tableSkuName) {
                                growl.error("Please enter the Name");
                                $scope.isSkuNameEntered = true;
                            } else {
                                $scope.checkUpcCode(skuData.tableSkuPrimaryUpcEan, "normal").then(
                                    function(v) {
                                        if (v) {
                                            if (!skuData.tableSkuCategoryType) {
                                                growl.error("Please select a Category");
                                                $scope.isSkuCategorySelected = true;
                                            } else {
                                                if (!skuData.tableSkuBrandCode) {
                                                    growl.error("Please select a Brand");
                                                    $scope.isSkuBrandSelected = true;
                                                } else {
                                                    if (!skuData.tableSkuDescription) {
                                                        growl.error("Please enter the Description");
                                                        $scope.isSkuDescEntered = true;
                                                    } else {
                                                        if (!skuData.tableSkuLength) {
                                                            $scope.productDimClicked = true;
                                                            $scope.shelfLifeClicked = false;
                                                            $scope.attributesClicked = false;
                                                            $scope.propertiesClicked = false;
                                                            document.skuForm.tableSkuLength.focus();
                                                            growl.error("Please enter the SKU Length");
                                                            $scope.isSkuLengthEntered = true;
                                                        } else {
                                                            if (!skuData.tableSkuWidth) {
                                                                $scope.productDimClicked = true;
                                                                $scope.shelfLifeClicked = false;
                                                                $scope.attributesClicked = false;
                                                                $scope.propertiesClicked = false;
                                                                document.skuForm.tableSkuWidth.focus();
                                                                growl.error("Please enter the SKU Width");
                                                                $scope.isSkuWidthEntered = true;
                                                            } else {
                                                                if (!skuData.tableSkuHeight) {
                                                                    $scope.productDimClicked = true;
                                                                    $scope.shelfLifeClicked = false;
                                                                    $scope.attributesClicked = false;
                                                                    $scope.propertiesClicked = false;
                                                                    document.skuForm.tableSkuHeight.focus();
                                                                    growl.error("Please enter the SKU Height");
                                                                    $scope.isSkuHeightEntered = true;
                                                                } else {
                                                                    if (!skuData.tableSkuWeight) {
                                                                        $scope.productDimClicked = true;
                                                                        $scope.shelfLifeClicked = false;
                                                                        $scope.attributesClicked = false;
                                                                        $scope.propertiesClicked = false;
                                                                        $scope.kitDetailsClicked = false;
                                                                        growl.error("Please enter the SKU Weight");
                                                                        $scope.isSkuWeightEntered = true;
                                                                    } else {
                                                                        if (!skuData.tableSkuUodmType) {
                                                                            $scope.productDimClicked = true;
                                                                            $scope.shelfLifeClicked = false;
                                                                            $scope.attributesClicked = false;
                                                                            $scope.propertiesClicked = false;
                                                                            document.skuForm.tableSkuUodmType.focus();
                                                                            growl.error("Please select the Dimention Unit");
                                                                            $scope.isDimUnitSelected = true;
                                                                        } else {
                                                                            if (!skuData.tableSkuUowmType) {
                                                                                $scope.productDimClicked = true;
                                                                                $scope.shelfLifeClicked = false;
                                                                                $scope.attributesClicked = false;
                                                                                $scope.propertiesClicked = false;
                                                                                document.skuForm.tableSkuUowmType.focus();
                                                                                growl.error("Please select the Weight Unit");
                                                                                $scope.isWeightUnitSelected = true;
                                                                            } else {
                                                                                if (!skuData.tableSkuShelfLifeType) {
                                                                                    $scope.productDimClicked = false;
                                                                                    $scope.shelfLifeClicked = true;
                                                                                    $scope.attributesClicked = false;
                                                                                    $scope.propertiesClicked = false;
                                                                                    growl.error("Please select the Shelf Type");
                                                                                    $scope.isShelfTypeSelected = true;
                                                                                    if (document.skuForm.tableSkuShelfLifeType) {
                                                                                        document.skuForm.tableSkuShelfLifeType.focus();
                                                                                    }
                                                                                } else {
                                                                                    if ($scope.dialogBoxSkuMode == "add") {
                                                                                        $scope.saveSkuDataInDb(skuData);
                                                                                    } else if ($scope.dialogBoxSkuMode == "edit") {
                                                                                        $scope.updateSkuData(skuData, $scope.skuClientCode);
                                                                                    }
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
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
            } else {
                growl.error("Please enter the Seller SKU ID");
                $scope.isSellerSkuIdEntered = true;
            }
        } else {
            growl.error("Please enter the Seller SKU ID");
            $scope.isSellerSkuIdEntered = true;
        }
    };
    //ends here-code for saving the kit data in kitapi to backend

    $scope.addBrand = function(brandName) {
        if (!brandName) {
            growl.error("Please enter the Brand Name");
            $scope.isNewBrandNameEntered = true;
        } else {
            postBrandData = {
                "tableSkuBrandCodeString": brandName
            }

            $http({
                method: 'POST',
                url: baseUrl + '/omsservices/webapi/skubrandcodes',
                data: postBrandData,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(res) {
                if (res) {
                    growl.success("New Brand Added Successfully");
                    $scope.brandTypeArray();
                    $scope.closeBrandBox();
                }
            }).error(function(error, status) {
                growl.error("New Brand Can" +
                    "if(status == 401n{" +
                    "$('#AuthErrorot.modal('show B;" +
                    "$location.path('/logine ;Added");
            });
        }
    };

    $scope.openBrandBox = function() {
        $("#addNewBrand").modal("show");
    }

    $scope.closeBrandBox = function() {
        $scope.isNewBrandNameEntered = false;
        $("#addNewBrand").modal("hide");
    };

    $scope.newBrandNameChanged = function(brandName) {
        if (brandName) {
            $scope.isNewBrandNameEntered = false;
        } else {
            $scope.isNewBrandNameEntered = true;
        }
    };

    $scope.addCategory = function(categoryName) {
        if (!categoryName) {
            growl.error("Please enter the Category Name");
            $scope.isNewCatgNameEntered = true;
        } else {
            postCategoryData = {
                "tableSkuCategoryTypeString": categoryName
            }

            $http({
                method: 'POST',
                url: baseUrl + '/omsservices/webapi/skucategorytypes',
                data: postCategoryData,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(res) {
                if (res) {
                    growl.success("New Category Added Successfully");
                    $scope.categoryTypeArray();
                    $scope.closeCategoryBox();
                }
            }).error(function(error, status) {
                growl.error("New Category " +
                    "if(status == 401C{" +
                    "$('#AuthErroran.modal('showno;" +
                    "$location.path('/logint ;Be Added");
            });
        }
    };

    $scope.openCategoryBox = function() {
        $("#addNewCatg").modal("show");
    };

    $scope.closeCategoryBox = function() {
        $scope.isNewCatgNameEntered = false;
        $("#addNewCatg").modal("hide");
    };

    $scope.newCatgNameChanged = function(catgName) {
        if (catgName) {
            $scope.isNewCatgNameEntered = false;
        } else {
            $scope.isNewCatgNameEntered = true;
        }
    };

    $scope.addAttribute = function(attributeName) {
        if (!attributeName) {
            growl.error("Please enter the Attribute Name");
            $scope.isNewAttributeNameEntered = true;
        } else {
            postAttributeData = {
                "tableSkuAttributeKeysString": attributeName
            }

            $http({
                method: 'POST',
                url: baseUrl + '/omsservices/webapi/skuattributekeys',
                data: postAttributeData,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(res) {
                if (res) {
                    growl.success("New Attribute Added Successfully");
                    $scope.attributeArray();
                    $scope.closeAttributeBox();
                }
            }).error(function(error, status) {
                growl.error("New Attribute cannot be added");
            });
        }
    };

    $scope.openAttributeBox = function() {
        $("#addNewAttribute").modal("show");
    }

    $scope.closeAttributeBox = function() {
        $scope.isNewAttributeNameEntered = false;
        $("#addNewAttribute").modal("hide");
    };

    $scope.newAttributeNameChanged = function(attrName) {
        if (attrName) {
            $scope.isNewAttributeNameEntered = false;
        } else {
            $scope.isNewAttributeNameEntered = true;
        }
    };

    //check CLient Sku Code
    $scope.checkClientCode = function(sellerskuId, skuType) {
        var q = $q.defer();
        if (sellerskuId) {
            if (skuType == "virtual") {
                if ($scope.sellerSkuIdChangedFlag || $scope.dialogBoxVirtualKitMode == "add") {
                    var checkClientUrl = baseUrl + "/omsservices/webapi/skus/checkclientcode?clientcode=" + sellerskuId;
                    $http.get(checkClientUrl).success(function(data) {
                        if (data == true) {
                            growl.error("Seller SKU ID Already Exists. Please Enter New Seller Sku Id");
                            var myEl = angular.element(document.querySelector('#sellerSkuId'));
                            myEl.empty();
                            $scope.isSellerSkuIdEntered = true;
                            document.skuForm.sellerSkuId.focus();
                            q.resolve(false);
                        } else {
                            $scope.isSellerSkuIdEntered = false;
                            q.resolve(true);
                        }
                    });
                } else {
                    q.resolve(true);
                }
            } else if (skuType == "normal") {
                if ($scope.sellerSkuIdChangedFlag || $scope.dialogBoxSkuMode == "add") {
                    var checkClientUrl = baseUrl + "/omsservices/webapi/skus/checkclientcode?clientcode=" + sellerskuId;
                    $http.get(checkClientUrl).success(function(data) {
                        if (data == true) {
                            growl.error("Seller SKU ID Already Exists. Please Enter New Seller Sku Id");
                            var myEl = angular.element(document.querySelector('#sellerSkuId'));
                            myEl.empty();
                            $scope.isSellerSkuIdEntered = true;
                            document.skuForm.sellerSkuId.focus();
                            q.resolve(false);
                        } else {
                            $scope.isSellerSkuIdEntered = false;
                            q.resolve(true);
                        }
                    });
                } else {
                    q.resolve(true);
                }
            } else if (skuType == "kit") {
                if ($scope.sellerSkuIdChangedFlag || $scope.dialogBoxKitMode == "add") {
                    var checkClientUrl = baseUrl + "/omsservices/webapi/skus/checkclientcode?clientcode=" + sellerskuId;
                    $http.get(checkClientUrl).success(function(data) {
                        if (data == true) {
                            growl.error("Seller SKU ID Already Exists. Please Enter New Seller Sku Id");
                            var myEl = angular.element(document.querySelector('#sellerSkuId'));
                            myEl.empty();
                            $scope.isSellerSkuIdEntered = true;
                            document.skuForm.sellerSkuId.focus();
                            q.resolve(false);
                        } else {
                            $scope.isSellerSkuIdEntered = false;
                            q.resolve(true);
                        }
                    });
                } else {
                    q.resolve(true);
                }
            }
        } else {
            document.skuForm.sellerSkuId.focus();
            growl.error("Please enter the Seller SKU ID");
            $scope.isSellerSkuIdEntered = true;
            q.resolve(false);
        }
        return q.promise;
    };

    //check CLient UPC Code
    $scope.checkUpcCode = function(upcCode, skuType) {
        var q = $q.defer();
        if (upcCode) {
            if (skuType == "virtual") {
                if ($scope.upcCodeChangedFlag || $scope.dialogBoxVirtualKitMode == "add") {
                    var checkUPCUrl = baseUrl + "/omsservices/webapi/skus/checkupccode?upccode=" + upcCode;
                    $http.get(checkUPCUrl).success(function(data) {
                        if (data == true) {
                            growl.error("ISBN/UPC/EAN Already Exists. Please Enter New ISBN/UPC/EAN");
                            var myEl1 = angular.element(document.querySelector('#upc'));
                            myEl1.empty();
                            document.skuForm.upc.focus();
                            $scope.isUpcCodeEntered = true;
                            q.resolve(false);
                        } else {
                            $scope.isUpcCodeEntered = false;
                            q.resolve(true);
                        }
                    });
                } else {
                    q.resolve(true);
                }
            } else if (skuType == "normal") {
                if ($scope.upcCodeChangedFlag || $scope.dialogBoxSkuMode == "add") {
                    var checkUPCUrl = baseUrl + "/omsservices/webapi/skus/checkupccode?upccode=" + upcCode;
                    $http.get(checkUPCUrl).success(function(data) {
                        if (data == true) {
                            growl.error("ISBN/UPC/EAN Already Exists. Please Enter New ISBN/UPC/EAN");
                            var myEl1 = angular.element(document.querySelector('#upc'));
                            myEl1.empty();
                            document.skuForm.upc.focus();
                            $scope.isUpcCodeEntered = true;
                            q.resolve(false);
                        } else {
                            $scope.isUpcCodeEntered = false;
                            q.resolve(true);
                        }
                    });
                } else {
                    q.resolve(true);
                }
            } else if (skuType == "kit") {
                if ($scope.upcCodeChangedFlag || $scope.dialogBoxKitMode == "add") {
                    var checkUPCUrl = baseUrl + "/omsservices/webapi/skus/checkupccode?upccode=" + upcCode;
                    $http.get(checkUPCUrl).success(function(data) {
                        if (data == true) {
                            growl.error("ISBN/UPC/EAN Already Exists. Please Enter New ISBN/UPC/EAN");
                            var myEl1 = angular.element(document.querySelector('#upc'));
                            myEl1.empty();
                            document.skuForm.upc.focus();
                            $scope.isUpcCodeEntered = true;
                            q.resolve(false);
                        } else {
                            $scope.isUpcCodeEntered = false;
                            q.resolve(true);
                        }
                    });
                } else {
                    q.resolve(true);
                }
            }
        } else {
            q.resolve(true);
            $scope.isUpcCodeEntered = false;
        }
        return q.promise;
    };

    //event to prevent neg integers
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

    $scope.deactivateSku = function(skuId, skuData, type, ev) {
        $scope.skuId = skuId;
        $scope.skuData = skuData;
        $scope.type = type;
        $mdDialog.show({
                templateUrl: 'dialog333.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                escapeToClose: false,
                clickOutsideToClose: false,
                scope: $scope.$new()
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    //deactiving sku code
    $scope.deactivateSkuApi = function(skuId, skuData, type) {
        skuData.tableSkuStatusType = {
            "idtableSkuStatusTypeId": 2,
            "tableSkuStatusTypeString": "Inactive"
        }

        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/skus/' + skuId,
            data: skuData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            if (res) {
                if (type == 'Normal') {
                    growl.success("Normal SKU Deactivated Successfully");
                    // $scope.listOfSkus();
                    $scope.listOfSkusCount($scope.vmPager.currentPage);
                    // $scope.listOfNormalSkus();
                    $scope.listOfNormalSkusCount($scope.vmPagerNormal.currentPage);
                }
                if (type == 'Kit') {
                    growl.success("Kit Deactivated Successfully");
                    // $scope.listOfSkus();
                    $scope.listOfSkusCount($scope.vmPager.currentPage);
                    // $scope.listOfKitSkus();
                    $scope.listOfKitSkusCount($scope.vmPagerKit.currentPage);
                }
                if (type == 'VirtualKit') {
                    growl.success("Virtual Kit Deactivated Successfully");
                    // $scope.listOfSkus();
                    $scope.listOfSkusCount($scope.vmPager.currentPage);
                    // $scope.listOfVirtualKitSkus();
                    $scope.listOfVirtualKitSkusCount($scope.vmPagerVKit.currentPage);
                }
                $mdDialog.hide();
            }
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
            if (type == 'Normal') {
                growl.error("Normal SKU Cannot Be Deactivated");
            }
            if (type == 'Kit') {
                growl.error("Kit Cannot Be Deactivated");
            }
            if (type == 'VirtualKit') {
                growl.error("Virtual Kit Cannot Be Deactivated");
            }
            $mdDialog.hide();
        });
    };

    $scope.activateSku = function(skuId, skuData, type, ev) {
        $scope.skuId = skuId;
        $scope.skuData = skuData;
        $scope.type = type;
        $mdDialog.show({
                templateUrl: 'dialog334.tmpl.html',
                parent: angular.element(document.body),
                targetEvent: ev,
                escapeToClose: false,
                clickOutsideToClose: false,
                scope: $scope.$new()
            })
            .then(function(answer) {
                $scope.status = 'You said the information was "' + answer + '".';
            }, function() {
                $scope.status = 'You cancelled the dialog.';
            });
    };

    //deactiving sku code
    $scope.activateSkuApi = function(skuId, skuData, type) {
        skuData.tableSkuStatusType = {
            "idtableSkuStatusTypeId": 1,
            "tableSkuStatusTypeString": "Active"
        }

        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/skus/' + skuId,
            data: skuData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            if (res) {
                if (type == 'Normal') {
                    growl.success("Normal SKU Activated Successfully");
                    // $scope.listOfSkus();
                    $scope.listOfSkusCount($scope.vmPager.currentPage);
                    // $scope.listOfNormalSkus();
                    $scope.listOfNormalSkusCount($scope.vmPagerNormal.currentPage);
                }
                if (type == 'Kit') {
                    growl.success("Kit Activated Successfully");
                    // $scope.listOfSkus();
                    $scope.listOfSkusCount($scope.vmPager.currentPage);
                    // $scope.listOfKitSkus();
                    $scope.listOfKitSkusCount($scope.vmPagerKit.currentPage);
                }
                if (type == 'VirtualKit') {
                    growl.success("Virtual Kit Activated Successfully");
                    // $scope.listOfSkus();
                    $scope.listOfSkusCount($scope.vmPager.currentPage);
                    // $scope.listOfVirtualKitSkus();
                    $scope.listOfVirtualKitSkusCount($scope.vmPagerVKit.currentPage);
                }
                $mdDialog.hide();
            }
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
            if (type == 'Normal') {
                growl.error("Normal SKU Cannot Be Deactivated");
            }
            if (type == 'Kit') {
                growl.error("Kit Cannot Be Deactivated");
            }
            if (type == 'VirtualKit') {
                growl.error("Virtual Kit Cannot Be Deactivated");
            }
            $mdDialog.hide();
        });
    };

    $scope.isFile1SelectDisabled = function() {
        if ($scope.isImg1Present()) {
            return true;
        } else if ($scope.fromDelete1) {
            $scope.fromDelete1 = false;
            return true;
        }
        return false;
    }

    $scope.isImg1Present = function() {
        if ($scope.img1PresentId != 0 || $scope.skuImgFile1) {
            return true;
        }
        return false;
    };

    $scope.isFile2SelectDisabled = function() {
        if ($scope.isImg2Present()) {
            return true;
        } else if ($scope.fromDelete2) {
            $scope.fromDelete2 = false;
            return true;
        }
        return false;
    }

    $scope.isImg2Present = function() {
        if ($scope.img2PresentId != 0 || $scope.skuImgFile2) {
            return true;
        }
        return false;
    };

    $scope.isFile3SelectDisabled = function() {
        if ($scope.isImg3Present()) {
            return true;
        } else if ($scope.fromDelete3) {
            $scope.fromDelete3 = false;
            return true;
        }
        return false;
    }

    $scope.isImg3Present = function() {
        if ($scope.img3PresentId != 0 || $scope.skuImgFile3) {
            return true;
        }
        return false;
    };

    $scope.isFile4SelectDisabled = function() {
        if ($scope.isImg4Present()) {
            return true;
        } else if ($scope.fromDelete4) {
            $scope.fromDelete4 = false;
            return true;
        }
        return false;
    }

    $scope.isImg4Present = function() {
        if ($scope.img4PresentId != 0 || $scope.skuImgFile4) {
            return true;
        }
        return false;
    };

    $scope.deleteSkuImage = function(imageNo) {
        var imgId = 0;
        if (imageNo == "1") {
            imgId = $scope.img1PresentId;
        } else if (imageNo == "2") {
            imgId = $scope.img2PresentId;
        } else if (imageNo == "3") {
            imgId = $scope.img3PresentId;
        } else if (imageNo == "4") {
            imgId = $scope.img4PresentId;
        }

        if (imgId != 0) {
            var delImgUrl = baseUrl + "/omsservices/webapi/skus/" + $scope.skuClientCode + "/images/" + imgId;
            console.log(delImgUrl);
            $http.delete(delImgUrl).success(function(data) {
                console.log(data);
            }).error(function(error, status) {
                if (status == 401) {
                    growl.error("Your session has been expired. You need to Login again.");
                    $location.path("/login");
                }
            });
        }
        if (imageNo == "1") {
            $scope.skuImgUrl1 = "images/svg/add_image_active.svg";
            $scope.img1PresentId = 0;
            $scope.skuImgFile1 = undefined;
            $scope.fromDelete1 = true;
        } else if (imageNo == "2") {
            $scope.skuImgUrl2 = "images/svg/add_image_active.svg";
            $scope.img2PresentId = 0;
            $scope.skuImgFile2 = undefined;
            $scope.fromDelete2 = true;
        } else if (imageNo == "3") {
            $scope.skuImgUrl3 = "images/svg/add_image_active.svg";
            $scope.img3PresentId = 0;
            $scope.skuImgFile3 = undefined;
            $scope.fromDelete3 = true;
        } else if (imageNo == "4") {
            $scope.skuImgUrl4 = "images/svg/add_image_active.svg";
            $scope.img4PresentId = 0;
            $scope.skuImgFile4 = undefined;
            $scope.fromDelete4 = true;
        }
    };

    $scope.deleteSkuImages = function(skuId) {
        var q = $q.defer();
        q.resolve(true);
        if ($scope.skuImgFile1 != undefined && $scope.img1PresentId != 0) {
            var delImgUrl = baseUrl + "/omsservices/webapi/skus/" + skuId + "/images/" + $scope.img1PresentId;
            $http.delete(delImgUrl).success(function(data) {
                console.log(data);
                q.resolve(true);
            }).error(function(error, status) {
                if (status == 401) {
                    growl.error("Your session has been expired. You need to Login again.");
                    $location.path("/login");
                }
                q.reject(false);
            });
        }
        if ($scope.skuImgFile2 != undefined && $scope.img2PresentId != 0) {
            var delImgUrl = baseUrl + "/omsservices/webapi/skus/" + skuId + "/images/" + $scope.img2PresentId;
            $http.delete(delImgUrl).success(function(data) {
                console.log(data);
                q.resolve(true);
            }).error(function(error, status) {
                if (status == 401) {
                    growl.error("Your session has been expired. You need to Login again.");
                    $location.path("/login");
                }
                q.reject(false);
            });
        }
        if ($scope.skuImgFile3 != undefined && $scope.img3PresentId != 0) {
            var delImgUrl = baseUrl + "/omsservices/webapi/skus/" + skuId + "/images/" + $scope.img3PresentId;
            $http.delete(delImgUrl).success(function(data) {
                console.log(data);
                q.resolve(true);
            }).error(function(error, status) {
                if (status == 401) {
                    growl.error("Your session has been expired. You need to Login again.");
                    $location.path("/login");
                }
                q.reject(false);
            });
        }
        if ($scope.skuImgFile4 != undefined && $scope.img4PresentId != 0) {
            var delImgUrl = baseUrl + "/omsservices/webapi/skus/" + skuId + "/images/" + $scope.img4PresentId;
            $http.delete(delImgUrl).success(function(data) {
                console.log(data);
                q.resolve(true);
            }).error(function(error, status) {
                if (status == 401) {
                    growl.error("Your session has been expired. You need to Login again.");
                    $location.path("/login");
                }
                q.reject(false);
            });
        }
        return q.promise;
    };

    $scope.uploadSkuImages = function(uploadUrl) {
        var q = $q.defer();
        if ($scope.skuImgFile1 != undefined) {
            fileUpload.uploadFileToUrl($scope.skuImgFile1, uploadUrl);
        }
        if ($scope.skuImgFile2 != undefined) {
            fileUpload.uploadFileToUrl($scope.skuImgFile2, uploadUrl);
        }
        if ($scope.skuImgFile3 != undefined) {
            fileUpload.uploadFileToUrl($scope.skuImgFile3, uploadUrl);
        }
        if ($scope.skuImgFile4 != undefined) {
            fileUpload.uploadFileToUrl($scope.skuImgFile4, uploadUrl);
        }
        q.resolve(true);
        return q.promise;
    };

    //update Normal Sku Functionality
    $scope.updateSkuData = function(skuData, skuId) {
        $scope.tableSkuAttributeses = [];
        for (var i = 0; i < $scope.attributeListArray.length; i++) {
            $scope.tableSkuAttributeses.push({
                "tableSkuAttributesAttributeValue": $scope.attributeListArray[i].tableSkuAttributeValue,
                "tableSkuAttributeKeys": {
                    "tableSkuAttributeKeysString": $scope.attributeListArray[i].tableSkuAttributeKeys
                }
            })
        }

        $scope.tableSkuIsPoisonous = false;
        $scope.tableSkuIsIndividualItemBarcoded = false;
        $scope.tableSkuIsStackable = false;
        $scope.tableSkuIsSaleable = false;
        $scope.tableSkuIsFragile = false;
        for (var i = 0; i < $scope.selected.length; i++) {
            if ($scope.selected[i] == 'Poisonous') {
                $scope.tableSkuIsPoisonous = true;
            }

            if ($scope.selected[i] == 'Stackable') {
                $scope.tableSkuIsStackable = true;
            }

            if ($scope.selected[i] == 'Fragile') {
                $scope.tableSkuIsFragile = true;
            }

            if ($scope.selected[i] == 'Is Saleable') {
                $scope.tableSkuIsSaleable = true;
            }

            if ($scope.selected[i] == 'Is individual item barcoded') {
                $scope.tableSkuIsIndividualItemBarcoded = true;
            }
        }

        var putSkuData = skuData;
        putSkuData.tableSkuIsPoisonous = $scope.tableSkuIsPoisonous;
        putSkuData.tableSkuIsStackable = $scope.tableSkuIsStackable;
        putSkuData.tableSkuIsFragile = $scope.tableSkuIsFragile;
        putSkuData.tableSkuIsSaleable = $scope.tableSkuIsSaleable;
        putSkuData.tableSkuIsIndividualItemBarcoded = $scope.tableSkuIsIndividualItemBarcoded;
        putSkuData.tableSkuAttributeses = $scope.tableSkuAttributeses;
        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/skus/' + skuId,
            data: putSkuData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            if (res) {

                var uploadUrl = baseUrl + '/omsservices/webapi/skus/' + skuId + '/images/';
                $scope.deleteSkuImages(skuId).then(
                    function(v) {
                        $scope.uploadSkuImages(uploadUrl).then(
                            function(v) {
                                skuData = null;
                                if ($scope.modeSku == 'normal') {
                                    // $scope.listOfSkus();
                                    $scope.listOfSkusCount($scope.vmPager.currentPage);
                                }
                                if ($scope.modeSku == 'mutual') {
                                    // $scope.listOfMutualSkus();
                                    $scope.listOfMutualSkusCount($scope.vmPager.currentPage);
                                }
                                if ($scope.modeNormalSku == 'normal') {
                                    // $scope.listOfNormalSkus();
                                    $scope.listOfNormalSkusCount($scope.vmPagerNormal.currentPage);
                                }
                                if ($scope.modeNormalSku == 'mutual') {
                                    // $scope.listOfNormalMutualSkus();
                                    $scope.listOfNormalMutualSkusCount($scope.vmPagerNormal.currentPage);
                                }
                                $scope.dialogBoxSkuMode = 'add';
                                growl.success("Normal SKU Updated Successfully");
                                $scope.cancelSkuData();
                            },
                            function(err) {}
                        );
                    },
                    function(err) {}
                );
            }
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
            growl.error("Normal SKU cannot be Updated");
        });
    };

    $scope.updateKitData = function(kitData, skuId) {
        $scope.kitDetList = [];
        $scope.tableSkuAttributeses = [];
        for (var i = 0; i < $scope.attributeListArray.length; i++) {
            $scope.tableSkuAttributeses.push({
                "tableSkuAttributesAttributeValue": $scope.attributeListArray[i].tableSkuAttributeValue,
                "tableSkuAttributeKeys": {
                    "tableSkuAttributeKeysString": $scope.attributeListArray[i].tableSkuAttributeKeys
                }
            })
        }
        for (var i = 0; i < $scope.skuvirtualKitList.length; i++) {
            $scope.kitDetList.push({
                skuid: $scope.skuvirtualKitList[i].sku.idtableSkuId,
                quantity: parseInt($scope.skuvirtualKitList[i].quantity)
            });
        }
        $scope.tableSkuIsPoisonous = false;
        $scope.tableSkuIsIndividualItemBarcoded = false;
        $scope.tableSkuIsStackable = false;
        $scope.tableSkuIsSaleable = false;
        $scope.tableSkuIsFragile = false;

        for (var i = 0; i < $scope.selected.length; i++) {
            if ($scope.selected[i] == 'Poisonous') {
                $scope.tableSkuIsPoisonous = true;
            }

            if ($scope.selected[i] == 'Stackable') {
                $scope.tableSkuIsStackable = true;
            }

            if ($scope.selected[i] == 'Fragile') {
                $scope.tableSkuIsFragile = true;
            }

            if ($scope.selected[i] == 'Is Saleable') {
                $scope.tableSkuIsSaleable = true;
            }

            if ($scope.selected[i] == 'Is individual item barcoded') {
                $scope.tableSkuIsIndividualItemBarcoded = true;
            }
        }
        var putKitData = {};
        putKitData.parentSku = {
            "idtableSkuId": 7,
            "tableSkuClientSkuCode": kitData.tableSkuClientSkuCode,
            "tableSkuName": kitData.tableSkuName,
            "tableSkuDescription": kitData.tableSkuDescription,
            "tableSkuPrimaryUpcEan": kitData.tableSkuPrimaryUpcEan,
            "tableSkuHeight": parseInt(kitData.tableSkuHeight),
            "tableSkuWidth": parseInt(kitData.tableSkuWidth),
            "tableSkuLength": parseInt(kitData.tableSkuLength),
            "tableSkuWeight": parseInt(kitData.tableSkuWeight),
            "tableSkuIsIndividualItemBarcoded": $scope.tableSkuIsIndividualItemBarcoded,
            "tableSkuIsStackable": $scope.tableSkuIsStackable,
            "tableSkuIsPoisonous": $scope.tableSkuIsPoisonous,
            "tableSkuIsSaleable": $scope.tableSkuIsSaleable,
            "tableSkuIsFragile": $scope.tableSkuIsFragile,
            "tableSkuAttributeses": $scope.tableSkuAttributeses,
            "tableSkuBrandCode": kitData.tableSkuBrandCode,
            "tableSkuCategoryType": kitData.tableSkuCategoryType,
            "tableSkuShelfLifeType": kitData.tableSkuShelfLifeType,
            "tableSkuUodmType": kitData.tableSkuUodmType,
            "tableSkuUowmType": kitData.tableSkuUowmType,
            "tableSkuStatusType": {
                "idtableSkuStatusTypeId": 1,
                "tableSkuStatusTypeString": "Active"
            },
            "tableSkuType": {
                "idtableSkuTypeId": 2,
                "tableSkuTypeString": "Kit"
            }
        }

        putKitData.skuKitList = $scope.kitDetList;
        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/skus/kit/' + skuId,
            data: putKitData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            if (res) {
                var uploadUrl = baseUrl + '/omsservices/webapi/skus/' + skuId + '/images/';
                $scope.deleteSkuImages(skuId).then(
                    function(v) {
                        $scope.uploadSkuImages(uploadUrl).then(
                            function(v) {
                                kitData = null;
                                $scope.dialogBoxKitMode = "add";
                                if ($scope.modeSku == 'normal') {
                                    $scope.listOfSkusCount($scope.vmPager.currentPage);
                                }
                                if ($scope.modeSku == 'mutual') {
                                    $scope.listOfMutualSkusCount($scope.vmPager.currentPage);
                                }
                                if ($scope.modeKitSku == 'normal') {
                                    $scope.listOfKitSkusCount($scope.vmPager.currentPage);
                                }
                                if ($scope.modeKitSku == 'mutual') {
                                    $scope.listOfNormalMutualSkusCount($scope.vmPager.currentPage);
                                }
                                growl.success("Kit Updated Successfully");
                                $scope.cancelSkuData();
                            },
                            function(err) {}
                        );
                    },
                    function(err) {}
                );
            }
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
            growl.error("Kit cannot be Updated");
        });
    };

    $scope.updatevirtualKitData = function(kitData, skuId) {
        $scope.kitDetList = [];
        $scope.tableSkuAttributeses = [];
        for (var i = 0; i < $scope.attributeListArray.length; i++) {
            $scope.tableSkuAttributeses.push({
                "tableSkuAttributesAttributeValue": $scope.attributeListArray[i].tableSkuAttributeValue,
                "tableSkuAttributeKeys": {
                    "tableSkuAttributeKeysString": $scope.attributeListArray[i].tableSkuAttributeKeys
                }
            })
        }
        for (var i = 0; i < $scope.skuvirtualKitList.length; i++) {
            $scope.kitDetList.push({
                skuid: $scope.skuvirtualKitList[i].sku.idtableSkuId,
                quantity: parseInt($scope.skuvirtualKitList[i].quantity)
            });
        }
        $scope.tableSkuIsPoisonous = false;
        $scope.tableSkuIsIndividualItemBarcoded = false;
        $scope.tableSkuIsStackable = false;
        $scope.tableSkuIsSaleable = false;
        $scope.tableSkuIsFragile = false;

        for (var i = 0; i < $scope.selected.length; i++) {
            if ($scope.selected[i] == 'Poisonous') {
                $scope.tableSkuIsPoisonous = true;
            }

            if ($scope.selected[i] == 'Stackable') {
                $scope.tableSkuIsStackable = true;
            }

            if ($scope.selected[i] == 'Fragile') {
                $scope.tableSkuIsFragile = true;
            }

            if ($scope.selected[i] == 'Is Saleable') {
                $scope.tableSkuIsSaleable = true;
            }

            if ($scope.selected[i] == 'Is individual item barcoded') {
                $scope.tableSkuIsIndividualItemBarcoded = true;
            }
        }
        var putKitData = {};
        putKitData.parentSku = {
            "idtableSkuId": skuId,
            "tableSkuClientSkuCode": kitData.tableSkuClientSkuCode,
            "tableSkuName": kitData.tableSkuName,
            "tableSkuDescription": kitData.tableSkuDescription,
            "tableSkuPrimaryUpcEan": kitData.tableSkuPrimaryUpcEan,
            "tableSkuHeight": parseInt(kitData.tableSkuHeight),
            "tableSkuWidth": parseInt(kitData.tableSkuWidth),
            "tableSkuLength": parseInt(kitData.tableSkuLength),
            "tableSkuWeight": parseInt(kitData.tableSkuWeight),
            "tableSkuIsIndividualItemBarcoded": $scope.tableSkuIsIndividualItemBarcoded,
            "tableSkuIsStackable": $scope.tableSkuIsStackable,
            "tableSkuIsPoisonous": $scope.tableSkuIsPoisonous,
            "tableSkuIsSaleable": $scope.tableSkuIsSaleable,
            "tableSkuIsFragile": $scope.tableSkuIsFragile,
            "tableSkuAttributeses": $scope.tableSkuAttributeses,
            "tableSkuBrandCode": kitData.tableSkuBrandCode,
            "tableSkuCategoryType": kitData.tableSkuCategoryType,
            "tableSkuShelfLifeType": kitData.tableSkuShelfLifeType,
            "tableSkuUodmType": kitData.tableSkuUodmType,
            "tableSkuUowmType": kitData.tableSkuUowmType,
            "tableSkuStatusType": {
                "idtableSkuStatusTypeId": 1,
                "tableSkuStatusTypeString": "Active"
            },
            "tableSkuType": {
                "idtableSkuTypeId": 3,
                "tableSkuTypeString": "VirtualKit"
            }
        }

        putKitData.skuKitList = $scope.kitDetList;

        console.log(putKitData);
        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/skus/virtualkit/' + skuId,
            data: putKitData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            if (res) {

                var uploadUrl = baseUrl + '/omsservices/webapi/skus/' + skuId + '/images/';
                $scope.deleteSkuImages(skuId).then(
                    function(v) {
                        $scope.uploadSkuImages(uploadUrl).then(
                            function(v) {
                                kitData = null;
                                $scope.dialogBoxVirtualKitMode = "add";
                                if ($scope.modeSku == 'normal') {
                                    // $scope.listOfSkus();
                                    $scope.listOfSkusCount($scope.vmPager.currentPage);
                                }
                                if ($scope.modeSku == 'mutual') {
                                    // $scope.listOfMutualSkus();
                                    $scope.listOfMutualSkusCount($scope.vmPager.currentPage);
                                }
                                if ($scope.modeKitSku == 'normal') {
                                    // $scope.listOfKitSkus();
                                    $scope.listOfVirtualKitSkusCount($scope.vmPager.currentPage);
                                }
                                if ($scope.modeKitSku == 'mutual') {
                                    // $scope.listOfNormalMutualSkus();
                                    $scope.listOfVirtualKitMutualSkusCount($scope.vmPager.currentPage);
                                }
                                $scope.cancelSkuData();
                                growl.success("Virtual Kit Updated Successfully");
                            },
                            function(err) {}
                        );;
                    },
                    function(err) {}
                );
            }
        }).error(function(error, status) {
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
            growl.error("Kit cannot be Updated");
        });
    };

    //splicing the kit list
    $scope.removeKit = function(index) {
        $scope.skuKitList.splice(index, 1);
    };

    //splicing the virtual kit list
    $scope.removeVirtualKit = function(index) {
        $scope.skuvirtualKitList.splice(index, 1);
    };
}
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
