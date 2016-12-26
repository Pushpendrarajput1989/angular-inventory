/**
 * Created by angularpc on 04-11-2016.
 */
myApp.controller('verifyUserController', verifyUserController);
verifyUserController.$inject = ['$scope', '$http', '$location','baseUrl'];

function verifyUserController($scope, $http, $location,baseUrl) {
    $scope.$on('$routeChangeSuccess', function () {
        //        $scope.displayEmail = $location.search().email;
        //$scope.displayEmail = 'abc@example.com';
    });

    console.log($location.search());
    $scope.userEmail = $location.search().email;
    $scope.hashcode = $location.search().hashcode;
    //{{url}}/omsservices/webapi/login/verify?email=abcd&hashcode=abcd

    $scope.UserVerification = function(){
        $scope.loading=false;
        $http({
            method: 'GET',
            url: baseUrl + '/omsservices/webapi/login/verify?email='+$scope.userEmail+'&hashcode='+$scope.hashcode
        }).success(function(data){
            console.log(data);
            if(data == true){
                $scope.verified = false;
            }else{
                $scope.verified = true;
            }
            $scope.loading = true;
        }).error(function(data){
            console.log(data);
            $scope.verified = true;
        });
    }

    $scope.UserVerification();

    $scope.ResendLink = function(){
        $http({
            method: 'GET',
            url: baseUrl + '/omsservices/webapi/login/resend?email='+$scope.userEmail
        }).success(function(data){
            console.log(data);
            $scope.verified = false;
            $scope.loading = true;
        }).error(function(data){
            console.log(data);
            $scope.verified = true;
        });
    }
};