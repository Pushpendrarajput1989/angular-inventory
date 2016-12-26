myApp.controller('saleschannelsController', saleschannelsController);

saleschannelsController.$inject = ['$scope', '$http', '$location', 'baseUrl', 'growl','$cookies'];

function saleschannelsController($scope, $http, $location, baseUrl, growl,$cookies) {
    $scope.addNewSaleChannelClicked = false;
    $scope.showVerifyIntegration = false;
    $scope.integrationVerified = false;
    $scope.integrationNotVerified = false;

    $scope.saleChannelMode = 'add';

    $scope.toggleSaleChannelRow = function() {
        console.log($scope.addNewSaleChannelClicked);
        $scope.addNewSaleChannelClicked = !$scope.addNewSaleChannelClicked;
    }

    $scope.$on('$routeChangeSuccess', function() {
        $scope.listOfSaleChannel();
    });

    // fetching list of sale channels from RestAPI OMS
    $scope.listOfSaleChannel = function() {
        var saleChannelUrl = baseUrl + "/omsservices/webapi/saleschannelmetadata";
        $http.get(saleChannelUrl).success(function(data) {
            $scope.saleChannelData = data;
            console.log(data);
        }).error(function(error, status) {

            console.log(error);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);
                $location.path('/login');
            }
        });
    }

    $scope.isActive = function(clickedSalesChannel) {
        if ($scope.channelName == clickedSalesChannel) {
            return true;
        }
        return false;
    };

    $scope.listOfSubSaleChannels = function(channelData) {
        $scope.showVerifyIntegration = false;
        $scope.integrationVerified = false;
        $scope.integrationNotVerified = false;
        console.log(channelData);

        $scope.subChannelData = [];
        $scope.addNewSaleChannelClicked = false;
        console.log(channelData);
        $scope.metaInfoValues = [];
        $scope.metaChannelData = [];
        $scope.metaInfoValues.push(channelData.tableSalesChannelMetaInfoField1);
        $scope.metaInfoValues.push(channelData.tableSalesChannelMetaInfoField2);
        $scope.metaInfoValues.push(channelData.tableSalesChannelMetaInfoField3);
        $scope.metaInfoValues.push(channelData.tableSalesChannelMetaInfoField4);
        $scope.metaInfoValues.push(channelData.tableSalesChannelMetaInfoField5);
        $scope.metaInfoValues.push(channelData.tableSalesChannelMetaInfoField6);
        $scope.metaInfoValues.push(channelData.tableSalesChannelMetaInfoField7);
        $scope.metaInfoValues.push(channelData.tableSalesChannelMetaInfoField8);
        $scope.metaInfoValues.push(channelData.tableSalesChannelMetaInfoField9);
        $scope.metaInfoValues.push(channelData.tableSalesChannelMetaInfoField10);
        console.log($scope.metaInfoValues);
        for (var i = 0; i < $scope.metaInfoValues.length; i++) {
            if ($scope.metaInfoValues[i] != null) {
                $scope.metaChannelData.push({
                    tableSalesChannelValueMetaValue: $scope.metaInfoValues[i],
                    tableSalesChannelValueInfoValue: null
                })
            }
        }
        $scope.isKeyEntered = [];
        for (var i = 0; i < $scope.metaChannelData.length; i++) {
            if ($scope.metaChannelData[i].tableSalesChannelValueMetaValue) {
                $scope.isKeyEntered[i] = false;
            }
        }
        $scope.channelData = channelData;
        $scope.channelName = channelData.tableSalesChannelMetaInfoName;
        var subSaleChannelUrl = baseUrl + "/omsservices/webapi/saleschannelmetadata/" + channelData.idtableSalesChannelMetaInfoId + "/saleschannels";
        $http.get(subSaleChannelUrl).success(function(data) {
            $scope.subSaleChannelData = data;
            console.log(data);
        }).error(function(error, status) {

            console.log(error);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);
                $location.path('/login');
            }
        });
    }

    $scope.channelNameEntered = function(tableSalesChannelValueInfoName) {
        if (!tableSalesChannelValueInfoName) {
            $scope.isChannelNameEntered = true;
        } else {
            $scope.isChannelNameEntered = false;
        }
    };

    $scope.saveSubChannel = function(subChannelData, channelData, metaChannelData) {

        var isOkToSave = true;

        if (!$scope.subChannelData) {
            growl.error("Please Enter the Sub Channel Name");
            $scope.isChannelNameEntered = true;
            isOkToSave = false;
        } else if (!$scope.subChannelData.tableSalesChannelValueInfoName) {
            growl.error("Please Enter the Sub Channel Name");
            $scope.isChannelNameEntered = true;
            isOkToSave = false;
        } else if ($scope.subChannelData.tableSalesChannelValueInfoName.length > 45) {
            growl.error("Sub Channel Name cannot be greater than 45 characters!");
            $scope.isChannelNameEntered = true;
            isOkToSave = false;
        } else if ($scope.subSaleChannelData.length > 0) {
            for (var i = 0; i < $scope.subSaleChannelData.length; i++) {
                if (subChannelData.tableSalesChannelValueInfoName == $scope.subSaleChannelData[i].tableSalesChannelValueInfoName) {
                    growl.error("Please enter a unique Sales Channel Name!");
                    $scope.isChannelNameEntered = true;
                    isOkToSave = false;
                    break;
                }
            }
        }
        if (isOkToSave) {
            if (!$scope.metaChannelData) {
                growl.error("Please enter the " + $scope.metaChannelData[0].tableSalesChannelValueMetaValue + "!");
                $scope.isKeyEntered[0] = true;
                isOkToSave = false;
            } else if ($scope.metaChannelData.length > 0) {
                for (var i = 0; i < $scope.metaChannelData.length; i++) {
                    if (!$scope.metaChannelData[i].tableSalesChannelValueInfoValue) {
                        growl.error("Please enter the " + $scope.metaChannelData[i].tableSalesChannelValueMetaValue + "!");
                        $scope.isKeyEntered[i] = true;
                        isOkToSave = false;
                        break;
                    }
                }
            }
        }
        if (isOkToSave) {
            if (channelData.tableSalesChannelType.idtableSalesChannelTypeId == 2) {
                if ($scope.saleChannelMode == "add") {
                    $scope.saveSubChannelData(subChannelData, channelData, metaChannelData);
                } else if ($scope.saleChannelMode == "edit") {
                    $scope.editSubChannel(subChannelData, channelData, metaChannelData);
                }
            } else if ($scope.showVerifyIntegration) {
                growl.error("Please verify the integration!");
            } else if ($scope.integrationNotVerified) {
                growl.error("Verification has failed! Please verify the integration again!");
                $scope.showVerifyIntegration = true;
                $scope.integrationNotVerified = false;
                $scope.integrationVerified = false;
            } else if ($scope.integrationVerified) {
                if ($scope.saleChannelMode == "add") {
                    $scope.saveSubChannelData(subChannelData, channelData, metaChannelData);
                } else if ($scope.saleChannelMode == "edit") {
                    $scope.editSubChannel(subChannelData, channelData, metaChannelData);
                }
            }
        }
    };

    $scope.saveSubChannelData = function(subChannelData, channelData, metaChannelData) {
        console.log(metaChannelData);
        var postSubChannelData = {
            "tableSalesChannelValueInfoName": subChannelData.tableSalesChannelValueInfoName,
            "tableSalesChannelValueInfoLastOrderPullDatetime": null,
            "tableSalesChannelValueInfoLastProductSyncDatetime": null,
            "tableSalesChannelClientEmailTemplate": null,
            "tableSalesChannelClientInvoiceTemplate": null,
            "tableSalesChannelClientPackingTemplate": null,

            "tableSalesChannelMetaInfo": channelData
        }

        if (metaChannelData.length == 1) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[i].tableSalesChannelValueInfoValue;
        } else if (metaChannelData.length == 2) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
        } else if (metaChannelData.length == 3) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
        } else if (metaChannelData.length == 4) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue4 = metaChannelData[3].tableSalesChannelValueInfoValue;
        } else if (metaChannelData.length == 5) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue4 = metaChannelData[3].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue5 = metaChannelData[4].tableSalesChannelValueInfoValue;
        } else if (metaChannelData.length == 6) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue4 = metaChannelData[3].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue5 = metaChannelData[4].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue6 = metaChannelData[5].tableSalesChannelValueInfoValue;
        } else if (metaChannelData.length == 7) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue4 = metaChannelData[3].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue5 = metaChannelData[4].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue6 = metaChannelData[5].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue7 = metaChannelData[6].tableSalesChannelValueInfoValue;
        } else if (metaChannelData.length == 8) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue4 = metaChannelData[3].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue5 = metaChannelData[4].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue6 = metaChannelData[5].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue7 = metaChannelData[6].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue8 = metaChannelData[7].tableSalesChannelValueInfoValue;
        } else if (metaChannelData.length == 9) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue4 = metaChannelData[3].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue5 = metaChannelData[4].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue6 = metaChannelData[5].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue7 = metaChannelData[6].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue8 = metaChannelData[7].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue9 = metaChannelData[8].tableSalesChannelValueInfoValue;
        } else if (metaChannelData.length == 10) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue4 = metaChannelData[3].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue5 = metaChannelData[4].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue6 = metaChannelData[5].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue7 = metaChannelData[6].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue8 = metaChannelData[7].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue9 = metaChannelData[8].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue10 = metaChannelData[9].tableSalesChannelValueInfoValue;
        }


        console.log(postSubChannelData);

        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/saleschannels',
            data: postSubChannelData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            console.log(res);
            if (res) {
                $scope.subChannelData = null;
                subChannelData = null;
                growl.success("New Sales Channel Added for " + channelData.tableSalesChannelMetaInfoName);
                $scope.listOfSubSaleChannels(channelData);
                $scope.addNewSaleChannelClicked = false;
            }
        }).error(function(error, status) {

            console.log(error);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);
                $location.path('/login');
            }
            growl.error("Sale Channel Cannot Be Added");
        });
    };

    $scope.openChannel = function() {
        $scope.subChannelData = [];
        subChannelData = [];
        $scope.addNewSaleChannelClicked = true;
        $scope.saleChannelMode = 'add';
        $scope.metaChannelData = [];
        for (var i = 0; i < $scope.metaInfoValues.length; i++) {
            if ($scope.metaInfoValues[i] != null) {
                $scope.metaChannelData.push({
                    tableSalesChannelValueMetaValue: $scope.metaInfoValues[i],
                    tableSalesChannelValueInfoValue: null
                })
            }
        }
        $scope.showVerifyIntegration = false;
        $scope.isKeyEntered = [];
        for (var i = 0; i < $scope.metaChannelData.length; i++) {
            if ($scope.metaChannelData[i].tableSalesChannelValueMetaValue) {
                $scope.isKeyEntered[i] = false;
            }
        }
    };

    $scope.editSaleChannelConfig = function(configid) {
        $scope.authTokenEntered(0);
        $scope.addNewSaleChannelClicked = true;
        $scope.saleChannelMode = 'edit';
        var saleChannelConfigUrl = baseUrl + "/omsservices/webapi/saleschannels/" + configid;
        $http.get(saleChannelConfigUrl).success(function(data) {
            if (data != null) {
                console.log(data);
                $scope.subChannelData = data;
                $scope.metaInfoValues = [];
                $scope.metaChannelData = [];
                $scope.metaValues = [];
                console.log(data.tableSalesChannelMetaInfo);


                $scope.metaValues.push(data.tableSalesChannelValueInfoValue1);
                $scope.metaValues.push(data.tableSalesChannelValueInfoValue2);
                $scope.metaValues.push(data.tableSalesChannelValueInfoValue3);
                $scope.metaValues.push(data.tableSalesChannelValueInfoValue4);
                $scope.metaValues.push(data.tableSalesChannelValueInfoValue5);
                $scope.metaValues.push(data.tableSalesChannelValueInfoValue6);
                $scope.metaValues.push(data.tableSalesChannelValueInfoValue7);
                $scope.metaValues.push(data.tableSalesChannelValueInfoValue8);
                $scope.metaValues.push(data.tableSalesChannelValueInfoValue9);
                $scope.metaValues.push(data.tableSalesChannelValueInfoValue10);

                $scope.metaInfoValues.push(data.tableSalesChannelMetaInfo.tableSalesChannelMetaInfoField1);
                $scope.metaInfoValues.push(data.tableSalesChannelMetaInfo.tableSalesChannelMetaInfoField2);
                $scope.metaInfoValues.push(data.tableSalesChannelMetaInfo.tableSalesChannelMetaInfoField3);
                $scope.metaInfoValues.push(data.tableSalesChannelMetaInfo.tableSalesChannelMetaInfoField4);
                $scope.metaInfoValues.push(data.tableSalesChannelMetaInfo.tableSalesChannelMetaInfoField5);
                $scope.metaInfoValues.push(data.tableSalesChannelMetaInfo.tableSalesChannelMetaInfoField6);
                $scope.metaInfoValues.push(data.tableSalesChannelMetaInfo.tableSalesChannelMetaInfoField7);
                $scope.metaInfoValues.push(data.tableSalesChannelMetaInfo.tableSalesChannelMetaInfoField8);
                $scope.metaInfoValues.push(data.tableSalesChannelMetaInfo.tableSalesChannelMetaInfoField9);
                $scope.metaInfoValues.push(data.tableSalesChannelMetaInfo.tableSalesChannelMetaInfoField10);


                console.log($scope.metaInfoValues);
                for (var i = 0; i < $scope.metaInfoValues.length; i++) {
                    if ($scope.metaInfoValues[i] != null) {
                        $scope.metaChannelData.push({
                            tableSalesChannelValueMetaValue: $scope.metaInfoValues[i],
                            tableSalesChannelValueInfoValue: $scope.metaValues[i]
                        })
                    }
                }
                $scope.isKeyEntered = [];
                for (var i = 0; i < $scope.metaChannelData.length; i++) {
                    if ($scope.metaChannelData[i].tableSalesChannelValueMetaValue) {
                        $scope.isKeyEntered[i] = false;
                    }
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

    $scope.editSubChannel = function(subChannelData, channelData, metaChannelData) {

        console.log(metaChannelData);
        var postSubChannelData = {
            "tableSalesChannelValueInfoName": subChannelData.tableSalesChannelValueInfoName,
            "tableSalesChannelValueInfoLastOrderPullDatetime": null,
            "tableSalesChannelValueInfoLastProductSyncDatetime": null,
            "tableSalesChannelClientEmailTemplate": null,
            "tableSalesChannelClientInvoiceTemplate": null,
            "tableSalesChannelClientPackingTemplate": null,

            "tableSalesChannelMetaInfo": channelData
        }

        if (metaChannelData.length == 1) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[i].tableSalesChannelValueInfoValue;
        } else if (metaChannelData.length == 2) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
        } else if (metaChannelData.length == 3) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
        } else if (metaChannelData.length == 4) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue4 = metaChannelData[3].tableSalesChannelValueInfoValue;
        } else if (metaChannelData.length == 5) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue4 = metaChannelData[3].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue5 = metaChannelData[4].tableSalesChannelValueInfoValue;
        } else if (metaChannelData.length == 6) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue4 = metaChannelData[3].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue5 = metaChannelData[4].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue6 = metaChannelData[5].tableSalesChannelValueInfoValue;
        } else if (metaChannelData.length == 7) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue4 = metaChannelData[3].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue5 = metaChannelData[4].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue6 = metaChannelData[5].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue7 = metaChannelData[6].tableSalesChannelValueInfoValue;
        } else if (metaChannelData.length == 8) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue4 = metaChannelData[3].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue5 = metaChannelData[4].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue6 = metaChannelData[5].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue7 = metaChannelData[6].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue8 = metaChannelData[7].tableSalesChannelValueInfoValue;
        } else if (metaChannelData.length == 9) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue4 = metaChannelData[3].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue5 = metaChannelData[4].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue6 = metaChannelData[5].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue7 = metaChannelData[6].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue8 = metaChannelData[7].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue9 = metaChannelData[8].tableSalesChannelValueInfoValue;
        } else if (metaChannelData.length == 10) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue4 = metaChannelData[3].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue5 = metaChannelData[4].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue6 = metaChannelData[5].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue7 = metaChannelData[6].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue8 = metaChannelData[7].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue9 = metaChannelData[8].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue10 = metaChannelData[9].tableSalesChannelValueInfoValue;
        }

        console.log(postSubChannelData);

        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/saleschannels/' + subChannelData.idtableSalesChannelValueInfoId,
            data: postSubChannelData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            console.log(res);
            if (res) {
                $scope.subChannelData = null;
                subChannelData = null;
                growl.success("Sale Channel Updated for " + channelData.tableSalesChannelMetaInfoName);
                $scope.listOfSubSaleChannels(channelData);
                $scope.addNewSaleChannelClicked = false;
            }
        }).error(function(error, status) {

            console.log(error);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                //$('#AuthError').modal('show');
                $cookies.put('isLoggedIn', false);
                $location.path('/login');
            }
            growl.error("Sale Channel Cannot Be Updated");
        });
    }

    $scope.authTokenEntered = function(index) {
        $scope.showVerifyIntegration = true;
        $scope.integrationVerified = false;
        $scope.integrationNotVerified = false;
        $scope.isKeyEntered[index] = false;
    };
    $scope.cancelData = function(channelData) {
        $scope.addNewSaleChannelClicked = false;
        $scope.saleChannelMode = 'add';
        $scope.listOfSubSaleChannels(channelData)
    }

    $scope.verifyIntegration = function(subChannelData, channelData, metaChannelData) {
        console.log(metaChannelData);
        var postSubChannelData = {
            "tableSalesChannelValueInfoName": subChannelData.tableSalesChannelValueInfoName,
            "tableSalesChannelValueInfoLastOrderPullDatetime": null,
            "tableSalesChannelValueInfoLastProductSyncDatetime": null,
            "tableSalesChannelClientEmailTemplate": null,
            "tableSalesChannelClientInvoiceTemplate": null,
            "tableSalesChannelClientPackingTemplate": null,
            "tableSalesChannelMetaInfo": channelData
        }


        if (metaChannelData.length == 1) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[i].tableSalesChannelValueInfoValue;
        }

        if (metaChannelData.length == 2) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
        }

        if (metaChannelData.length == 3) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
        }

        if (metaChannelData.length == 4) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue4 = metaChannelData[3].tableSalesChannelValueInfoValue;
        }

        if (metaChannelData.length == 5) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue4 = metaChannelData[3].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue5 = metaChannelData[4].tableSalesChannelValueInfoValue;
        }

        if (metaChannelData.length == 6) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue4 = metaChannelData[3].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue5 = metaChannelData[4].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue6 = metaChannelData[5].tableSalesChannelValueInfoValue;

        }

        if (metaChannelData.length == 7) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue4 = metaChannelData[3].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue5 = metaChannelData[4].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue6 = metaChannelData[5].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue7 = metaChannelData[6].tableSalesChannelValueInfoValue;
        }

        if (metaChannelData.length == 8) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue4 = metaChannelData[3].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue5 = metaChannelData[4].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue6 = metaChannelData[5].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue7 = metaChannelData[6].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue8 = metaChannelData[7].tableSalesChannelValueInfoValue;
        }

        if (metaChannelData.length == 9) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue4 = metaChannelData[3].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue5 = metaChannelData[4].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue6 = metaChannelData[5].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue7 = metaChannelData[6].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue8 = metaChannelData[7].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue9 = metaChannelData[8].tableSalesChannelValueInfoValue;
        }

        if (metaChannelData.length == 10) {
            postSubChannelData.tableSalesChannelValueInfoValue1 = metaChannelData[0].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue2 = metaChannelData[1].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue3 = metaChannelData[2].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue4 = metaChannelData[3].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue5 = metaChannelData[4].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue6 = metaChannelData[5].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue7 = metaChannelData[6].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue8 = metaChannelData[7].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue9 = metaChannelData[8].tableSalesChannelValueInfoValue;
            postSubChannelData.tableSalesChannelValueInfoValue10 = metaChannelData[9].tableSalesChannelValueInfoValue;
        }


        console.log(postSubChannelData);

        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/saleschannels/checkserviceavailability',
            data: postSubChannelData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            if (res != null) {
                $scope.showVerifyIntegration = false;
                console.log(res);
                if (res) {
                    $scope.integrationVerified = true;
                    growl.success("Verified Successfully!");
                }
                if (!res) {
                    $scope.integrationNotVerified = true;
                    growl.error("Verification Failed!");
                }
            }
        }).error(function(error, status) {

            console.log(error);
            if (status == 401) {
                growl.error('Your session has been expired. You need to login again.');
                $cookies.put('isLoggedIn', false);
                $location.path('/login');
            }
            growl.error("Sale Channel could not Be updated at this time");
        });
    }

    $scope.openHelpModal = function(channelId) {
        console.log(channelId);

        if (channelId == 1) {
            $('#helpAmazonModal').modal('show');
        }
        if (channelId == 3) {
            $('#helpMagentoModal').modal('show');
        }
        if (channelId == 4) {
            $('#helpFlipkartModal').modal('show');
        }
        if (channelId == 5) {
            $('#helpftpModal').modal('show');
        }
    }

    $scope.clearHelpDialog = function() {
        $('#helpMagentoModal').modal('hide');
        $('#helpAmazonModal').modal('hide');
        $('#helpftpModal').modal('hide');
        $('#helpFlipkartModal').modal('hide');
    }
}
