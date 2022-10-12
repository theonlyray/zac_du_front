(function () {
    'use strict';

    function licensesController($scope, $window, colService, $cookies, $routeParams) {
        const vm = this;
        vm.touch = false;

        //?table settings
        vm.pageNumbers = [10,25,50];
        vm.data_page = vm.pageNumbers[0];
        vm.page = 1;
        //?
        //?permission
        vm.canValidateEntry     = false;
        vm.canValidateDocsPlans = false;
        vm.canCreateOrder       = false;

        vm.utype = $window.sessionStorage.getItem('__utype');
      
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
            

            let canCreateOrder =  usrPermissionsArray.find(o => o.name === 'order.store');
            if (angular.isDefined(canCreateOrder)) vm.canCreateOrder = true;

            $scope.$digest();
        };

        vm.init = async () => {
            getPermissions();
            vm.licStat = $routeParams.licStat;

            const count = await colService.axios('get',`contador`);
            vm.count = setClassCounter(count.data);
            
            const licenses = await colService.axios('get',`licencias?estatus=${vm.licStat}`);
            if (licenses.status === 204) toastr.info('Aún no existen licencias.');
            else if (licenses.status === 400) toastr.warning(licenses.data.message);
            else vm.licenses = licenses.data;

            $scope.$digest();
        };

        const setClassCounter = (data) => {
            let count = [];

            vm.total = data.Total;
            delete data.Total;

            for (const key in data) 
                count.push({ type : key, items : data[key], class : vm.licStat == key ? 'text-white bg-info' : '' });
            
            return count;
        };

        vm.saveLic = license => { 
            $window.sessionStorage.setItem('__licId', license.id);
            vm.license = license;
        };

        vm.validations = async flag => {
            if (vm.touch === false) {
                vm.touch = true;
                const licId = $window.sessionStorage.getItem('__licId');
    
                vm.license.estatus = flag;
                
                const response = await colService.axios('patch',`licencias/${licId}/validaciones`, vm.license);
                if (response.status === 200) {
                    toastr.success('Actualizado con exito');
                    vm.license = response.data;
                    vm.init();
                    $scope.$digest();
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
                    vm.init();
                    $scope.$digest();
                }else toastr.error(response.data.message);
                vm.touch = false;
            } else toastr.warning('Proceso en ejecución, espera un momento');
        };

        vm.pdf = async () => {

          let response = await colService.axios('get',`licencias/${vm.license.id}/licencia`, null, 1);
          console.log(response);
          let fileURL = window.URL.createObjectURL(response.data);
          $window.open(fileURL, '_blank');
          vm.touch = false;
        };
        
        vm.preview = async () => {
          let response = await colService.axios('get',`licencias/${vm.license.id}/preview`, null, 1);
          console.log(response);
          let fileURL = window.URL.createObjectURL(response.data);
          $window.open(fileURL, '_blank');
          vm.touch = false;
        };

        vm.orderPDF = async license => {
          let response = await colService.axios('get',`licencias/${license.id}/orden/${license.order.id}/pdf`, null, 1);
          let fileURL = window.URL.createObjectURL(response.data);
          $window.open(fileURL, '_blank');
          vm.touch = false;
      };
    }

    angular
        .module('college')
        .controller('licensesController', licensesController)

})();