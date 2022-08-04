(function () {
    'use strict';

    function docsController($scope, $window, appService) {
        const vm = this;
        vm.touch = false;

        vm.to = true;
        vm.init = async () => {
            const response = await appService.axios('get', 'archivos');

            if (response.status == 200) vm.files = response.data;
            if (response.status === 204) toastr.info('Aún no existen archivos.');

            $scope.$digest();
        };
    }

    angular
        .module('app')
        .controller('docsController', docsController)
})();