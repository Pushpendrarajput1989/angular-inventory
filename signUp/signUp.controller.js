myApp.controller('signUpController', signUpController);
signUpController.$inject = ['$scope', '$http', '$location', 'baseUrl'];

function signUpController($scope, $http, $location, baseUrl) {

    $scope.$on('$routeChangeSuccess', function () {

        $scope.clearCompanyCheck();
        $scope.clearEmailCheck();
        $scope.clearPhoneCheck();
        $scope.clearFNameCheck();
        $scope.clearLNameCheck();
        $scope.clearFPwdCheck();
        $scope.clearCPwdCheck();
    });

    /* ------------------------------------------------
                        COMPANY NAME
       ------------------------------------------------ */

    $scope.checkCompanyName = function () {
        $scope.clearCompanyCheck();
        var companyName = $scope.companyName;
        if (!companyName) {
            //$scope.displayCompanyMessage = "Please Insert Company Name";
            $scope.companyValidateWrongStyle = {
                'display': 'block'
            };
            $scope.companyValidateCorrectStyle = {
                'display': 'none'
            };
            return false;
        }
        $http.get(baseUrl + "/omsservices/webapi/signup/checkcompany?company=" + companyName).success(function (data) {
            if (data) {
                $scope.companyStatus = data;
                $scope.displayCompanyMessage = "Company already exists";
                $scope.companyValidateWrongStyle = {
                    'display': 'block'
                };
                $scope.companyValidateCorrectStyle = {
                    'display': 'none'
                };
                return false;
            } else {
                $scope.companyValidateCorrectStyle = {
                    'display': 'block'
                };
                $scope.displayCompanyMessage = "";
                $scope.companyValidateWrongStyle = {
                    'display': 'none'
                };
                return true;
            }
        }).error(function (error) {
            console.log("error message");
        });
        return true;
    };

    $scope.clearCompanyCheck = function () {
        $scope.companyValidateCorrectStyle = {
            'display': 'none'
        };
        $scope.companyValidateWrongStyle = {
            'display': 'none'
        };
        $scope.displayCompanyMessage = "";
    };

    /* ------------------------------------------------
                            EMAIL 
       ------------------------------------------------ */
    $scope.checkEmail = function () {

        var email = $scope.email;
        $scope.clearEmailCheck();
        if (!email) {
            //$scope.displayEmailMessage = "Please enter an Email ID";
            $scope.emailValidateWrongStyle = {
                'display': 'block'
            };
            $scope.emailValidateCorrectStyle = {
                'display': 'none'
            };
            return false;
        }
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/igm;

        if (re.test(email)) {
            $http.get(baseUrl + "/omsservices/webapi/signup/checkemail?email=" + email).success(function (data) {
                if (!data) {
                    $scope.emailValidateCorrectStyle = {
                        'display': 'block'
                    };
                    $scope.emailValidateWrongStyle = {
                        'display': 'none'
                    };
                    $scope.displayEmailMessage = "";
                    return true;
                } else {
                    $scope.emailValidateWrongStyle = {
                        'display': 'block'
                    };
                    $scope.displayEmailMessage = "Email is already registered";
                    $scope.emailValidateCorrectStyle = {
                        'display': 'none'
                    };
                    return false;
                }
            }).error(function (error) {
                alert("Service is down");
            });
            return true;
        } else {
            $scope.emailValidateWrongStyle = {
                'display': 'block'
            };
            //$scope.displayEmailMessage = "Please enter a valid email address";
            $scope.emailValidateCorrectStyle = {
                'display': 'none'
            };
            return false;
        }
    };

    $scope.clearEmailCheck = function () {
        $scope.emailValidateCorrectStyle = {
            'display': 'none'
        };
        $scope.emailValidateWrongStyle = {
            'display': 'none'
        };
        $scope.displayEmailMessage = "";
    };

    /* ------------------------------------------------
                        PHONE NUMBER 
       ------------------------------------------------ */

    $scope.checkPhone = function () {

        var phone = $scope.phone;
        $scope.clearPhoneCheck();
        if (!phone) {
            //$scope.displayPhoneMessage = "Please enter a Mobile Number";
            $scope.phoneValidateWrongStyle = {
                'display': 'block'
            };
            return false;
        }
        var re = /^[0-9]{1,10}$/;
        if (re.test(phone)) {
            $http.get(baseUrl + "/omsservices/webapi/signup/checkphone?phone=" + phone).success(function (data) {
                if (!data) {
                    $scope.phoneValidateCorrectStyle = {
                        'display': 'block'
                    };
                    $scope.phoneValidateWrongStyle = {
                        'display': 'none'
                    };
                    $scope.displayPhoneMessage = "";
                    return true;
                } else {
                    $scope.phoneValidateWrongStyle = {
                        'display': 'block'
                    };
                    $scope.phoneValidateCorrectStyle = {
                        'display': 'none'
                    };
                    $scope.displayPhoneMessage = "Already Exists";
                    return false;
                }
            }).error(function (error) {
                alert("Service is down");
            });
        } else {
            $scope.phoneValidateWrongStyle = {
                'display': 'block'
            };
            $scope.phoneValidateCorrectStyle = {
                'display': 'none'
            };
            //$scope.displayPhoneMessage = "Please enter a valid phone number";
            return false;
        }
        return true;
    };

    $scope.clearPhoneCheck = function () {
        $scope.phoneValidateCorrectStyle = {
            'display': 'none'
        };
        $scope.phoneValidateWrongStyle = {
            'display': 'none'
        };
        $scope.displayPhoneMessage = "";
    };

    /* ------------------------------------------------
                        FIRST NAME
       ------------------------------------------------ */

    $scope.checkFName = function () {

        var fName = $scope.fName;
        $scope.clearFNameCheck();
        if (!fName) {
            //$scope.displayFNameMessage = "Please enter your First Name";
            $scope.fNameValidateWrongStyle = {
                'display': 'block'
            };
            return false;
        }
        return true;
    };

    $scope.clearFNameCheck = function () {
        $scope.fNameValidateStyle = {
            'display': 'none'
        };
        $scope.displayFNameMessage = "";
    };

    /* ------------------------------------------------
                        LAST NAME
       ------------------------------------------------ */

    $scope.checkLName = function () {

        var lName = $scope.lName;
        $scope.clearLNameCheck();
        if (!lName) {
            //$scope.displayLNameMessage = "Please enter your Last Name";
            $scope.lNameValidateWrongStyle = {
                'display': 'block'
            };
            return false;
        }
        return true;
    };

    $scope.clearLNameCheck = function () {
        $scope.lNameValidateStyle = {
            'display': 'none'
        };
        $scope.displayLNameMessage = "";
    };

    /* ------------------------------------------------
                         PASSWORD 
       ------------------------------------------------ */

    $scope.checkFPwd = function () {

        var pwd = $scope.pwd;
        $scope.clearFPwdCheck();
        if (!pwd) {
            //$scope.displayFPwdMessage = "Please Enter the Password";
            return false;
        }
        return true;
    };

    $scope.clearFPwdCheck = function () {
        $scope.displayFPwdMessage = "";
    };

    /* ------------------------------------------------
                         CONFIRM PASSWORD 
       ------------------------------------------------ */

    $scope.checkCPwd = function () {

        var pwd = $scope.pwd;
        var cPwd = $scope.cPwd;

        $scope.clearCPwdCheck();
        if (!cPwd) {
            //$scope.displayCPwdMessage = "Please confirm the Password";
            $scope.cPwdValidateStyle = {
                'display': 'block'
            };
            return false;
        } else if (pwd != cPwd) {
            $scope.displayCPwdMessage = "Please re-enter the password, your passwords don't match";
            $scope.cPwdValidateStyle = {
                'display': 'block'
            };
            return false;
        }
        return true;
    };

    $scope.clearCPwdCheck = function () {
        $scope.displayCPwdMessage = "";
        $scope.cPwdValidateStyle = {
            'display': 'none'
        };
    };

    /* ------------------------------------------------
                         SIGNUP 
       ------------------------------------------------ */

    $scope.registerCompanyDetails = function () {


        var allChecked;
        //if ($scope.checkCompanyName()) {
        //    if ($scope.checkEmail()) {
        //        if ($scope.checkPhone()) {
        //            if ($scope.checkFName()) {
        //                if ($scope.checkLName()) {
        //                    if ($scope.checkFPwd()) {
        //                        if ($scope.checkCPwd()) {
        //                            if (!$scope.termsCheck) {
        //                                alert("Please check the terms and conditions");
        //                            } else {
        //                                allChecked = true;
        //                            }
        //                        }
        //                    }
        //                }
        //            }
        //        }
        //    }
        //}
        allChecked = true;
        if (allChecked) {

            var clientID = 0;
            var postData = {
                    //"idtableUserId": clientID,
                    "tableUserFirstName": $scope.fName,
                    "tableUserLastName": $scope.lName,
                    "tableUserEmailId": $scope.email,
                    "tableUserEncryptedPassword": $scope.pwd,
                    "tableUserPhoneNo": $scope.phone,
                    "tableUserIsDeleted": 0,
                    "tableUserIsEmailVerified": false,
                    "tableClient": {
                        //"idtableClientId": clientID,
                        "tableClientCompanyName": $scope.companyName
                    }
                    //"tableUserRoleType": {
                    //    "idtableUserRoleTypeId": 1,
                    //    "tableUserRoleTypeString": "Admin"
                    //},
                    //"tableUserStatusType": {
                    //    "idtableUserStatusTypeId": 1,
                    //    "tableUserStatusTypeString": "Active"
                    //}
                };
            $http({
                method: 'POST',
                url: baseUrl + '/omsservices/webapi/signup/register',
                data: postData
            }).success(function (res) {
                //alert("Registered successfully");
                $location.path('/signUpSuccess');
            }).error(function (error) {
                console.log(error);
            });
//            $http({
//                method: 'POST',
//                url: baseUrl + '/omsservices/webapi/clients/',
//                data: postData
//
//            }).success(function (res) {
//                clientID = res["idtableClientId"];
//                console.log("Client ID: " + clientID);
//;
//
//            }).error(function (error) {
//                console.log(error);
//            });
        }
    }
};


//--------------------------------------- circleAdmin ---------------------------------------//