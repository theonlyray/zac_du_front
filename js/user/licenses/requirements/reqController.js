(function () {
    'use strict';
  
    function reqController($scope, $window, usrService, usrFactory) {
      const vm = this;
      vm.touch = false;

      vm.docType = false; //?filter byt req type

      vm.canValidateEntry   = false;
      vm.canValidateFirst   = false;
      vm.canValidateSecond  = false;
      vm.canValidateThird   = false;

      vm.statusInt = 4; //?status value to send in changeStatus method
      
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
        $scope.$digest();
      };

    vm.init = async () => {
        getPermissions();
        const licId = $window.sessionStorage.getItem('__licId');

        const response  = await usrService.axios('get', `licencias/${licId}`);
        
        if (response.status == 200) vm.license = response.data;
        else toastr.error(response.data.message);

        $scope.$digest();
      };

      vm.sendFile = async (file, req) => {
        if (vm.touch === false) {          
          vm.touch = true;

          const validation = await usrFactory.docValidation(file);
          
          if (validation.status === true) {
            const licId = $window.sessionStorage.getItem('__licId');
            const payload = { archivo: file.base64, estatus:1, nombre: file.filename}
            
            const response = await usrService.axios('patch',`licencias/${licId}/requisitos/${req.id}`, payload);
            
            if (response.status == 200){
               vm.license = response.data;
               toastr.success("Documento cargado con éxito");
            }else toastr.error(response.data.message);
            
            $scope.$digest();
          } else toastr.error(validation.msg);
          vm.touch = false
        } else {
          toastr.warning('El proceso a comenzado, espera un momento')
        }
      };

      vm.updateReq = async (req,status)  =>{
        if (vm.touch === false) {          
          vm.touch = true;
          
          const licId = $window.sessionStorage.getItem('__licId');
          
          req.estatus = status;
          
          const response = await usrService.axios('patch',`licencias/${licId}/requisitos/${req.id}`, req);
          
          if (response.status == 200){
              vm.license = response.data;
              toastr.success("Actualización realizada con éxito");
          }else toastr.error(response.data.message);
          
          $scope.$digest();
          vm.touch = false
        } else {
          toastr.warning('El proceso a comenzado, espera un momento')
        }
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
                $scope.$digest();
            }else toastr.error(response.data.message);
            vm.touch = false;
        } else toastr.warning('Proceso en ejecución, espera un momento');
      };
    }
  
    angular
      .module('user')
      .controller('reqController', reqController)
  })();