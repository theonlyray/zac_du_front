(function () {
    'use strict';

    function requestController($scope, colService, $window) {
        const vm = this;
        vm.touch = false;

        vm.foliosList = [];

        vm.canValidateEntry     = false;
        vm.canValidateDocsPlans = false;

        vm.statusInt = 4; //?status value to send in changeStatus method
        
        const sleep = ms => {
            return new Promise(resolve => setTimeout(resolve, ms));
        };
        
        const getPermissions = async () => {
            await sleep(2000);//sleep to wait colService fill permissions array from profile request

            let usrPermissionsArray = colService.permissionsArray;
            /**entry validation */
            let canValidateEntry =  usrPermissionsArray.find(o => o.name === 'license.validateEntry');
            if (angular.isDefined(canValidateEntry)) vm.canValidateEntry = true;
            
            /**docs plans validation */
            let canValidateDocsPlans =  usrPermissionsArray.find(o => o.name === 'license.validateDocsPlans');
            if (angular.isDefined(canValidateDocsPlans)) vm.canValidateDocsPlans = true;
            $scope.$digest();
        };

        vm.init = async () => {
            getPermissions();

            const licId = $window.sessionStorage.getItem('__licId');
            const response = await colService.axios('get',`licencias/${licId}`);        
            vm.license = response.data;
            

            // vm.qrcode = `https://consultas.licenciaszac.org/visitors/card.html?hash=${btoa(vm.solicitud.id)}`;

            if (vm.license.property) {
              $window.sessionStorage.setItem('__lat', vm.license.property.latitud);
              $window.sessionStorage.setItem('__lng', vm.license.property.longitud);
            }
            

            const folios  = await colService.axios('get', 'folios');
            if (folios.status == 200) vm.foliosList = folios.data;
            else vm.foliosList = [
                {id:0, folio:'No hay licencias generadas'}
            ];

            $scope.$digest();
        };
        
        vm.validations = async flag => {
            if (vm.touch === false) {
                vm.touch = true;
                const licId = $window.sessionStorage.getItem('__licId');
    
                vm.license.estatus = flag;
                // if (angular.isUndefined(vm.license.backgrounds)) vm.license.backgrounds = [ {} ];   
                
                const response = await colService.axios('patch',`licencias/${licId}/validaciones`, vm.license);
                if (response.status === 200) {
                    toastr.success('Actualizado con exito');
                    $window.location = "#!tramites/Proceso";
                }else toastr.error(response.data.message);
                vm.touch = false;
            } else toastr.warning('Proceso en ejecución, espera un momento');
        };

      vm.setValLabels = flag => {
        switch (flag) {
          case 0: 
            vm.stepValLabel = 'validar el ingreso';
            vm.statusInt = 4;
            break;
          case 1: 
            vm.stepValLabel = 'validar los documentos y planos';
            vm.statusInt = 5;            
            break;
          default: 
            vm.stepValLabel = 'No option selected'; 
            vm.statusInt = 4;
            break;
        }
      };
        
      vm.setObsLabels = flag => {
        switch (flag) {
          case 0: 
            vm.stepObsLabel = 'Agregar observaciones a los requisitos a ';
            vm.statusInt = 2;
            break;           
          case 1: 
            vm.stepObsLabel = 'Agregar Observaciones al trámite';
            vm.statusInt = 6;            
            break;
          case 2: 
            vm.stepObsLabel = 'Rechazar'; 
            vm.statusInt = 9;
            break;
          default: 
            vm.stepObsLabel = 'No option selected'; 
            vm.statusInt = 4;
            break;
        }
      };
    
      vm.observations = async flag => {
        if (vm.touch === false) {
            vm.touch = true;
            const licId = $window.sessionStorage.getItem('__licId');

            vm.license.estatus = flag;
            
            const response = await colService.axios('patch',`licencias/${licId}/observaciones`, vm.license);
            if (response.status === 200) {
                toastr.success('Actualizado con exito');
                vm.license = response.data;
                $scope.$digest();
            }else toastr.error(response.data.message);
            vm.touch = false;
        } else toastr.warning('Proceso en ejecución, espera un momento');
      };
      
      vm.preview = async () => {
        let response = await colService.axios('get',`licencias/${vm.license.id}/preview`, null, 1);
        console.log(response);
        let fileURL = window.URL.createObjectURL(response.data);
        $window.open(fileURL, '_blank');
        vm.touch = false;
      };
    }

    angular
        .module('college')
        .controller('requestController', requestController)
})();