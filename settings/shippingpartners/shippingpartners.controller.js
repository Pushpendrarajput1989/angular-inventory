myApp.controller('shippingpartnersController', shippingpartnersController);

shippingpartnersController.$inject = ['$scope', '$http', '$location', 'baseUrl', 'growl','$cookies'];

function shippingpartnersController($scope, $http, $location, baseUrl, growl,$cookies) {
    $scope.addNewShippingPartnerClicked = false;
    $scope.isShippingName = false;
    $scope.isMetaEntered = [];
    $scope.shipPartnerMode = 'add';
    $scope.toggleShippingPartnerRow = function() {
        $scope.isMetaEntered = [];
        $scope.isShippingName = false;
        $scope.metaSubmitEnable = false;
        for(var i = 0;i<$scope.metapartnerData.length;i++){
            $scope.isMetaEntered.push(false);
        }
        // $scope.isMetaEntered = false;
        console.log($scope.addNewShippingPartnerClicked);
        $scope.addNewShippingPartnerClicked = !$scope.addNewShippingPartnerClicked;
    }

    $scope.$on('$routeChangeSuccess', function() {
        $scope.listOfShippingPartners();
    });

    // fetching list of sale channels from RestAPI OMS
    $scope.listOfShippingPartners = function() {
        var shippingPartnersUrl = baseUrl + "/omsservices/webapi/shippingcarriermetadata";
        $http.get(shippingPartnersUrl).success(function(data) {
            $scope.shippingPartnersData = data;
            console.log(data);
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                //$('#AuthError').modal('show');

                $cookies.put('isLoggedIn', false);
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    }

    $scope.isActive = function(clickedShippingPartner) {
        if ($scope.shippingPartnerName == clickedShippingPartner) {
            return true;
        }
        return false;
    };

    $scope.listOfSubShippingPartners = function(partnerData) {
        $scope.isMetaEntered =[];
        $scope.subpartnerData = null;
        $scope.addNewShippingPartnerClicked = false;
        console.log(partnerData);
        $scope.metaInfoValues = [];
        $scope.metapartnerData = [];
        $scope.metaInfoValues.push(partnerData.tableShippingCarrierMetaDataField1);
        $scope.metaInfoValues.push(partnerData.tableShippingCarrierMetaDataField2);
        $scope.metaInfoValues.push(partnerData.tableShippingCarrierMetaDataField3);
        $scope.metaInfoValues.push(partnerData.tableShippingCarrierMetaDataField4);
        $scope.metaInfoValues.push(partnerData.tableShippingCarrierMetaDataField5);
        $scope.metaInfoValues.push(partnerData.tableShippingCarrierMetaDataField6);
        $scope.metaInfoValues.push(partnerData.tableShippingCarrierMetaDataField7);
        $scope.metaInfoValues.push(partnerData.tableShippingCarrierMetaDataField8);
        $scope.metaInfoValues.push(partnerData.tableShippingCarrierMetaDataField9);
        $scope.metaInfoValues.push(partnerData.tableShippingCarrierMetaDataField10);
        console.log($scope.metaInfoValues);
        for (var i = 0; i < $scope.metaInfoValues.length; i++) {
            if ($scope.metaInfoValues[i] != null) {
                $scope.metapartnerData.push({
                    tableShippingCarrierMetaDataField: $scope.metaInfoValues[i],
                    tableShippingCarrierConfigVal: null
                })
            }
        }
        console.log($scope.metapartnerData);
        for(var i = 0;i<$scope.metapartnerData.length;i++){
            $scope.isMetaEntered.push(false);
        }
        $scope.partnerData = partnerData;
        $scope.shippingPartnerName = partnerData.tableShippingCarrierMetaDataName;
        var subshippingPartnersUrl = baseUrl + "/omsservices/webapi/shippingcarriermetadata/" + partnerData.idtableShippingCarrierMetaDataId + '/shippingcarrierconfigs';
        $http.get(subshippingPartnersUrl).success(function(data) {
            $scope.subShippingPartnersData = data;
            console.log(data);
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                //$('#AuthError').modal('show');

                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    }

    $scope.saveSubShippingPartner = function(subpartnerData, partnerData, metapartnerData) {
        $scope.isMetaEntered =[];
        $scope.metaSubmitEnable = false;
        if (!subpartnerData) {
            growl.error("Please enter the Shipping Partners Name");
            $scope.isShippingName = true;
        }
        if (subpartnerData.tableShippingCarrierConfigName == null) {
            growl.error("Please enter the Shipping Partners Name");
            $scope.isShippingName = true;
        }
        if (subpartnerData.tableShippingCarrierConfigName != null) {
            $scope.isShippingName = false;
        }
        if (metapartnerData != null) {
            for (var i = 0; i < metapartnerData.length; i++) {
                if (metapartnerData[i].tableShippingCarrierConfigVal == null || metapartnerData[i].tableShippingCarrierConfigVal == '' || metapartnerData[i].tableShippingCarrierConfigVal == undefined) {
                    growl.error(metapartnerData[i].tableShippingCarrierMetaDataField + " can't be empty");
                    $scope.isMetaEntered.push(true);
                } else {
                    $scope.isMetaEntered.push(false);
                }
            }   
        }
        for(var i =0;i<$scope.isMetaEntered.length;i++)
        {
            if($scope.isMetaEntered[i] == true){
                $scope.metaSubmitEnable = true;
            }
        }
        console.log($scope.isMetaEntered);
        console.log($scope.metaSubmitEnable);

        if ($scope.metaSubmitEnable == false && $scope.isShippingName == false) {
            console.log(metapartnerData);
            var postSubpartnerData = {
                "tableShippingCarrierConfigName": subpartnerData.tableShippingCarrierConfigName,
                "tableClientManifestTemplate": null,
                "tableClientShippingLabelTemplate": null,
                "tableShippingCarrierMetaData": partnerData
            }

            if (metapartnerData.length == 1) {
                postSubpartnerData.tableShippingCarrierConfigVal1 = metapartnerData[0].tableShippingCarrierConfigVal;
            }

            if (metapartnerData.length == 2) {
                postSubpartnerData.tableShippingCarrierConfigVal1 = metapartnerData[0].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal2 = metapartnerData[1].tableShippingCarrierConfigVal;
            }

            if (metapartnerData.length == 3) {
                postSubpartnerData.tableShippingCarrierConfigVal1 = metapartnerData[0].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal2 = metapartnerData[1].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal3 = metapartnerData[2].tableShippingCarrierConfigVal;
            }

            if (metapartnerData.length == 4) {
                postSubpartnerData.tableShippingCarrierConfigVal1 = metapartnerData[0].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal2 = metapartnerData[1].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal3 = metapartnerData[2].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal4 = metapartnerData[3].tableShippingCarrierConfigVal;
            }

            if (metapartnerData.length == 5) {
                postSubpartnerData.tableShippingCarrierConfigVal1 = metapartnerData[0].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal2 = metapartnerData[1].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal3 = metapartnerData[2].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal4 = metapartnerData[3].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal5 = metapartnerData[4].tableShippingCarrierConfigVal;
            }

            if (metapartnerData.length == 6) {
                postSubpartnerData.tableShippingCarrierConfigVal1 = metapartnerData[0].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal2 = metapartnerData[1].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal3 = metapartnerData[2].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal4 = metapartnerData[3].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal5 = metapartnerData[4].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal6 = metapartnerData[5].tableShippingCarrierConfigVal;

            }

            if (metapartnerData.length == 7) {
                postSubpartnerData.tableShippingCarrierConfigVal1 = metapartnerData[0].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal2 = metapartnerData[1].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal3 = metapartnerData[2].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal4 = metapartnerData[3].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal5 = metapartnerData[4].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal6 = metapartnerData[5].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal7 = metapartnerData[6].tableShippingCarrierConfigVal;
            }

            if (metapartnerData.length == 8) {
                postSubpartnerData.tableShippingCarrierConfigVal1 = metapartnerData[0].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal2 = metapartnerData[1].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal3 = metapartnerData[2].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal4 = metapartnerData[3].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal5 = metapartnerData[4].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal6 = metapartnerData[5].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal7 = metapartnerData[6].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal8 = metapartnerData[7].tableShippingCarrierConfigVal;
            }

            if (metapartnerData.length == 9) {
                postSubpartnerData.tableShippingCarrierConfigVal1 = metapartnerData[0].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal2 = metapartnerData[1].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal3 = metapartnerData[2].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal4 = metapartnerData[3].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal5 = metapartnerData[4].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal6 = metapartnerData[5].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal7 = metapartnerData[6].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal8 = metapartnerData[7].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal9 = metapartnerData[8].tableShippingCarrierConfigVal;
            }

            if (metapartnerData.length == 10) {
                postSubpartnerData.tableShippingCarrierConfigVal1 = metapartnerData[0].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal2 = metapartnerData[1].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal3 = metapartnerData[2].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal4 = metapartnerData[3].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal5 = metapartnerData[4].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal6 = metapartnerData[5].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal7 = metapartnerData[6].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal8 = metapartnerData[7].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal9 = metapartnerData[8].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal10 = metapartnerData[9].tableShippingCarrierConfigVal;
            }


            console.log(postSubpartnerData);

            $http({
                method: 'POST',
                url: baseUrl + '/omsservices/webapi/shippingcarrierconfigs',
                data: postSubpartnerData,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(res) {
                console.log(res);
                if (res) {
                    growl.success("New Shipping Partner Added for " + partnerData.tableShippingCarrierMetaDataName + " with name " + subpartnerData.tableShippingCarrierConfigName);
                    $scope.subpartnerData = null;
                    subpartnerData = null;
                    $scope.listOfSubShippingPartners(partnerData);
                    $scope.shipPartnerMode = 'add';
                    $scope.addNewShippingPartnerClicked = false;
                }
            }).error(function(error, status) {
                console.log(error);
                console.log(status);
                if (status == 401) {
                    //$('#AuthError').modal('show');


                    $cookies.put('isLoggedIn', false);
                    growl.error('Your session has been expired. You need to Login again.');
                    $location.path('/login');
                }
                growl.error("Shipping Partner can't be Added");
            });
        }
    }

    $scope.openChannel = function() {
        $scope.isShippingName = false;
        $scope.isMetaEntered = false;
        $scope.subpartnerData = null;
        subpartnerData = null;
        $scope.addNewShippingPartnerClicked = true;
        $scope.shipPartnerMode = 'add';
        $scope.metapartnerData = [];
        for (var i = 0; i < $scope.metaInfoValues.length; i++) {
            if ($scope.metaInfoValues[i] != null) {
                $scope.metapartnerData.push({
                    tableShippingCarrierMetaDataField: $scope.metaInfoValues[i],
                    tableShippingCarrierConfigVal: null
                })
            }
        }
    }
    $scope.editShippingCarrierConfig = function(configid) {
        $scope.addNewShippingPartnerClicked = true;
        $scope.shipPartnerMode = 'edit';
        var shippingCarrierConfigUrl = baseUrl + "/omsservices/webapi/shippingcarrierconfigs/" + configid;
        $http.get(shippingCarrierConfigUrl).success(function(data) {
            console.log(data);
            $scope.subpartnerData = data;
            $scope.metaInfoValues = [];
            $scope.metapartnerData = [];
            $scope.metaValues = [];
            $scope.metaInfoValues.push(data.tableShippingCarrierMetaData.tableShippingCarrierMetaDataField1);
            $scope.metaInfoValues.push(data.tableShippingCarrierMetaData.tableShippingCarrierMetaDataField2);
            $scope.metaInfoValues.push(data.tableShippingCarrierMetaData.tableShippingCarrierMetaDataField3);
            $scope.metaInfoValues.push(data.tableShippingCarrierMetaData.tableShippingCarrierMetaDataField4);
            $scope.metaInfoValues.push(data.tableShippingCarrierMetaData.tableShippingCarrierMetaDataField5);
            $scope.metaInfoValues.push(data.tableShippingCarrierMetaData.tableShippingCarrierMetaDataField6);
            $scope.metaInfoValues.push(data.tableShippingCarrierMetaData.tableShippingCarrierMetaDataField7);
            $scope.metaInfoValues.push(data.tableShippingCarrierMetaData.tableShippingCarrierMetaDataField8);
            $scope.metaInfoValues.push(data.tableShippingCarrierMetaData.tableShippingCarrierMetaDataField9);
            $scope.metaInfoValues.push(data.tableShippingCarrierMetaData.tableShippingCarrierMetaDataField10);

            $scope.metaValues.push(data.tableShippingCarrierConfigVal1);
            $scope.metaValues.push(data.tableShippingCarrierConfigVal2);
            $scope.metaValues.push(data.tableShippingCarrierConfigVal3);
            $scope.metaValues.push(data.tableShippingCarrierConfigVal4);
            $scope.metaValues.push(data.tableShippingCarrierConfigVal5);
            $scope.metaValues.push(data.tableShippingCarrierConfigVal6);
            $scope.metaValues.push(data.tableShippingCarrierConfigVal7);
            $scope.metaValues.push(data.tableShippingCarrierConfigVal8);
            $scope.metaValues.push(data.tableShippingCarrierConfigVal9);
            $scope.metaValues.push(data.tableShippingCarrierConfigVal10);
            console.log($scope.metaInfoValues);
            for (var i = 0; i < $scope.metaInfoValues.length; i++) {
                if ($scope.metaInfoValues[i] != null) {
                    $scope.metapartnerData.push({
                        tableShippingCarrierMetaDataField: $scope.metaInfoValues[i],
                        tableShippingCarrierConfigVal: $scope.metaValues[i]
                    })
                }
            }
        }).error(function(error, status) {
            console.log(error);
            console.log(status);
            if (status == 401) {
                //$('#AuthError').modal('show');

                $cookies.put('isLoggedIn', false);
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    }

    $scope.editSubShippingPartner = function(subpartnerData, partnerData, metapartnerData) {
        $scope.isMetaEntered =[];
        $scope.metaSubmitEnable = false;
        if (!subpartnerData) {
            growl.error("Please enter the Shipping Partner Name");
            $scope.isShippingName = true;
        }
        if (subpartnerData.tableShippingCarrierConfigName == '') {
            growl.error("Please enter the Shipping Partner Name");
            $scope.isShippingName = true;
        }
        if (subpartnerData.tableShippingCarrierConfigName != '') {
            $scope.isShippingName = false;
        }
        if (metapartnerData != null) {
            for (var i = 0; i < metapartnerData.length; i++) {
                if (metapartnerData[i].tableShippingCarrierConfigVal == null || metapartnerData[i].tableShippingCarrierConfigVal == '' || metapartnerData[i].tableShippingCarrierConfigVal == undefined) {
                    growl.error(metapartnerData[i].tableShippingCarrierMetaDataField + " can't be empty");
                    $scope.isMetaEntered.push(true);
                } else {
                    $scope.isMetaEntered.push(false);
                }
            }   
        }
        for(var i =0;i<$scope.isMetaEntered.length;i++)
        {
            if($scope.isMetaEntered[i] == true){
                $scope.metaSubmitEnable = true;
            }
        }
        console.log($scope.isMetaEntered);
        console.log($scope.metaSubmitEnable);
        if ($scope.metaSubmitEnable == false && $scope.isShippingName == false) {

            console.log(metapartnerData);
            var postSubpartnerData = {
                "tableShippingCarrierConfigName": subpartnerData.tableShippingCarrierConfigName,
                "tableClientManifestTemplate": null,
                "tableClientShippingLabelTemplate": null,
                "tableShippingCarrierMetaData": partnerData
            }

            if (metapartnerData.length == 1) {
                postSubpartnerData.tableShippingCarrierConfigVal1 = metapartnerData[0].tableShippingCarrierConfigVal;
            }

            if (metapartnerData.length == 2) {
                postSubpartnerData.tableShippingCarrierConfigVal1 = metapartnerData[0].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal2 = metapartnerData[1].tableShippingCarrierConfigVal;
            }

            if (metapartnerData.length == 3) {
                postSubpartnerData.tableShippingCarrierConfigVal1 = metapartnerData[0].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal2 = metapartnerData[1].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal3 = metapartnerData[2].tableShippingCarrierConfigVal;
            }

            if (metapartnerData.length == 4) {
                postSubpartnerData.tableShippingCarrierConfigVal1 = metapartnerData[0].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal2 = metapartnerData[1].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal3 = metapartnerData[2].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal4 = metapartnerData[3].tableShippingCarrierConfigVal;
            }

            if (metapartnerData.length == 5) {
                postSubpartnerData.tableShippingCarrierConfigVal1 = metapartnerData[0].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal2 = metapartnerData[1].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal3 = metapartnerData[2].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal4 = metapartnerData[3].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal5 = metapartnerData[4].tableShippingCarrierConfigVal;
            }

            if (metapartnerData.length == 6) {
                postSubpartnerData.tableShippingCarrierConfigVal1 = metapartnerData[0].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal2 = metapartnerData[1].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal3 = metapartnerData[2].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal4 = metapartnerData[3].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal5 = metapartnerData[4].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal6 = metapartnerData[5].tableShippingCarrierConfigVal;

            }

            if (metapartnerData.length == 7) {
                postSubpartnerData.tableShippingCarrierConfigVal1 = metapartnerData[0].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal2 = metapartnerData[1].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal3 = metapartnerData[2].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal4 = metapartnerData[3].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal5 = metapartnerData[4].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal6 = metapartnerData[5].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal7 = metapartnerData[6].tableShippingCarrierConfigVal;
            }

            if (metapartnerData.length == 8) {
                postSubpartnerData.tableShippingCarrierConfigVal1 = metapartnerData[0].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal2 = metapartnerData[1].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal3 = metapartnerData[2].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal4 = metapartnerData[3].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal5 = metapartnerData[4].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal6 = metapartnerData[5].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal7 = metapartnerData[6].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal8 = metapartnerData[7].tableShippingCarrierConfigVal;
            }

            if (metapartnerData.length == 9) {
                postSubpartnerData.tableShippingCarrierConfigVal1 = metapartnerData[0].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal2 = metapartnerData[1].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal3 = metapartnerData[2].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal4 = metapartnerData[3].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal5 = metapartnerData[4].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal6 = metapartnerData[5].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal7 = metapartnerData[6].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal8 = metapartnerData[7].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal9 = metapartnerData[8].tableShippingCarrierConfigVal;
            }

            if (metapartnerData.length == 10) {
                postSubpartnerData.tableShippingCarrierConfigVal1 = metapartnerData[0].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal2 = metapartnerData[1].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal3 = metapartnerData[2].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal4 = metapartnerData[3].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal5 = metapartnerData[4].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal6 = metapartnerData[5].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal7 = metapartnerData[6].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal8 = metapartnerData[7].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal9 = metapartnerData[8].tableShippingCarrierConfigVal;
                postSubpartnerData.tableShippingCarrierConfigVal10 = metapartnerData[9].tableShippingCarrierConfigVal;
            }


            console.log(postSubpartnerData);

            $http({
                method: 'PUT',
                url: baseUrl + '/omsservices/webapi/shippingcarrierconfigs/' + subpartnerData.idtableShippingCarrierConfigId,
                data: postSubpartnerData,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(res) {
                console.log(res);
                if (res) {
                    growl.success("Shipping Partner Updated for " + partnerData.tableShippingCarrierMetaDataName + " with name " + subpartnerData.tableShippingCarrierConfigName);
                    $scope.subpartnerData = null;
                    subpartnerData = null;
                    $scope.listOfSubShippingPartners(partnerData);
                    $scope.shipPartnerMode = 'add';
                    $scope.addNewShippingPartnerClicked = false;
                }
            }).error(function(error, status) {
                console.log(error);
                console.log(status);
                if (status == 401) {
                    //$('#AuthError').modal('show');
                    $cookies.put('isLoggedIn', false);
                    growl.error('Your session has been expired. You need to Login again.');
                    $location.path('/login');
                }
                growl.error("Shipping Partner can't Be Added");
            });
        }
    }
    $scope.cancelData = function(partnerData) {
        $scope.addNewShippingPartnerClicked = false;
        $scope.shipPartnerMode = 'add';
        $scope.listOfSubShippingPartners(partnerData)
    }

    $scope.openHelpModal = function(shippingPartnerId) {
        console.log(shippingPartnerId);

        if (shippingPartnerId == 1) {
            $('#helpFedexModal').modal('show');
        }
        if (shippingPartnerId == 4) {
            $('#helpxpressBeesModal').modal('show');
        }
        if (shippingPartnerId == 3) {
            $('#helpecomXpressModal').modal('show');
        }
    }

    $scope.clearHelpDialog = function() {
        $('#helpFedexModal').modal('hide');
        $('#helpecomXpressModal').modal('hide');
        $('#helpxpressBeesModal').modal('hide');
    }    
}
