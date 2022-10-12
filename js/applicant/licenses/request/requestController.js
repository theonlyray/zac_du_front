(function () {
    'use strict';

    function requestController($scope, appService, $window) {
        const vm = this;

        vm.showLicTypesFlag = false;
        vm.utype = ($window.sessionStorage.getItem('__utype'));
        vm.dUValidation = ($window.sessionStorage.getItem('__DUValidation') == 'true');
        vm.colValidation = ($window.sessionStorage.getItem('__colValidation') == 'true');
    
        $window.sessionStorage.setItem('__lat', 22.774286330471714);
        $window.sessionStorage.setItem('__lng', -102.58732274627991);

        vm.init = async () => {
            if ((vm.utype == 9 && vm.dUValidation && vm.colValidation) || (vm.utype == 10 && vm.dUValidation)) {
                const response = await appService.axios('get', `tipos_licencia`);
                vm.licenseTypes = response.data;
                vm.showLicTypesFlag = true;
                $scope.$digest();
            }
        };

        vm.licenseType = (item) => {
            vm.request = item;
            toastr.info('Completa todos los campos');
        };
    }

    angular
        .module('app')
        .controller('requestController', requestController)
})();