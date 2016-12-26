myApp.controller('loginController', loginController);
loginController.$inject = ['$scope', '$http', '$location', 'baseUrl', '$cookies', 'growl'];

function loginController($scope, $http, $location, baseUrl, $cookies, growl) {

    $scope.$on('$routeChangeSuccess', function() {
        $scope.pwdValidateStyle = {
            'display': 'none'
        };
        $scope.emailValidateCorrectStyle = {
            'display': 'none'
        };
        $scope.emailValidateWrongStyle = {
            'display': 'none'
        };

    });

    /* ------------------------------------------------
                            EMAIL
       ------------------------------------------------ */
    $scope.checkEmail = function(email) {

        $scope.clearEmailCheck();
        if (!email) {
            $scope.displayEmailMessage = "Please enter an Email ID";
            $scope.emailValidateWrongStyle = {
                'display': 'block'
            };
            return;
        }
        $http.get(baseUrl + "/omsservices/webapi/signup/checkemail?email=" + email).success(function(data) {
            if (data) {
                $scope.emailValidateCorrectStyle = {
                    'display': 'block'
                };
            } else {
                $scope.emailValidateWrongStyle = {
                    'display': 'block'
                };
                $scope.displayEmailMessage = "Email is not registered";
            }
        }).error(function(error, status) {
            alert("Service is down");
            console.log(error);
            console.log(status);
            if (status == 401) {
                //$('#AuthError').modal('show');
                growl.error('Your Email ID or Password might be incorrect.');
                $location.path('/login');
            }
        });
    };

    $scope.clearEmailCheck = function() {
        $scope.emailValidateCorrectStyle = {
            'display': 'none'
        };
        $scope.emailValidateWrongStyle = {
            'display': 'none'
        };
        $scope.displayEmailMessage = "";
    };



    /* ------------------------------------------------
                         PASSWORD
       ------------------------------------------------ */

    $scope.checkPwd = function(password) {
        $scope.clearPwdCheck();
        if (!password) {
            $scope.displayPasswordMessage = "Please Enter the Password";
            $scope.pwdValidateStyle = {
                'display': 'block'
            };
        }
    };

    $scope.clearPwdCheck = function() {
        $scope.displayPasswordMessage = "";
        $scope.pwdValidateStyle = {
            'display': 'none'
        };
    };

    /* ------------------------------------------------
                         LOGIN
       ------------------------------------------------ */


    $scope.userLogin = function() {
        alert('fffff');
        $scope.displayEmailMessage = "";
        $scope.displayPasswordMessage = "";
        $scope.pwdValidateStyle = {
            'display': 'none'
        };
        $scope.emailValidateCorrectStyle = {
            'display': 'none'
        };
        $scope.emailValidateWrongStyle = {
            'display': 'none'
        };

        console.log(baseUrl);
        if (!$scope.email && !$scope.password) {
            $scope.displayEmailMessage = "Please enter an Email ID";
            $scope.emailValidateWrongStyle = {
                'display': 'block'
            };
            $scope.displayPasswordMessage = "Please enter the Password";
            $scope.pwdValidateStyle = {
                'display': 'block'
            };
            return;
        } else if (!$scope.email) {
            $scope.displayEmailMessage = "Please enter an Email ID";
            $scope.emailValidateWrongStyle = {
                'display': 'block'
            };
            return;

        } else if (!$scope.password) {
            $scope.displayPasswordMessage = "Please enter the Password";
            $scope.pwdValidateStyle = {
                'display': 'block'
            };
            return;
        }

        console.log($scope.password);

        $http.get(baseUrl + "/omsservices/webapi/signup/checkemail?email=" + $scope.email).success(function(data) {
            if (data == 'false') {
                $scope.displayEmailMessage = "Email is not registered";
                $scope.emailValidateWrongStyle = {
                    'display': 'block'
                };
                return;
            } else {

                $http.post(baseUrl + "/omsservices/webapi/login/authenticate?email=" + $scope.email + "&password=" + $scope.password).success(function(data) {
                    console.log(data);
                    if (!data) {
                        $scope.password = '';
                        $scope.displayPasswordMessage = "Wrong password entered";

                        //display cross-icon-password
                        $scope.pwdValidateStyle = {
                            'display': 'block'
                        };
                        return;
                    } else if (data.tableUserIsEmailVerified == false) {
                        console.log("not verified");
                        $scope.email = '';
                        $scope.password = '';
                        alert("Email is not verified.Please click on the activation link sent to your email or click on the Resend Activation Link");
                    } else {
                        $cookies.put("username", data.tableUserFirstName);
                        console.log(data.tableUserIsEmailVerified);
                        $scope.email = '';
                        $scope.password = '';
                        $scope.showAlert = true;
                        $scope.displayActivationMessage = "";
                        $scope.alertMsg = "Redirecting to Dashboard";
                        $http.get(baseUrl + "/omsservices/webapi/clientprofiles/checkfirsttime")
                            .success(function(data) {
                                console.log(data);

                            }).error(function(data) {
                                console.log(data);
                            });
                        //{{url}}/omsservices/webapi/clientprofiles/checkfirsttime
                        $cookies.put('isLoggedIn', true);
                        $location.path('/Dashboard');
                    }
                }).error(function(error, status) {
                    console.log(error);
                    console.log(status);
                    if (status == -1 || status == 401) {
                        growl.error('Your Email ID or Password might be incorrect.');
                    }
                    console.log("error message");
                });
            }
        });
    };

    $scope.resendActivationLink = function() {
        $http.get(baseUrl + "/omsservices/webapi/login/resend?email=" + $scope.email).success(function(data) {
            console.log(data);
            if (data == 'true') {
                $scope.showAnchor = false;
                alert("Activation link successfully send");
            }
        }).error(function(error, status) {
            if (status == 401) {
                growl.error('Your Email ID or Password might be incorrect.');
            }
            console.log(error);
        });
    }

    var LoginToken = $cookies.get('isLoggedIn');
    console.log(LoginToken);
    $scope.checkLogedIn = function() {
        console.log(typeof LoginToken);
        if (LoginToken == true || LoginToken == 'true') {
            console.log('helloe');
            $location.path('/Dashboard');
        } else {
            console.log('login again');
        };
    };
    $scope.checkLogedIn();
};
//--------------------------------------- circleAdmin ---------------------------------------//
