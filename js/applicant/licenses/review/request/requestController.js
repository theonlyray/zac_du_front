(function () {
    'use strict';

    function requestController($scope, appService, $window) {
        const vm = this;
        vm.touch = false;
        vm.lic = {};

        vm.foliosList = [];

        vm.init = async () => {
            const licId = $window.sessionStorage.getItem('__licId');
            const response = await appService.axios('get',`licencias/${licId}`);        
            vm.license = response.data;                      

            // vm.tramite = response.data.license_type_id;

            // vm.qrcode = `https://consultas.licenciaszac.org/visitors/card.html?hash=${btoa(vm.solicitud.id)}`;

            if (vm.license.property !== null) {
                sessionStorage.setItem('__lat', vm.license.property.latitud);
                sessionStorage.setItem('__lng', vm.license.property.longitud); 
            }
            
            const folios  = await appService.axios('get', 'folios');
            if (folios.status == 200) vm.foliosList = folios.data;
            else vm.foliosList = [
                {id:0, folio:'No hay licencias generadas'}
            ];
            
            $scope.$digest();
        };

        vm.validation = async flag => {
            if (vm.touch === false) {
                vm.touch = true;
                const licId = $window.sessionStorage.getItem('__licId');
    
                vm.license.estatus = flag;
                if (angular.isUndefined(vm.license.backgrounds)) vm.license.backgrounds = [ {} ];   
                
                const response = await appService.axios('patch',`licencias/${licId}/validaciones`, vm.license);
                if (response.status === 200) {
                    toastr.success('Actualizado con exito');
                    $window.location = "#!tramites/Proceso";
                }else toastr.error(response.data.message);
                vm.init();
                vm.touch = false;
            } else toastr.warning('Proceso en ejecución, espera un momento');
        };

        vm.observations = async flag => {
            if (vm.touch === false) {
                vm.touch = true;
                const licId = $window.sessionStorage.getItem('__licId');
    
                vm.license.estatus = flag;
                
                const response = await appService.axios('patch',`licencias/${licId}/observaciones`, vm.license);
                if (response.status === 200) {
                    toastr.success('Actualizado con exito');
                    vm.license = response.data;
                    $window.location = "#!tramites/Canceladas";
                    $scope.$digest();
                }else toastr.error(response.data.message);
                vm.touch = false;
            } else toastr.warning('Proceso en ejecución, espera un momento');
        };
    }

    angular
        .module('app')
        .controller('requestController', requestController)
})();