(function () {
    'use strict';

    function MyCtrl($scope, usrService, $cookies, $window, $q, $routeParams) {
        const vm = this;
        vm.touch = false;
        
        //?table settings
        vm.pageNumbers = [10,25,50];
        vm.data_page = vm.pageNumbers[0];
        vm.page = 1;

        vm.utype = $window.sessionStorage.getItem("__utype");
        
        vm.init = async () => {
            vm.roleId = $routeParams.role;

            const response = await usrService.axios('get', `autenticacion/roles`);
            
            if (response.status == 200) vm.roles = response.data;
            $scope.$digest();
        };
        
        vm.setRole = async role => {
            vm.role = role;   
            const response = await usrService.axios('get', `autenticacion/permisos`);

            if (response.status == 200){ 
                vm.permissisonsToAdd = mergingPermissions(response.data, role.permissions);
                $scope.$digest();
            } 
        };

        const mergingPermissions = (allPermissions, usrPermissions) =>{
            for (const userPermIterator of usrPermissions) {
                let index = allPermissions.findIndex(p => p.name == userPermIterator.name);

                if (index >= 0) allPermissions[index].checked = true;
            }

            return allPermissions;
        };

        vm.saveRole = async () => {
            // console.log(vm.permissisonsToAdd.filter(p => p.checked == true));
            vm.role.permissions = vm.permissisonsToAdd.filter(p => p.checked == true);

            const response = await usrService.axios('patch', `autenticacion/roles/${vm.role.id}`, vm.role);

            if (response.status == 200){ 
                toastr.success('Actualizacion realizada con éxito.')
                vm.cancel();
            }
            $scope.$digest();
        };

        vm.cancel = () => { 
            vm.role = undefined; }
            vm.permissisonsToAdd = undefined;
        ;
    }

    angular
        .module('user')
        .controller('rolesController', MyCtrl)

})();