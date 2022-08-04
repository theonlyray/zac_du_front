(function () {
    'use strict';

    function orderController($scope, usrService, $window) {
        const vm = this;
        
        vm.touch = false;

        vm.data_page=5;
        vm.page = 1;

        vm.canDeleteOrder     = false;
        vm.canValidateOrder   = false;

        vm.utype = $window.sessionStorage.getItem('__utype');
      
        const sleep = ms => {
            return new Promise(resolve => setTimeout(resolve, ms));
        };
        
        const getPermissions = async () => {
            await sleep(2000);//sleep to wait usrService fill permissions array from profile request

            let usrPermissionsArray = usrService.permissionsArray;

            let canDeleteOrder =  usrPermissionsArray.find(o => o.name === 'order.destroy');
            if (angular.isDefined(canDeleteOrder)) vm.canDeleteOrder = true;
            
            let canValidateOrder =  usrPermissionsArray.find(o => o.name === 'order.validate');
            if (angular.isDefined(canValidateOrder)) vm.canValidateOrder = true;

            $scope.$digest();
        };

        vm.init = async () => {
            getPermissions();
            const licId = $window.sessionStorage.getItem('__licId');
            const depId = $window.sessionStorage.getItem('__depid');

            const response  = await usrService.axios('get', `licencias/${licId}`);
            
            if (response.status == 200){ 
                vm.license = response.data;
                setPayloadDuties(vm.license.order);
            }
            else toastr.error(response.data.message);
            
            const duties  = await usrService.axios('get', `derechos?department=${depId}`);

            if (duties.status == 200) vm.duties = duties.data;
            else toastr.error(response.data.message);
            $scope.$digest();
        };

        const setPayloadDuties = data => {
            vm.dutiesPayload = [];
            vm.methodFlag = 'post';
            console.log(data);
            if (data != null) {
                vm.methodFlag = 'patch';
                for (const iterator of data.duties) {                    
                    iterator.cantidad = Number(iterator.pivot.cantidad);
                    iterator.total = Number(iterator.pivot.total);
                    vm.dutiesPayload.push(iterator);
                    calculate(vm.dutiesPayload);
                }
            }
        };
        
        vm.add = async (item) => {            
            if (!angular.isNumber(item.cantidad)) {
                toastr.error("Ingrese una cantidad valida"); 
            } else {
                if (angular.isUndefined(vm.dutiesPayload.find(x => x.id == item.id))) {
                    document.getElementById(`input_${item.id}`).disabled = true;
                    document.getElementById(`btn_${item.id}`).disabled = true;

                    item.total = item.cantidad * item.precio;
                    vm.dutiesPayload.push(item);
                    calculate(vm.dutiesPayload);
                }else toastr.warning("Este derecho ya ha sido agregado.");
                
            }
        };

        vm.remove = index => {
            let input   = document.getElementById(`input_${vm.dutiesPayload[index].id}`);
            let btn     = document.getElementById(`btn_${vm.dutiesPayload[index].id}`);

            if (input != null && btn != null) {
                input.disabled = false;
                btn.disabled = false;
            }
            vm.dutiesPayload.splice(index, 1);
            calculate(vm.dutiesPayload);
        }


        const calculate = async array => {
            vm.total = 0
            if (array.length > 0) {
                for (const iterator of array)
                    vm.total += iterator.cantidad * iterator.precio;
            } else vm.total = 0;
        }

        vm.send = async (flag) => {
            if (vm.touch === false) {
                vm.touch = true;
                if (vm.dutiesPayload.length !== 0) {
                    const licId = $window.sessionStorage.getItem('__licId');
                    const payload = { derechos :  vm.dutiesPayload }
                    let path;
                    if (vm.methodFlag == 'post') {
                        path = `licencias/${licId}/orden`;
                    }else path = `licencias/${licId}/orden/${vm.license.order.id}`;
                    const response = await usrService.axios(vm.methodFlag,path, payload);
                    if (response.status == 200) {
                        toastr.success("Actualización exitosa");
                        vm.init();
                    }else if (response.status == 422) 
                        toastr.warning(response.data.message);
                } else {
                    toastr.warning("Debe ingresar por lo menos un derecho");
                    vm.touch = false;
                }
                vm.touch = false;
            } else {
                toastr.warning('El proceso a comenzado, espera un momento')
            }
        };
        
        vm.delete = async () => {
            if (vm.touch === false) {
                vm.touch = true;
                
                const licId = $window.sessionStorage.getItem('__licId');
                const response = await usrService.axios('delete',`licencias/${licId}/orden/${vm.license.order.id}`, vm.license);

                if (response.status == 200) {
                    toastr.success("Actualización exitosa");
                    $window.locations = '#!tramites/Proceso';
                }else if (response.status == 422) 
                    toastr.warning(response.data.message);                
                        
                vm.touch = false;
            } else {
                toastr.warning('El proceso a comenzado, espera un momento')
            }
        };
        
        vm.validate = async () => {
            if (vm.touch === false) {
                vm.touch = true;
                
                const licId = $window.sessionStorage.getItem('__licId');

                const response = await usrService.axios('get',`licencias/${licId}/orden/${vm.license.order.id}/validar`);

                if (response.status == 200) {
                    toastr.success("Actualización exitosa");
                    vm.init();
                }else if (response.status == 422) 
                    toastr.warning(response.data.message);                
                        
                vm.touch = false;
            } else {
                toastr.warning('El proceso a comenzado, espera un momento')
            }
        };

        vm.pdf = async () => {
            let response = await usrService.axios('get',`licencias/${vm.license.id}/orden/${vm.license.order.id}/pdf`, null, 1);
            let fileURL = window.URL.createObjectURL(response.data);
            $window.open(fileURL, '_blank');
            vm.touch = false;
        };
    }

    angular
        .module('user')
        .controller('orderController', orderController)
})();