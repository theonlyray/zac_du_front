(function () {
    'use strict';

    function licensesController($scope, $window, usrService, $cookies, $routeParams) {
        const vm = this;
        vm.touch = false;

        //?table settings
        vm.pageNumbers = [10,25,50];
        vm.data_page = vm.pageNumbers[0];
        vm.page = 1;
        //?
        //?permission
        vm.canValidateEntry   = false;
        vm.canValidateFirst   = false;
        vm.canValidateSecond  = false;
        vm.canValidateThird   = false;
        vm.canCreateOrder     = false;

        vm.utype = $window.sessionStorage.getItem('__utype');
      
        const sleep = ms => {
            return new Promise(resolve => setTimeout(resolve, ms));
        };
        
        const getPermissions = async () => {
            await sleep(2000);//sleep to wait usrService fill permissions array from profile request

            let usrPermissionsArray = usrService.permissionsArray;

            /**entry validation */
            let canValidateEntry =  usrPermissionsArray.find(o => o.name === 'license.validateEntry');
            if (angular.isDefined(canValidateEntry)) vm.canValidateEntry = true;
            
            /**first validation */
            let canValidateFirst =  usrPermissionsArray.find(o => o.name === 'license.validateFirstReview');
            if (angular.isDefined(canValidateFirst)) vm.canValidateFirst = true;
            
            /**second validation */
            let canValidateSecond =  usrPermissionsArray.find(o => o.name === 'license.validateSecondReview');
            if (angular.isDefined(canValidateSecond)) vm.canValidateSecond = true;
            
            /**third validation */
            let canValidateThird =  usrPermissionsArray.find(o => o.name === 'license.validateThirdReview');
            if (angular.isDefined(canValidateThird)) vm.canValidateThird = true;

            let canCreateOrder =  usrPermissionsArray.find(o => o.name === 'order.store');
            if (angular.isDefined(canCreateOrder)) vm.canCreateOrder = true;

            $scope.$digest();
        };

        vm.init = async () => {
            getPermissions();
            vm.licStat = $routeParams.licStat;

            const count = await usrService.axios('get',`contador`);
            vm.count = setClassCounter(count.data);
            
            const licenses = await usrService.axios('get',`licencias?estatus=${vm.licStat}`);
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
                
                const response = await usrService.axios('patch',`licencias/${licId}/validaciones`, vm.license);
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
                vm.stepValLabel = 'validar la primer revisión';
                vm.statusInt = 5;            
                break;
              case 2: 
                vm.stepValLabel = 'validar la segunda revisión'; 
                vm.statusInt = 7;
                break;
              case 3: 
                vm.stepValLabel = 'validar la tercer revisión'; 
                vm.statusInt = 9;
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
                vm.stepObsLabel = 'Agregar Obsercaciones en la primer revisión';
                vm.statusInt = 6;            
                break;
              case 2: 
                vm.stepObsLabel = 'Agregar Obsercaciones en la segunda revisión'; 
                vm.statusInt = 8;
                break;
              case 3: 
                vm.stepObsLabel = 'Agregar Obsercaciones en la tercer revisión'; 
                vm.statusInt = 10;
                break;
              case 4: 
                vm.stepObsLabel = 'Rechazar'; 
                vm.statusInt = 16;
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
                
                const response = await usrService.axios('patch',`licencias/${licId}/observaciones`, vm.license);
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

          let response = await usrService.axios('get',`licencias/${vm.license.id}/licencia`, null, 1);
          console.log(response);
          let fileURL = window.URL.createObjectURL(response.data);
          $window.open(fileURL, '_blank');
          vm.touch = false;
        };
    }

    angular
        .module('user')
        .controller('licensesController', licensesController)

})();