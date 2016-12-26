myApp.controller('signUpSuccessController', signUpSuccessController);
signUpSuccessController.$inject = ['$scope', '$http', '$location'];

function signUpSuccessController($scope, $http, $location) {
    $scope.$on('$routeChangeSuccess', function () {
        //        $scope.displayEmail = $location.search().email;
        //$scope.displayEmail = 'abc@example.com';
    });
};