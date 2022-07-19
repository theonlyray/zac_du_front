(function () {
    'use strict';

    function AppCtrl($scope, appService, $cookies, $window) {
        const vm = this;

        vm.me = async () => {
            if (angular.isUndefined($cookies.get('__token'))) vm.logout();

            const response = await appService.axios('get', `perfil`);
            
            vm.user = response.data;
            
            isValidated(vm.user);

            $scope.$digest();
        };        

        const isValidated = user => {
            let utype = $window.sessionStorage.getItem('__utype');
            
            $window.sessionStorage.setItem('__DUValidation', (user.validado));
            if(utype == 9) $window.sessionStorage.setItem('__colValidation', (user.college[0].pivot.validado == 1));
        };

        vm.logout = async () => {
            const response = await appService.axios('get', `autenticacion/logout`);

            if (response.status === 200) {
                let cookies = $cookies.getAll();
                angular.forEach(cookies, function (v, k) {
                    $cookies.remove(k);
                });
                sessionStorage.clear();
                $window.location = "index.html";
            }else toastr.warning('No se ha podido cerrar sesión, intentelo más tarde');
        };

        // vm.usr_flags = flg => {
        //     $window.sessionStorage.setItem('__usrtypeflg', flg);            
        // }
    }

    angular
        .module('app')
        .controller('appCtrl', AppCtrl)

})();