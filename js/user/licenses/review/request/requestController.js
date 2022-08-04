(function () {
    'use strict';

    function requestController($scope, usrService, $window) {
        const vm = this;
        vm.touch = false;

        vm.foliosList = [];

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
            const response = await usrService.axios('get',`licencias/${licId}`);        
            vm.license = response.data;
            

            // vm.qrcode = `https://consultas.licenciaszac.org/visitors/card.html?hash=${btoa(vm.solicitud.id)}`;

            $window.sessionStorage.setItem('__lat', vm.license.property.latitud);
            $window.sessionStorage.setItem('__lng', vm.license.property.longitud);

            const folios  = await usrService.axios('get', 'folios');
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
                
                const response = await usrService.axios('patch',`licencias/${licId}/validaciones`, vm.license);
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
                    $scope.$digest();
                }else toastr.error(response.data.message);
                vm.touch = false;
            } else toastr.warning('Proceso en ejecución, espera un momento');
          };
        // vm.download_file = async () => {
        //     if (vm.touch === false) {
        //         vm.touch = true;
        //         const id_lic = $window.sessionStorage.getItem('id_lic');
        //         const response = await myService.peticiones('get',`PdfV2/license/${id_lic}`);
        //         console.log(response);
        //         if (response != false) {
        //             window.open(`pdfs/dev_pdf/licencias/${response.data}`, '_blank');
        //             vm.touch = false;
        //         } else {
        //             vm.touch = false;
        //             console.log('algo salio mal');
        //         }
        //     } else toastr.warning('Proceso en ejecución, espera un momento');
        // }

        // vm.update = async data => {
        //     console.log(data);
        //     console.log(vm.solicitud.lic_detalles_);
        //     if (vm.touch === false) {
        //         vm.touch = true;
        //         const id_lic = $window.sessionStorage.getItem('id_lic');
        //         let payload = { grupo : 'lic_detalles_', data : data };
        //         const response = await myService.peticiones('patch',`Formalities/request_form/${id_lic}`, payload);
        //         if (response != false) {
        //             toastr.success('Actualizado con exito');
        //             vm.touch = false;
        //         } else {
        //             vm.touch = false;
        //             console.log('algo salio mal');
        //         }
        //     } else toastr.warning('Proceso en ejecución, espera un momento');
        // }
        
        // vm.update_lic = async () => {
        //     if (vm.touch === false) {
        //         vm.touch = true;
        //         const id_lic = $window.sessionStorage.getItem('id_lic');
        //         const response = await myService.peticiones('patch',`Formalities/license_form/${id_lic}`, vm.solicitud);
        //         if (response != false) {
        //             toastr.success('Actualizado con exito');
        //             vm.touch = false;
        //             vm.init();
        //         } else {
        //             vm.touch = false;
        //             console.log('algo salio mal');
        //         }
        //     } else toastr.warning('Proceso en ejecución, espera un momento');
        // }

        // vm.change_est = async flag => {
        //     if (vm.touch === false) {
        //         vm.touch = true;
        //         const id_lic = $window.sessionStorage.getItem('id_lic');
        //         let payload = { flag : flag}
        //         const response = await myService.peticiones('patch',`Formalities/license/${id_lic}`, payload);
        //         if (response != false) {
        //             toastr.success('Actualizado con exito');
        //             // $window.location = '#!/';
        //         } else {
        //             vm.touch = false;
        //             console.log('algo salio mal');
        //         }
        //     } else toastr.warning('Proceso en ejecución, espera un momento');
        // }

        // vm.toImage = async ()=>{
        //     // Convert the DOM element to a drawing using kendo.drawing.drawDOM
        //     kendo.drawing.drawDOM($(".qrgenerator"))
        //     .then(function(group) {
        //         // Render the result as a PNG image
        //         return kendo.drawing.exportImage(group);
        //     })
        //     .done(function(data) {
        //         // Save the image file
        //         kendo.saveAs({
        //             dataURI: data,
        //             fileName: "obraqr.png",
        //             proxyURL: "https://demos.telerik.com/kendo-ui/service/export"
        //         });
        //     });
        // }
    }

    angular
        .module('user')
        .controller('requestController', requestController)
})();