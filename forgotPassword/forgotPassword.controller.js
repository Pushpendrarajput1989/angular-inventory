myApp.controller('forgotPasswordController', forgotPasswordController);
forgotPasswordController.$inject = ['$scope', '$http', '$location', 'baseUrl', '$q'];

function forgotPasswordController($scope, $http, $location, baseUrl, $q) {

    $scope.$on('$routeChangeSuccess', function() {
        $scope.emailValidateCorrectStyle = {
            'display': 'none'
        };
        $scope.emailValidateWrongStyle = {
            'display': 'none'
        };

    });

    $scope.checkEmail = function(email) {
        var q = $q.defer();

        $http.get(baseUrl + "/omsservices/webapi/signup/checkemail?email=" + email).success(function(data) {
            if (data == true) {
                $scope.emailValidateCorrectStyle = {
                    'display': 'block'
                };
                q.resolve(true);
            } else {
                $scope.emailValidateWrongStyle = {
                    'display': 'block'
                };
                $scope.displayEmailMessage = "Email is not registered";
                q.resolve(false);
            }
        }).error(function(error) {
            console.log("error message");
        });
        return q.promise;
    };

    $scope.resetPassword = function() {
        $scope.displayEmailMessage = "";
        $scope.emailValidateWrongStyle = {
            'display': 'none'
        };
        $scope.emailValidateCorrectStyle = {
            'display': 'none'
        };

        if (!$scope.email) {
            $scope.displayEmailMessage = "Please enter an Email ID";
            $scope.emailValidateWrongStyle = {
                'display': 'block'
            };
            return;
        } else {
            $scope.checkEmail($scope.email).then(
                function(v) {
                    if (v) {
                        $http.get(baseUrl + "/omsservices/webapi/login/forgotpassword?email=" + $scope.email).success(function(data) {
                            console.log(data);
                            if (data == true) {
                                $scope.forgotlink = true;
                                $scope.linked = true;
                            }
                        });
                    }
                },
                function(err) {

                }
            );
        }
    };

    $scope.resendLink = function() {
        $http.get(baseUrl + "/omsservices/webapi/login/forgotpassword?email=" + $scope.email).success(function(data) {
            console.log(data);
            if (data == true) {
                $scope.forgotlink = true;
                $scope.linked = true;
            }
        }).error(function(data) {
            console.log(data);
        });
    }
}

//--------------------------------------- circleAdmin ---------------------------------------//