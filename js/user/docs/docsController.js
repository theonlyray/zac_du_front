(function () {
    'use strict';

    function docsController($scope, $window, usrService, usrFactory) {
        const vm = this;
        vm.touch = false;

        vm.init = async () => {
            const response = await myService.peticiones('get', 'Documents/docs');            
            vm.files = preset(response.data.data);

            if(vm.files[0] == undefined) toastr.info('No hay documentos cargados.');
            $scope.$digest();
        }
    }

    angular
        .module('user')
        .controller('docsController', docsController)
})();