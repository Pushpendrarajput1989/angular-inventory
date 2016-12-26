/**
 * Created by angularpc on 26-10-2016.
 */
myApp.controller('dashboardController', dashboardController);

dashboardController.$inject = ['$scope', '$http', '$location', 'baseUrl','$cookies', '$mdDialog', '$mdMedia', 'growl', '$window', 'downloadOrderTemplateUrl', 'Upload'];

function dashboardController($scope, $http, $location, baseUrl,$cookies, $mdDialog, $mdMedia, growl, $window, downloadOrderTemplateUrl, Upload) {

    var TodayDate = new Date();


    $scope.sortType     = 'channel'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.searchFish   = '';     // set the default search/filter term



    var NowDate =  moment(TodayDate).format('YYYY-MM-DD');
   var yesterdayDate =  moment(TodayDate).subtract(1,'days').format('YYYY-MM-DD');
   var lastWeek =  moment(TodayDate).subtract(7,'days').format('YYYY-MM-DD');
   var LastMonth =  moment(TodayDate).subtract(30,'days').format('YYYY-MM-DD');
    //var et = moment(yesdated).format('YYYY-MM-DD');
    console.log(NowDate);
    console.log(yesterdayDate);
    console.log(lastWeek);
    console.log(LastMonth);

    $scope.clickDisable = function(data){
      console.log(data);
        var disableActive = $(".tabbable-line > .nav-tabs > li.active").attr('class');
        if(disableActive == 'active'){
            $scope.DisableActiveBtn = true;
        }
        //$(".tabbable-line > .nav-tabs > li.active").attr('class');
    };

    $scope.TodaySku =
    $scope.NewHoldUrl = baseUrl + '/omsservices/webapi/orders/counthold?startdate='+NowDate+'&enddate='+NowDate;
    $scope.NewOrderUrl = baseUrl + '/omsservices/webapi/orders/countsaleschannelwise?startdate='+NowDate+'&enddate='+NowDate;
    $scope.outwardUrl = baseUrl + '/omsservices/webapi/inventory/outwardinventory?startdate='+NowDate+'&enddate='+NowDate;

    $scope.NowDateOrder = function(){
        $http({
            method: 'GET',
            url: $scope.NewHoldUrl
        }).success(function(data){
            if(data == null || data == ""){
                $scope.OrderBlock = [];
            }else{
                console.log(data)
                $scope.OrderBlock = data;
            }
        }).error(function(data){
            if(status == 401){
                growl.error('Your session has been expired. You need to Login again.');
                $cookies.put('isLoggedIn',false);
                $location.path('/login')
            }
        });
    }
    ;var d ={};
    $scope.NewOrderStatus = function(){

        $http({
            method: 'GET',
            url: $scope.NewOrderUrl
        }).success(function(data){
            $scope.fit = [];
            console.log(data);

                $scope.OrderStatusBlock = data;

                console.log($scope.OrderStatusBlock);

            //}
        }).error(function(data){
            if(status == 401){
                growl.error('Your session has been expired. You need to Login again.');
                $cookies.put('isLoggedIn',false);
                $location.path('/login')
            }
        });

    }


    $scope.NewOrderStatus();
    $scope.NowDateOrder();

    $scope.changeNav = function(data){
        console.log(data);
        $cookies.put('Dashdata',data);
        console.log($cookies.get('Dashdata'));
        $location.path('/order');
    }

    $scope.InvSummary = function(){
        $http({
            method: 'GET',
            url: baseUrl + '/omsservices/webapi/inventory/inventorysummary'
        }).success(function(data){
            console.log(data);
            if(data.totalvalue == null || data.totalvalue == '' || data.totalvalue == undefined){
                $scope.ValueOrder = 0;
            }
             if(data.totalquantity == '' || data.totalquantity == null || data.totalquantity == undefined){
                $scope.ValueQuantity = 0;
            }if(data.totalsku == '' || data.totalsku == null || data.totalsku == undefined){
                $scope.ValueSKU = 0;
            }else{
                $scope.ValueOrder = data.totalvalue;
                $scope.ValueQuantity = data.totalquantity;
                $scope.ValueSKU = data.totalsku;

            }
        }).error(function(data,status){
            if(status == 401){
                growl.error('Your session has been expired. You need to Login again.');
                $cookies.put('isLoggedIn',false);
                $location.path('/login')
            }

            console.log(data)
        })
    }
    $scope.InvSummary();

    $scope.outward = function(){
        $http({
            method: 'GET',
            url: $scope.outwardUrl
        }).success(function(data){
            console.log(data);
            $scope.OutwardOrder = data.totalvalue;
            $scope.OutwardQuantity = data.totalquantity;
            $scope.OutwardSKU = data.totalsku;
        }).error(function(data,status){
            if(status == 401){
                growl.error('Your session has been expired. You need to Login again.');
                $cookies.put('isLoggedIn',false);
                $location.path('/login')
            }
        });
    }
    $scope.outward();

//    ================================ sku details ===================================== //

    $scope.SKUurl = {};

    $scope.SKUurl.new = baseUrl + '/omsservices/webapi/orders/filtercount?state=new&startDate='+NowDate+'&endDate='+NowDate;
    $scope.SKUurl.packed = baseUrl + '/omsservices/webapi/orders/filtercount?state=packed&startDate='+NowDate+'&endDate='+NowDate;
    $scope.SKUurl.shipping = baseUrl + '/omsservices/webapi/orders/filtercount?state=shipping&startDate='+NowDate+'&endDate='+NowDate;
    $scope.SKUurl.delivered = baseUrl + '/omsservices/webapi/orders/filtercount?state=delivered&startDate='+NowDate+'&endDate='+NowDate;

    $scope.skuPreview = function(){
            $http({
                method: 'GET',
                url: $scope.SKUurl.new
            }).success(function(data){
                console.log('sku1',data);
                $scope.skuNew = data;
            }).error(function(data){
                if(status == 401){
                    growl.error('Your session has been expired. You need to Login again.');
                    $cookies.put('isLoggedIn',false);
                    $location.path('/login')
                }
            });
            $http({
                method: 'GET',
                url:$scope.SKUurl.packed
            }).success(function(data){
                console.log('sku2',data);
                $scope.skuPacked = data;
            }).error(function(data,status){
                if(status == 401){
                    growl.error('Your session has been expired. You need to Login again.');
                    $cookies.put('isLoggedIn',false);
                    $location.path('/login')
                }
            });
            $http({
                method: 'GET',
                url: $scope.SKUurl.shipping
            }).success(function(data){
                console.log('sku3',data);
                $scope.skuShipping = data;
            }).error(function(data){
                if(status == 401){
                    growl.error('Your session has been expired. You need to Login again.');
                    $cookies.put('isLoggedIn',false);
                    $location.path('/login')
                }
            })
            $http({
                method: 'GET',
                url: $scope.SKUurl.delivered
            }).success(function(data){
                console.log('sku4',data);
                $scope.skuDelivered = data;
            }).error(function(data,status){
                if(status == 401){
                    growl.error('Your session has been expired. You need to Login again.');
                    $cookies.put('isLoggedIn',false);
                    $location.path('/login')
                }
            })

        }
    $scope.skuPreview();

    $scope.TodaysDate = function(data){
        if(data == 'hold'){
            $scope.NewHoldUrl = baseUrl + '/omsservices/webapi/orders/counthold?startdate='+NowDate+'&enddate='+NowDate;
            $scope.NowDateOrder();
        }else if(data == 'section'){
            $scope.NewOrderUrl = baseUrl + '/omsservices/webapi/orders/countsaleschannelwise?startdate='+NowDate+'&enddate='+NowDate;
            $scope.NewOrderStatus();
        }else if(data == 'inout'){
            $scope.outwardUrl = baseUrl + '/omsservices/webapi/inventory/outwardinventory?startdate='+NowDate+'&enddate='+NowDate;
            $scope.outward();
        }else if(data == 'sku'){
            $scope.SKUurl.new = baseUrl + '/omsservices/webapi/orders/filtercount?state=new&startDate='+NowDate+'&endDate='+NowDate;
            $scope.SKUurl.packed = baseUrl + '/omsservices/webapi/orders/filtercount?state=packed&startDate='+NowDate+'&endDate='+NowDate;
            $scope.SKUurl.shipping = baseUrl + '/omsservices/webapi/orders/filtercount?state=shipping&startDate='+NowDate+'&endDate='+NowDate;
            $scope.SKUurl.delivered = baseUrl + '/omsservices/webapi/orders/filtercount?state=delivered&startDate='+NowDate+'&endDate='+NowDate;
            $scope.skuPreview();
        }
    };
    $scope.Yesterday = function(data){
        if(data == 'section'){
            $scope.yesterdayOrder = baseUrl + '/omsservices/webapi/orders/countsaleschannelwise?startdate='+yesterdayDate+'&enddate='+yesterdayDate;
            $scope.NewOrderUrl = $scope.yesterdayOrder;
            $scope.NewOrderStatus();
        }else if(data == 'sku'){
            $scope.SKUurl.new = baseUrl + '/omsservices/webapi/orders/filtercount?state=new&startDate='+yesterdayDate+'&endDate='+yesterdayDate;
            $scope.SKUurl.packed = baseUrl + '/omsservices/webapi/orders/filtercount?state=packed&startDate='+yesterdayDate+'&endDate='+yesterdayDate;
            $scope.SKUurl.shipping = baseUrl + '/omsservices/webapi/orders/filtercount?state=shipping&startDate='+yesterdayDate+'&endDate='+yesterdayDate;
            $scope.SKUurl.delivered = baseUrl + '/omsservices/webapi/orders/filtercount?state=delivered&startDate='+yesterdayDate+'&endDate='+yesterdayDate;
            $scope.skuPreview();
        }
    };
    $scope.Week = function(data){
        if(data == 'hold'){
            $scope.NewHoldUrl = baseUrl + '/omsservices/webapi/orders/counthold?startdate='+lastWeek+'&enddate='+NowDate;
            $scope.NowDateOrder();
        }else if(data == 'section'){
            $scope.NewOrderUrl = baseUrl + '/omsservices/webapi/orders/countsaleschannelwise?startdate='+lastWeek+'&enddate='+NowDate;
            $scope.NewOrderStatus();
        }else if(data == 'inout'){
            $scope.outwardUrl = baseUrl + '/omsservices/webapi/inventory/outwardinventory?startdate='+lastWeek+'&enddate='+NowDate;
            $scope.outward();
        }else if(data == 'sku'){
            $scope.SKUurl.new = baseUrl + '/omsservices/webapi/orders/filtercount?state=new&startDate='+lastWeek+'&endDate='+NowDate;
            $scope.SKUurl.packed = baseUrl + '/omsservices/webapi/orders/filtercount?state=packed&startDate='+lastWeek+'&endDate='+NowDate;
            $scope.SKUurl.shipping = baseUrl + '/omsservices/webapi/orders/filtercount?state=shipping&startDate='+lastWeek+'&endDate='+NowDate;
            $scope.SKUurl.delivered = baseUrl + '/omsservices/webapi/orders/filtercount?state=delivered&startDate='+lastWeek+'&endDate='+NowDate;
            $scope.skuPreview();
        }
    }
    $scope.Month = function(data){
        if(data == 'hold'){
            $scope.NewHoldUrl = baseUrl + '/omsservices/webapi/orders/counthold?startdate='+LastMonth+'&enddate='+NowDate;
            $scope.NowDateOrder();
        }else if(data == 'section'){
            $scope.NewOrderUrl = baseUrl + '/omsservices/webapi/orders/countsaleschannelwise?startdate='+LastMonth+'&enddate='+NowDate;
            $scope.NewOrderStatus();

        }else if(data == 'inout'){
            $scope.outwardUrl = baseUrl + '/omsservices/webapi/inventory/outwardinventory?startdate='+LastMonth+'&enddate='+NowDate;
            $scope.outward();
        }else if(data == 'sku'){
            $scope.SKUurl.new = baseUrl + '/omsservices/webapi/orders/filtercount?state=new&startDate='+LastMonth+'&endDate='+NowDate;
            $scope.SKUurl.packed = baseUrl + '/omsservices/webapi/orders/filtercount?state=packed&startDate='+LastMonth+'&endDate='+NowDate;
            $scope.SKUurl.shipping = baseUrl + '/omsservices/webapi/orders/filtercount?state=shipping&startDate='+LastMonth+'&endDate='+NowDate;
            $scope.SKUurl.delivered = baseUrl + '/omsservices/webapi/orders/filtercount?state=delivered&startDate='+LastMonth+'&endDate='+NowDate;
            $scope.skuPreview();
        }
    }

}
