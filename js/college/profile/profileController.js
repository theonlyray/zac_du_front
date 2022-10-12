(function () {
    'use strict';

    function profileController($scope, colService, $window) {
        const vm = this;
        vm.touch = false;

        vm.utype = $window.sessionStorage.getItem('__utype');

        vm.init = async () => {
            const response = await colService.axios('get', `perfil`);
            vm.user = response.data;
            
            $scope.$digest()
        };

        vm.updateMe = async user => {
            const response = await colService.axios('patch', `perfil`, user);

            if (response.status == 200){
                toastr.success('Datos actualizados correctamente');  
                vm.user = response.data;
            }
        };
        
        vm.updateDep = async dep => {
            const response = await colService.axios('patch', `departamentos/${dep.id}`, dep);

            if (response.status == 200){
                toastr.success('Datos actualizados correctamente');  
                vm.init();
            }
        };

    }

    angular
        .module('college')
        .controller('profileController', profileController)

})();