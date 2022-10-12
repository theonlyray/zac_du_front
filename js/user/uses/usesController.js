(function () {
    'use strict';

    function usesController($scope, $window, usrService, usrFactory) {
        const vm = this;
        vm.touch = false;

        vm.editing = false;

        //?stepper settings
        vm.pageNumbers = [10,25,50];
        vm.data_page = vm.pageNumbers[0];
        vm.page = 1;

        vm.init = async () => {
            
            const response = await usrService.axios('get', 'usos');                
            vm.uses = response.data;

            $scope.$digest();
        };

        vm.setUse = async landUse =>{
            vm.editing = true;
            const response = await usrService.axios('get',  `usos/${landUse.id}`);

            vm.landUse = response.data;
            $scope.$digest();
        };

        vm.cancel = () => {
            vm.landUse = undefined;
            vm.editing = false;
        };

        vm.saveDesc = async (desc) =>{
            const response = await usrService.axios('post', `usos/${vm.landUse.id}/descripcion`, desc);

            if (response.status == 200){ 
                toastr.success('Descripción generada correctamente');
                vm.desc = undefined;
                vm.setUse(vm.landUse);
            }
        };

        vm.updateDesc = async (desc, index) =>{
            const response = await usrService.axios('patch',  `usos/${vm.landUse.id}/descripcion/${desc.id}`, desc);

            if (response.status == 200){ 
                toastr.success('Descripcion Actualizada correctamente');
                vm.landUse.descriptions[index] = response.data;
            }
        };

        vm.updateLandUse = async landUse => {
            const response = await usrService.axios('patch',  `usos/${landUse.id}`, landUse);

            if (response.status == 200){ 
                toastr.success('Uso de Suelo actualizado correctamente');
                vm.licType = response.data;

                $scope.$digest();
            }
        };

    }

    angular
        .module('user')
        .controller('usesController', usesController)
})();