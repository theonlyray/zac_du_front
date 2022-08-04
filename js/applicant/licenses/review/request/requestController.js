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

            $window.sessionStorage.setItem('__lat', vm.license.property.latitud);
            $window.sessionStorage.setItem('__lng', vm.license.property.longitud);
            
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
        .module('app')
        .controller('requestController', requestController)
})();