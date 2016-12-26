myApp.controller('inventoryController', inventoryController);
inventoryController.$inject = ['$scope', '$http', '$location', '$mdDialog', '$mdMedia', 'baseUrl', 'growl', 'PagerService','$controller'];

function inventoryController($scope, $http, $location, $mdDialog, $mdMedia, baseUrl, growl, PagerService,$controller) {

    // Initialize the super class and extend it.
    // $.extend(this, $controller('templatesController', {$scope: $scope}));

    $scope.sortType = "tableSku.tableSkuClientSkuCode"; // set the default sort type
    $scope.sortReverse = true; // set the default sort order
    $scope.searchItem = ""; // set the default search/filter term

    $scope.searchInventoryClicked = false;
    $scope.searchWorkOrderClicked = false;
    $scope.searchWorkOrderKitClicked = false;
    $scope.searchWorkOrderSplitClicked = false;
    $scope.searchWorkOrderMailerClicked = false;
    $scope.searchWorkOrderQcClicked = false;
    $scope.searchWorkOrderStockClicked = false;
    $scope.searchWorkOrderStickerClicked = false;
    $scope.inventoryData = "";
    $scope.kitData = "";
    $scope.splitData = "";
    $scope.freeMailerData = "";
    $scope.qcData = "";
    $scope.stockData = "";
    $scope.stickerData = "";
    $scope.wIdSticker = "";
    $scope.mode = "add";
    $scope.start = 0;
    $scope.inventorySize = 5;
    $scope.allworkOrderStart = 0;
    $scope.allworkOrderSize = 5;
    $scope.allworkOrderKitStart = 0;
    $scope.allworkOrderKitSize = 5;
    $scope.allworkOrderSplitStart = 0;
    $scope.allworkOrderSplitSize = 5;
    $scope.allworkOrderMailerStart = 0;
    $scope.allworkOrderMailerSize = 5;
    $scope.allworkOrderQcStart = 0;
    $scope.allworkOrderQcSize = 5;
    $scope.allworkOrderStockStart = 0;
    $scope.allworkOrderStockSize = 5;
    $scope.allworkOrderStickerStart = 0;
    $scope.allworkOrderStickerSize = 5;
    // $scope.optionsList = [];
    $scope.products = [];
    $scope.invMRPMSP = false;
    $scope.baseSkuUrl = baseUrl + '/omsservices/webapi/skus/search?search=';
    $scope.baseCustomerUrl = baseUrl + '/omsservices/webapi/customers/search?search=';

    //Inv No
    $scope.firstInvNo = 1;
    $scope.secInvNo = 2;
    $scope.thirdInvNo = 3;
    $scope.fourthInvNo = 4;
    $scope.fifthInvNo = 5;

    //Work Ord No
    $scope.firstWrkOrdNo = 1;
    $scope.secWrkOrdNo = 2;
    $scope.thirdWrkOrdNo = 3;
    $scope.fourthWrkOrdNo = 4;
    $scope.fifthWrkOrdNo = 5;

    //Work Order Kit No
    $scope.firstWrkOrdKitNo = 1;
    $scope.secWrkOrdKitNo = 2;
    $scope.thirdWrkOrdKitNo = 3;
    $scope.fourthWrkOrdKitNo = 4;
    $scope.fifthWrkOrdKitNo = 5;

    //Work Order Split No
    $scope.firstWrkOrdSplitNo = 1;
    $scope.secWrkOrdSplitNo = 2;
    $scope.thirdWrkOrdSplitNo = 3;
    $scope.fourthWrkOrdSplitNo = 4;
    $scope.fifthWrkOrdSplitNo = 5;

    //Work Order Mailer No
    $scope.firstWrkOrdMailerNo = 1;
    $scope.secWrkOrdMailerNo = 2;
    $scope.thirdWrkOrdMailerNo = 3;
    $scope.fourthWrkOrdMailerNo = 4;
    $scope.fifthWrkOrdMailerNo = 5;

    //Work Order Qc No
    $scope.firstWrkOrdQcNo = 1;
    $scope.secWrkOrdQcNo = 2;
    $scope.thirdWrkOrdQcNo = 3;
    $scope.fourthWrkOrdQcNo = 4;
    $scope.fifthWrkOrdQcNo = 5;

    //Work Order Stock No
    $scope.firstWrkOrdStockNo = 1;
    $scope.secWrkOrdStockNo = 2;
    $scope.thirdWrkOrdStockNo = 3;
    $scope.fourthWrkOrdStockNo = 4;
    $scope.fifthWrkOrdStockNo = 5;

    //Work Order Stock No
    $scope.firstWrkOrdStickerNo = 1;
    $scope.secWrkOrdStickerNo = 2;
    $scope.thirdWrkOrdStickerNo = 3;
    $scope.fourthWrkOrdStickerNo = 4;
    $scope.fifthWrkOrdStickerNo = 5;

    //dialog bog variable
    $scope.dialogBoxKit = 'add';
    $scope.dialogBoxSplit = 'add';
    $scope.dialogBoxFreeMailer = 'add';
    $scope.dialogBoxQC = 'add';
    $scope.dialogBoxStock = 'add';
    $scope.dialogBoxSticker = 'add';

    $scope.validAvblQty = false;

    $scope.selectedTab1 = 0;
    $scope.mdSelectedTab = 0;

    $scope.isSubmitDisabledInv = true;
    $scope.isResetDisabledInv = true;

    $scope.isSubmitDisabledListWo = true;
    $scope.isResetDisabledListWo = true;

    $scope.isSubmitDisabledKit = true;
    $scope.isResetDisabledKit = true;

    $scope.isSubmitDisabledSplit = true;
    $scope.isResetDisabledSplit = true;

    $scope.isSubmitDisabledMailer = true;
    $scope.isResetDisabledMailer = true;

    $scope.isSubmitDisabledQc = true;
    $scope.isResetDisabledQc = true;

    $scope.isSubmitDisabledStock = true;
    $scope.isResetDisabledStock = true; 

    $scope.isSubmitDisabledSticker = true;
    $scope.isResetDisabledSticker = true; 
    $scope.isStartDateDisabled = true;
    $scope.isEndDateDisabled = true;


    $scope.stickermode = "add";
    $scope.openStickeMode = function()
    {
    $scope.stickerTotalMode = "new";
    }

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
        $scope.listOfInventories($scope.start);
        $scope.listOfInventoriesCount();
        // $scope.listOfWorkOrders($scope.allworkOrderStart);
        // $scope.listOfWorkOrderCount();
        // $scope.listOfWorkOrdersCreatedKit($scope.allworkOrderKitStart);
        // $scope.listOfWorkOrderKitCount();
        // $scope.listOfWorkOrdersCreatedSplit($scope.allworkOrderSplitStart);
        // $scope.listOfWorkOrderSplitCount();
        // $scope.listOfWorkOrdersCreatedMailer($scope.allworkOrderMailerStart);
        // $scope.listOfWorkOrderMailerCount();
        // $scope.listOfWorkOrdersCreatedQc($scope.allworkOrderQcStart);
        // $scope.listOfWorkOrderQcCount();
        // $scope.listOfWorkOrdersCreatedStock($scope.allworkOrderStockStart);
        // $scope.listOfWorkOrderStockCount();
        // $scope.listOfWorkOrdersCreatedSticker($scope.allworkOrderStickerStart);
        // $scope.listOfWorkOrderStickerCount();
        $scope.getWarehouses();
        $scope.getVendors();
        $scope.qcTrueLists();
        $scope.loadStickerTemplates();
        $scope.loadCancelReasons();
    });

    $scope.checkValidAvblQty = function(val) {
        if (val && val > 0) {
            $scope.validAvblQty = false;
        }
    };

    $scope.callDisabled = function(){
        $scope.isSubmitDisabledInv = false;
    }

    $scope.callDisabledListWo = function(){
        $scope.isSubmitDisabledListWo = false;
    }

    $scope.callDisabledKit = function(){
        $scope.isSubmitDisabledKit = false;
    }

    $scope.callDisabledSplit = function(){
        $scope.isSubmitDisabledSplit = false;
    }

    $scope.callDisabledMailer = function(){
        $scope.isSubmitDisabledMailer = false;
    }

    $scope.callDisabledQc = function(){
        $scope.isSubmitDisabledQc = false;
    }

    $scope.callDisabledStock = function(){
        $scope.isSubmitDisabledStock = false;
    }

    $scope.callDisabledSticker = function(){
        $scope.isSubmitDisabledSticker = false;
    }                

    $scope.searchedProduct = function(selected) {
            $scope.skuid = selected.originalObject.idtableSkuId;
            $scope.callDisabled();
        }
        //fetching list of inventories count
    $scope.listOfInventoriesCount = function(page) {
            var inventoryCountUrl = baseUrl + "/omsservices/webapi/inventory/filtercount?sort=tableSkuInventoryCreationDate&direction=desc";
            if ($scope.warehouseid) {
                inventoryCountUrl += "&warehouseid=" + $scope.warehouseid;
            }
            if ($scope.skuid) {
                inventoryCountUrl += "&skuid=" + $scope.skuid;
            }
            if ($scope.startDate) {
                inventoryCountUrl += "&startDate=" + $scope.startDate;
            }
            if ($scope.endDate) {
                inventoryCountUrl += "&endDate=" + $scope.endDate;
            }


            $http.get(inventoryCountUrl).success(function(data) {
                $scope.invCount = data;
                if (data != null) {
                    var vm = this;

                    vm.dummyItems = _.range(0, $scope.invCount); // dummy array of items to be paged
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
                        $scope.inventorySize = $scope.start + 5;
            
            
                        // get current page of items
                        vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                        $scope.vmItems = vm.items;
                        $scope.listOfInventories($scope.start);
                    }
                }
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
            });
        }
        //fetchng list of inv count ends here

    //fetching list of workorder count
    $scope.listOfWorkOrderCount = function(page) {
        var workOrderCountUrl = baseUrl + "/omsservices/webapi/workorder/filtercount?workorderstatus=0";
        if ($scope.warehouseid) {
            workOrderCountUrl += "&warehouse=" + $scope.warehouseid;
        }
        if ($scope.startDate) {
            workOrderCountUrl += "&startDate=" + $scope.startDate;
        }
        if ($scope.endDate) {
            workOrderCountUrl += "&endDate=" + $scope.endDate;
        }
        $http.get(workOrderCountUrl).success(function(data) {
            $scope.workOrdCount = data;
            if (data != null) {
                var vm = this;

                vm.dummyItems = _.range(0, $scope.workOrdCount); // dummy array of items to be paged
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
        
                    $scope.vmPagerWoStart = vm.pager;

                    $scope.allworkOrderStart = (vm.pager.currentPage - 1) * 5;
                    $scope.allworkOrderSize = $scope.allworkOrderStart + 5;
        
        
                    // get current page of items
                    vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                    $scope.vmItems = vm.items;
                    $scope.listOfWorkOrders($scope.allworkOrderStart);
                }
            }
        }).error(function(error, status) {


            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
        });
    }

    //fetching list of workorder kit count
    $scope.listOfWorkOrderKitCount = function(page) {
            var workOrderKitCountUrl = baseUrl + "/omsservices/webapi/workorder/filtercount?workordertype=1&workorderstatus=0";
            if ($scope.warehouseid) {
                workOrderKitCountUrl += "&warehouse=" + $scope.warehouseid;
            }
            if ($scope.startDate) {
                workOrderKitCountUrl += "&startDate=" + $scope.startDate;
            }
            if ($scope.endDate) {
                workOrderKitCountUrl += "&endDate=" + $scope.endDate;
            }


            $http.get(workOrderKitCountUrl).success(function(data) {
                $scope.workOrdKitCount = data;
                if (data != null) {
                    var vm = this;

                    vm.dummyItems = _.range(0, $scope.workOrdKitCount); // dummy array of items to be paged
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
            
                        $scope.vmPagerWoKitStart = vm.pager;

                        $scope.allworkOrderKitStart = (vm.pager.currentPage - 1) * 5;
                        $scope.allworkOrderKitSize = $scope.allworkOrderKitStart + 5;
            
            
                        // get current page of items
                        vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                        $scope.vmItems = vm.items;
                        $scope.listOfWorkOrdersCreatedKit($scope.allworkOrderKitStart);
                    }
                }
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
            });
        }
        //fetching list of workorder kit count ends here

    //fetching list of workorder split count
    $scope.listOfWorkOrderSplitCount = function(page) {
            var workOrderSplitCountUrl = baseUrl + "/omsservices/webapi/workorder/filtercount?workordertype=2&workorderstatus=0";
            if ($scope.warehouseid) {
                workOrderSplitCountUrl += "&warehouse=" + $scope.warehouseid;
            }
            if ($scope.startDate) {
                workOrderSplitCountUrl += "&startDate=" + $scope.startDate;
            }
            if ($scope.endDate) {
                workOrderSplitCountUrl += "&endDate=" + $scope.endDate;
            }


            $http.get(workOrderSplitCountUrl).success(function(data) {
                $scope.workOrdSplitCount = data;
                if (data != null) {
                    var vm = this;

                    vm.dummyItems = _.range(0, $scope.workOrdSplitCount); // dummy array of items to be paged
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
            
                        $scope.vmPagerWoSplitStart = vm.pager;

                        $scope.allworkOrderSplitStart = (vm.pager.currentPage - 1) * 5;
                        $scope.allworkOrderSplitSize = $scope.allworkOrderSplitStart + 5;
            
            
                        // get current page of items
                        vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                        $scope.vmItems = vm.items;
                        $scope.listOfWorkOrdersCreatedSplit($scope.allworkOrderSplitStart);
                    }
                }
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
            });
        }
        //fetching list of workorder split count ends here

    //fetching list of workorder mailer count
    $scope.listOfWorkOrderMailerCount = function(page) {
            var workOrderMailerCountUrl = baseUrl + "/omsservices/webapi/workorder/filtercount?workordertype=4&workorderstatus=0";
            if ($scope.warehouseid) {
                workOrderMailerCountUrl += "&warehouse=" + $scope.warehouseid;
            }
            if ($scope.startDate) {
                workOrderMailerCountUrl += "&startDate=" + $scope.startDate;
            }
            if ($scope.endDate) {
                workOrderMailerCountUrl += "&endDate=" + $scope.endDate;
            }


            $http.get(workOrderMailerCountUrl).success(function(data) {
                $scope.workOrdMailerCount = data;
                if (data != null) {
                    var vm = this;

                    vm.dummyItems = _.range(0, $scope.workOrdMailerCount); // dummy array of items to be paged
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
            
                        $scope.vmPagerWoMailerStart = vm.pager;

                        $scope.allworkOrderMailerStart = (vm.pager.currentPage - 1) * 5;
                        $scope.allworkOrderMailerSize = $scope.allworkOrderMailerStart + 5;
            
            
                        // get current page of items
                        vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                        $scope.vmItems = vm.items;
                        $scope.listOfWorkOrdersCreatedMailer($scope.allworkOrderMailerStart);
                    }
                }
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
            });
        }
        //fetching list of workorder mailer count ends here

    //fetching list of workorder qc count
    $scope.listOfWorkOrderQcCount = function(page) {
            var workOrderQcCountUrl = baseUrl + "/omsservices/webapi/workorder/filtercount?workordertype=6&workorderstatus=0";
            if ($scope.warehouseid) {
                workOrderQcCountUrl += "&warehouse=" + $scope.warehouseid;
            }
            if ($scope.startDate) {
                workOrderQcCountUrl += "&startDate=" + $scope.startDate;
            }
            if ($scope.endDate) {
                workOrderQcCountUrl += "&endDate=" + $scope.endDate;
            }


            $http.get(workOrderQcCountUrl).success(function(data) {
                $scope.workOrdQcCount = data;
                if (data != null) {
                    var vm = this;

                    vm.dummyItems = _.range(0, $scope.workOrdQcCount); // dummy array of items to be paged
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
            
                        $scope.vmPagerWoQcStart = vm.pager;

                        $scope.allworkOrderQcStart = (vm.pager.currentPage - 1) * 5;
                        $scope.allworkOrderQcSize = $scope.allworkOrderQcStart + 5;
            
            
                        // get current page of items
                        vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                        $scope.vmItems = vm.items;
                        $scope.listOfWorkOrdersCreatedQc($scope.allworkOrderQcStart);
                    }
                }
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
            });
        }
        //fetching list of workorder qc count ends here

    //fetching list of workorder stock count
    $scope.listOfWorkOrderStockCount = function(page) {
            var workOrderStockCountUrl = baseUrl + "/omsservices/webapi/workorder/filtercount?workordertype=7&workorderstatus=0";
            if ($scope.warehouseid) {
                workOrderStockCountUrl += "&warehouse=" + $scope.warehouseid;
            }
            if ($scope.startDate) {
                workOrderStockCountUrl += "&startDate=" + $scope.startDate;
            }
            if ($scope.endDate) {
                workOrderStockCountUrl += "&endDate=" + $scope.endDate;
            }


            $http.get(workOrderStockCountUrl).success(function(data) {
                $scope.workOrdStockCount = data;
                if (data != null) {
                    var vm = this;

                    vm.dummyItems = _.range(0, $scope.workOrdStockCount); // dummy array of items to be paged
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
            
                        $scope.vmPagerWoStockStart = vm.pager;

                        $scope.allworkOrderStockStart = (vm.pager.currentPage - 1) * 5;
                        $scope.allworkOrderStockSize = $scope.allworkOrderStockStart + 5;
            
            
                        // get current page of items
                        vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                        $scope.vmItems = vm.items;
                        $scope.listOfWorkOrdersCreatedStock($scope.allworkOrderStockStart);
                    }
                }
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
            });
        }
        //fetching list of workorder stock count ends here

    //fetching list of workorder sticker count
    $scope.listOfWorkOrderStickerCount = function(page) {
            var workOrderStickerCountUrl = baseUrl + "/omsservices/webapi/workorder/filtercount?workordertype=8&workorderstatus=0";
            if ($scope.warehouseid) {
                workOrderStickerCountUrl += "&warehouse=" + $scope.warehouseid;
            }
            if ($scope.startDate) {
                workOrderStickerCountUrl += "&startDate=" + $scope.startDate;
            }
            if ($scope.endDate) {
                workOrderStickerCountUrl += "&endDate=" + $scope.endDate;
            }


            $http.get(workOrderStickerCountUrl).success(function(data) {
                $scope.workOrdStickerCount = data;
                if (data != null) {
                    var vm = this;

                    vm.dummyItems = _.range(0, $scope.workOrdStickerCount); // dummy array of items to be paged
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
            
                        $scope.vmPagerWoStickerStart = vm.pager;

                        $scope.allworkOrderStickerStart = (vm.pager.currentPage - 1) * 5;
                        $scope.allworkOrderStickerSize = $scope.allworkOrderStickerStart + 5;
            
            
                        // get current page of items
                        vm.items = vm.dummyItems.slice(vm.pager.startIndex, vm.pager.endIndex + 1);
                        $scope.vmItems = vm.items;
                        $scope.listOfWorkOrdersCreatedSticker($scope.allworkOrderStickerStart);
                    }
                }
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
            });
        }
        //fetching list of workorder sticker count ends here

    // fetching list of inventories from RestAPI OMS
    $scope.listOfInventories = function(start) {
            var inventoryListUrl = baseUrl + "/omsservices/webapi/inventory";
            inventoryListUrl += "?start=" + start + '&size=5&sort=tableSkuInventoryCreationDate&direction=desc';
            if ($scope.warehouseid) {
                inventoryListUrl += "&warehouseid=" + $scope.warehouseid;
            }
            if ($scope.skuid) {
                inventoryListUrl += "&skuid=" + $scope.skuid;
            }
            if ($scope.startDate) {
                inventoryListUrl += "&startDate=" + $scope.startDate;
            }
            if ($scope.endDate) {
                inventoryListUrl += "&endDate=" + $scope.endDate;
            }
            $http.get(inventoryListUrl).success(function(data) {
                $scope.inventoryLists = data;
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
            });
        }
        //inventory code ends here

    //Pagination Code for Inventory
    $scope.startIncrement = function() {
        var nextVal = $scope.firstInvNo + 5

        if (nextVal > $scope.invCountWithoutDecimal) {

            growl.error("Inventory For that Range Does Not Exist");
        }
        if (nextVal <= $scope.invCountWithoutDecimal) {
            $scope.firstInvNo = $scope.firstInvNo + 5;
            $scope.secInvNo = $scope.secInvNo + 5;
            $scope.thirdInvNo = $scope.thirdInvNo + 5;
            $scope.fourthInvNo = $scope.fourthInvNo + 5;
            $scope.fifthInvNo = $scope.fifthInvNo + 5;


            $scope.start = ($scope.firstInvNo - 1) * 5;
            $scope.inventorySize = $scope.start + 5;
            $scope.listOfInventories();
        }
    }

    $scope.startDecrement = function() {

        var prevVal = $scope.firstInvNo - 5;

        if (prevVal > $scope.invCountWithoutDecimal) {

            growl.error("Inventory For that Range Does Not Exist");
        }
        if (prevVal <= $scope.invCountWithoutDecimal) {
            $scope.firstInvNo = $scope.firstInvNo - 5;
            $scope.secInvNo = $scope.secInvNo - 5;
            $scope.thirdInvNo = $scope.thirdInvNo - 5;
            $scope.fourthInvNo = $scope.fourthInvNo - 5;
            $scope.fifthInvNo = $scope.fifthInvNo - 5;

            $scope.start = ($scope.firstInvNo - 1) * 5;
            $scope.inventorySize = $scope.start + 5;
            $scope.listOfInventories();
        }
    }

    $scope.zeroDecrement = function() {
        growl.error("Inventory for that range does not exist");
    }

    $scope.callInventoryList = function(number) {


            if (number <= $scope.invCountWithoutDecimal) {
    
    
                if (number) {
                    $scope.start = (number - 1) * 5;
                }
    
                $scope.inventorySize = $scope.start + 5;
                $scope.listOfInventories();
            }
            if (number > $scope.invCountWithoutDecimal) {
    
                growl.error("Inventory For that Range Does Not Exist");
            }
        }
        //Pagination Code for Inventory Ends Here

    //Different Submit Actions for Inventories,Work Order Types..
    //submit Action for Inventory screen when clicking on submit button in main inventory screen
    $scope.submitInventoryAction = function(wid, skuid, startDate, endDate) {
        if (wid != undefined) {
            $scope.warehouseid = wid;
        }
        if (skuid != undefined) {
            $scope.skuid = skuid;
        }
        if (startDate != undefined) {
            $scope.startDate = dateFormat(new Date(startDate), 'yyyy-mm-dd');
        }
        if (endDate != undefined) {
            $scope.endDate = dateFormat(new Date(endDate), 'yyyy-mm-dd');
        }
        $scope.start = 0;
        // $scope.listOfInventories();
        var page = undefined;
        $scope.isSubmitDisabledInv = true;
        $scope.isResetDisabledInv = false;
        $scope.listOfInventoriesCount(page);
    }

    $scope.clearActionInv = function() {
        $scope.warehouseid = undefined;
        $scope.skuid = "";
        $scope.startDate = "";
        $scope.endDate = "";
        $scope.start1Date = undefined;
        $scope.end1Date = undefined;
        var productId = 'products';
        if (productId) {
            $scope.$broadcast('angucomplete-alt:clearInput', productId);
        }
        $scope.start = 0;
        // $scope.listOfInventories();
        var page = undefined;
        $scope.isSubmitDisabledInv = true;
        $scope.isResetDisabledInv = false;        
        $scope.listOfInventoriesCount(page);
    }
    $scope.submitListWorkOrderAction = function(wid, startDate, endDate) {
        if (wid != undefined) {
            $scope.warehouseid = wid;
        }
        if (startDate != undefined) {
            $scope.startDate = dateFormat(new Date(startDate), 'yyyy-mm-dd');
        }
        if (endDate != undefined) {
            $scope.endDate = dateFormat(new Date(endDate), 'yyyy-mm-dd');
        }
        $scope.allworkOrderStart = 0;
        // $scope.listOfWorkOrders();
        var page = undefined;
        $scope.isSubmitDisabledListWo = true;
        $scope.isResetDisabledListWo = false;
        $scope.listOfWorkOrderCount(page);
    }

    //clear filter after applying
    $scope.clearAction = function() {
        $scope.warehouseid = undefined;
        $scope.startDate = "";
        $scope.endDate = "";
        $scope.start1Date = undefined;
        $scope.end1Date = undefined;
        $scope.allworkOrderStart = 0;
        // $scope.listOfWorkOrders();
        var page = undefined;
        $scope.listOfWorkOrderCount(page);
    }

    $scope.submitWorkOrderKitAction = function(wid, startDate, endDate) {
        if (wid != undefined) {
            $scope.warehouseid = wid;
        }
        if (startDate != undefined) {
            $scope.startDate = dateFormat(new Date(startDate), 'yyyy-mm-dd');
        }
        if (endDate != undefined) {
            $scope.endDate = dateFormat(new Date(endDate), 'yyyy-mm-dd');
        }
        $scope.allworkOrderKitStart = 0;
        // $scope.listOfWorkOrdersCreatedKit();
        $scope.isSubmitDisabledKit = true;
        $scope.isResetDisabledKit = false;
        var page = undefined;
        $scope.listOfWorkOrderKitCount(page);
    }

    //clear filter after applying
    $scope.clearAction1 = function() {
        $scope.warehouseid = undefined;
        $scope.startDate = "";
        $scope.endDate = "";
        $scope.start1Date = undefined;
        $scope.end1Date = undefined;
        $scope.allworkOrderKitStart = 0;
        // $scope.listOfWorkOrdersCreatedKit();
        $scope.isSubmitDisabledKit = true;
        $scope.isResetDisabledKit = false;        
        var page = undefined;
        $scope.listOfWorkOrderKitCount(page);
    }

    $scope.submitWorkOrderSplitAction = function(wid, startDate, endDate) {
        if (wid != undefined) {
            $scope.warehouseid = wid;
        }
        if (startDate != undefined) {
            $scope.startDate = dateFormat(new Date(startDate), 'yyyy-mm-dd');
        }
        if (endDate != undefined) {
            $scope.endDate = dateFormat(new Date(endDate), 'yyyy-mm-dd');
        }
        $scope.allworkOrderSplitStart = 0;
        // $scope.listOfWorkOrdersCreatedSplit();
        $scope.isSubmitDisabledSplit = true;
        $scope.isResetDisabledSplit = false;        
        var page = undefined;
        $scope.listOfWorkOrderSplitCount(page);
    }

    //clear filter after applying
    $scope.clearAction2 = function() {
        $scope.warehouseid = undefined;
        $scope.startDate = "";
        $scope.endDate = "";
        $scope.start1Date = undefined;
        $scope.end1Date = undefined;
        $scope.allworkOrderSplitStart = 0;
        // $scope.listOfWorkOrdersCreatedSplit();
        $scope.isSubmitDisabledSplit = true;
        $scope.isResetDisabledSplit = false;        
        var page = undefined;
        $scope.listOfWorkOrderSplitCount(page);
    }

    $scope.submitWorkOrderMailerAction = function(wid, startDate, endDate) {
        if (wid != undefined) {
            $scope.warehouseid = wid;
        }
        if (startDate != undefined) {
            $scope.startDate = dateFormat(new Date(startDate), 'yyyy-mm-dd');
        }
        if (endDate != undefined) {
            $scope.endDate = dateFormat(new Date(endDate), 'yyyy-mm-dd');
        }
        $scope.allworkOrderMailerStart = 0;
        // $scope.listOfWorkOrdersCreatedMailer();
        $scope.isSubmitDisabledMailer = true;
        $scope.isResetDisabledMailer = false;        
        var page = undefined;
        $scope.listOfWorkOrderMailerCount(page);
    }

    //clear filter after applying
    $scope.clearAction3 = function() {
        $scope.warehouseid = undefined;
        $scope.startDate = "";
        $scope.endDate = "";
        $scope.start1Date = undefined;
        $scope.end1Date = undefined;
        $scope.allworkOrderMailerStart = 0;
        // $scope.listOfWorkOrdersCreatedMailer();
        $scope.isSubmitDisabledMailer = true;
        $scope.isResetDisabledMailer = false;        
        var page = undefined;
        $scope.listOfWorkOrderMailerCount(page);
    }

    $scope.submitWorkOrderQcAction = function(wid, startDate, endDate) {
        if (wid != undefined) {
            $scope.warehouseid = wid;
        }
        if (startDate != undefined) {
            $scope.startDate = dateFormat(new Date(startDate), 'yyyy-mm-dd');
        }
        if (endDate != undefined) {
            $scope.endDate = dateFormat(new Date(endDate), 'yyyy-mm-dd');
        }
        $scope.allworkOrderQcStart = 0;
        // $scope.listOfWorkOrdersCreatedQc();
        $scope.isSubmitDisabledQc = true;
        $scope.isResetDisabledQc = false;        
        var page = undefined;
        $scope.listOfWorkOrderQcCount(page);
    }

    //clear filter after applying
    $scope.clearAction4 = function() {
        $scope.warehouseid = undefined;
        $scope.startDate = "";
        $scope.endDate = "";
        $scope.start1Date = undefined;
        $scope.end1Date = undefined;
        $scope.allworkOrderQcStart = 0;
        // $scope.listOfWorkOrdersCreatedQc();
        $scope.isSubmitDisabledQc = true;
        $scope.isResetDisabledQc = false;        
        var page = undefined;
        $scope.listOfWorkOrderQcCount(page);
    }

    $scope.submitWorkOrderStockAction = function(wid, startDate, endDate) {
        if (wid != undefined) {
            $scope.warehouseid = wid;
        }
        if (startDate != undefined) {
            $scope.startDate = dateFormat(new Date(startDate), 'yyyy-mm-dd');
        }
        if (endDate != undefined) {
            $scope.endDate = dateFormat(new Date(endDate), 'yyyy-mm-dd');
        }
        $scope.allworkOrderStockStart = 0;
        // $scope.listOfWorkOrdersCreatedStock();
        $scope.isSubmitDisabledStock = true;
        $scope.isResetDisabledStock = false;        
        var page = undefined;
        $scope.listOfWorkOrderStockCount(page);
    }

    //clear filter after applying
    $scope.clearAction5 = function() {
        $scope.warehouseid = undefined;
        $scope.startDate = "";
        $scope.endDate = "";
        $scope.start1Date = undefined;
        $scope.end1Date = undefined;
        $scope.allworkOrderStockStart = 0;
        // $scope.listOfWorkOrdersCreatedStock();
        $scope.isSubmitDisabledStock = true;
        $scope.isResetDisabledStock = false;        
        var page = undefined;
        $scope.listOfWorkOrderStockCount(page);
    }

    $scope.submitWorkOrderStickerAction = function(wid, startDate, endDate) {
        if (wid != undefined) {
            $scope.warehouseid = wid;
        }
        if (startDate != undefined) {
            $scope.startDate = dateFormat(new Date(startDate), 'yyyy-mm-dd');
        }
        if (endDate != undefined) {
            $scope.endDate = dateFormat(new Date(endDate), 'yyyy-mm-dd');
        }
        $scope.allworkOrderStickerStart = 0;
        // $scope.listOfWorkOrdersCreatedSticker();
        $scope.isSubmitDisabledSticker = true;
        $scope.isResetDisabledSticker = false;        
        var page = undefined;
        $scope.listOfWorkOrderStickerCount(page);
    }

    //clear filter after applying
    $scope.clearAction6 = function() {
        $scope.warehouseid = undefined;
        $scope.startDate = "";
        $scope.endDate = "";
        $scope.start1Date = undefined;
        $scope.end1Date = undefined;
        $scope.allworkOrderStickerStart = 0;
        // $scope.listOfWorkOrdersCreatedSticker();
        $scope.isSubmitDisabledSticker = true;
        $scope.isResetDisabledSticker = false;        
        var page = undefined;
        $scope.listOfWorkOrderStickerCount(page);
    }

    // fetching list of all work orders from RestAPI OMS
    $scope.listOfWorkOrders = function(start) {
            var workOrdersListUrl = baseUrl + "/omsservices/webapi/workorder";
            workOrdersListUrl += "?start=" + start + '&size=5&sort=tableWorkOrderDatetime&direction=desc&workorderstatus=0';

            if ($scope.warehouseid) {
                workOrdersListUrl += "&warehouse=" + $scope.warehouseid;
            }
            if ($scope.startDate) {
                workOrdersListUrl += "&startDate=" + $scope.startDate;
            }
            if ($scope.endDate) {
                workOrdersListUrl += "&endDate=" + $scope.endDate;
            }

            $http.get(workOrdersListUrl).success(function(data) {
                $scope.workOrderLists = data;
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
            });
        }
        // list of all work orders code ends here

    //Pagination Code for All Work Order
    $scope.startAllWorkOrderIncrement = function() {
        var nextVal = $scope.firstWrkOrdKitNo + 5

        if (nextVal > $scope.workOrdCountWithoutDecimal) {

            growl.error("Work Orders For that Range Does Not Exist");
        }
        if (nextVal <= $scope.workOrdCountWithoutDecimal) {
            $scope.firstWrkOrdNo = $scope.firstWrkOrdNo + 5;
            $scope.secWrkOrdNo = $scope.secWrkOrdNo + 5;
            $scope.thirdWrkOrdNo = $scope.thirdWrkOrdNo + 5;
            $scope.fourthWrkOrdNo = $scope.fourthWrkOrdNo + 5;
            $scope.fifthWrkOrdNo = $scope.fifthWrkOrdNo + 5;


            $scope.allworkOrderStart = ($scope.firstWrkOrdNo - 1) * 5;
            $scope.allworkOrderSize = $scope.allworkOrderStart + 5;
            $scope.listOfWorkOrders();
        }
    }

    $scope.startAllWorkOrderDecrement = function() {
        var prevVal = $scope.firstWrkOrdNo - 5;

        if (prevVal > $scope.workOrdCountWithoutDecimal) {

            growl.error("Work Orders For that Range Does Not Exist");
        }
        if (prevVal <= $scope.workOrdCountWithoutDecimal) {
            $scope.firstWrkOrdNo = $scope.firstWrkOrdNo - 5;
            $scope.secWrkOrdNo = $scope.secWrkOrdNo - 5;
            $scope.thirdWrkOrdNo = $scope.thirdWrkOrdNo - 5;
            $scope.fourthWrkOrdNo = $scope.fourthWrkOrdNo - 5;
            $scope.fifthWrkOrdNo = $scope.fifthWrkOrdNo - 5;

            $scope.allworkOrderStart = ($scope.firstWrkOrdNo - 1) * 5;
            $scope.allworkOrderSize = $scope.allworkOrderStart + 5;
            $scope.listOfWorkOrders();
        }
    }

    $scope.zeroWorkOrdDec = function() {
        growl.error("Work Orders For that Range Does Not Exist");
    }

    $scope.callAllWorkOrderList = function(number) {


            if (number <= $scope.workOrdCountWithoutDecimal) {
    
    
                if (number) {
                    $scope.allworkOrderStart = (number - 1) * 5;
                }
    
                $scope.allworkOrderSize = $scope.allworkOrderStart + 5;
                $scope.listOfWorkOrders();
            }
            if (number > $scope.workOrdCountWithoutDecimal) {
    
                growl.error("Work Orders For that Range Does Not Exist");
            }
        }
        //Pagination Code for All Work Order Ends Here

    // fetching list of work orders - created kit from RestAPI OMS
    $scope.listOfWorkOrdersCreatedKit = function(start) {
            var workOrderskitListUrl = baseUrl + "/omsservices/webapi/workorder?workordertype=1&workorderstatus=0";
            workOrderskitListUrl += "&start=" + start + '&size=5&sort=tableWorkOrderDatetime&direction=desc';

            if ($scope.warehouseid) {
                workOrderskitListUrl += "&warehouse=" + $scope.warehouseid;
            }
            if ($scope.startDate) {
                workOrderskitListUrl += "&startDate=" + $scope.startDate;
            }
            if ($scope.endDate) {
                workOrderskitListUrl += "&endDate=" + $scope.endDate;
            }

            $http.get(workOrderskitListUrl).success(function(data) {
                $scope.workOrderkitLists = data;
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
            });
        }
        // list of work orders create kit code ends here

    //Pagination Code for Kit - Work Order
    $scope.startAllWorkOrderKitIncrement = function() {
        var nextVal = $scope.firstWrkOrdKitNo + 5

        if (nextVal > $scope.workOrdKitCountWithoutDecimal) {

            growl.error("Kit - Work Orders For that Range Does Not Exist");
        }
        if (nextVal <= $scope.workOrdKitCountWithoutDecimal) {
            $scope.firstWrkOrdKitNo = $scope.firstWrkOrdKitNo + 5;
            $scope.secWrkOrdKitNo = $scope.secWrkOrdKitNo + 5;
            $scope.thirdWrkOrdKitNo = $scope.thirdWrkOrdKitNo + 5;
            $scope.fourthWrkOrdKitNo = $scope.fourthWrkOrdKitNo + 5;
            $scope.fifthWrkOrdKitNo = $scope.fifthWrkOrdKitNo + 5;


            $scope.allworkOrderKitStart = ($scope.firstWrkOrdKitNo - 1) * 5;
            $scope.allworkOrderKitSize = $scope.allworkOrderKitStart + 5;
            $scope.listOfWorkOrdersCreatedKit();
        }
    }

    $scope.startAllWorkOrderKitDecrement = function() {
        var prevVal = $scope.firstWrkOrdKitNo - 5;

        if (prevVal > $scope.workOrdKitCountWithoutDecimal) {

            growl.error("Kit - Work Orders For that Range Does Not Exist");
        }
        if (prevVal <= $scope.workOrdKitCountWithoutDecimal) {
            $scope.firstWrkOrdKitNo = $scope.firstWrkOrdKitNo - 5;
            $scope.secWrkOrdKitNo = $scope.secWrkOrdKitNo - 5;
            $scope.thirdWrkOrdKitNo = $scope.thirdWrkOrdKitNo - 5;
            $scope.fourthWrkOrdKitNo = $scope.fourthWrkOrdKitNo - 5;
            $scope.fifthWrkOrdKitNo = $scope.fifthWrkOrdKitNo - 5;

            $scope.allworkOrderKitStart = ($scope.firstWrkOrdKitNo - 1) * 5;
            $scope.allworkOrderKitSize = $scope.allworkOrderKitStart + 5;
            $scope.listOfWorkOrdersCreatedKit();
        }
    }

    $scope.zeroWorkOrdKitDec = function() {
        growl.error("Kit - Work Orders For that Range Does Not Exist");
    }

    $scope.callAllWorkOrderKitList = function(number) {


            if (number <= $scope.workOrdKitCountWithoutDecimal) {
    
    
                if (number) {
                    $scope.allworkOrderKitStart = (number - 1) * 5;
                }
    
                $scope.allworkOrderKitSize = $scope.allworkOrderKitStart + 5;
                $scope.listOfWorkOrdersCreatedKit();
            }
            if (number > $scope.workOrdKitCountWithoutDecimal) {
    
                growl.error("Kit - Work Orders For that Range Does Not Exist");
            }
        }
        //Pagination Code for Kit - Work Order Ends Here

    // fetching list of work orders - created split from RestAPI OMS
    $scope.listOfWorkOrdersCreatedSplit = function(start) {
            var workOrderssplitListUrl = baseUrl + "/omsservices/webapi/workorder?workordertype=2&workorderstatus=0";

            workOrderssplitListUrl += "&start=" + start + '&size=5&sort=tableWorkOrderDatetime&direction=desc';

            if ($scope.warehouseid) {
                workOrderssplitListUrl += "&warehouse=" + $scope.warehouseid;
            }
            if ($scope.startDate) {
                workOrderssplitListUrl += "&startDate=" + $scope.startDate;
            }
            if ($scope.endDate) {
                workOrderssplitListUrl += "&endDate=" + $scope.endDate;
            }

            $http.get(workOrderssplitListUrl).success(function(data) {
                $scope.workOrdersplitLists = data;
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
            });
        }
        // list of work orders create split code ends here

    //Pagination Code for Split - Work Order
    $scope.startAllWorkOrderSplitIncrement = function() {
        var nextVal = $scope.firstWrkOrdSplitNo + 5

        if (nextVal > $scope.workOrdSplitCountWithoutDecimal) {

            growl.error("Split - Work Orders For that Range Does Not Exist");
        }
        if (nextVal <= $scope.workOrdSplitCountWithoutDecimal) {
            $scope.firstWrkOrdSplitNo = $scope.firstWrkOrdSplitNo + 5;
            $scope.secWrkOrdSplitNo = $scope.secWrkOrdSplitNo + 5;
            $scope.thirdWrkOrdSplitNo = $scope.thirdWrkOrdSplitNo + 5;
            $scope.fourthWrkOrdSplitNo = $scope.fourthWrkOrdSplitNo + 5;
            $scope.fifthWrkOrdSplitNo = $scope.fifthWrkOrdSplitNo + 5;


            $scope.allworkOrderSplitStart = ($scope.firstWrkOrdSplitNo - 1) * 5;
            $scope.allworkOrderSplitSize = $scope.allworkOrderSplitStart + 5;
            $scope.listOfWorkOrdersCreatedSplit();
        }
    }

    $scope.startAllWorkOrderSplitDecrement = function() {
        var prevVal = $scope.firstWrkOrdSplitNo - 5;

        if (prevVal > $scope.workOrdSplitCountWithoutDecimal) {

            growl.error("Split - Work Orders For that Range Does Not Exist");
        }
        if (prevVal <= $scope.workOrdSplitCountWithoutDecimal) {
            $scope.firstWrkOrdSplitNo = $scope.firstWrkOrdSplitNo - 5;
            $scope.secWrkOrdSplitNo = $scope.secWrkOrdSplitNo - 5;
            $scope.thirdWrkOrdSplitNo = $scope.thirdWrkOrdSplitNo - 5;
            $scope.fourthWrkOrdSplitNo = $scope.fourthWrkOrdSplitNo - 5;
            $scope.fifthWrkOrdSplitNo = $scope.fifthWrkOrdSplitNo - 5;

            $scope.allworkOrderSplitStart = ($scope.firstWrkOrdSplitNo - 1) * 5;
            $scope.allworkOrderSplitSize = $scope.allworkOrderSplitStart + 5;
            $scope.listOfWorkOrdersCreatedSplit();
        }
    }

    $scope.zeroWorkOrdSplitDec = function() {
        growl.error("Split - Work Orders For that Range Does Not Exist");
    }

    $scope.callAllWorkOrderSplitList = function(number) {


            if (number <= $scope.workOrdSplitCountWithoutDecimal) {
    
    
                if (number) {
                    $scope.allworkOrderSplitStart = (number - 1) * 5;
                }
    
                $scope.allworkOrderSplitSize = $scope.allworkOrderSplitStart + 5;
                $scope.listOfWorkOrdersCreatedSplit();
            }
            if (number > $scope.workOrdSplitCountWithoutDecimal) {
    
                growl.error("Split - Work Orders For that Range Does Not Exist");
            }
        }
        //Pagination Code for Split - Work Order Ends Here

    // fetching list of work orders - created free mailer sample from RestAPI OMS
    $scope.listOfWorkOrdersCreatedMailer = function(start) {
            var workOrdersmailerListUrl = baseUrl + "/omsservices/webapi/workorder?workordertype=4&workorderstatus=0";

            workOrdersmailerListUrl += "&start=" + start + '&size=5&sort=tableWorkOrderDatetime&direction=desc';

            if ($scope.warehouseid) {
                workOrdersmailerListUrl += "&warehouse=" + $scope.warehouseid;
            }
            if ($scope.startDate) {
                workOrdersmailerListUrl += "&startDate=" + $scope.startDate;
            }
            if ($scope.endDate) {
                workOrdersmailerListUrl += "&endDate=" + $scope.endDate;
            }

            $http.get(workOrdersmailerListUrl).success(function(data) {
                $scope.workOrdermailerLists = data;
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
            });
        }
        // list of work orders create free mailer sample code ends here

    //Pagination Code for Mailer - Work Order
    $scope.startAllWorkOrderMailerIncrement = function() {
        var nextVal = $scope.firstWrkOrdQcNo + 5

        if (nextVal > $scope.workOrdMailerCountWithoutDecimal) {

            growl.error("Mailer - Work Orders For that Range Does Not Exist");
        }
        if (nextVal <= $scope.workOrdMailerCountWithoutDecimal) {
            $scope.firstWrkOrdMailerNo = $scope.firstWrkOrdMailerNo + 5;
            $scope.secWrkOrdMailerNo = $scope.secWrkOrdMailerNo + 5;
            $scope.thirdWrkOrdMailerNo = $scope.thirdWrkOrdMailerNo + 5;
            $scope.fourthWrkOrdMailerNo = $scope.fourthWrkOrdMailerNo + 5;
            $scope.fifthWrkOrdMailerNo = $scope.fifthWrkOrdMailerNo + 5;


            $scope.allworkOrderMailerStart = ($scope.firstWrkOrdMailerNo - 1) * 5;
            $scope.allworkOrderMailerSize = $scope.allworkOrderMailerStart + 5;
            $scope.listOfWorkOrdersCreatedMailer();
        }
    }

    $scope.startAllWorkOrderMailerDecrement = function() {
        var prevVal = $scope.firstWrkOrdMailerNo - 5;

        if (prevVal > $scope.workOrdMailerCountWithoutDecimal) {

            growl.error("Mailer - Work Orders For that Range Does Not Exist");
        }
        if (prevVal <= $scope.workOrdMailerCountWithoutDecimal) {
            $scope.firstWrkOrdMailerNo = $scope.firstWrkOrdMailerNo - 5;
            $scope.secWrkOrdMailerNo = $scope.secWrkOrdMailerNo - 5;
            $scope.thirdWrkOrdMailerNo = $scope.thirdWrkOrdMailerNo - 5;
            $scope.fourthWrkOrdMailerNo = $scope.fourthWrkOrdMailerNo - 5;
            $scope.fifthWrkOrdMailerNo = $scope.fifthWrkOrdMailerNo - 5;

            $scope.allworkOrderMailerStart = ($scope.firstWrkOrdMailerNo - 1) * 5;
            $scope.allworkOrderMailerSize = $scope.allworkOrderMailerStart + 5;
            $scope.listOfWorkOrdersCreatedMailer();
        }
    }

    $scope.zeroWorkOrdMailerDec = function() {
        growl.error("Mailer - Work Orders For that Range Does Not Exist");
    }

    $scope.callAllWorkOrderMailerList = function(number) {


            if (number <= $scope.workOrdMailerCountWithoutDecimal) {
    
    
                if (number) {
                    $scope.allworkOrderMailerStart = (number - 1) * 5;
                }
    
                $scope.allworkOrderMailerSize = $scope.allworkOrderMailerStart + 5;
                $scope.listOfWorkOrdersCreatedMailer();
            }
            if (number > $scope.workOrdMailerCountWithoutDecimal) {
    
                growl.error("Mailer - Work Orders For that Range Does Not Exist");
            }
        }
        //Pagination Code for Mailer - Work Order Ends Here

    // fetching list of work orders - created qc from RestAPI OMS
    $scope.listOfWorkOrdersCreatedQc = function(start) {
            var workOrdersqcListUrl = baseUrl + "/omsservices/webapi/workorder?workordertype=6&workorderstatus=0";

            workOrdersqcListUrl += "&start=" + start + '&size=5&sort=tableWorkOrderDatetime&direction=desc';

            if ($scope.warehouseid) {
                workOrdersqcListUrl += "&warehouse=" + $scope.warehouseid;
            }
            if ($scope.startDate) {
                workOrdersqcListUrl += "&startDate=" + $scope.startDate;
            }
            if ($scope.endDate) {
                workOrdersqcListUrl += "&endDate=" + $scope.endDate;
            }

            $http.get(workOrdersqcListUrl).success(function(data) {
                $scope.workOrderqcLists = data;
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
            });
        }
        // list of work orders create qc sample code ends here

    //Pagination Code for QC - Work Order
    $scope.startAllWorkOrderQcIncrement = function() {
        var nextVal = $scope.firstWrkOrdQcNo + 5

        if (nextVal > $scope.workOrdQcCountWithoutDecimal) {

            growl.error("QC - Work Orders For that Range Does Not Exist");
        }
        if (nextVal <= $scope.workOrdQcCountWithoutDecimal) {
            $scope.firstWrkOrdQcNo = $scope.firstWrkOrdQcNo + 5;
            $scope.secWrkOrdQcNo = $scope.secWrkOrdQcNo + 5;
            $scope.thirdWrkOrdQcNo = $scope.thirdWrkOrdQcNo + 5;
            $scope.fourthWrkOrdQcNo = $scope.fourthWrkOrdQcNo + 5;
            $scope.fifthWrkOrdQcNo = $scope.fifthWrkOrdQcNo + 5;


            $scope.allworkOrderQcStart = ($scope.firstWrkOrdQcNo - 1) * 5;
            $scope.allworkOrderQcSize = $scope.allworkOrderQcStart + 5;
            $scope.listOfWorkOrdersCreatedQc();
        }
    }

    $scope.startAllWorkOrderQcDecrement = function() {
        var prevVal = $scope.firstWrkOrdQcNo - 5;

        if (prevVal > $scope.workOrdQcCountWithoutDecimal) {

            growl.error("QC - Work Orders For that Range Does Not Exist");
        }
        if (prevVal <= $scope.workOrdQcCountWithoutDecimal) {
            $scope.firstWrkOrdQcNo = $scope.firstWrkOrdQcNo - 5;
            $scope.secWrkOrdQcNo = $scope.secWrkOrdQcNo - 5;
            $scope.thirdWrkOrdQcNo = $scope.thirdWrkOrdQcNo - 5;
            $scope.fourthWrkOrdQcNo = $scope.fourthWrkOrdQcNo - 5;
            $scope.fifthWrkOrdQcNo = $scope.fifthWrkOrdQcNo - 5;


            $scope.allworkOrderQcStart = ($scope.firstWrkOrdQcNo - 1) * 5;
            $scope.allworkOrderQcSize = $scope.allworkOrderQcStart + 5;
            $scope.listOfWorkOrdersCreatedQc();
        }
    }

    $scope.zeroWorkOrdQcDec = function() {
        growl.error("QC - Work Orders For that Range Does Not Exist");
    }

    $scope.callAllWorkOrderQcList = function(number) {


            if (number <= $scope.workOrdQcCountWithoutDecimal) {
    
    
                if (number) {
                    $scope.allworkOrderQcStart = (number - 1) * 5;
                }
    
                $scope.allworkOrderQcSize = $scope.allworkOrderQcStart + 5;
                $scope.listOfWorkOrdersCreatedQc();
            }
            if (number > $scope.workOrdQcCountWithoutDecimal) {
    
                growl.error("QC - Work Orders For that Range Does Not Exist");
            }
        }
        //Pagination Code for QC - Work Order Ends Here

    // fetching list of work orders - created stock from RestAPI OMS
    $scope.listOfWorkOrdersCreatedStock = function(start) {
            var workOrdersstockListUrl = baseUrl + "/omsservices/webapi/workorder?workordertype=7&workorderstatus=0";

            workOrdersstockListUrl += "&start=" + start + '&size=5&sort=tableWorkOrderDatetime&direction=desc';

            if ($scope.warehouseid) {
                workOrdersstockListUrl += "&warehouse=" + $scope.warehouseid;
            }
            if ($scope.startDate) {
                workOrdersstockListUrl += "&startDate=" + $scope.startDate;
            }
            if ($scope.endDate) {
                workOrdersstockListUrl += "&endDate=" + $scope.endDate;
            }

            $http.get(workOrdersstockListUrl).success(function(data) {
                $scope.workOrderstockLists = data;
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
            });
        }
        // list of work orders create stock sample code ends here

    //Pagination Code for Stock - Work Order
    $scope.startAllWorkOrderStockIncrement = function() {
        var nextVal = $scope.firstWrkOrdStockNo + 5

        if (nextVal > $scope.workOrdStockCountWithoutDecimal) {

            growl.error("Stock - Work Orders For that Range Does Not Exist");
        }
        if (nextVal <= $scope.workOrdStockCountWithoutDecimal) {
            $scope.firstWrkOrdStockNo = $scope.firstWrkOrdStockNo + 5;
            $scope.secWrkOrdStockNo = $scope.secWrkOrdStockNo + 5;
            $scope.thirdWrkOrdStockNo = $scope.thirdWrkOrdStockNo + 5;
            $scope.fourthWrkOrdStockNo = $scope.fourthWrkOrdStockNo + 5;
            $scope.fifthWrkOrdStockNo = $scope.fifthWrkOrdStockNo + 5;


            $scope.allworkOrderStockStart = ($scope.firstWrkOrdStockNo - 1) * 5;
            $scope.allworkOrderStockSize = $scope.allworkOrderStockStart + 5;
            $scope.listOfWorkOrdersCreatedStock();
        }
    }

    $scope.startAllWorkOrderStockDecrement = function() {
        var prevVal = $scope.firstWrkOrdStockNo - 5;

        if (prevVal > $scope.workOrdStockCountWithoutDecimal) {

            growl.error("Stock - Work Orders For that Range Does Not Exist");
        }
        if (prevVal <= $scope.workOrdStockCountWithoutDecimal) {
            $scope.firstWrkOrdStockNo = $scope.firstWrkOrdStockNo - 5;
            $scope.secWrkOrdStockNo = $scope.secWrkOrdStockNo - 5;
            $scope.thirdWrkOrdStockNo = $scope.thirdWrkOrdStockNo - 5;
            $scope.fourthWrkOrdStockNo = $scope.fourthWrkOrdStockNo - 5;
            $scope.fifthWrkOrdStockNo = $scope.fifthWrkOrdStockNo - 5;


            $scope.allworkOrderStockStart = ($scope.firstWrkOrdStockNo - 1) * 5;
            $scope.allworkOrderStockSize = $scope.allworkOrderStockStart + 5;
            $scope.listOfWorkOrdersCreatedStock();
        }
    }

    $scope.zeroWorkOrdStockDec = function() {
        growl.error("Stock - Work Orders For that Range Does Not Exist");
    }

    $scope.callAllWorkOrderStockList = function(number) {


            if (number <= $scope.workOrdStockCountWithoutDecimal) {
    
    
                if (number) {
                    $scope.allworkOrderStockStart = (number - 1) * 5;
                }
    
                $scope.allworkOrderStockSize = $scope.allworkOrderStockStart + 5;
                $scope.listOfWorkOrdersCreatedStock();
            }
            if (number > $scope.workOrdStockCountWithoutDecimal) {
    
                growl.error("Stock - Work Orders For that Range Does Not Exist");
            }
        }
        //Pagination Code for Stock - Work Order Ends Here



    // fetching list of work orders - created sticker from RestAPI OMS
    $scope.listOfWorkOrdersCreatedSticker = function(start) {
            var workOrdersstickerListUrl = baseUrl + "/omsservices/webapi/workorder?workordertype=8&workorderstatus=0";

            workOrdersstickerListUrl += "&start=" + start + '&size=5&sort=tableWorkOrderDatetime&direction=desc';

            if ($scope.warehouseid) {
                workOrdersstickerListUrl += "&warehouse=" + $scope.warehouseid;
            }
            if ($scope.startDate) {
                workOrdersstickerListUrl += "&startDate=" + $scope.startDate;
            }
            if ($scope.endDate) {
                workOrdersstickerListUrl += "&endDate=" + $scope.endDate;
            }

            $http.get(workOrdersstickerListUrl).success(function(data) {
                $scope.workOrderstickerLists = data;
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
            });
        }
        // list of work orders create stock sample code ends here

    //Pagination Code for Sticker - Work Order
    $scope.startAllWorkOrderStickerIncrement = function() {
        var nextVal = $scope.firstWrkOrdStickerNo + 5

        if (nextVal > $scope.workOrdStickerCountWithoutDecimal) {

            growl.error("Sticker - Work Orders For that Range Does Not Exist");
        }
        if (nextVal <= $scope.workOrdStickerCountWithoutDecimal) {
            $scope.firstWrkOrdStickerNo = $scope.firstWrkOrdStickerNo + 5;
            $scope.secWrkOrdStickerNo = $scope.secWrkOrdStickerNo + 5;
            $scope.thirdWrkOrdStickerNo = $scope.thirdWrkOrdStickerNo + 5;
            $scope.fourthWrkOrdStickerNo = $scope.fourthWrkOrdStickerNo + 5;
            $scope.fifthWrkOrdStickerNo = $scope.fifthWrkOrdStickerNo + 5;


            $scope.allworkOrderStickerStart = ($scope.firstWrkOrdStickerNo - 1) * 5;
            $scope.allworkOrderStickerSize = $scope.allworkOrderStickerStart + 5;
            $scope.listOfWorkOrdersCreatedSticker();
        }
    }

    $scope.startAllWorkOrderStickerDecrement = function() {
        var prevVal = $scope.firstWrkOrdStickerNo - 5;

        if (prevVal > $scope.workOrdStickerCountWithoutDecimal) {

            growl.error("Sticker - Work Orders For that Range Does Not Exist");
        }
        if (prevVal <= $scope.workOrdStickerCountWithoutDecimal) {
            $scope.firstWrkOrdStickerNo = $scope.firstWrkOrdStickerNo - 5;
            $scope.secWrkOrdStickerNo = $scope.secWrkOrdStickerNo - 5;
            $scope.thirdWrkOrdStickerNo = $scope.thirdWrkOrdStickerNo - 5;
            $scope.fourthWrkOrdStickerNo = $scope.fourthWrkOrdStickerNo - 5;
            $scope.fifthWrkOrdStickerNo = $scope.fifthWrkOrdStickerNo - 5;


            $scope.allworkOrderStickerStart = ($scope.firstWrkOrdStickerNo - 1) * 5;
            $scope.allworkOrderStickerSize = $scope.allworkOrderStickerStart + 5;
            $scope.listOfWorkOrdersCreatedSticker();
        }
    }

    $scope.zeroWorkOrdStickerDec = function() {
        growl.error("Sticker - Work Orders For that Range Does Not Exist");
    }

    $scope.callAllWorkOrderStickerList = function(number) {


            if (number <= $scope.workOrdStickerCountWithoutDecimal) {
    
    
                if (number) {
                    $scope.allworkOrderStickerStart = (number - 1) * 5;
                }
    
                $scope.allworkOrderStickerSize = $scope.allworkOrderStickerStart + 5;
                $scope.listOfWorkOrdersCreatedSticker();
            }
            if (number > $scope.workOrdStickerCountWithoutDecimal) {
    
                growl.error("Sticker - Work Orders For that Range Does Not Exist");
            }
        }
        //Pagination Code for Stock - Work Order Ends Here





    // dialog box to add new inventory
    $scope.showAdvanced = function(ev) {
        $scope.callMainMinStartMaxStart();
        $mdDialog.show({
            templateUrl: 'dialog1.tmpl.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: false,
            scope: $scope.$new()
        }).then(function(answer) {
            $scope.status = 'You said the information was "' + answer + '".';
        }, function() {
            $scope.status = 'You cancelled the dialog.';
        });
        $scope.validAvblQty = false;
    };

    // dialog box to add new stock transfer
    $scope.showStockTransferDialog = function(ev) {
        $mdDialog.show({
                templateUrl: 'addEditStockTransfer.tmpl.html',
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

    //dialog box to show work order types
    $scope.showWorkOrderTypes = function(ev) {
        $scope.radio = "";
        var workOrderTypeUrl = baseUrl + "/omsservices/webapi/workordertypes";
        $http.get(workOrderTypeUrl).success(function(data) {
            $scope.workOrdersTypes = data;

        }).error(function(error, status) {


            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
        });

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

    $scope.onvalue = function(radio) {
        $scope.radio = JSON.parse(radio);
    };

    $scope.selectWorkOrderTypeAction = function(radio, ev) {
        $mdDialog.hide();
        if (radio == 1) {
            $scope.showAddKitDialog(ev);
        }
        if (radio == 2) {
            $scope.showAddSplitDialog(ev);
        }
        if (radio == 4) {
            $scope.showAddFreeMailerDialog(ev);
        }
        if (radio == 6) {
            $scope.showAddQcDialog(ev);
        }
        if (radio == 7) {
            $scope.showAddStockDialog(ev);
        }
        if (radio == 8) {
            $scope.showAddStickerDialog(ev);
        }
    };

    $scope.cancelWorkOrderType = function() {
        $mdDialog.hide();
    };
    // dialog box to add new kit
    $scope.showAddKitDialog = function(ev) {
        $scope.callMinStartMaxStart();
        $scope.startmaxDate = "";
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
    };

    // dialog box to add new split
    $scope.showAddSplitDialog = function(ev) {
        $scope.callMinStartMaxStart();
        $scope.startmaxDate = "";
        $mdDialog.show({
                templateUrl: 'dialog4.tmpl.html',
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

    // dialog box to add new free mailer
    $scope.showAddFreeMailerDialog = function(ev) {
        $scope.callMinStartMaxStart();
        $scope.startmaxDate = "";
        $mdDialog.show({
                templateUrl: 'dialog5.tmpl.html',
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

    // dialog box to add new QC
    $scope.showAddQcDialog = function(ev) {
        $scope.callMinStartMaxStart();
        $scope.startmaxDate = "";
        $mdDialog.show({
                templateUrl: 'dialog6.tmpl.html',
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

    // dialog box to add new Stock Audit
    $scope.showAddStockDialog = function(ev) {
        $scope.callMinStartMaxStart();
        $scope.startmaxDate = "";
        $mdDialog.show({
                templateUrl: 'dialog7.tmpl.html',
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

    $scope.showAddStickerDialog = function(ev) {
        $scope.callMinStartMaxStart();
        $scope.loadStickerTemplates();
        $scope.startmaxDate = "";
        $mdDialog.show({
                templateUrl: 'dialog8.tmpl.html',
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

    //add inventory dialog box code ends here

    $scope.hide = function() {
        $mdDialog.hide();
    };
    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.toggleInvSearchRow = function() {
        $scope.searchInventoryClicked = !$scope.searchInventoryClicked;
    };

    $scope.toggleWOSearchRow = function() {
        $scope.searchWorkOrderClicked = !$scope.searchWorkOrderClicked;
    };

    $scope.togglKitSearchRow = function() {
        $scope.searchWorkOrderKitClicked = !$scope.searchWorkOrderKitClicked;
    };

    $scope.toggleSplitSearchRow = function() {
        $scope.searchWorkOrderSplitClicked = !$scope.searchWorkOrderSplitClicked;
    };

    $scope.toggleMailerSearchRow = function() {
        $scope.searchWorkOrderMailerClicked = !$scope.searchWorkOrderMailerClicked;
    };

    $scope.toggleQcSearchRow = function() {
        $scope.searchWorkOrderQcClicked = !$scope.searchWorkOrderQcClicked;
    };

    $scope.toggleStockSearchRow = function() {
        $scope.searchWorkOrderStockClicked = !$scope.searchWorkOrderStockClicked;
    };

    $scope.toggleStickerSearchRow = function() {
        $scope.searchWorkOrderStickerClicked = !$scope.searchWorkOrderStickerClicked;
    };

    // getting the list of warehouses from backend
    $scope.getWarehouses = function() {
        $scope.wareHousesData = [];
        var warehouseUrl = baseUrl + "/omsservices/webapi/warehouses";
        $http.get(warehouseUrl).success(function(data) {
            for (var i = 0; i < data.length; i++) {
                $scope.wareHousesData.push(data[i]);
            }
        }).error(function(error, status) {


            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
        });
    };
    //getting warehouses list ends here

    // getting the list of vendors from backend
    $scope.getVendors = function() {
        $scope.vendorsData = [];
        var vendorsUrl = baseUrl + "/omsservices/webapi/vendors";
        $http.get(vendorsUrl).success(function(data) {
            for (var i = 0; i < data.length; i++) {
                $scope.vendorsData.push(data[i]);
            }
        }).error(function(error, status) {


            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
        });
    };
    //getting warehouses list ends here

    // add inventory code using restOMS Api of inventory
    $scope.addInventory = function(inventoryData) {
        if (!inventoryData.tableSkuInventoryAvailableCount || inventoryData.tableSkuInventoryAvailableCount == 0) {
            $scope.validAvblQty = true;
            growl.error("Please enter a valid available quantity");
        } else {
            var mfgDate = "";
            var expDate = "";
            if (inventoryData.tableSkuInventoryMfgDate != null) {
                mfgDate = dateFormat(new Date(inventoryData.tableSkuInventoryMfgDate), 'yyyy-mm-dd');
            }
            if (inventoryData.tableSkuInventoryExpiryDate != null) {
                expDate = dateFormat(new Date(inventoryData.tableSkuInventoryExpiryDate), 'yyyy-mm-dd');
            }

            var postInventoryData = {
                "idtableSkuInventoryId": 1,
                "tableSkuInventoryMaxRetailPrice": parseInt(inventoryData.tableSkuInventoryMaxRetailPrice),
                "tableSkuInventoryBatchNo": inventoryData.tableSkuInventoryBatchNo,
                "tableSkuInventoryMfgDate": mfgDate,
                "tableSkuInventoryExpiryDate": expDate,
                "tableSkuInventoryShelfLifeInDays": parseInt(inventoryData.tableSkuInventoryShelfLifeInDays),
                "tableSkuInventoryMinSalePrice": parseInt(inventoryData.tableSkuInventoryMinSalePrice),
                "tableSkuInventoryAvailableCount": parseInt(inventoryData.tableSkuInventoryAvailableCount),
                "tableSkuInventoryInwardQcFailedCount": parseInt(inventoryData.tableSkuInventoryInwardQcFailedCount),
                "tableSku": inventoryData.tableSku,
                "tableWarehouseDetails": JSON.parse(inventoryData.tableWarehouseDetails),
                "tableWorkOrders": [],
                "tableSaleOrderSkuInventoryMaps": []
            }
            if (inventoryData.tableVendor != undefined) {
                postInventoryData.tableVendor = JSON.parse(inventoryData.tableVendor);
            }

            $http({
                method: 'POST',
                url: baseUrl + '/omsservices/webapi/inventory',
                data: postInventoryData,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(res) {
                if (res) {
                    growl.success("Inventory Added Successfully");
                    $scope.inventoryData = null;
                    postInventoryData = null;
                    // $scope.listOfInventories();
                    $scope.listOfInventoriesCount($scope.vmPager.currentPage);
                    $scope.mode = 'add';
                    $mdDialog.hide();
                }
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
                growl.error("Inventory Cannot be Added");
            });
        }
    };

    $scope.updateInventory = function(inventoryData) {
        inventoryData.tableSkuInventoryAvailableCount = inventoryData.tableSkuInventoryAvailableCount - inventoryData.tableSkuInventoryBlockedCount;
        var putInventoryData = inventoryData;
        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/inventory/' + inventoryData.idtableSkuInventoryId,
            data: putInventoryData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            if (res) {
                growl.success("Inventory Updated Successfully");
                $scope.inventoryData = null;
                postInventoryData = null;
                // $scope.listOfInventories();
                $scope.listOfInventoriesCount($scope.vmPager.currentPage);
                $scope.mode = 'add';
                $mdDialog.hide();
            }
        }).error(function(error, status) {


            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
            growl.error("Inventory Cannot be Updated");
        });
    };

    // edit inventory code using restOMS Api of inventory
    $scope.editInventory = function(ev, id) {
        $scope.mode = 'edit';
        $http.get(baseUrl + '/omsservices/webapi/inventory/' + id).success(function(response) {

            $scope.inventoryData = response;
            $scope.tableWareHouseName = response.tableWarehouseDetails.tableWarehouseDetailsShortname;
            $scope.skuShelfType = response.tableSku.tableSkuShelfLifeType.idtableSkuShelfLifeTypeId;
            if (response.tableVendor != null) {
                $scope.tableVendorName = response.tableVendor.tableVendorName;
            }
            $scope.productName = response.tableSku.tableSkuName;
            $scope.productId = response.tableSku.tableSkuClientSkuCode;
            if ($scope.inventoryData != null) {
                $("blockQu").focus();
                $scope.showAdvanced(ev);
            }
        });
    };

    //cancel - closing inventory Dialog
    $scope.cancelInventory = function() {
        $scope.availableQuantityMode = false;
        $scope.wData = null;
        $scope.inventoryData = "";
        $scope.kitData = "";
        $scope.splitData = "";
        $scope.freeMailerData = "";
        $scope.qcData = "";
        $scope.stockData = "";
        $scope.stickerData = "";
        $scope.initialSelected = "";
        $scope.freeMailertableWorkOrderSkuQuantity = "";
        $scope.initialSelected1 = "";
        $scope.selectedList = "";
        $scope.invStickerLists = "";
        $scope.radio = "";
        $scope.skuId = "";
        $scope.mode = 'add';
        $scope.dialogBoxKit = 'add';
        $scope.dialogBoxSplit = 'add';
        $scope.dialogBoxFreeMailer = 'add';
        $scope.dialogBoxQC = 'add';
        $scope.dialogBoxStock = 'add';
        $scope.dialogBoxSticker = 'add';
        $scope.products = [];
        $mdDialog.hide();
    };

    // add kit - work order code using restOMS Api of work order
    $scope.addKitData = function(kitData) {
        var tableWorkOrderSkus = [];
        tableWorkOrderSkus.push({
            tableSku: $scope.productObj
        });
        var yearStart = dateFormat(new Date(kitData.tableWorkOrderScheduledDatetime), 'yyyy');
        var monthStart = dateFormat(new Date(kitData.tableWorkOrderScheduledDatetime), 'mm');
        var dateStart = dateFormat(new Date(kitData.tableWorkOrderScheduledDatetime), 'dd');
        var hoursStart = dateFormat(new Date(), 'HH');
        var minStart = dateFormat(new Date(), 'MM');
        var secStart = dateFormat(new Date(), 'ss');

        var yearEnd = dateFormat(new Date(kitData.tableWorkOrderScheduledEndDatetime), 'yyyy');
        var monthEnd = dateFormat(new Date(kitData.tableWorkOrderScheduledEndDatetime), 'mm');
        var dateEnd = dateFormat(new Date(kitData.tableWorkOrderScheduledEndDatetime), 'dd');
        var hoursEnd = dateFormat(new Date(), 'HH');
        var minEnd = dateFormat(new Date(), 'MM');
        var secEnd = dateFormat(new Date(), 'ss');

        var postKitData = {
            "tableWorkOrderSkuQuantity": kitData.tableWorkOrderSkuQuantity,
            "tableWarehouseDetails": kitData.tableWarehouseDetails,
            "tableWorkOrderSkus": tableWorkOrderSkus,
            "tableWorkOrderType": {
                "idtableWorkOrderTypeId": 1,
                "tableWorkOrderTypeString": "Kit"
            },
            "tableWorkOrderStatusType": {
                "idtableWorkOrderStatusTypeId": 1,
                "tableWorkOrderStatusTypeString": "New"
            },
            "tableWorkOrderStateTrails": []
        }

        postKitData.tableWorkOrderScheduledDatetime = [
            parseInt(yearStart),
            parseInt(monthStart),
            parseInt(dateStart),
            parseInt(hoursStart),
            parseInt(minStart),
            parseInt(secStart)
        ]

        postKitData.tableWorkOrderScheduledEndDatetime = [
            parseInt(yearEnd),
            parseInt(monthEnd),
            parseInt(dateEnd),
            parseInt(hoursEnd),
            parseInt(minEnd),
            parseInt(secEnd)
        ]

        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/workorder',
            data: postKitData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            if (res) {
                growl.success("Work Order - Kit Created Successfully");
                $scope.kitData = null;
                postKitData = null;
                $scope.skuId = null;
                // $scope.listOfWorkOrdersCreatedKit();
                $scope.listOfWorkOrderKitCount($scope.vmPagerWoKitStart.currentPage);
                // $scope.listOfWorkOrders();
                $scope.listOfWorkOrderCount($scope.vmPagerWoStart.currentPage);
                $scope.dialogBoxKit = 'add';
                $mdDialog.hide();
            }
        }).error(function(error, status) {


            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
            growl.error("Work Order - Kit cannot be added");
        });
    };

    // edit kit code using restOMS Api of inventory
    $scope.updateKitData = function(kitData, kitId) {
        var tableWorkOrderSkus = [];
        tableWorkOrderSkus.push({
            idtableWorkOrderSkuId: $scope.idtableWorkOrderSkuId,
            tableSku: $scope.productObj
        });
        var yearStart = dateFormat(new Date(kitData.tableWorkOrderScheduledDatetime), 'yyyy');
        var monthStart = dateFormat(new Date(kitData.tableWorkOrderScheduledDatetime), 'mm');
        var dateStart = dateFormat(new Date(kitData.tableWorkOrderScheduledDatetime), 'dd');
        var hoursStart = dateFormat(new Date(), 'HH');
        var minStart = dateFormat(new Date(), 'MM');
        var secStart = dateFormat(new Date(), 'ss');

        var yearEnd = dateFormat(new Date(kitData.tableWorkOrderScheduledEndDatetime), 'yyyy');
        var monthEnd = dateFormat(new Date(kitData.tableWorkOrderScheduledEndDatetime), 'mm');
        var dateEnd = dateFormat(new Date(kitData.tableWorkOrderScheduledEndDatetime), 'dd');
        var hoursEnd = dateFormat(new Date(), 'HH');
        var minEnd = dateFormat(new Date(), 'MM');
        var secEnd = dateFormat(new Date(), 'ss');

        var putKitData = kitData;
        putKitData.tableWorkOrderSkus = tableWorkOrderSkus;
        putKitData.tableWorkOrderScheduledDatetime = [
            parseInt(yearStart),
            parseInt(monthStart),
            parseInt(dateStart),
            parseInt(hoursStart),
            parseInt(minStart),
            parseInt(secStart)
        ]

        putKitData.tableWorkOrderScheduledEndDatetime = [
            parseInt(yearEnd),
            parseInt(monthEnd),
            parseInt(dateEnd),
            parseInt(hoursEnd),
            parseInt(minEnd),
            parseInt(secEnd)
        ]

        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/workorder/' + kitId,
            data: putKitData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            if (res) {
    
                growl.success("Work Order - Kit Updated Successfully");
                $scope.kitData = "";
                postKitData = null;
                $scope.skuId = null;
                // $scope.listOfWorkOrdersCreatedKit();
                $scope.listOfWorkOrderKitCount($scope.vmPagerWoKitStart.currentPage);
                // $scope.listOfWorkOrders();
                $scope.listOfWorkOrderCount($scope.vmPagerWoStart.currentPage);
                $scope.dialogBoxKit = 'add';
                $mdDialog.hide();
            }
        }).error(function(error, status) {


            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
            $scope.dialogBoxSplit = 'add';
            growl.error("Work Order - Kit cannot be updated");
            $mdDialog.hide();
        });
    };

    // add split - work order code using restOMS Api of work order
    $scope.addSplitData = function(splitData) {
        var tableWorkOrderSkus = [];
        tableWorkOrderSkus.push({
            tableSku: $scope.productObj
        });
        var yearStart = dateFormat(new Date(splitData.tableWorkOrderScheduledDatetime), 'yyyy');
        var monthStart = dateFormat(new Date(splitData.tableWorkOrderScheduledDatetime), 'mm');
        var dateStart = dateFormat(new Date(splitData.tableWorkOrderScheduledDatetime), 'dd');
        var hoursStart = dateFormat(new Date(), 'HH');
        var minStart = dateFormat(new Date(), 'MM');
        var secStart = dateFormat(new Date(), 'ss');

        var yearEnd = dateFormat(new Date(splitData.tableWorkOrderScheduledEndDatetime), 'yyyy');
        var monthEnd = dateFormat(new Date(splitData.tableWorkOrderScheduledEndDatetime), 'mm');
        var dateEnd = dateFormat(new Date(splitData.tableWorkOrderScheduledEndDatetime), 'dd');
        var hoursEnd = dateFormat(new Date(), 'HH');
        var minEnd = dateFormat(new Date(), 'MM');
        var secEnd = dateFormat(new Date(), 'ss');

        var postSplitData = {
            "tableWorkOrderSkuQuantity": splitData.tableWorkOrderSkuQuantity,
            "tableWarehouseDetails": splitData.tableWarehouseDetails,
            "tableWorkOrderSkus": tableWorkOrderSkus,
            "tableWorkOrderType": {
                "idtableWorkOrderTypeId": 2,
                "tableWorkOrderTypeString": "Split"
            },
            "tableWorkOrderStatusType": {
                "idtableWorkOrderStatusTypeId": 1,
                "tableWorkOrderStatusTypeString": "New"
            },
            "tableWorkOrderStateTrails": []
        }

        postSplitData.tableWorkOrderScheduledDatetime = [
            parseInt(yearStart),
            parseInt(monthStart),
            parseInt(dateStart),
            parseInt(hoursStart),
            parseInt(minStart),
            parseInt(secStart)
        ]

        postSplitData.tableWorkOrderScheduledEndDatetime = [
            parseInt(yearEnd),
            parseInt(monthEnd),
            parseInt(dateEnd),
            parseInt(hoursEnd),
            parseInt(minEnd),
            parseInt(secEnd)
        ]
        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/workorder',
            data: postSplitData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            if (res) {
                growl.success("Work Order - Split Created Successfully");
                $scope.splitData = null;
                postSplitData = null;
                $scope.skuId = null;
                // $scope.listOfWorkOrdersCreatedSplit();
                $scope.listOfWorkOrderSplitCount($scope.vmPagerWoSplitStart.currentPage);
                // $scope.listOfWorkOrders();
                $scope.listOfWorkOrderCount($scope.vmPagerWoStart.currentPage);
                $scope.mode = 'add';
                $mdDialog.hide();
            }
        }).error(function(error, status) {


            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
            growl.error("Work Order - Kit cannot be added");
        });
    };

    // edit split code using restOMS Api of inventory
    $scope.updateSplitData = function(splitData, splitId) {
        var tableWorkOrderSkus = [];
        tableWorkOrderSkus.push({
            idtableWorkOrderSkuId: $scope.idtableWorkOrderSkuId,
            tableSku: $scope.productObj
        });
        var yearStart = dateFormat(new Date(splitData.tableWorkOrderScheduledDatetime), 'yyyy');
        var monthStart = dateFormat(new Date(splitData.tableWorkOrderScheduledDatetime), 'mm');
        var dateStart = dateFormat(new Date(splitData.tableWorkOrderScheduledDatetime), 'dd');
        var hoursStart = dateFormat(new Date(), 'HH');
        var minStart = dateFormat(new Date(), 'MM');
        var secStart = dateFormat(new Date(), 'ss');

        var yearEnd = dateFormat(new Date(splitData.tableWorkOrderScheduledEndDatetime), 'yyyy');
        var monthEnd = dateFormat(new Date(splitData.tableWorkOrderScheduledEndDatetime), 'mm');
        var dateEnd = dateFormat(new Date(splitData.tableWorkOrderScheduledEndDatetime), 'dd');
        var hoursEnd = dateFormat(new Date(), 'HH');
        var minEnd = dateFormat(new Date(), 'MM');
        var secEnd = dateFormat(new Date(), 'ss');

        var putSplitData = splitData;
        putSplitData.tableWorkOrderSkus = tableWorkOrderSkus;
        putSplitData.tableWorkOrderScheduledDatetime = [
            parseInt(yearStart),
            parseInt(monthStart),
            parseInt(dateStart),
            parseInt(hoursStart),
            parseInt(minStart),
            parseInt(secStart)
        ]

        putSplitData.tableWorkOrderScheduledEndDatetime = [
            parseInt(yearEnd),
            parseInt(monthEnd),
            parseInt(dateEnd),
            parseInt(hoursEnd),
            parseInt(minEnd),
            parseInt(secEnd)
        ]

        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/workorder/' + splitId,
            data: putSplitData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            if (res) {
    
                growl.success("Work Order - Split Updated Successfully");
                $scope.splitData = "";
                postSplitData = null;
                $scope.skuId = null;
                // $scope.listOfWorkOrdersCreatedSplit();
                $scope.listOfWorkOrderSplitCount($scope.vmPagerWoSplitStart.currentPage);
                // $scope.listOfWorkOrders();
                $scope.listOfWorkOrderCount($scope.vmPagerWoStart.currentPage);
                $scope.dialogBoxSplit = 'add';
                $mdDialog.hide();
            }
        }).error(function(error, status) {


            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
            $scope.dialogBoxSplit = 'add';
            growl.error("Work Order - Split cannot be updated");
            $mdDialog.hide();
        });
    };

    //Available Quantity Function to get data base on sku id and warehouse id
    $scope.availableQuantity = function(wareHousesData, skuid) {
        if (wareHousesData != null && skuid != null) {
            var wData = wareHousesData;

            $http.get(baseUrl + '/omsservices/webapi/warehouses/' + wData.idtableWarehouseDetailsId + '/skus/' + skuid + '/inventory/inventorycount').success(function(response) {
    
                if (response != null) {
                    $scope.availableQuantityMode = true;
                    $scope.freeMailertableWorkOrderSkuQuantity = response;
                }
                if (response == null || response == '') {
                    $scope.availableQuantityMode = false;
                }
            });
        }
    };


    $scope.checkQuantityAvail = function(quantity, availableQuantity) {
        if (quantity > availableQuantity) {
            growl.error("Please Enter Quantity which is less than or equal to Available Quantity");
            $scope.isDisabled = true;
        }
        if (quantity <= availableQuantity) {
            $scope.isDisabled = false;
        }
    }

    $scope.nullQuantity = function() {
        $scope.freeMailertableWorkOrderSkuQuantity = null;
    };

    // add split - work order code using restOMS Api of work order
    $scope.addfreeMailerData = function(freeMailerData, freeMailerQuantity) {
        var tableWorkOrderSkus = [];
        tableWorkOrderSkus.push({
            tableSku: $scope.productObj
        });
        tableWorkOrderSkus.push({
            tableSku: $scope.mailerObj
        });
        var yearStart = dateFormat(new Date(freeMailerData.tableWorkOrderScheduledDatetime), 'yyyy');
        var monthStart = dateFormat(new Date(freeMailerData.tableWorkOrderScheduledDatetime), 'mm');
        var dateStart = dateFormat(new Date(freeMailerData.tableWorkOrderScheduledDatetime), 'dd');
        var hoursStart = dateFormat(new Date(), 'HH');
        var minStart = dateFormat(new Date(), 'MM');
        var secStart = dateFormat(new Date(), 'ss');

        var yearEnd = dateFormat(new Date(freeMailerData.tableWorkOrderScheduledEndDatetime), 'yyyy');
        var monthEnd = dateFormat(new Date(freeMailerData.tableWorkOrderScheduledEndDatetime), 'mm');
        var dateEnd = dateFormat(new Date(freeMailerData.tableWorkOrderScheduledEndDatetime), 'dd');
        var hoursEnd = dateFormat(new Date(), 'HH');
        var minEnd = dateFormat(new Date(), 'MM');
        var secEnd = dateFormat(new Date(), 'ss');

        var postfreeMailerData = {
            "tableWorkOrderSkuQuantity": parseInt(freeMailerQuantity),
            "tableWarehouseDetails": freeMailerData.tableWarehouseDetails,
            "tableWorkOrderSkus": tableWorkOrderSkus,
            "tableSkuInventory": null,
            "tableWorkOrderStatusType": {
                "idtableWorkOrderStatusTypeId": 1,
                "tableWorkOrderStatusTypeString": "New"
            },
            "tableWorkOrderType": {
                "idtableWorkOrderTypeId": 4,
                "tableWorkOrderTypeString": "Free Mailers"
            },
            "tableWorkOrderStateTrails": []
        }

        postfreeMailerData.tableWorkOrderScheduledDatetime = [
            parseInt(yearStart),
            parseInt(monthStart),
            parseInt(dateStart),
            parseInt(hoursStart),
            parseInt(minStart),
            parseInt(secStart)
        ]

        postfreeMailerData.tableWorkOrderScheduledEndDatetime = [
            parseInt(yearEnd),
            parseInt(monthEnd),
            parseInt(dateEnd),
            parseInt(hoursEnd),
            parseInt(minEnd),
            parseInt(secEnd)
        ]

        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/workorder',
            data: postfreeMailerData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            if (res) {
                growl.success("Work Order - Free Mailer Created Successfully");
                $scope.freeMailerData = null;
                freeMailerData = null;
                $scope.skuId = null;
                // $scope.listOfWorkOrdersCreatedMailer();
                $scope.listOfWorkOrderMailerCount($scope.vmPagerWoMailerStart.currentPage);
                // $scope.listOfWorkOrders();
                $scope.listOfWorkOrderCount($scope.vmPagerWoStart.currentPage);
                $scope.mode = 'add';
                $mdDialog.hide();
            }
        }).error(function(error, status) {


            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
            growl.error("Work Order - Free Mailer cannot be added");
        });
    };

    // edit mailer code using restOMS Api of inventory
    $scope.updatefreeMailerData = function(freeMailerData, freeMailerQuantity, freeMailerId) {
        var tableWorkOrderSkus = [];
        tableWorkOrderSkus.push({
            idtableWorkOrderSkuId: $scope.idtableWorkOrderSkuId,
            tableSku: $scope.productObj
        });
        tableWorkOrderSkus.push({
            idtableWorkOrderSkuId: $scope.idtableWorkOrderSkuId1,
            tableSku: $scope.mailerObj
        });
        var yearStart = dateFormat(new Date(freeMailerData.tableWorkOrderScheduledDatetime), 'yyyy');
        var monthStart = dateFormat(new Date(freeMailerData.tableWorkOrderScheduledDatetime), 'mm');
        var dateStart = dateFormat(new Date(freeMailerData.tableWorkOrderScheduledDatetime), 'dd');
        var hoursStart = dateFormat(new Date(), 'HH');
        var minStart = dateFormat(new Date(), 'MM');
        var secStart = dateFormat(new Date(), 'ss');

        var yearEnd = dateFormat(new Date(freeMailerData.tableWorkOrderScheduledEndDatetime), 'yyyy');
        var monthEnd = dateFormat(new Date(freeMailerData.tableWorkOrderScheduledEndDatetime), 'mm');
        var dateEnd = dateFormat(new Date(freeMailerData.tableWorkOrderScheduledEndDatetime), 'dd');
        var hoursEnd = dateFormat(new Date(), 'HH');
        var minEnd = dateFormat(new Date(), 'MM');
        var secEnd = dateFormat(new Date(), 'ss');

        var putMailerData = freeMailerData;

        putMailerData.tableWorkOrderSkus = tableWorkOrderSkus;
        putMailerData.tableWorkOrderScheduledDatetime = [
            parseInt(yearStart),
            parseInt(monthStart),
            parseInt(dateStart),
            parseInt(hoursStart),
            parseInt(minStart),
            parseInt(secStart)
        ]

        putMailerData.tableWorkOrderScheduledEndDatetime = [
            parseInt(yearEnd),
            parseInt(monthEnd),
            parseInt(dateEnd),
            parseInt(hoursEnd),
            parseInt(minEnd),
            parseInt(secEnd)
        ]

        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/workorder/' + freeMailerId,
            data: putMailerData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            if (res) {
    
                growl.success("Work Order - Free Mailer Updated Successfully");
                $scope.freeMailerData = "";
                putMailerData = null;
                $scope.skuId = null;
                // $scope.listOfWorkOrdersCreatedMailer();
                $scope.listOfWorkOrderMailerCount($scope.vmPagerWoMailerStart.currentPage);
                // $scope.listOfWorkOrders();
                $scope.listOfWorkOrderCount($scope.vmPagerWoStart.currentPage);
                $scope.dialogBoxFreeMailer = 'add';
                $mdDialog.hide();
            }
        }).error(function(error, status) {


            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
            $scope.dialogBoxFreeMailer = 'add';
            growl.error("Work Order - Free Mailer cannot be updated");
            $mdDialog.hide();
        });
    };

    $scope.qcTrueLists = function() {
        $scope.optionsList = [];
        $http.get(baseUrl + '/omsservices/webapi/skuqctypes').success(function(response) {
            for (var i = 0; i < response.length; i++) {
                if (response[i].tableSkuQcParameterTypeIsAdditional == true) {
                    $scope.optionsList.push(response[i].tableSkuQcParameterTypeString);
                }
            }
        });
    };

    $scope.addQcData = function(qcData, selectList) {
        var arr = [];
        for (var i = 0; i < selectList.length; i++) {
            arr.push(selectList[i])
        }

        var a = arr.join("|");


        var tableWorkOrderSkus = [];
        tableWorkOrderSkus.push({
            tableSku: $scope.productObj
        });
        var yearStart = dateFormat(new Date(qcData.tableWorkOrderScheduledDatetime), 'yyyy');
        var monthStart = dateFormat(new Date(qcData.tableWorkOrderScheduledDatetime), 'mm');
        var dateStart = dateFormat(new Date(qcData.tableWorkOrderScheduledDatetime), 'dd');
        var hoursStart = dateFormat(new Date(), 'HH');
        var minStart = dateFormat(new Date(), 'MM');
        var secStart = dateFormat(new Date(), 'ss');

        var yearEnd = dateFormat(new Date(qcData.tableWorkOrderScheduledEndDatetime), 'yyyy');
        var monthEnd = dateFormat(new Date(qcData.tableWorkOrderScheduledEndDatetime), 'mm');
        var dateEnd = dateFormat(new Date(qcData.tableWorkOrderScheduledEndDatetime), 'dd');
        var hoursEnd = dateFormat(new Date(), 'HH');
        var minEnd = dateFormat(new Date(), 'MM');
        var secEnd = dateFormat(new Date(), 'ss');

        var postqcData = {
            "tableWorkOrderSkuQuantity": qcData.tableWorkOrderSkuQuantity,
            "tableWorkOrderSkus": tableWorkOrderSkus,
            "tableSkuInventory": null,
            "tableWorkOrderStatusType": {
                "idtableWorkOrderStatusTypeId": 1,
                "tableWorkOrderStatusTypeString": "New"
            },
            "tableWorkOrderAdditionalQc": a,
            "tableWorkOrderType": {
                "idtableWorkOrderTypeId": 6,
                "tableWorkOrderTypeString": "QC"
            },
            "tableWorkOrderStateTrails": []
        }

        postqcData.tableWorkOrderScheduledDatetime = [
            parseInt(yearStart),
            parseInt(monthStart),
            parseInt(dateStart),
            parseInt(hoursStart),
            parseInt(minStart),
            parseInt(secStart)
        ]

        postqcData.tableWorkOrderScheduledEndDatetime = [
            parseInt(yearEnd),
            parseInt(monthEnd),
            parseInt(dateEnd),
            parseInt(hoursEnd),
            parseInt(minEnd),
            parseInt(secEnd)
        ]

        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/workorder',
            data: postqcData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            if (res) {
                growl.success("Work Order - QC Created Successfully");
                $scope.qcData = null;
                qcData = null;
                $scope.skuId = null;
                // $scope.listOfWorkOrdersCreatedQc();
                $scope.listOfWorkOrderQcCount($scope.vmPagerWoQcStart.currentPage);
                // $scope.listOfWorkOrders();
                $scope.listOfWorkOrderCount($scope.vmPagerWoStart.currentPage);
                $scope.mode = 'add';
                $mdDialog.hide();
            }
        }).error(function(error, status) {


            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
            growl.error("Work Order - QC cannot be created");
        });
    };

    //update qc data back to oms
    $scope.updateQcData = function(qcData, selectList, qcId) {
        var arr = [];
        for (var i = 0; i < selectList.length; i++) {
            arr.push(selectList[i])
        }

        var a = arr.join("|");


        var tableWorkOrderSkus = [];
        tableWorkOrderSkus.push({
            idtableWorkOrderSkuId: $scope.idtableWorkOrderSkuId,
            tableSku: $scope.productObj
        });
        var yearStart = dateFormat(new Date(qcData.tableWorkOrderScheduledDatetime), 'yyyy');
        var monthStart = dateFormat(new Date(qcData.tableWorkOrderScheduledDatetime), 'mm');
        var dateStart = dateFormat(new Date(qcData.tableWorkOrderScheduledDatetime), 'dd');
        var hoursStart = dateFormat(new Date(), 'HH');
        var minStart = dateFormat(new Date(), 'MM');
        var secStart = dateFormat(new Date(), 'ss');

        var yearEnd = dateFormat(new Date(qcData.tableWorkOrderScheduledEndDatetime), 'yyyy');
        var monthEnd = dateFormat(new Date(qcData.tableWorkOrderScheduledEndDatetime), 'mm');
        var dateEnd = dateFormat(new Date(qcData.tableWorkOrderScheduledEndDatetime), 'dd');
        var hoursEnd = dateFormat(new Date(), 'HH');
        var minEnd = dateFormat(new Date(), 'MM');
        var secEnd = dateFormat(new Date(), 'ss');

        var putqcData = qcData;
        putqcData.tableWorkOrderAdditionalQc = a;
        putqcData.tableWorkOrderScheduledDatetime = [
            parseInt(yearStart),
            parseInt(monthStart),
            parseInt(dateStart),
            parseInt(hoursStart),
            parseInt(minStart),
            parseInt(secStart)
        ]

        putqcData.tableWorkOrderScheduledEndDatetime = [
            parseInt(yearEnd),
            parseInt(monthEnd),
            parseInt(dateEnd),
            parseInt(hoursEnd),
            parseInt(minEnd),
            parseInt(secEnd)
        ]

        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/workorder/' + qcId,
            data: putqcData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            if (res) {
                growl.success("Work Order - QC Updated Successfully");
                $scope.qcData = null;
                qcData = null;
                $scope.skuId = null;
                // $scope.listOfWorkOrdersCreatedQc();
                $scope.listOfWorkOrderQcCount($scope.vmPagerWoQcStart.currentPage);
                // $scope.listOfWorkOrders();
                $scope.listOfWorkOrderCount($scope.vmPagerWoStart.currentPage);
                $scope.dialogBoxQC = 'add';
                $mdDialog.hide();
            }
        }).error(function(error, status) {


            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
            $scope.dialogBoxQC = 'add';
            growl.error("Work Order - QC cannot be updated");
        });
    };

    //adding list of product for stock audit
    $scope.addProduct = function(tableSku) {

        $scope.products.push({
            tableSku: tableSku.originalObject
        });

        var id = 'products'
        if (id) {
            $scope.$broadcast('angucomplete-alt:clearInput', id);
            tableSku = null;
            $scope.stockData.productObj = null;
        } else {
            $scope.$broadcast('angucomplete-alt:clearInput');
        }
    };

    // add stock audit data to oms backend
    $scope.addStockData = function(stockData) {
        var yearStart = dateFormat(new Date(stockData.tableWorkOrderScheduledDatetime), 'yyyy');
        var monthStart = dateFormat(new Date(stockData.tableWorkOrderScheduledDatetime), 'mm');
        var dateStart = dateFormat(new Date(stockData.tableWorkOrderScheduledDatetime), 'dd');
        var hoursStart = dateFormat(new Date(), 'HH');
        var minStart = dateFormat(new Date(), 'MM');
        var secStart = dateFormat(new Date(), 'ss');

        var yearEnd = dateFormat(new Date(stockData.tableWorkOrderScheduledEndDatetime), 'yyyy');
        var monthEnd = dateFormat(new Date(stockData.tableWorkOrderScheduledEndDatetime), 'mm');
        var dateEnd = dateFormat(new Date(stockData.tableWorkOrderScheduledEndDatetime), 'dd');
        var hoursEnd = dateFormat(new Date(), 'HH');
        var minEnd = dateFormat(new Date(), 'MM');
        var secEnd = dateFormat(new Date(), 'ss');

        var postStockData = {
            "tableWorkOrderSkus": $scope.products,
            "tableWarehouseDetails": stockData.tableWarehouseDetails,
            "tableSkuInventory": null,
            "tableWorkOrderStatusType": {
                "idtableWorkOrderStatusTypeId": 1,
                "tableWorkOrderStatusTypeString": "New"
            },
            "tableWorkOrderType": {
                "idtableWorkOrderTypeId": 7,
                "tableWorkOrderTypeString": "Stock Audit"
            },
            "tableWorkOrderStateTrails": []
        }

        postStockData.tableWorkOrderScheduledDatetime = [
            parseInt(yearStart),
            parseInt(monthStart),
            parseInt(dateStart),
            parseInt(hoursStart),
            parseInt(minStart),
            parseInt(secStart)
        ]

        postStockData.tableWorkOrderScheduledEndDatetime = [
            parseInt(yearEnd),
            parseInt(monthEnd),
            parseInt(dateEnd),
            parseInt(hoursEnd),
            parseInt(minEnd),
            parseInt(secEnd)
        ]

        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/workorder',
            data: postStockData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            if (res) {
                growl.success("Work Order - Stock Created Successfully");
                $scope.stockData = null;
                stockData = null;
                $scope.products = [];
                $scope.skuId = null;
                // $scope.listOfWorkOrdersCreatedStock();
                $scope.listOfWorkOrderStockCount($scope.vmPagerWoStockStart.currentPage);
                // $scope.listOfWorkOrders();
                $scope.listOfWorkOrderCount($scope.vmPagerWoStart.currentPage);
                $scope.dialogBoxStock = 'add';
                $mdDialog.hide();
            }
        }).error(function(error, status) {


            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
            $scope.dialogBoxStock = 'add';
            growl.error("Work Order - Stock Cannot be Added");
        });
    };

    // update stock audit data to oms backend
    $scope.updateStockData = function(stockData, stockId) {
        var yearStart = dateFormat(new Date(stockData.tableWorkOrderScheduledDatetime), 'yyyy');
        var monthStart = dateFormat(new Date(stockData.tableWorkOrderScheduledDatetime), 'mm');
        var dateStart = dateFormat(new Date(stockData.tableWorkOrderScheduledDatetime), 'dd');
        var hoursStart = dateFormat(new Date(), 'HH');
        var minStart = dateFormat(new Date(), 'MM');
        var secStart = dateFormat(new Date(), 'ss');

        var yearEnd = dateFormat(new Date(stockData.tableWorkOrderScheduledEndDatetime), 'yyyy');
        var monthEnd = dateFormat(new Date(stockData.tableWorkOrderScheduledEndDatetime), 'mm');
        var dateEnd = dateFormat(new Date(stockData.tableWorkOrderScheduledEndDatetime), 'dd');
        var hoursEnd = dateFormat(new Date(), 'HH');
        var minEnd = dateFormat(new Date(), 'MM');
        var secEnd = dateFormat(new Date(), 'ss');

        var putStockData = stockData;
        putStockData.tableWorkOrderSkus = $scope.products;

        putStockData.tableWorkOrderScheduledDatetime = [
            parseInt(yearStart),
            parseInt(monthStart),
            parseInt(dateStart),
            parseInt(hoursStart),
            parseInt(minStart),
            parseInt(secStart)
        ]

        putStockData.tableWorkOrderScheduledEndDatetime = [
            parseInt(yearEnd),
            parseInt(monthEnd),
            parseInt(dateEnd),
            parseInt(hoursEnd),
            parseInt(minEnd),
            parseInt(secEnd)
        ]


        delete putStockData.productObj;

        console.log(putStockData);
        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/workorder/' + stockId,
            data: putStockData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            if (res) {
    
                growl.success("Work Order - Stock Updated Successfully");
                $scope.stockData = null;
                stockData = null;
                $scope.products = [];
                $scope.skuId = null;
                // $scope.listOfWorkOrdersCreatedStock();
                $scope.listOfWorkOrderStockCount($scope.vmPagerWoStockStart.currentPage);
                // $scope.listOfWorkOrders();
                $scope.listOfWorkOrderCount($scope.vmPagerWoStart.currentPage);
                $scope.dialogBoxStock = 'add';
                $mdDialog.hide();
            }
        }).error(function(error, status) {


            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
            $scope.dialogBoxStock = 'add';
            growl.error("Work Order - Stock Cannot be Updated");
        });
    };

    // add sticker data to oms backend
    $scope.addStickerData = function(stickerData, inventory) {
        var yearStart = dateFormat(new Date(stickerData.tableWorkOrderScheduledDatetime), 'yyyy');
        var monthStart = dateFormat(new Date(stickerData.tableWorkOrderScheduledDatetime), 'mm');
        var dateStart = dateFormat(new Date(stickerData.tableWorkOrderScheduledDatetime), 'dd');
        var hoursStart = dateFormat(new Date(), 'HH');
        var minStart = dateFormat(new Date(), 'MM');
        var secStart = dateFormat(new Date(), 'ss');

        var yearEnd = dateFormat(new Date(stickerData.tableWorkOrderScheduledEndDatetime), 'yyyy');
        var monthEnd = dateFormat(new Date(stickerData.tableWorkOrderScheduledEndDatetime), 'mm');
        var dateEnd = dateFormat(new Date(stickerData.tableWorkOrderScheduledEndDatetime), 'dd');
        var hoursEnd = dateFormat(new Date(), 'HH');
        var minEnd = dateFormat(new Date(), 'MM');
        var secEnd = dateFormat(new Date(), 'ss');

        var tableWorkOrderSkus = [];
        tableWorkOrderSkus.push({
            tableSku: $scope.skuProduct
        });

        var postStickerData = {
            "tableWorkOrderSkus": tableWorkOrderSkus,
            "tableWarehouseDetails": stickerData.tableWarehouseDetails,
            "tableSkuInventory": inventory,
            "tableStickerTemplate": stickerData.tableStickerTemplate,
            "tableWorkOrderStatusType": {
                "idtableWorkOrderStatusTypeId": 1,
                "tableWorkOrderStatusTypeString": "New"
            },
            "tableWorkOrderType": {
                "idtableWorkOrderTypeId": 8,
                "tableWorkOrderTypeString": "Stickers"
            },
            "tableWorkOrderStateTrails": []
        }

        postStickerData.tableWorkOrderScheduledDatetime = [
            parseInt(yearStart),
            parseInt(monthStart),
            parseInt(dateStart),
            parseInt(hoursStart),
            parseInt(minStart),
            parseInt(secStart)
        ]

        postStickerData.tableWorkOrderScheduledEndDatetime = [
            parseInt(yearEnd),
            parseInt(monthEnd),
            parseInt(dateEnd),
            parseInt(hoursEnd),
            parseInt(minEnd),
            parseInt(secEnd)
        ]

        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/workorder',
            data: postStickerData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            if (res) {
                growl.success("Work Order - Sticker Created Successfully");
                $scope.stickerData = null;
                stickerData = null;
                // $scope.stickerProductObj = "";
                var productId = 'products';
                if (productId) {
                    $scope.$broadcast('angucomplete-alt:clearInput', productId);
                }                
                $scope.skuId = null;
                // $scope.listOfWorkOrdersCreatedSticker();
                $scope.listOfWorkOrderStickerCount($scope.vmPagerWoStickerStart.currentPage);
                // $scope.listOfWorkOrders();
                $scope.listOfWorkOrderCount($scope.vmPagerWoStart.currentPage);
                $scope.mode = 'add';
                $mdDialog.hide();
            }
        }).error(function(error, status) {


            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
            growl.error("Work Order - Sticker Cannot be Added");
        });
    };

    // update sticker data to oms backend
    $scope.updateStickerData = function(stickerData, inventory, stickerId) {
        var yearStart = dateFormat(new Date(stickerData.tableWorkOrderScheduledDatetime), 'yyyy');
        var monthStart = dateFormat(new Date(stickerData.tableWorkOrderScheduledDatetime), 'mm');
        var dateStart = dateFormat(new Date(stickerData.tableWorkOrderScheduledDatetime), 'dd');
        var hoursStart = dateFormat(new Date(), 'HH');
        var minStart = dateFormat(new Date(), 'MM');
        var secStart = dateFormat(new Date(), 'ss');

        var yearEnd = dateFormat(new Date(stickerData.tableWorkOrderScheduledEndDatetime), 'yyyy');
        var monthEnd = dateFormat(new Date(stickerData.tableWorkOrderScheduledEndDatetime), 'mm');
        var dateEnd = dateFormat(new Date(stickerData.tableWorkOrderScheduledEndDatetime), 'dd');
        var hoursEnd = dateFormat(new Date(), 'HH');
        var minEnd = dateFormat(new Date(), 'MM');
        var secEnd = dateFormat(new Date(), 'ss');

        var tableWorkOrderSkus = [];
        tableWorkOrderSkus.push({
            idtableWorkOrderSkuId: $scope.idtableWorkOrderSkuId,
            tableSku: $scope.skuProduct
        });

        var putStickerData = stickerData;
        putStickerData.tableWorkOrderSkus = tableWorkOrderSkus;
        putStickerData.tableSkuInventory = inventory;

        putStickerData.tableWorkOrderScheduledDatetime = [
            parseInt(yearStart),
            parseInt(monthStart),
            parseInt(dateStart),
            parseInt(hoursStart),
            parseInt(minStart),
            parseInt(secStart)
        ]

        putStickerData.tableWorkOrderScheduledEndDatetime = [
            parseInt(yearEnd),
            parseInt(monthEnd),
            parseInt(dateEnd),
            parseInt(hoursEnd),
            parseInt(minEnd),
            parseInt(secEnd)
        ]

        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/workorder/' + stickerId,
            data: putStickerData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            if (res) {
                growl.success("Work Order - Sticker Updated Successfully");
                $scope.stickerData = null;
                stickerData = null;
                // $scope.stickerProductObj = "";

                var productId = 'products';
                if (productId) {
                    $scope.$broadcast('angucomplete-alt:clearInput', productId);
                }


                $scope.invStickerLists = "";
                $scope.radio = "";
                $scope.skuId = null;
                // $scope.listOfWorkOrdersCreatedSticker();
                $scope.listOfWorkOrderStickerCount($scope.vmPagerWoStickerStart.currentPage);
                // $scope.listOfWorkOrders();
                $scope.listOfWorkOrderCount($scope.vmPagerWoStart.currentPage);
                $scope.dialogBoxSticker = 'add';
                $mdDialog.hide();
            }
        }).error(function(error, status) {


            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
            $scope.dialogBoxSticker = 'add';
            $scope.stickerData = null;
            stickerData = null;
            // $scope.stickerProductObj = "";
            var productId = 'products';
            if (productId) {
                $scope.$broadcast('angucomplete-alt:clearInput', productId);
            }
            $scope.invStickerLists = "";
            growl.error("Work Order - Sticker Cannot be Updated");
        });
    };

    //Start Date and End Date Validations Starts Here for Individual Work Orders
    $scope.callMinStartMaxStart = function() {
        $scope.todayDate = new Date();
        $scope.startminDate = new Date(
            $scope.todayDate.getFullYear(),
            $scope.todayDate.getMonth(),
            $scope.todayDate.getDate());

        $scope.endminDate = new Date(
            $scope.todayDate.getFullYear(),
            $scope.todayDate.getMonth(),
            $scope.todayDate.getDate());
    }
    $scope.callMinStartMaxStart();
    $scope.sendStartDate = function(date) {
        $scope.startDateData = new Date(date);
        $scope.endminDate = new Date(
            $scope.startDateData.getFullYear(),
            $scope.startDateData.getMonth(),
            $scope.startDateData.getDate() + 1);
    }

    $scope.sendEndDate = function(date) {
        $scope.endDateData = new Date(date);
        $scope.startmaxDate = new Date(
            $scope.endDateData.getFullYear(),
            $scope.endDateData.getMonth(),
            $scope.endDateData.getDate() - 1);
    };
    //Start Date and End Date Validations Ends Here

    //Start Date and End Date Validations Starts Here for Main Inventory and Work Orders Screen Starts Here
    $scope.callMainMinStartMaxStart = function() {
        $scope.warehouseid = undefined;
        $scope.startDate = "";
        $scope.endDate = "";
        $scope.start1Date = undefined;
        $scope.end1Date = undefined;
        $scope.todayDate = new Date();
        $scope.mainstartmaxDate = new Date(
            $scope.todayDate.getFullYear(),
            $scope.todayDate.getMonth(),
            $scope.todayDate.getDate());

        $scope.mainendmaxDate = new Date(
            $scope.todayDate.getFullYear(),
            $scope.todayDate.getMonth(),
            $scope.todayDate.getDate());

        $scope.invMinDate = new Date(
            $scope.todayDate.getFullYear(),
            $scope.todayDate.getMonth(),
            $scope.todayDate.getDate() + 1);
    };

    $scope.callMainMinStartMaxStart();

    $scope.mainsendStartDate = function(date) {
        $scope.mainstartDateData = new Date(date);
        $scope.mainendminDate = new Date(
            $scope.mainstartDateData.getFullYear(),
            $scope.mainstartDateData.getMonth(),
            $scope.mainstartDateData.getDate());
        $scope.isStartDateDisabled = false;
    };

    $scope.mainsendEndDate = function(date) {
        $scope.mainendDateData = new Date(date);
        $scope.mainstartmaxDate = new Date(
            $scope.mainendDateData.getFullYear(),
            $scope.mainendDateData.getMonth(),
            $scope.mainendDateData.getDate());
        $scope.isEndDateDisabled = false;
    };
    //Start Date and End Date Validations Starts Here for Main Inventory and Work Orders Screen Ends Here

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

    //MSP MRP Validation
    $scope.checkMspGrtMrp = function(mrp, msp) {
        if (msp > mrp) {
            growl.error("MSP Must Be Less than MRP")
            $scope.inventoryData.tableSkuInventoryMinSalePrice = "";
            $scope.invMRPMSP = true;
        } else {
            $scope.invMRPMSP = false;
        }
    };

    $scope.validateAvBl = function(block, available) {
        if (block > available) {
            growl.error("“\Blocked Count”\ Must be less than equal to “\Available Count”\.");
            $scope.inventoryData.tableSkuInventoryBlockedCount = "";
            $scope.invMRPMSP = true;
        } else {
            $scope.invMRPMSP = false;
        }
    };

    //selecting and calling api
    $scope.stickerProductObj = function(selected) {
        if ((selected != undefined || selected != null) && $scope.wIdSticker != "") {

            var skuIdSticker = selected.originalObject.idtableSkuId;
            $scope.skuProduct = selected.originalObject;
            $http.get(baseUrl + '/omsservices/webapi/warehouses/' + $scope.wIdSticker + '/skus/' + skuIdSticker + '/inventory').success(function(response) {
                $scope.invStickerLists = response;
    
            });
        }
    };

    $scope.allWHouse = function(warehouse) {
        var warehouse = warehouse;
        $scope.wIdSticker = warehouse.idtableWarehouseDetailsId;
    };

    // dialog box to add new kit
    $scope.cancelWorkOrder = function(workOrderId, workOrderData, ev) {
        $scope.workOrderId = workOrderId;
        $scope.workOrderData = workOrderData;
        $mdDialog.show({
                templateUrl: 'dialog333.tmpl.html',
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

    //cancel work order action
    $scope.cancelWorkOrderApi = function(workOrderId, workOrderData, remarks) {
        workOrderData.tableWorkOrderStatusType = {
            "idtableWorkOrderStatusTypeId": 5,
            "tableWorkOrderStatusTypeString": "Cancelled"
        }

        workOrderData.tableWorkOrderRemark = remarks;

        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/workorder/' + workOrderId + '/cancel',
            data: workOrderData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            if (res) {
                growl.success("Work Order Cancelled Successfully");
                $scope.availableQuantityMode = false;
                $scope.wData = null;
                $scope.inventoryData = "";
                $scope.kitData = "";
                $scope.splitData = "";
                $scope.freeMailerData = "";
                $scope.qcData = "";
                $scope.stockData = "";
                $scope.stickerData = "";
                $scope.initialSelected = "";
                $scope.freeMailertableWorkOrderSkuQuantity = "";
                $scope.initialSelected1 = "";
                $scope.selectedList = "";
                $scope.invStickerLists = "";
                $scope.radio = "";
                $scope.skuId = "";
                $scope.mode = 'add';
                $scope.dialogBoxKit = 'add';
                $scope.dialogBoxSplit = 'add';
                $scope.dialogBoxFreeMailer = 'add';
                $scope.dialogBoxQC = 'add';
                $scope.dialogBoxStock = 'add';
                $scope.dialogBoxSticker = 'add';
                $scope.products = [];
                // $scope.listOfWorkOrders();
                $scope.listOfWorkOrderCount($scope.vmPagerWoStart.currentPage);
                $mdDialog.hide();
            }
        }).error(function(error, status) {


            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
            growl.error("Work Order Cannot be Cancelled");
        });
    };

    $scope.loadCancelReasons = function() {
        var cancelReasonsUrl = baseUrl + '/omsservices/webapi/workordercancelreasons';
        $http.get(cancelReasonsUrl).success(function(data) {

            $scope.cancelReasonArray = data;

        }).error(function(error, status) {


            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
        });
    }

    //load sticker templates
    $scope.loadStickerTemplates = function() {
        var stickerTemplateUrl = baseUrl + "/omsservices/webapi/stickertemplates";

        $http.get(stickerTemplateUrl).success(function(data) {
            $scope.stickertemplatesArray = data;
        });
    };

    //edit mode for work orders
    $scope.editWorkOrders = function(ev, workOrderId, workOrderType) {

        //Kit
        if (workOrderType == 1) {
            $scope.dialogBoxKit = 'edit';
            $http.get(baseUrl + '/omsservices/webapi/workorder/' + workOrderId).success(function(response) {
    
                $scope.kitData = response;
                $scope.initialSelected = response.tableWorkOrderSkus[0].tableSku.tableSkuName;
                $scope.productObj = response.tableWorkOrderSkus[0].tableSku;
                $scope.idtableWorkOrderSkuId = response.tableWorkOrderSkus[0].idtableWorkOrderSkuId;
    
                $scope.skuId = response.tableWorkOrderSkus[0].tableSku.tableSkuClientSkuCode;
                $scope.kitData.tableWarehouseDetails = initializeDropdowns($scope.wareHousesData, 'idtableWarehouseDetailsId', response.tableWarehouseDetails.idtableWarehouseDetailsId);
                var stDate = response.tableWorkOrderScheduledDatetime[0] + "-" + response.tableWorkOrderScheduledDatetime[1] + "-" + response.tableWorkOrderScheduledDatetime[2];
                var endDate = response.tableWorkOrderScheduledEndDatetime[0] + "-" + response.tableWorkOrderScheduledEndDatetime[1] + "-" + response.tableWorkOrderScheduledEndDatetime[2];
                $scope.kitData.tableWorkOrderScheduledDatetime = new Date(stDate);
                $scope.kitData.tableWorkOrderScheduledEndDatetime = new Date(endDate);
                if ($scope.kitData != null) {
                    $scope.showAddKitDialog(ev);
                }
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
                $scope.dialogBoxKit = "add";
                growl.error("Error In Loading Work Order");
            });
        }

        //Split
        if (workOrderType == 2) {
            $scope.dialogBoxSplit = 'edit';
            $http.get(baseUrl + '/omsservices/webapi/workorder/' + workOrderId).success(function(response) {
    
                $scope.splitData = response;
                $scope.initialSelected = response.tableWorkOrderSkus[0].tableSku.tableSkuName;
                $scope.productObj = response.tableWorkOrderSkus[0].tableSku;
                $scope.idtableWorkOrderSkuId = response.tableWorkOrderSkus[0].idtableWorkOrderSkuId;
    
                $scope.skuId = response.tableWorkOrderSkus[0].tableSku.tableSkuClientSkuCode;
                $scope.splitData.tableWarehouseDetails = initializeDropdowns($scope.wareHousesData, 'idtableWarehouseDetailsId', response.tableWarehouseDetails.idtableWarehouseDetailsId);
                var stDate = response.tableWorkOrderScheduledDatetime[0] + "-" + response.tableWorkOrderScheduledDatetime[1] + "-" + response.tableWorkOrderScheduledDatetime[2];
                var endDate = response.tableWorkOrderScheduledEndDatetime[0] + "-" + response.tableWorkOrderScheduledEndDatetime[1] + "-" + response.tableWorkOrderScheduledEndDatetime[2];
                $scope.splitData.tableWorkOrderScheduledDatetime = new Date(stDate);
                $scope.splitData.tableWorkOrderScheduledEndDatetime = new Date(endDate);
                if ($scope.splitData != null) {
                    $scope.showAddSplitDialog(ev);
                }
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
                $scope.dialogBoxSplit = "add";
                growl.error("Error In Loading Work Order");
            });
        }

        //FreeMailer
        if (workOrderType == 4) {
            $scope.dialogBoxFreeMailer = 'edit';
            $http.get(baseUrl + '/omsservices/webapi/workorder/' + workOrderId).success(function(response) {
    
                $scope.freeMailerData = response;
                $scope.freeMailertableWorkOrderSkuQuantity = response.tableWorkOrderSkuQuantity;
                $scope.initialSelected = response.tableWorkOrderSkus[0].tableSku.tableSkuName;
                $scope.initialSelected1 = response.tableWorkOrderSkus[1].tableSku.tableSkuName;
                $scope.productObj = response.tableWorkOrderSkus[0].tableSku;
                $scope.idtableWorkOrderSkuId = response.tableWorkOrderSkus[0].idtableWorkOrderSkuId;
                $scope.mailerObj = response.tableWorkOrderSkus[1].tableSku;
                $scope.idtableWorkOrderSkuId1 = response.tableWorkOrderSkus[1].idtableWorkOrderSkuId;
                $scope.freeMailerData.tableWarehouseDetails = initializeDropdowns($scope.wareHousesData, 'idtableWarehouseDetailsId', response.tableWarehouseDetails.idtableWarehouseDetailsId);
                $scope.wData = initializeDropdowns($scope.wareHousesData, 'idtableWarehouseDetailsId', response.tableWarehouseDetails.idtableWarehouseDetailsId);
                var stDate = response.tableWorkOrderScheduledDatetime[0] + "-" + response.tableWorkOrderScheduledDatetime[1] + "-" + response.tableWorkOrderScheduledDatetime[2];
                var endDate = response.tableWorkOrderScheduledEndDatetime[0] + "-" + response.tableWorkOrderScheduledEndDatetime[1] + "-" + response.tableWorkOrderScheduledEndDatetime[2];
                $scope.freeMailerData.tableWorkOrderScheduledDatetime = new Date(stDate);
                $scope.freeMailerData.tableWorkOrderScheduledEndDatetime = new Date(endDate);
                if ($scope.freeMailerData != null) {
                    $scope.showAddFreeMailerDialog(ev);
                }
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
                $scope.dialogBoxFreeMailer = "add";
                growl.error("Error In Loading Work Order");
            });
        }

        //QC
        if (workOrderType == 6) {
            $scope.dialogBoxQC = 'edit';
            $http.get(baseUrl + '/omsservices/webapi/workorder/' + workOrderId).success(function(response) {
    
                $scope.qcData = response;
                $scope.selectedList = [];
                $scope.initialSelected = response.tableWorkOrderSkus[0].tableSku.tableSkuName;
                $scope.productObj = response.tableWorkOrderSkus[0].tableSku;
                $scope.idtableWorkOrderSkuId = response.tableWorkOrderSkus[0].idtableWorkOrderSkuId;
                var stDate = response.tableWorkOrderScheduledDatetime[0] + "-" + response.tableWorkOrderScheduledDatetime[1] + "-" + response.tableWorkOrderScheduledDatetime[2];
                var endDate = response.tableWorkOrderScheduledEndDatetime[0] + "-" + response.tableWorkOrderScheduledEndDatetime[1] + "-" + response.tableWorkOrderScheduledEndDatetime[2];
                $scope.qcData.tableWorkOrderScheduledDatetime = new Date(stDate);
                $scope.qcData.tableWorkOrderScheduledEndDatetime = new Date(endDate);
                var strVale = response.tableWorkOrderAdditionalQc;
                var arr = strVale.split('|');
    
                for (i = 0; i < arr.length; i++) {
                    $scope.selectedList.push(arr[i]);
                }
                if ($scope.qcData != null) {
                    $scope.showAddQcDialog(ev);
                }
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
                $scope.dialogBoxQC = "add";
                growl.error("Error In Loading Work Order");
            });
        }

        //Stock Audit
        if (workOrderType == 7) {
            $scope.dialogBoxStock = 'edit';
            $http.get(baseUrl + '/omsservices/webapi/workorder/' + workOrderId).success(function(response) {
    
                $scope.stockData = response;
                $scope.stockData.tableWarehouseDetails = initializeDropdowns($scope.wareHousesData, 'idtableWarehouseDetailsId', response.tableWarehouseDetails.idtableWarehouseDetailsId);
                var stDate = response.tableWorkOrderScheduledDatetime[0] + "-" + response.tableWorkOrderScheduledDatetime[1] + "-" + response.tableWorkOrderScheduledDatetime[2];
                var endDate = response.tableWorkOrderScheduledEndDatetime[0] + "-" + response.tableWorkOrderScheduledEndDatetime[1] + "-" + response.tableWorkOrderScheduledEndDatetime[2];
                $scope.stockData.tableWorkOrderScheduledDatetime = new Date(stDate);
                $scope.stockData.tableWorkOrderScheduledEndDatetime = new Date(endDate);
                for (var i = 0; i < response.tableWorkOrderSkus.length; i++) {
                    $scope.products.push({
                        idtableWorkOrderSkuId: response.tableWorkOrderSkus[i].idtableWorkOrderSkuId,
                        tableSku: response.tableWorkOrderSkus[i].tableSku
                    });
                }

                if ($scope.stockData != null) {
                    $scope.showAddStockDialog(ev);
                }
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
                $scope.dialogBoxStock = "add";
                growl.error("Error In Loading Work Order");
            });
        }

        //Sticker
        if (workOrderType == 8) {
            $scope.dialogBoxSticker = 'edit';
            $http.get(baseUrl + '/omsservices/webapi/workorder/' + workOrderId).success(function(response) {
    
                $scope.stickerData = response;
                $scope.stickerData.tableWarehouseDetails = initializeDropdowns($scope.wareHousesData, 'idtableWarehouseDetailsId', response.tableWarehouseDetails.idtableWarehouseDetailsId);
                $scope.stickerData.tableStickerTemplate = initializeDropdowns($scope.stickertemplatesArray, 'idtableStickerTemplateId', response.tableStickerTemplate.idtableStickerTemplateId);

                $scope.initialSelected = response.tableWorkOrderSkus[0].tableSku.tableSkuName;
                $scope.skuProduct = response.tableWorkOrderSkus[0].tableSku;
                $scope.idtableWorkOrderSkuId = response.tableWorkOrderSkus[0].idtableWorkOrderSkuId;
    
    
                $http.get(baseUrl + '/omsservices/webapi/warehouses/' + response.tableWarehouseDetails.idtableWarehouseDetailsId + '/skus/' + $scope.skuProduct.idtableSkuId + '/inventory').success(function(data) {
        
                    $scope.invStickerLists = data;
        
                    $scope.radio = response.tableSkuInventory;
        
                });
                var stDate = response.tableWorkOrderScheduledDatetime[0] + "-" + response.tableWorkOrderScheduledDatetime[1] + "-" + response.tableWorkOrderScheduledDatetime[2];
                var endDate = response.tableWorkOrderScheduledEndDatetime[0] + "-" + response.tableWorkOrderScheduledEndDatetime[1] + "-" + response.tableWorkOrderScheduledEndDatetime[2];
                $scope.stickerData.tableWorkOrderScheduledDatetime = new Date(stDate);
                $scope.stickerData.tableWorkOrderScheduledEndDatetime = new Date(endDate);

                if ($scope.stickerData != null) {
                    $scope.showAddStickerDialog(ev);
                }
            }).error(function(error, status) {
    
    
                if (status == 401) {
                    $('#AuthError').modal('show');
                    $location.path('/login');
                }
                $scope.dialogBoxSticker = "add";
                growl.error("Error In Loading Work Order");
            });
        }
    };

    $scope.fullproductObj = function(selected) {
        if (selected != null) {
            $scope.skuId = selected.originalObject.tableSkuClientSkuCode;
            $scope.skuFullId = selected.originalObject.idtableSkuId;
            $scope.productObj = selected.originalObject;
            if ($scope.wData != null) {
                $scope.availableQuantityMode = true;
                $scope.availableQuantity($scope.wData, selected.originalObject.idtableSkuId);
            }
        }
    };

    $scope.fullmailerObj = function(selected) {
        $scope.skuFullId = selected.originalObject.idtableSkuId;
        if (selected != null) {
            $scope.mailerObj = selected.originalObject;
            if ($scope.wData != null) {
                $scope.availableQuantity($scope.wData, selected.originalObject.idtableSkuId);
            }
        }
    };

    $scope.loadWareHousesData = function(wData) {
        $scope.wData = wData;
        if ($scope.skuFullId != null) {
            $scope.availableQuantityMode = true;
            $scope.availableQuantity($scope.wData, $scope.skuFullId);
        }
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

    //add new qc code
    $scope.addQc = function(qcName) {
        var postNewQcData = {
            "tableSkuQcParameterTypeString": qcName,
            "tableSkuQcParameterTypeIsAdditional": true
        }

        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/skuqctypes',
            data: postNewQcData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            if (res) {
                growl.success("New QC Type Added Successfully");
                $scope.qcName = null;
                qcName = null;
                $scope.qcTrueLists();
            }
        }).error(function(error, status) {


            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
            growl.error("New QC Type Cannot be Added");
        });
    };

    // $scope.stockproductObj = function(selected)
    // {
    //     var productId = 'products';
    //     if (productId) {
    //         $scope.$broadcast('angucomplete-alt:clearInput', productId);
    //     }
    // }
    $scope.callInitialTabDisabled = function(){
        $scope.isSubmitDisabledInv = true;
        $scope.isResetDisabledInv = true;
    }
}

//Dialog Controller
function DialogController($scope, $mdDialog) {
    $scope.hide = function() {
        $mdDialog.hide();
    };

    $scope.cancel = function() {
        $mdDialog.cancel();
    };

    $scope.answer = function(answer) {
        $mdDialog.hide(answer);
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
