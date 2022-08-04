(function () {
    'use strict';

    function MyCtrl($scope, usrService, $cookies, $window, $q, $routeParams) {
        const vm = this;
        vm.touch = false;
        
        //?table settings
        vm.pageNumbers = [10,25,50];
        vm.data_page = vm.pageNumbers[0];
        vm.page = 1;
        
        vm.rolesArray = [            
            {id : 5, name : 'Colaborador'},
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

            const response = await usrService.axios('get', `usuarios?role_id=${vm.roleId}`);

            const responseUnits = await usrService.axios('get', `unidades`);                  
            
            if (response.status == 200) vm.users = response.data;
            if (responseUnits.status == 200){ 
                vm.units = responseUnits.data;
                vm.user.unit_id = vm.units[0];
            }
            $scope.$digest();
        };
        
        const setRoleArray = utype => {
            if (utype <= 3) {
                vm.rolesArray.push({id : 4, name : 'Jefe Unidad'});
            }
        };
        
        const setLabel = roleId => {
            switch (roleId) {
                case '2':
                    vm.label = 'Dir. Departamento';
                    break;
                case '3':
                    vm.label = 'Sub. Dir. Departamento';
                    break;
                case '4':
                    vm.label = 'Jefes de Unidad';
                    break;
                case '5':
                    vm.label = 'Colaboradores';
                    break;
                case '9':
                    vm.label = 'DROs';
                    break;
                case '10':
                    vm.label = 'Particulares';
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
                    usr.unit_id = usr.unit_id.id;
                }

                const response = await usrService.axios('patch', `usuarios/${usr.id}`, usr);
                        
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
            vm.user.role_id = vm.user.roles[0];
            if(vm.user.unit != null){vm.user.unit_id = vm.user.unit[0];}
            vm.editing = true;
        };

        vm.cancel = () => { vm.editing = false;  vm.permissionsDiv = false; vm.user = {role_id : vm.rolesArray[0],  unit_id : vm.units[0]}; };

        vm.addUser = async user =>{
            if (angular.equals(vm.touch,false)) {
                vm.touch = true;
                
                user.role_id = user.role_id.id;
                user.department_id = $window.sessionStorage.getItem('__depid');
                user.college_id = $window.sessionStorage.getItem('__colid');

                const response = await usrService.axios('post', `usuarios`, user);
                        
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

                const response = await usrService.axios('get', `usuarios/${user.id}`);

                const permissions = await usrService.axios('get', `autenticacion/permisos`);
                        
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
            
            const response = await usrService.axios('patch', `usuarios/${vm.user.id}/permisos`, vm.user);
                        
            vm.touch = false;
            if (response.status == 200){
                toastr.success('Usuario Actualizado');
                vm.cancel(); vm.init();
                $scope.$digest();
            }
        };        
    }

    angular
        .module('user')
        .controller('usersController', MyCtrl)

})();