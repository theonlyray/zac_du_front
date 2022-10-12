(function () {
    'use strict';

    function MyCtrl($scope, colService, $cookies, $window, $q, $routeParams) {
        const vm = this;
        vm.touch = false;
        
        //?table settings
        vm.pageNumbers = [10,25,50];
        vm.data_page = vm.pageNumbers[0];
        vm.page = 1;
        
        vm.rolesArray = [            
            {id : 8, name : 'Colaborador'},
        ];

        //?permissions div flag
        vm.permissionsDiv = false;

        //?set new user model
        vm.user = {
            role_id : vm.rolesArray[0]
        };

        vm.utype = $window.sessionStorage.getItem("__utype");
        
        vm.init = async () => {
            vm.roleId = $routeParams.role;          

            setLabel(vm.roleId);
            setRoleArray(vm.utype);

            const response = await colService.axios('get', `usuarios?role_id=${vm.roleId}`);              
            
            if (response.status == 200) vm.users = response.data;
            $scope.$digest();
        };
        
        const setRoleArray = utype => {
            if (utype == 6) {
                vm.rolesArray.push({id : 7, name : 'Subdirector de Colegio'});
            }
        };
        
        const setLabel = roleId => {
            switch (roleId) {
                case '6':
                    vm.label = 'Dir. Colegio';
                    break;
                case '7':
                    vm.label = 'Sub. Dir. Colegio';
                    break;
                case '8':
                    vm.label = 'Colaboradores';
                    break;
                case '9':
                    vm.label = 'DROs';
                    break;
                default:
                    vm.label = 'Undefined';            
                    break;
            }
        };

        vm.updateUser = async (usr,flag) =>{
            if (angular.equals(vm.touch,false)) {
                vm.touch = true; let method = '';
                
                if (angular.equals(flag,0)){ method="PATCH"; usr.validado = !usr.validado; }
                else if(flag == 1){
                    usr.role_id = usr.role_id.id;
                }

                const response = await colService.axios('patch', `usuarios/${usr.id}`, usr);
                        
                vm.touch = false;
                if (response.status == 200){ 
                    toastr.success('Usuario Actualizado');
                    vm.cancel(); vm.init();
                }
                // else toastr.warning(response.data.message);
            }else toastr.warning('Proceso en ejecución, espera un momento');
        };

        vm.editUser = data => {
            vm.user = data;
            vm.editing = true;
            vm.user.role_id = vm.user.roles[0];
        };

        vm.cancel = () => { vm.editing = false;  vm.permissionsDiv = false; vm.user = {role_id : vm.rolesArray[0]}; };

        vm.addUser = async user =>{
            if (angular.equals(vm.touch,false)) {
                vm.touch = true;
                
                user.role_id = user.role_id.id;
                user.department_id = $window.sessionStorage.getItem('__depid');
                user.college_id = $window.sessionStorage.getItem('__colid');

                const response = await colService.axios('post', `usuarios`, user);
                        
                vm.touch = false;
                if (response.status == 200){ 
                    toastr.success('Usuario Actualizado');
                    vm.cancel(); vm.init();
                }
            }else toastr.warning('Proceso en ejecución, espera un momento');
        };

        vm.queryUser = async user => {
            if (angular.equals(vm.touch,false)) {
                vm.touch = true;

                const response = await colService.axios('get', `usuarios/${user.id}`);

                const permissions = await colService.axios('get', `autenticacion/permisos`);
                        
                vm.touch = false;
                if (response.status == 200){
                    vm.permissionsDiv = true;
                    vm.user = response.data;
                    vm.permissisonsToAdd = mergingPermissions(permissions.data, response.data.permissions);
                    $scope.$digest();
                }
            }else toastr.warning('Proceso en ejecución, espera un momento');
        };

        const mergingPermissions = (allPermissions, usrPermissions) =>{
            for (const userPermIterator of usrPermissions) {
                let index = allPermissions.findIndex(p => p.name == userPermIterator.name);

                if (index >= 0) allPermissions[index].checked = true;
            }

            return allPermissions;
        };

        vm.savePerm = async () => {
            // console.log(vm.permissisonsToAdd.filter(p => p.checked == true));
            vm.user.permissions = vm.permissisonsToAdd.filter(p => p.checked == true);
            
            const response = await colService.axios('patch', `usuarios/${vm.user.id}/permisos`, vm.user);
                        
            vm.touch = false;
            if (response.status == 200){
                toastr.success('Usuario Actualizado');
                vm.cancel(); vm.init();
                $scope.$digest();
            }
        };        
    }

    angular
        .module('college')
        .controller('usersController', MyCtrl)

})();