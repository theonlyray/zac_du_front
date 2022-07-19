(function () {
    'use strict';

    function licensesController($scope, $window, appService, $cookies, $routeParams) {
        const vm = this;
        vm.touch = false;

        //?table settings
        vm.data_page=10;
        vm.page = 1;
        //?
        
        vm.utype = $window.sessionStorage.getItem('__utype');

        vm.init = async () => {
            vm.licStat = $routeParams.licStat;

            const count = await appService.axios('get',`contador`);
            vm.count = setClassCounter(count.data);
            
            const licenses = await appService.axios('get',`licencias?estatus=${vm.licStat}`);
            if (licenses.status === 204) toastr.info('Aún no existen licencias.');
            else if (licenses.status === 400) toastr.warning(licenses.data.message);
            else vm.licenses = licenses.data;

            $scope.$digest();
        };

        const setClassCounter = (data) => {
            let count = [];

            vm.total = data.Total;
            delete data.Total;

            for (const key in data) 
                count.push({ type : key, items : data[key], class : vm.licStat == key ? 'text-white bg-info' : '' });
            
            return count;
        };

        vm.saveLic = license => { 
            $window.sessionStorage.setItem('__licId', license.id);
            vm.license = license;
        };

        vm.changeStatus = async flag => {
            if (vm.touch === false) {
                vm.touch = true;
                const licId = $window.sessionStorage.getItem('__licId');
    
                vm.license.estatus = flag;
                
                const response = await appService.axios('patch',`licencias/${licId}`, vm.license);
                if (response.status === 200) {
                    toastr.success('Actualizado con exito');
                    vm.init();
                }else toastr.error(response.data.message);
                vm.touch = false;
            } else toastr.warning('Proceso en ejecución, espera un momento');
        };
        /*
        vm.pro_type = ($window.sessionStorage.getItem('utipo') == 4);
        vm.__ustate = ($window.sessionStorage.getItem('__ustate') == 'true');
        vm.uid = $window.sessionStorage.getItem('__uid');      

        //FIO
        vm.btn_fio = 'active';        
        //cotizacion
        vm.btn_cot = '';
        const preset = () => {
            vm.tipo_lic = Number($window.sessionStorage.getItem('__tipo_lic'));
            
            switch (vm.tipo_lic) {
                case 1:  vm.btn_fio = 'active'; vm.btn_cot = ''; break;
                case 2:  vm.btn_fio = ''; vm.btn_cot = 'active'; break;            
                default: vm.btn_fio = 'active'; vm.btn_cot = ''; break;
            }
        }

        vm.init = async () => {
            preset();
            vm.totalDebt =  vm.totalM2 = 0;
            vm.status_lic = $routeParams.tipo;
            let status;
            switch (vm.status_lic) {
                case 'Solicitudes':         status = 0; break;
                case 'Generadas':           status = 1; break;
                case 'Canceladas':          status = 2; break;
                case 'Corresponsabilidades':  status = 3; break;
                default: status = 1; break;            
            }
            $window.sessionStorage.setItem('__estatus_lic',vm.status_lic);
            const counter  = await appService.axios('get',`contador`);
            const response = await appService.axios('get',`licencias?type=${vm.tipo_lic}&status=${status}`);
                        
            vm.contados = setClassCounter(counter.data,status);
            vm.data = response.data;

            if (response.status == 200 && (status == 1)) getTotals(vm.data);            
            if (response.status == 200 && (status == 3)) getCoresponsiblesData(vm.data);

            vm.page = 1;
            $scope.$digest();
        };

        function setClassCounter(data,status){
            vm.total = data.Total;                        
            let contados = [ 
                {tipo : 'Solicitudes',  items: data.Solicitudes, class: ''}, 
                {tipo : 'Generadas',    items: data.Generadas, class: ''}, 
                {tipo : 'Canceladas',   items: data.Canceladas, class: ''}, 
                {tipo : 'Corresponsabilidades', items: data.Corresponsabilidades, class: ''} 
            ];
            switch (status) {
                case 0: contados[0].class = 'text-white bg-info'; break;
                case 1: contados[1].class = 'text-white bg-info'; break;
                case 2: contados[2].class = 'text-white bg-info'; break;
                case 3: contados[3].class = 'text-white bg-info'; break;        
                default: contados[1].class = 'text-white bg-info'; break;
            }
            return contados                      
        }

        const getTotals = data =>{            
            for (const element of data) {                
                vm.totalM2    += element.construction.sup_cons_total;                
                if (element.breakdown[0].validada == false) {                    
                    vm.totalDebt  += element.breakdown[0].cuota;
                }
            }
        }
        
        const getCoresponsiblesData = data =>{
            for (const element of data) {
                console.log(element.breakdown.filter(breakdown => breakdown.debtor_id == vm.uid));
                element.coresponsblesBreakdowns = element.breakdown.filter(breakdown => breakdown.debtor_id == vm.uid);
                for (const item of element.coresponsblesBreakdowns) {
                    if (item.validada == false) {                    
                        vm.totalDebt  += item.cuota;
                    }
                }
            }
        }

        vm.save_lic = item => { $window.sessionStorage.setItem('__id_lic', item.id); };

        vm.saveLic = async license => { vm.license  = license; }

        vm.solicitud = async id => {
            if (vm.touch === false) {
                vm.touch = true;
                const id_lic = $window.sessionStorage.getItem('__id_lic');
                const response = await appService.axios('get',`PdfV2/license/${id_lic}`);
                console.log(response);
                if (response != false) {
                    window.open(`pdfs/public_pdfs/FIO.php`, '_blank');
                    vm.touch = false;
                } else {
                    vm.touch = false;
                    console.log('algo salio mal');
                }
                vm.touch = false;
            } else toastr.warning('proceso en ejecucíon, espera un momento');
        }

        vm.send = async flag => {
            if (vm.touch === false) {
                vm.touch = true;
                vm.license.estatus = flag;
                
                const id_lic = $window.sessionStorage.getItem('__id_lic');
                const response = await appService.axios('patch',`licencias/${id_lic}`, vm.license);
                
                console.log(response);
                if (angular.equals(response.status, 200) && flag ==  1) {
                    toastr.success('Folio Generado Correctamente');
                    $window.location = "#!tramites/Generadas";
                }
                else if (angular.equals(response.status, 200) && flag ==  2) {
                    toastr.success('Folio Cancelado');
                    $window.location = "#!tramites/Canceladas";
                }
                vm.touch = false;
            } else toastr.warning('Proceso en ejecución, espera un momento por favor');                    
        }

        // vm.history = async () => {
        //     const id_lic = $window.sessionStorage.getItem('__id_lic');
        //     const response = await appService.axios('get',`Activities/activities_lic/${id_lic}/`);
        //     // console.log(response);

        //     if (!angular.isUndefined(response.data.status)) {
        //         vm.act_hist = response.data.data;
        //         console.log(vm.act_hist);
        //         $scope.$digest();          
        //     }else{
        //         // log
        //     }
        // }

        // vm.statics = async () => {
        //     if (vm.touch === false) {
        //         vm.touch = true;
        //         const response = await appService.req_rep('get',`Backups/statistics`);

        //         console.log(response.data);
        //         if (response !== false) {
        //             const url = window.URL.createObjectURL(new Blob([response.data]));
        //             const link = document.createElement('a');
        //             link.href = url;
        //             link.setAttribute('download', `statics.xlsx`);
        //             document.body.appendChild(link);
        //             link.click();
        //             vm.init();                 
        //         }
        //         vm.touch = false;                   
        //     } else toastr.warning('proceso en ejecucíon, espera un momento');
        // }

        vm.download= async id =>{
            let duties = await appService.axios('get',`licencias/${id}/pdf`,{},0,1);
            console.log(duties);
			let fileURL = window.URL.createObjectURL(duties.data);
			$window.open(fileURL, '_blank');
            vm.touch = false;
        }

        vm.cambiar_tipo = data =>{
            $window.sessionStorage.setItem('__tipo_lic', data);
            vm.init();
        }

        vm.confirmation = async license =>{
            let response = await appService.axios('patch',`licencias/${license.id}/confirmation`,{},0,1);
            if (response.status == 200) {
                toastr.success('Confirmación de corresponsabilidad exitosa');
                vm.init();
            }
        }
        */
    }

    angular
        .module('app')
        .controller('licensesController', licensesController)

})();