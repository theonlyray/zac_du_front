(function () {
    'use strict';

    function controller($scope, $window, appService) {
        const vm = this;
        vm.touch = false;

        vm.init = async () => {
            const licId = $window.sessionStorage.getItem('__licId');

            const response  = await appService.axios('get', `licencias/${licId}`);
            
            if (response.status == 200) vm.license = response.data;
            
            else toastr.error(response.data.message);

            $scope.$digest();
        };

        vm.pdf = async () => {
            let response = await usrService.axios('get',`licencias/${vm.license.id}/orden/${vm.license.order.id}/pdf`, null, 1);
            let fileURL = window.URL.createObjectURL(response.data);
            $window.open(fileURL, '_blank');
            vm.touch = false;
        };

        vm.insert = async () => {
            axios.post('http://10.220.107.112/api/orden/store',
            {
                'nombre' : 'nombre',
                'descripcion' : 'descripcion',
                'id' : [217],
                'monto' : [1.50],
                'cantidad' : [1],
                'idexpress' : 2689
            },
            {
                headers:{
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxNSIsImp0aSI6Ijc5MTQ3YjIwZTM3ZGY4MmQxMDc1YjMyZDU5NjhlNDIxM2ZlYjAyYmNkNmNhNjk1NDNkOTg0NWY1MjQxOGU1NDkwZTM0MGZlMDMzZmZhM2JkIiwiaWF0IjoxNjYwNTkxODMwLjI0MTU4MSwibmJmIjoxNjYwNTkxODMwLjI0MTU4NSwiZXhwIjoxNjkyMTI3ODMwLjIzNDE4Miwic3ViIjoiMTY4Iiwic2NvcGVzIjpbXX0.n08-Sv6OXwNse7-sEOz9P2OLwtj9j2j8ZLNicJ-9udOt7TA9WVO2f7AdEMKXLygETaT1mIWzyI8sw48VO8VXVWEjRHVmW7WOp8uNRS51F5wOWcZVZKce9GgayBWMeh6HyZyp-A3sSorcHoYF0WdWuH5zF9h00yFsCMPGZ0Om1mE5gZyU4403LC_zY9hljaKr1nxxDFGnl5SkfYUkHyVWOGQnbVqFyeWBcbKGL8_54AFg5F3s4HPqeYzj0aelHQ821Yxy3sk6bq08lLzkfylqNHj4fOdUigMkJfOljIZswf25y2GBHtGBorDyiyfeXJ99zryUrqIvNAr52WKEKPYn1H8yvC4HQjifuJlA6uwsjRwZz-lP67wITrgj-IKS5qZ0Tud_qefek7C3gkj3tbTbFKvM780jmP94YAI6Ln2akZYljK9xJGxEIvg7dNwhNL6vUFHxd8rU-vb-9ph1oDWQw4iuVT8uuUcL1bmckXmRVKIE0G4kq-7U3Q-rBRobxeDqWMHCmNN5FmvOTXt0UjroOzSQhd-TEGNPp1wn1i05EBqSaJt7V1lSno2Jqh8kFjSK1UbnZeC-hyTSpwocBrEEfMe-unU4wVAPCy1T2RvVslgQqpl6j2qzZ3iRxY2Bmhz5q2xZ0Ew83Jcno8josRHiI_7wtW_xNMoH8n04DCk_ZKc'
                }
            }).then( response => (
                console.log(response)
            ));
        }
        // vm.init = async () => {
        //     const id_lic = $window.sessionStorage.getItem('__id_lic');

        //     let license = await myService.peticiones('get',`licencias/${id_lic}`);
        //     vm.license = license.data;

        //     vm.breakdown = getBreakdown([vm.license]);

        //     let duties = await myService.peticiones('get',`licencias/${id_lic}/desgloce/${vm.breakdown[0].id}`);
        //     vm.duties = duties.data;

        //     vm.touch = false
        //     $scope.$digest();
        // }
        // vm.init();

        // const getBreakdown = data =>{
        //     console.log(data);
        //     let uid = $window.sessionStorage.getItem('__uid');
        //     for (const element of data) {
        //         return element.breakdown.filter(breakdown => breakdown.debtor_id == uid);
        //     }
        // }

        // vm.pago = async () => {
        //     if (vm.touch === false) {
        //         vm.touch = true;

        //             let formData = new $window.FormData();
        //             formData.append("license_id", $window.sessionStorage.getItem('__id_lic'));
        //             formData.append("breakdown_id", vm.breakdown[0].id);
        //             formData.append("nombre",vm.payload.document.name);
        //             formData.append("no_ref_pago",vm.payload.no_ref_pago);
        //             formData.append("renovacion", 0);
        //             formData.append("document", vm.payload.document);
        //             // console.dir(vm.payload.document);
                    
        //             const response = await myService.peticiones('post',`documentos?type=${1}`, formData,1);

        //             if (angular.equals(response.status,200)) {
        //                 toastr.success("Documento cargado con éxito");
        //                 vm.init();
        //             }
        //             else{ toastr.warning('Problemas para guardar, consulte con soporte');}
        //             vm.touch = false;
        //     }else {
        //         toastr.warning('Proceso activo, espera un momento');
        //     }
        // }
        
    }
    angular
        .module('app')
        .controller('paymentController', controller)

})();