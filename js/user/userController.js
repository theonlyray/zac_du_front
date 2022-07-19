(function () {
    'use strict';

    function UsrCtrl($scope, usrService, $cookies, $window) {
        const vm = this;

        vm.me = async () => {
            if (angular.isUndefined($cookies.get('__token'))) vm.logout();

            const response = await usrService.axios('get', `perfil`)

            vm.user = response.data;

            usrService.setPermissions(vm.user.roles[0].permissions);
            
            vm.utype = $window.sessionStorage.getItem('__utype');
            // getUserType();
            $scope.$digest();
        };

        vm.logout = async () => {
            const response = await usrService.axios('get', `autenticacion/logout`);

            if (response.status === 200) {
                let cookies = $cookies.getAll();
                angular.forEach(cookies, function (v, k) {
                    $cookies.remove(k);
                });
                sessionStorage.clear();
                $window.location = "index.html";
            }else toastr.warning('No se ha podido cerrar sesión, intentelo más tarde');
        };

        // const getUserType = () => {
        //     $scope.utype = $window.sessionStorage.getItem('__utype');
        // };
    }

    angular
        .module('user')
        .controller('usrCtrl', UsrCtrl)

})();