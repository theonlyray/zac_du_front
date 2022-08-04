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

            const response = await usrService.axios('get', `departamentos`);
            
            if (response.status == 200) vm.deps = response.data;
            $scope.$digest();
        };

        vm.editDep = data => {
            vm.dep = data;
            vm.editing = true;
        };

        vm.updateDep = async (dep) =>{
            if (angular.equals(vm.touch,false)) {
                vm.touch = true;

                const response = await usrService.axios('patch', `departamentos/${dep.id}`, dep);
                        
                vm.touch = false;
                if (response.status == 200){ 
                    toastr.success('Departamento Actualizado');
                    vm.cancel(); vm.init();
                }
                else if(response.status == 422) toastr.warning(response.data.message);
            }else toastr.warning('Proceso en ejecución, espera un momento');
        };

        vm.cancel = () => { vm.editing = false;  vm.dep = null; };

        ///
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
        .controller('depController', MyCtrl)

})();