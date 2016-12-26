myApp.controller('useradminController', useradminController);

useradminController.$inject = ['$scope', '$http', '$location', 'baseUrl', 'growl'];

function useradminController($scope, $http, $location, baseUrl, growl) {
    $scope.searchUserClicked = false;
    $scope.usersCount = 0;
    $scope.currentPage = 1;
    $scope.newRoleClicked = false;
    $scope.userSize = 5;
    $scope.EmailRegex = /^([a-zA-Z0-9]{1}[a-zA-Z0-9.​_-]+)@([a-zA-Z0-9._​-]+)([.]{1})([a-zA-Z0-9]+)$/;
    $scope.toggleSearchRow = function() {
        console.log($scope.searchUserClicked);
        $scope.searchUserClicked = !$scope.searchUserClicked;
    }
    $scope.SearchUseradmin = {};
    $scope.$on('$routeChangeSuccess', function () {
        $scope.listOfUsers();
        $scope.baseUserUrl = baseUrl + '/omsservices/webapi/users/search?search=';
        console.log($scope.baseUserUrl);
    });

//get another portions of data on page changed
    $scope.pageChanged = function() {
        console.log($scope.currentPage);
        $scope.listOfUsers();
    };



    // fetching list of sale channels from RestAPI OMS
    $scope.userDataCount = {}
    $scope.listOfUsers = function (SearchUserName){
        var usersUrl;
        if(SearchUserName == null || SearchUserName == undefined ){
            usersUrl = baseUrl+"/omsservices/webapi/users?start="+($scope.currentPage - 1)+"&size="+$scope.userSize;
        }else{
            usersUrl = baseUrl+"/omsservices/webapi/users/search?search="+SearchUserName+"&start="+($scope.currentPage - 1)+"&size="+$scope.userSize;
        }
        $http.get(usersUrl).success(function(data) {
            console.log(data.length);
            $scope.usersData = data;
            $scope.usersCount = data.length;
            //$scope.userDataCount.Count = data.length;
            $http.get(baseUrl+"/omsservices/webapi/users").success(function(reposnedata) {
                $scope.userDataCount.Count = reposnedata.length;
                console.log(reposnedata);
                console.log($scope.userDataCount.Count);
            }).error(function(reposnedata){

            });
                //$scope.ListPagination();
            console.log(data);
        }).error(function(error,status){
            console.log(error);
            if(status == 401){
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };

    $scope.searchedUser = function(data){
        console.log('userData',data);
    };

    //=================== creating new user ====================== //

    $scope.roleType = function(){
        var roleUser = baseUrl+"/omsservices/webapi/userroletypes";
        $http.get(roleUser).success(function(data){
            console.log(data);
            $scope.selectRole = data;
        }).error(function(error,status){
            console.log(error);
            if(status == 401){
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };
    $scope.roleType();

    $scope.Mycategory = {};
    $scope.selection = [];
    $scope.MyCategories = true;
    var idx;
    //var tableUserRolePermissions = [];
    $scope.bitchange = function(site){

        var idx = $scope.selection.indexOf(site);
        console.log(idx);
        // is currently selected
        if (idx > -1) {
            $scope.selection.splice(idx, 1);
        }

        // is newly selected
        else {
            $scope.selection.push(site);
        }
        console.log($scope.selection);

    };
    $scope.selected = [];
    $scope.Chekchange = function(site){
        //console.log($scope.MyCheckbox);
        console.log($scope.selected);
        var idx = $scope.selected.indexOf(site);
        console.log(idx);
        // is currently selected
        if (idx > -1) {
            $scope.selected.splice(idx, 1);
        }

        // is newly selected
        else {
            $scope.selected.push(site);
        }

    };


    $scope.diffUser = {};
    $scope.userChange = function(val){
        console.log(val);
        console.log($scope.UserAdmin.RoleType);
        $scope.diffUser = $scope.UserAdmin.RoleType;
        console.log($scope.UserAdmin.RoleType.tableUserRoleTypeIsEditable);
        $scope.MeantRole = JSON.parse($scope.UserAdmin.RoleType);
        console.log($scope.MeantRole);
        if($scope.MeantRole.tableUserRoleTypeIsEditable == true){
            $scope.createPermission = false;
            $scope.secondShow = true;
        }else{
            $scope.secondShow = false;
            $scope.editPermission = false;
        }

    };
    $scope.RoleData = {};
    $scope.EditRole = function(value){
        if(value == true){
            $scope.createPermission = false;
            $scope.editPermission = true;

            var tim = JSON.parse($scope.diffUser);
            console.log($scope.selectPermissionTypeRole.roles);
            console.log(tim.tableUserRolePermissions);
            $scope.ManageUserdataRole = tim.tableUserRolePermissions;
            $scope.ManageUserRoleName = tim.tableUserRoleTypeString;
            //$scope.ManageUserdataRole = $scope.selectPermissionTypeRole.roles;
            $scope.ManageUserID = tim.idtableUserRoleTypeId;

        }else if(value == false){
            $scope.createPermission = true;
            $scope.editPermission = false;
        }
    };
    $scope.selectedData = {};

    $scope.ChekedChange = function(value,data,indexed){
        console.log(value);
        console.log(indexed);
        //console.log(value.currentTarget.checked);
        console.log(data);
        $scope.selectedData.rolled = data;
        //console.log(data[indexed].tinder);
        //angular.forEach(data,function(success,index){
        //    console.log(success);
        //    console.log(index);
        //    $scope.selectedData = [];
        //    $scope.selectedData.push(success);
        //});
        //console.log($scope.selectedData);
    };

    $scope.updateRoles = function(checkedData,checkUserID){
        console.log(checkedData);
        console.log(checkUserID);
        console.log($scope.selectedData.rolled);
        var newRoleArray = [];
        angular.forEach($scope.selectedData.rolled,function(value,key){
            var newSite = {};
            console.log(value);
            newSite.idtableUserRolePermissionId = value.idtableUserRolePermissionId;
            newSite.tableUserRolePermissionType = {
                'idtableUserRolePermissionTypeId':value.tableUserRolePermissionType.idtableUserRolePermissionTypeId,
                'tableUserRolePermissionTypeString':value.tableUserRolePermissionType.tableUserRolePermissionTypeString
            };
            newSite.checked = value.checked;
            console.log(newSite);
            newRoleArray.push(newSite);
        });
        var EditedData = {
            'tableUserRoleTypeString':checkedData,
            'tableUserRolePermissions':newRoleArray,
            'tableUserRoleTypeIsEditable':true
        };
        console.log('role value:',newRoleArray);
        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/userroletypes/'+checkUserID,
            data: EditedData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data){
            console.log(data);
            $scope.createPermission = false;
            $scope.editPermission = false;
            $scope.roleType();
        }).error(function(data){
            console.log(data);
        })
    };
    $scope.createRoles = function(checkedData){
        console.log(checkedData);
        if(checkedData == "" || checkedData == null){

            growl.error('Roles and Role Name is Required.')
        }else{
            var newRoleArray = [];
            angular.forEach($scope.selection,function(value,key){
                var newsite = {};
                newsite.tableUserRolePermissionType = {
                    'idtableUserRolePermissionTypeId':value.idtableUserRolePermissionTypeId,
                    'tableUserRolePermissionTypeString':value.tableUserRolePermissionTypeString
                };
                console.log(value);
                newsite.checked = true;
                newRoleArray.push(newsite);
            });
            var EditedDatas = {
                'tableUserRoleTypeString':checkedData,
                'tableUserRolePermissions':newRoleArray,
                'tableUserRoleTypeIsEditable':true
            };
            $http({
                method: 'POST',
                url: baseUrl + '/omsservices/webapi/userroletypes',
                data: EditedDatas,
                headers: {
                    'Content-Type': 'application/json'
                }
            }).success(function(data){
                console.log(data);
                $scope.createPermission = false;
                $scope.editPermission = false;
                $scope.roleType();
            }).error(function(data){
                console.log(data);
            })
        }

    };
    //====================== get default type role service permission ================ //
    $scope.selectPermissionTypeRole = {};
    $scope.permissionRoleType = function(){
        var roleUser = baseUrl+"/omsservices/webapi/userrolepermissiontype";
        $http.get(roleUser).success(function(data){
            console.log(data);
            $scope.selectPermissionTypeRole.roles = data;
        }).error(function(error,status){
            console.log(error);
            if(status == 401){
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    }
    $scope.permissionRoleType();
    //

    $scope.UserAdmin = {};


    $scope.addNewUser = function(data){

        console.log(data);
        var AdminRole = $scope.UserAdmin.RoleType;
        $scope.JAdmin = JSON.parse(AdminRole);

        console.log($scope.JAdmin);
        $scope.postData = {
            "tableUserFirstName": data.newFirstName,
            "tableUserLastName": data.newLastName,
            "tableUserEmailId": data.newUserEmail,
            "tableUserEncryptedPassword": "abcd",
            "tableUserPhoneNo": data.newUserPhone,
            "tableUserIsDeleted": 0,
            "tableUserIsEmailVerified": false,
            "tableUserIsFirstTime": false,
            "tableUserRoleType": {
                "idtableUserRoleTypeId": $scope.JAdmin.idtableUserRoleTypeId,
                "tableUserRoleTypeString": $scope.JAdmin.tableUserRoleTypeString
            },
            "tableUserStatusType": {
                "idtableUserStatusTypeId": 1,
                "tableUserStatusTypeString": "Active"
            }
        }

        $http({
            method: 'POST',
            url: baseUrl + '/omsservices/webapi/users',
            data: $scope.postData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data){
            console.log(data);
            $('#addNewUserModal').modal('hide');
            $scope.UserAdmin.newFirstName = '';
            $scope.UserAdmin.newLastName = '';
            $scope.UserAdmin.newUserEmail = '';
            $scope.UserAdmin.newUserPhone = '';
            $scope.RoleSubmission.$setPristine();
            $scope.listOfUsers();

        }).error(function(data){
            console.log(data);
            if(status == 401){
                //$('#AuthError').modal('show');
                growl.error('Your session has been expired. You need to Login again.');
                $location.path('/login');
            }
        });
    };


    $scope.showAddNewUserModal = function() {
        $scope.RoleSubmission.$setPristine();
        $scope.EditUser = false;
        $scope.AddUserBtn = true;
        $('#addNewUserModal').modal('show');
    };

    $scope.cancelAddNewUserModal = function() {
        $('#addNewUserModal').modal('hide');
        $scope.UserAdmin.newFirstName = '';
        $scope.UserAdmin.newLastName = '';
        $scope.UserAdmin.newUserEmail = '';
        $scope.UserAdmin.newUserPhone = '';
        $scope.createPermission = false;
        $scope.editPermission = false;
        $scope.secondShow = false;
        $scope.UserAdmin.RoleType = '';
        $scope.RoleSubmission.$setPristine();
    };

    $scope.activationLink  = function(data,action){

        ///omsservices/webapi/users/1/activate
        if(action == 'active'){
            $http({
                method: 'PUT',
                url: baseUrl + '/omsservices/webapi/users/'+data.idtableUserId+'/activate'
            }).success(function(response){
                console.log(response);
                $scope.listOfUsers();
            }).error(function(response){
                console.log(response);
            });
        }else{
            $http({
                method: 'PUT',
                url: baseUrl + '/omsservices/webapi/users/'+data.idtableUserId+'/deactivate'
            }).success(function(response){
                console.log(response);
                $scope.listOfUsers();
            }).error(function(response){
                console.log(response);
            });
        }
        console.log(data.idtableUserId);
    }

    $scope.toggleNewRole = function() {
        $scope.newRoleClicked = !$scope.newRoleClicked;
    };

    $scope.clearAction = function(){
        $scope.SearchUseradmin.UserName = '';
        console.log($scope.SearchUseradmin);
        $scope.listOfUsers();

    }



//    ======================================= Edit User Admin ============================================ //

    $scope.EditUserAdmin = function(data){
        console.log(data);
        $scope.EditUser = true;
        $scope.AddUserBtn = false;
        $scope.UserAdmin.newFirstName = data.tableUserFirstName;
        $scope.UserAdmin.newLastName = data.tableUserLastName;
        $scope.UserAdmin.newUserEmail = data.tableUserEmailId;
        $scope.UserAdmin.newUserPhone = data.tableUserPhoneNo;
        $scope.UserAdmin.rollId = data.tableUserRoleType;
        $scope.UserAdmin.UserStatus = data.tableUserStatusType;
        $scope.UserAdmin.UserID = data.idtableUserId;
        $('#addNewUserModal').modal('show');


    };

    $scope.EditUserAdminSubmitAction = function(){
        console.log($scope.UserAdmin);
        console.log($scope.UserAdmin.RoleType);
        if($scope.UserAdmin.RoleType == undefined || $scope.UserAdmin.RoleType == null){
            $scope.RoleData = $scope.UserAdmin.rollId;
        }else{
            $scope.RoleData = JSON.parse($scope.UserAdmin.RoleType);
        }

        console.log($scope.RoleData);

        var postData = {
            "idtableUserId": $scope.UserAdmin.UserID,
            "tableUserFirstName": $scope.UserAdmin.newFirstName,
            "tableUserLastName": $scope.UserAdmin.newLastName,
            "tableUserEmailId": $scope.UserAdmin.newUserEmail,
            "tableUserEncryptedPassword": "abcd",
            "tableUserPhoneNo": $scope.UserAdmin.newUserPhone,
            "tableUserIsDeleted": 0,
            "tableUserIsEmailVerified": false,
            "tableUserIsFirstTime": false,
            "tableUserRoleType": {
                "idtableUserRoleTypeId": $scope.RoleData.idtableUserRoleTypeId,
                "tableUserRoleTypeString": $scope.RoleData.tableUserRoleTypeString
            },
            "tableUserStatusType": {
                "idtableUserStatusTypeId": $scope.UserAdmin.UserStatus.idtableUserStatusTypeId,
                "tableUserStatusTypeString": $scope.UserAdmin.UserStatus.tableUserStatusTypeString
            }
        };
        $http({
            method: 'PUT',
            url: baseUrl + '/omsservices/webapi/users/'+$scope.UserAdmin.UserID,
            data: postData,
            headers: {
                'Content-Type': 'application/json'
            }
        }).success(function(data){
            console.log(data);
            $('#addNewUserModal').modal('hide');
            $scope.RoleSubmission.$setPristine();
            $scope.listOfUsers();
        }).error(function(data){
            console.log(data);
        })

    };

}
