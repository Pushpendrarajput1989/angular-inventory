myApp.controller('resetPasswordController', resetPasswordController);
resetPasswordController.$inject = ['$scope', '$http', '$location', 'baseUrl', 'growl'];

function resetPasswordController($scope, $http, $location, baseUrl, growl) {

    $scope.resetPassword = function() {
        console.log($scope.newPass);
        console.log($scope.confirmPass);
        if (!$scope.newPass || !$scope.confirmPass) {
            return;
        }
        var postData = {
            "tableUserEncryptedPassword": $scope.password
        };
        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/clients/1/users',
            data: postData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(res) {
            console.log(res);
        }).error(function(error) {
            console.log(error);
        });
        $scope.companyName = '';
        $scope.phone = '';
    };

    $scope.RemoveCheckMessage = function(){
        $scope.MismatchPassword = false;
    };
    $scope.checkCPwd = function() {

        var pwd = $scope.pwd;
        var cPwd = $scope.cPwd;

        $scope.clearCPwdCheck();
        //if (!cPwd) {
        //    growl.error("Please confirm the Password");
        //    $scope.cPwdValidateStyle = {
        //        'display': 'block'
        //    };
        //    return false;
        //} else
        if (pwd != cPwd) {
            //growl.error("Please re-enter the password, your passwords don't match");
            $scope.MismatchPassword = true;
            $scope.cPwdValidateStyle = {
                'display': 'block'
            };
            return false;
        }
        return true;
    };


    $scope.clearFPwdCheck = function() {
        $scope.displayFPwdMessage = "";
    };
    $scope.checkFPwd = function() {

        var pwd = $scope.pwd;
        $scope.clearFPwdCheck();
        if (!pwd) {
            growl.error("Please Enter the Password");
            return false;
        }
        return true;
    };

    $scope.clearCPwdCheck = function() {
        $scope.displayCPwdMessage = "";
        $scope.cPwdValidateStyle = {
            'display': 'none'
        };
    };

    $scope.userEmail = $location.search().email;
    $scope.hash = $location.search().hashcode;
    $scope.reset = false;

    $scope.resetPass = function() {
        if ($scope.checkFPwd()) {
            if ($scope.checkCPwd()) {
                $http({
                    method: 'PUT',
                    url: baseUrl + '/omsservices/webapi/login/resetpwd?email=' + $scope.userEmail + '&newpassword=' + $scope.pwd + '&hashcode=' + $scope.hash
                }).success(function(data) {
                    console.log(data);
                    if (data == true) {
                        $scope.reset = true;
                    }

                    //$location.path('/login');
                }).error(function(data, status) {
                    if (status == 401) {
                        growl.error('Your Email ID or Password might be Incorrect.')
                    }
                    console.log(data);
                })
            }
        }
    };
}

//--------------------------------------- circleAdmin ---------------------------------------//