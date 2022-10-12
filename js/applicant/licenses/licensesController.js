(function () {
    'use strict';

    function licensesController($scope, $window, appService, $cookies, $routeParams) {
        const vm = this;
        vm.touch = false;

        //?table settings
        vm.data_page=10;
        vm.page = 1;
        //?
        
        vm.utype = $window.sessionStorage.getItem('__utype');

        vm.init = async () => {
            vm.licStat = $routeParams.licStat;

            const count = await appService.axios('get',`contador`);
            vm.count = setClassCounter(count.data);
            
            const licenses = await appService.axios('get',`licencias?estatus=${vm.licStat}`);
            if (licenses.status === 204) toastr.info('Aún no existen licencias.');
            else if (licenses.status === 400) toastr.warning(licenses.data.message);
            else{ 
                vm.licenses = licenses.data;
                vm.licStat == 'Proceso' ? syncOrders(licenses.data) : null;
            }

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

        vm.validation = async flag => {
            if (vm.touch === false) {
                vm.touch = true;
                const licId = $window.sessionStorage.getItem('__licId');
    
                vm.license.estatus = flag;
                
                const response = await appService.axios('patch',`licencias/${licId}/validaciones`, vm.license);
                if (response.status === 200) {
                    toastr.success('Actualizado con exito');
                    $scope.$digest();
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
                }else toastr.error(response.data.message);
                
                vm.init();
                $scope.$digest();
                vm.touch = false;
            } else toastr.warning('Proceso en ejecución, espera un momento');
        };

        vm.payment = async () => {
            console.log(vm.license);
        };
        
        vm.request = async () => {
            if (vm.license.license_type_id >= 17 && vm.license.license_type_id <= 20){
                let response = await appService.axios('get',`licencias/${vm.license.id}/solicitud`, null, 1);
                let fileURL = window.URL.createObjectURL(response.data);
                $window.open(fileURL, '_blank');
                vm.touch = false;    
            }else toastr.info('Developing...');
            
        };
        
        vm.pdf = async () => {

            let response = await appService.axios('get',`licencias/${vm.license.id}/licencia`, null, 1);
			let fileURL = window.URL.createObjectURL(response.data);
			$window.open(fileURL, '_blank');
            vm.touch = false;
        };

        vm.sublicense = async (license, flag) => {   
            if (vm.touch === false) {
                vm.touch = true;

                license.backgrounds = [ { prior_license_id: license.id } ];
                license.estatus = 0;
                const licId = $window.sessionStorage.getItem('__licId');
                
                const response = await appService.axios('post',`licencias/${licId}/sublicencia?type=${flag}`, vm.license);
                if (response.status === 200) {
                    toastr.success('Actualizado con exito');
                    $window.location = "#!tramites/Proceso";
                }else toastr.error(response.data.message);
                vm.touch = false;
            } else toastr.warning('Proceso en ejecución, espera un momento');
        };

        const syncOrders = async licenses =>{
            let ordersIds = [];
            for (const iterator of licenses)
                if (iterator.order != null) 
                    ordersIds.push(iterator.order.folio_api);                
            
            if (ordersIds.length > 0) {
                // let response = await appService.axios('patch', 'pagos', {ordersIds : ordersIds});

                // if (response.status == 200 && response.data.somePayment) {
                //     for (const iterator of response.data.data) {
                //         toastr.success(`Ya puedes descargar tu licenecia autorizada con folio ${iterator}`);
                //     }
                // }
            }
        };
    }

    angular
        .module('app')
        .controller('licensesController', licensesController)

})();