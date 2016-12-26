myApp.controller('analyticsController', analyticsController);

analyticsController.$inject = ['$scope', '$http', '$location', 'fileUpload', 'baseUrl', 'growl', 'Upload'];

function analyticsController($scope, $http, $location, fileUpload, baseUrl, growl, Upload) {

    var colors = ["#F0592B", "#83BD41", "#00ACE4", "#FDB813", "#EA2123"];
    $scope.data = null;
    $scope.baseSkuUrl = baseUrl + '/omsservices/webapi/skus/search?search=';

    $scope.$on('$routeChangeSuccess', function() {
        $scope.initChart();
    });
    $scope.options = {
        chart: {
            type: 'multiBarChart',
            height: 700,
            margin: {
                top: 30,
                right: 20,
                bottom: 100,
                left: 80
            },
            showControls: false,
            stacked: true,
            x: function(d) {
                return d.label;
            },
            y: function(d) {
                return d.value;
            },
            valueFormat: function(d) {
                return d3.format(',.0f')(d);
            },
            color: function(d, i) {
                return (d.data && d.data.color) || colors[i % colors.length]
            },
            showValues: false,
            duration: 1000,
            reduceXTicks: false,
            xAxis: {
                axisLabel: 'Week Start Date',
                rotateLabels: -45
            },
            yAxis: {
                axisLabelDistance: 10
            },
            legend: {
                maxKeyLength: 40
            },
            tooltip: {
                contentGenerator: function(e) {
                    var series = e.series[0];
                    if (series.value === null || series.value == 0) return;

                    var header =
                        "<thead>" +
                        "<tr>" +
                        "<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
                        "</tr>" +
                        "</thead>";

                    var rows =
                        "<tr>" +
                        "<td class='key'>" + series.key.substring(0, series.key.length - 4) + ": </td>" +
                        "<td class='x-value'><strong>" + series.value + "</strong></td>" +
                        "</tr>";

                    return "<table>" +
                        header +
                        "<tbody>" +
                        rows +
                        "</tbody>" +
                        "</table>";
                }
            }
        }
    };

    //Start Date and End Date Validations Starts Here
    var todayDate = new Date();

    $scope.startmaxDate = new Date(
        todayDate.getFullYear(),
        todayDate.getMonth(),
        todayDate.getDate()
    );

    $scope.endmaxDate = new Date(
        todayDate.getFullYear(),
        todayDate.getMonth(),
        todayDate.getDate()
    );

    $scope.initChart = function() {
        $scope.listOfChannels();

        $scope.dateRange = "3m";
        $scope.chartValueType = "value";
        $scope.chartValue = 0;

        $scope.getDateRange();

        $scope.getChart();

        $scope.sendStartDate($scope.start1Date);
        $scope.sendEndDate($scope.end1Date);
    };


    $scope.sendStartDate = function(date) {
        console.log(date);
        $scope.startDateData = new Date(date);
        $scope.endminDate = new Date(
            $scope.startDateData.getFullYear(),
            $scope.startDateData.getMonth(),
            $scope.startDateData.getDate());
    };

    $scope.sendEndDate = function(date) {
        console.log(date);
        $scope.endDateData = new Date(date);
        $scope.startmaxDate = new Date(
            $scope.endDateData.getFullYear(),
            $scope.endDateData.getMonth(),
            $scope.endDateData.getDate());
    };

    $scope.getChart = function() {
        if ($scope.chartValueType == "value") {
            $scope.chartHeader = "Total Sale Value";
            $scope.options.chart.yAxis.axisLabel = "Value";
            $scope.getChartByValue();
        } else if ($scope.chartValueType == "qty") {
            $scope.chartHeader = "Total Sale Quantity";
            $scope.options.chart.yAxis.axisLabel = "Quantity";
            $scope.getChartByQty();
        }
    };

    $scope.getChartByValue = function() {

        var reportUrl = baseUrl + "/omsservices/webapi/report/orderstatistics";
        var postData = {
            "skuId": $scope.skuId,
            "salesChannelId": $scope.saleChannelId,
            "startDate": $scope.start1Date,
            "endDate": $scope.end1Date
        };
        console.log(postData);
        $http({
            method: 'POST',
            url: reportUrl,
            data: postData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            var data;

            var chartValue = 0;

            var cancelledOrderCount = 0;
            var deliveredOrderCount = 0;
            var inProgressOrderCount = 0;
            var returnInProgressOrderCount = 0;
            var returnedOrderCount = 0;
            var secondWeekNo;

            console.log(res);
            if (res) {
                $scope.reportList = res;

                data = [{
                    key: "Cancelled",
                    color: "#F0592B",
                    values: []
                }, {
                    key: "Delivered",
                    color: "#83BD41",
                    values: []
                }, {
                    key: "In Progress",
                    color: "#00ACE4",
                    values: []
                }, {
                    key: "Return In Progress",
                    color: "#FDB813",
                    values: []
                }, {
                    key: "Returned",
                    color: "#EA2123",
                    values: []
                }];

                for (var i = 0; i < $scope.reportList.length; i++) {
                    firstWeekNo = $scope.reportList[i].weekNo;
                    startDateWeekNo = new Date($scope.start1Date).getWeek();
                    endDateWeekNo = new Date($scope.end1Date).getWeek();
                    startDateYear = $scope.start1Date.getFullYear();
                    endDateYear = $scope.end1Date.getFullYear();
                    firstYear = new Date($scope.reportList[i].date).getFullYear();

                    isLastRecord = false;
                    if (i == $scope.reportList.length - 1) {
                        isLastRecord = true;
                    }

                    if (!isLastRecord) {
                        secondWeekNo = $scope.reportList[i + 1].weekNo;
                        secondYear = new Date($scope.reportList[i + 1].date).getFullYear();
                    }

                    if (i == 0) {
                        if (startDateWeekNo < firstWeekNo && startDateYear == endDateYear) {
                            for (var j = startDateWeekNo; j <= firstWeekNo - 1; j++) {

                                for (var k = 0; k < data.length; k++) {
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(j, startDateYear) + "/" + startDateYear,
                                        "value": 0
                                    });
                                }
                            }
                        } else if (startDateYear < endDateYear) {

                            if (startDateYear == firstYear) {
                                for (var j = startDateWeekNo; j <= firstWeekNo - 1; j++) {

                                    for (var k = 0; k < data.length; k++) {
                                        data[k].values.push({
                                            "label": $scope.getDateOfWeek(j, startDateYear) + "/" + startDateYear,
                                            "value": 0
                                        });
                                    }
                                }
                            } else if (startDateYear < firstYear) {
                                for (var j = startDateWeekNo; j <= 53; j++) {

                                    for (var k = 0; k < data.length; k++) {
                                        data[k].values.push({
                                            "label": $scope.getDateOfWeek(j, startDateYear) + "/" + startDateYear,
                                            "value": 0
                                        });
                                    }
                                }
                                for (var j = 1; j <= firstWeekNo - 1; j++) {
                                    for (var k = 0; k < data.length; k++) {
                                        data[k].values.push({
                                            "label": $scope.getDateOfWeek(j, firstYear) + "/" + firstYear,
                                            "value": 0
                                        });
                                    }
                                }

                            }
                        }
                        for (var k = 0; k < data.length; k++) {
                            switch (data[k].key) {
                                case "Cancelled":
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(firstWeekNo, firstYear) + "/" + firstYear,
                                        "value": $scope.reportList[i].cancelledTotal
                                    });
                                    chartValue += $scope.reportList[i].cancelledTotal;
                                    cancelledOrderCount += $scope.reportList[i].cancelledOrders;
                                    break;
                                case "Delivered":
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(firstWeekNo, firstYear) + "/" + firstYear,
                                        "value": $scope.reportList[i].deliveredTotal
                                    });
                                    chartValue += $scope.reportList[i].deliveredTotal;
                                    deliveredOrderCount += $scope.reportList[i].deliveredOrders;
                                    break;
                                case "In Progress":
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(firstWeekNo, firstYear) + "/" + firstYear,
                                        "value": $scope.reportList[i].inProgressTotal
                                    });
                                    chartValue += $scope.reportList[i].inProgressTotal;
                                    inProgressOrderCount += $scope.reportList[i].inProgressOrders;
                                    break;
                                case "Return In Progress":
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(firstWeekNo, firstYear) + "/" + firstYear,
                                        "value": $scope.reportList[i].returnInprogressTotal
                                    });
                                    chartValue += $scope.reportList[i].returnInprogressTotal;
                                    returnInProgressOrderCount += $scope.reportList[i].returnInProgressOrders;
                                    break;
                                case "Returned":
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(firstWeekNo, firstYear) + "/" + firstYear,
                                        "value": $scope.reportList[i].returnedTotal
                                    });
                                    chartValue += $scope.reportList[i].returnedTotal;
                                    returnedOrderCount += $scope.reportList[i].returnedOrders;
                                    break;
                            }
                        }
                    }
                    if (!isLastRecord) {
                        if (firstWeekNo != secondWeekNo - 1) {
                            for (var j = firstWeekNo + 1; j <= secondWeekNo - 1; j++) {
                                for (var k = 0; k < data.length; k++) {
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(j, firstYear) + "/" + firstYear,
                                        "value": 0
                                    });
                                }
                            }
                        }
                        for (var k = 0; k < data.length; k++) {
                            switch (data[k].key) {
                                case "Cancelled":
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(secondWeekNo, secondYear) + "/" + secondYear,
                                        "value": $scope.reportList[i + 1].cancelledTotal
                                    });
                                    chartValue += $scope.reportList[i + 1].cancelledTotal;
                                    cancelledOrderCount += $scope.reportList[i + 1].cancelledOrders;
                                    break;
                                case "Delivered":
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(secondWeekNo, secondYear) + "/" + secondYear,
                                        "value": $scope.reportList[i + 1].deliveredTotal
                                    });
                                    chartValue += $scope.reportList[i + 1].deliveredTotal;
                                    deliveredOrderCount += $scope.reportList[i + 1].deliveredOrders;
                                    break;
                                case "In Progress":
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(secondWeekNo, secondYear) + "/" + secondYear,
                                        "value": $scope.reportList[i + 1].inProgressTotal
                                    });
                                    chartValue += $scope.reportList[i + 1].inProgressTotal;
                                    inProgressOrderCount += $scope.reportList[i + 1].inProgressOrders;
                                    break;
                                case "Return In Progress":
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(secondWeekNo, secondYear) + "/" + secondYear,
                                        "value": $scope.reportList[i + 1].returnInprogressTotal
                                    });
                                    chartValue += $scope.reportList[i + 1].returnInprogressTotal;
                                    returnInProgressOrderCount += $scope.reportList[i + 1].returnInProgressOrders;
                                    break;
                                case "Returned":
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(secondWeekNo, secondYear) + "/" + secondYear,
                                        "value": $scope.reportList[i + 1].returnedTotal
                                    });
                                    chartValue += $scope.reportList[i + 1].returnedTotal;
                                    returnedOrderCount += $scope.reportList[i + 1].returnedOrders;
                                    break;
                            }
                        }
                    } else if (isLastRecord && endDateWeekNo > secondWeekNo) {
                        for (var j = secondWeekNo + 1; j <= endDateWeekNo - 1; j++) {
                            for (var k = 0; k < data.length; k++) {
                                data[k].values.push({
                                    "label": $scope.getDateOfWeek(j, secondYear) + "/" + secondYear,
                                    "value": 0
                                });
                            }
                        }
                    }
                }


                for (var k = 0; k < data.length; k++) {
                    switch (data[k].key) {
                        case "Cancelled":
                            data[k].key = data[k].key + " - " + cancelledOrderCount;
                            break;
                        case "Delivered":
                            data[k].key = data[k].key + " - " + deliveredOrderCount;
                            break;
                        case "In Progress":
                            data[k].key = data[k].key + " - " + inProgressOrderCount;
                            break;
                        case "Return In Progress":
                            data[k].key = data[k].key + " - " + returnInProgressOrderCount;
                            break;
                        case "Returned":
                            data[k].key = data[k].key + " - " + returnedOrderCount;
                            break;
                    }
                }

                console.log(data);
                $scope.data = data;
                $scope.chartValue = chartValue;
                $scope.cancelledOrderCount = cancelledOrderCount;
                $scope.deliveredOrderCount = deliveredOrderCount;
                $scope.inProgressOrderCount = inProgressOrderCount;
                $scope.returnInProgressOrderCount = returnInProgressOrderCount;
                $scope.returnedOrderCount = returnedOrderCount;

            }
            if (res.length > 0) {
                $scope.dataPresent = true;
            } else {
                $scope.dataPresent = false;
            }
        }).error(function(error) {
            console.log(error);
            growl.error("Problem loading report data");
        });
    };

    $scope.getChartByQty = function() {

        var reportUrl = baseUrl + "/omsservices/webapi/report/orderstatistics";
        var postData = {
            "skuId": $scope.skuId,
            "salesChannelId": $scope.saleChannelId,
            "startDate": $scope.start1Date,
            "endDate": $scope.end1Date
        };
        console.log(postData);
        $http({
            method: 'POST',
            url: reportUrl,
            data: postData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            var data;

            var chartValue = 0;

            var cancelledOrderCount = 0;
            var deliveredOrderCount = 0;
            var inProgressOrderCount = 0;
            var returnInProgressOrderCount = 0;
            var returnedOrderCount = 0;
            var secondWeekNo;

            console.log(res);
            if (res) {
                $scope.reportList = res;

                data = [{
                    key: "Cancelled",
                    color: "#F0592B",
                    values: []
                }, {
                    key: "Delivered",
                    color: "#83BD41",
                    values: []
                }, {
                    key: "In Progress",
                    color: "#00ACE4",
                    values: []
                }, {
                    key: "Return In Progress",
                    color: "#FDB813",
                    values: []
                }, {
                    key: "Returned",
                    color: "#EA2123",
                    values: []
                }];

                for (var i = 0; i < $scope.reportList.length; i++) {
                    firstWeekNo = $scope.reportList[i].weekNo;
                    startDateWeekNo = new Date($scope.start1Date).getWeek();
                    endDateWeekNo = new Date($scope.end1Date).getWeek();
                    startDateYear = $scope.start1Date.getFullYear();
                    endDateYear = $scope.end1Date.getFullYear();
                    firstYear = new Date($scope.reportList[i].date).getFullYear();

                    isLastRecord = false;
                    if (i == $scope.reportList.length - 1) {
                        isLastRecord = true;
                    }

                    if (!isLastRecord) {
                        secondWeekNo = $scope.reportList[i + 1].weekNo;
                        secondYear = new Date($scope.reportList[i + 1].date).getFullYear();
                    }

                    if (i == 0) {
                        if (startDateWeekNo < firstWeekNo && startDateYear == endDateYear) {
                            for (var j = startDateWeekNo; j <= firstWeekNo - 1; j++) {

                                for (var k = 0; k < data.length; k++) {
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(j, startDateYear) + "/" + startDateYear,
                                        "value": 0
                                    });
                                }
                            }
                        } else if (startDateYear < endDateYear) {

                            if (startDateYear == firstYear) {
                                for (var j = startDateWeekNo; j <= firstWeekNo - 1; j++) {

                                    for (var k = 0; k < data.length; k++) {
                                        data[k].values.push({
                                            "label": $scope.getDateOfWeek(j, startDateYear) + "/" + startDateYear,
                                            "value": 0
                                        });
                                    }
                                }
                            } else if (startDateYear < firstYear) {
                                for (var j = startDateWeekNo; j <= 53; j++) {

                                    for (var k = 0; k < data.length; k++) {
                                        data[k].values.push({
                                            "label": $scope.getDateOfWeek(j, startDateYear) + "/" + startDateYear,
                                            "value": 0
                                        });
                                    }
                                }
                                for (var j = 1; j <= firstWeekNo - 1; j++) {
                                    for (var k = 0; k < data.length; k++) {
                                        data[k].values.push({
                                            "label": $scope.getDateOfWeek(j, firstYear) + "/" + firstYear,
                                            "value": 0
                                        });
                                    }
                                }

                            }
                        }
                        for (var k = 0; k < data.length; k++) {
                            switch (data[k].key) {
                                case "Cancelled":
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(firstWeekNo, firstYear) + "/" + firstYear,
                                        "value": $scope.reportList[i].cancelledSkuQuantity
                                    });
                                    chartValue += $scope.reportList[i].cancelledSkuQuantity;
                                    cancelledOrderCount += $scope.reportList[i].cancelledOrders;
                                    break;
                                case "Delivered":
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(firstWeekNo, firstYear) + "/" + firstYear,
                                        "value": $scope.reportList[i].deliveredSkuQuantity
                                    });
                                    chartValue += $scope.reportList[i].deliveredSkuQuantity;
                                    deliveredOrderCount += $scope.reportList[i].deliveredOrders;
                                    break;
                                case "In Progress":
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(firstWeekNo, firstYear) + "/" + firstYear,
                                        "value": $scope.reportList[i].inProgressSkuQuantity
                                    });
                                    chartValue += $scope.reportList[i].inProgressSkuQuantity;
                                    inProgressOrderCount += $scope.reportList[i].inProgressOrders;
                                    break;
                                case "Return In Progress":
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(firstWeekNo, firstYear) + "/" + firstYear,
                                        "value": $scope.reportList[i].returnInProgressSkuQuantity
                                    });
                                    chartValue += $scope.reportList[i].returnInProgressSkuQuantity;
                                    returnInProgressOrderCount += $scope.reportList[i].returnInProgressOrders;
                                    break;
                                case "Returned":
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(firstWeekNo, firstYear) + "/" + firstYear,
                                        "value": $scope.reportList[i].returnedSkuQuantity
                                    });
                                    chartValue += $scope.reportList[i].returnedSkuQuantity;
                                    returnedOrderCount += $scope.reportList[i].returnedOrders;
                                    break;
                            }
                        }
                    }
                    if (!isLastRecord) {
                        if (firstWeekNo != secondWeekNo - 1) {
                            for (var j = firstWeekNo + 1; j <= secondWeekNo - 1; j++) {
                                for (var k = 0; k < data.length; k++) {
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(j, firstYear) + "/" + firstYear,
                                        "value": 0
                                    });
                                }
                            }
                        }
                        for (var k = 0; k < data.length; k++) {
                            switch (data[k].key) {
                                case "Cancelled":
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(secondWeekNo, secondYear) + "/" + secondYear,
                                        "value": $scope.reportList[i + 1].cancelledSkuQuantity
                                    });
                                    chartValue += $scope.reportList[i + 1].cancelledSkuQuantity;
                                    cancelledOrderCount += $scope.reportList[i + 1].cancelledOrders;
                                    break;
                                case "Delivered":
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(secondWeekNo, secondYear) + "/" + secondYear,
                                        "value": $scope.reportList[i + 1].deliveredSkuQuantity
                                    });
                                    chartValue += $scope.reportList[i + 1].deliveredSkuQuantity;
                                    deliveredOrderCount += $scope.reportList[i + 1].deliveredOrders;
                                    break;
                                case "In Progress":
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(secondWeekNo, secondYear) + "/" + secondYear,
                                        "value": $scope.reportList[i + 1].inProgressSkuQuantity
                                    });
                                    chartValue += $scope.reportList[i + 1].inProgressSkuQuantity;
                                    inProgressOrderCount += $scope.reportList[i + 1].inProgressOrders;
                                    break;
                                case "Return In Progress":
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(secondWeekNo, secondYear) + "/" + secondYear,
                                        "value": $scope.reportList[i + 1].returnInProgressSkuQuantity
                                    });
                                    chartValue += $scope.reportList[i + 1].returnInProgressSkuQuantity;
                                    returnInProgressOrderCount += $scope.reportList[i + 1].returnInProgressOrders;
                                    break;
                                case "Returned":
                                    data[k].values.push({
                                        "label": $scope.getDateOfWeek(secondWeekNo, secondYear) + "/" + secondYear,
                                        "value": $scope.reportList[i + 1].returnedSkuQuantity
                                    });
                                    chartValue += $scope.reportList[i + 1].returnedSkuQuantity;
                                    returnedOrderCount += $scope.reportList[i + 1].returnedOrders;
                                    break;
                            }
                        }
                    } else if (isLastRecord && endDateWeekNo > secondWeekNo) {
                        for (var j = secondWeekNo + 1; j <= endDateWeekNo - 1; j++) {
                            for (var k = 0; k < data.length; k++) {
                                data[k].values.push({
                                    "label": $scope.getDateOfWeek(j, secondYear) + "/" + secondYear,
                                    "value": 0
                                });
                            }
                        }
                    }
                }

                for (var k = 0; k < data.length; k++) {
                    switch (data[k].key) {
                        case "Cancelled":
                            data[k].key = data[k].key + " - " + cancelledOrderCount;
                            break;
                        case "Delivered":
                            data[k].key = data[k].key + " - " + deliveredOrderCount;
                            break;
                        case "In Progress":
                            data[k].key = data[k].key + " - " + inProgressOrderCount;
                            break;
                        case "Return In Progress":
                            data[k].key = data[k].key + " - " + returnInProgressOrderCount;
                            break;
                        case "Returned":
                            data[k].key = data[k].key + " - " + returnedOrderCount;
                            break;
                    }
                }

                console.log(data);
                $scope.data = data;
                $scope.chartValue = chartValue;
                $scope.cancelledOrderCount = cancelledOrderCount;
                $scope.deliveredOrderCount = deliveredOrderCount;
                $scope.inProgressOrderCount = inProgressOrderCount;
                $scope.returnInProgressOrderCount = returnInProgressOrderCount;
                $scope.returnedOrderCount = returnedOrderCount;
            }
            if (res.length > 0) {
                $scope.dataPresent = true;
            } else {
                $scope.dataPresent = false;
            }

        }).error(function(error, status) {

            console.log(error);
            console.log(status);
            if (status == 401) {
                $('#AuthError').modal('show');
                $location.path('/login');
            }
            $scope.data = 0;
            growl.error("Problem loading report data");
        });
    };

    Date.prototype.getWeek = function() {

        // Create a copy of this date object
        var target = new Date(this.valueOf());

        // ISO week date weeks start on monday, so correct the day number
        var dayNr = (this.getDay() + 6) % 7;

        // Set the target to the thursday of this week so the
        // target date is in the right year
        target.setDate(target.getDate() - dayNr + 3);

        // ISO 8601 states that week 1 is the week with january 4th in it
        var jan4 = new Date(target.getFullYear(), 0, 4);

        // Number of days between target date and january 4th
        var dayDiff = (target - jan4) / 86400000;

        if (new Date(target.getFullYear(), 0, 1).getDay() < 5) {
            // Calculate week number: Week 1 (january 4th) plus the
            // number of weeks between target date and january 4th
            return 1 + Math.ceil(dayDiff / 7);
        } else { // jan 4th is on the next week (so next week is week 1)
            return Math.ceil(dayDiff / 7);
        }
    };

    $scope.getDateOfWeek = function(weekNo, year) {
        var d1 = new Date(year, 0, 15);
        numOfdaysPastSinceLastMonday = eval(d1.getDay() - 1);
        d1.setDate(d1.getDate() - numOfdaysPastSinceLastMonday);
        var weekNoToday = d1.getWeek();
        var weeksInTheFuture = eval(weekNo - weekNoToday);
        d1.setDate(d1.getDate() + eval(7 * weeksInTheFuture));
        return d1.getDate() + "/" + eval(d1.getMonth() + 1);
    };

    $scope.listOfChannels = function() {
        $scope.channelNamesData = [];
        var channelListUrl = baseUrl + "/omsservices/webapi/saleschannels";
        // console.log(channelListUrl);
        $http.get(channelListUrl).success(function(data) {
            console.log(data);
            $scope.channelLists = data;

            for (var i = 0; i < $scope.channelLists.length; i++) {
                $scope.channelNamesData.push($scope.channelLists[i]);
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

    $scope.clearAction = function() {
        $scope.saleChannelId = undefined;
        $scope.chartValueType = undefined;
        var productId = 'products';
        $scope.$broadcast('angucomplete:clearInput', productId);
        $scope.skuId = undefined;
        $scope.initChart();
    };

    $scope.getDateRange = function() {
        var date = new Date();

        var usableEndDate = dateFormat(new Date(date), 'yyyy-mm-dd');

        if ($scope.dateRange == "3m") {
            date.setMonth(date.getMonth() - 3);
        } else if ($scope.dateRange == "6m") {
            date.setMonth(date.getMonth() - 6);
        } else if ($scope.dateRange == "9m") {
            date.setMonth(date.getMonth() - 9);
        } else if ($scope.dateRange == "12m") {
            date.setFullYear(date.getFullYear() - 1);
        }

        var usableStartDate = dateFormat(new Date(date), 'yyyy-mm-dd');
        $scope.start1Date = new Date(usableStartDate);
        $scope.end1Date = new Date(usableEndDate);

    };
}
