(function () {
    'use strict';

    function profileController($scope, appService, appFactory, $window) {
        const vm = this;
        vm.touch = false;

        vm.utype = $window.sessionStorage.getItem('__utype');

        vm.init = async () => {
            const response = await appService.axios('get', `perfil`);
            vm.user = response.data;
            
            $scope.$digest()
        };

        vm.updateMe = async user => {
            const response = await appService.axios('patch', `perfil`, user);

            if (response.status == 200){
                toastr.success('Datos actualizados correctamente');  
                vm.user = response.data;
            }
        };

    }

    angular
        .module('app')
        .controller('profileController', profileController)

})();