(function () {
    'use strict';

    function docsController($scope, $window, usrService, usrFactory) {
        const vm = this;
        vm.touch = false;

        vm.to = 'true';
        vm.init = async () => {
            const response = await usrService.axios('get', 'archivos');

            if (response.status == 200) vm.files = response.data;
            if (response.status === 204) toastr.info('Aún no existen archivos.');

            $scope.$digest();
        };

        vm.sendFile = async (file) => {
            if (vm.touch === false) {          
              vm.touch = true;
    
              const validation = await usrFactory.docValidation(file);
              
              if (validation.status === true) {
                
                const payload = { 
                    archivo: file.base64, 
                    para:(vm.to == "true"), 
                    nombre: file.filename,
                    college_id : null
                };
                
                console.log(payload);
                const response = await usrService.axios('post',`archivos`, payload);
                
                if (response.status == 200){
                   toastr.success("Archivo cargado con éxito");
                   vm.init();
                }else toastr.error(response.data.message);
                
                $scope.$digest();
              } else toastr.error(validation.msg);
              vm.touch = false
            } else {
              toastr.warning('El proceso a comenzado, espera un momento')
            }
        };

        vm.setFile = file =>{ vm.file = file; };

        vm.deleteFile = async (file) => {
            if (vm.touch === false) {          
              vm.touch = true;
              
                const response = await usrService.axios('delete',`archivos/${file.id}`, file);
                
                if (response.status == 200){
                   toastr.success("Archivo eliminado con éxito");
                   vm.init();
                }else toastr.error(response.data.message);
                
                $scope.$digest();
              vm.touch = false
            } else {
              toastr.warning('El proceso a comenzado, espera un momento')
            }
        };
    }

    angular
        .module('user')
        .controller('docsController', docsController)
})();