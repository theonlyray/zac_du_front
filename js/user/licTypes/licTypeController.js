(function () {
    'use strict';

    function licTypeController($scope, $window, usrService, usrFactory) {
        const vm = this;
        vm.touch = false;
        vm.editing = false;

        vm.init = async () => {
            
            const response = await usrService.axios('get', 'tipos_licencia');                
            vm.licTypes = response.data;

            $scope.$digest();
        };

        vm.setLicType = async licType =>{
            vm.editing = true;
            const response = await usrService.axios('get',  `tipos_licencia/${licType.id}`);

            vm.licType = response.data;
            $scope.$digest();
        };

        vm.updateReq = async (req, index) =>{
            const response = await usrService.axios('patch',  `requisitos/${req.id}`, req);

            if (response.status == 200){ 
                toastr.success('Requisito Actualizado correctamente');
                vm.licType.requiments[index] = response.data;
            }
        };

        vm.saveReq = async (req) =>{
            req.license_type_id = vm.licType.id;
            req.activo      = req.activo == undefined ? false : req.activo;
            req.obligatorio = req.obligatorio == undefined ? false : req.obligatorio;
            req.es_plano    = req.es_plano == undefined ? false : req.es_plano;

            const response = await usrService.axios('post',  `requisitos`, req);

            if (response.status == 200){ 
                toastr.success('Requisito generado correctamente');
                vm.req = undefined;
                vm.setLicType(vm.licType);
            }
        };

        vm.cancel = () => {
            vm.licType = undefined;
            vm.editing = false;
        };

        vm.addLicType = async licType => {
            licType.department_id = $window.sessionStorage.getItem('__depid');

            const response = await usrService.axios('post',  `tipos_licencia`, licType);

            if (response.status == 200){ 
                toastr.success('Licencia generada correctamente');
                vm.init();
            }
        };
        
        vm.updateLicType = async licType => {
            const response = await usrService.axios('patch',  `tipos_licencia/${licType.id}`, licType);

            if (response.status == 200){ 
                toastr.success('Licencia actualizada correctamente');
                vm.licType = response.data;

                $scope.$digest();
            }
        };
    }

    angular
        .module('user')
        .controller('licTypeController', licTypeController)
})();