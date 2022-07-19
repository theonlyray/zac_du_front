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

            const response = await usrService.axios('get', `unidades`);
            
            if (response.status == 200) vm.units = response.data;
            $scope.$digest();
        };
        
        vm.editUnit = data => {
            vm.unit = data;
            vm.editing = true;
        };

        vm.cancel = () => { vm.editing = false;  vm.unit = undefined; };

        vm.addUnit = async unit =>{
            if (angular.equals(vm.touch,false)) {
                vm.touch = true;
                
                unit.department_id = $window.sessionStorage.getItem('__depid');

                const response = await usrService.axios('post', `unidades`, unit);
                        
                vm.touch = false;
                if (response.status == 200){ 
                    toastr.success('Unidad Actualizada');
                    vm.cancel(); vm.init();
                }
            }else toastr.warning('Proceso en ejecución, espera un momento');
        };

        vm.updateUnit = async (unit) =>{
            if (angular.equals(vm.touch,false)) {
                vm.touch = true;

                const response = await usrService.axios('patch', `unidades/${unit.id}`, unit);
                        
                vm.touch = false;
                if (response.status == 200){ 
                    toastr.success('Unidad Actualizada');
                    vm.cancel(); vm.init();
                }
                // else toastr.warning(response.data.message);
            }else toastr.warning('Proceso en ejecución, espera un momento');
        };
    }

    angular
        .module('user')
        .controller('unitsController', MyCtrl)

})();