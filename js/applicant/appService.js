(function () {
    'use strict';

    function AppService($cookies) {        
        loadProgressBar();

        const vm = this;
        const url = 'http://127.0.0.1:8000/';

        vm.axios = async ($method, path, form = null, $treponse = 0) =>{
            let payload;           
            let options = settingOptions($treponse);
            options.method = $method;
            options.url    = `${url}${path}`;
            options.data   = form;
            options.onUploadProgress = progressEvent =>{ 
                // const {loaded, total} = progressEvent;
                // let percent = Math.floor((loaded * 100) / total);
                // toastr.info( `${loaded}kb of ${total}kb | ${percent}%` );
            }
            // console.log(progressEvent.loaded)

            try {
                payload = await axios(options).then(x => { return x });
            } catch (error) { 
                toastr.error(error);
                payload = false;
            }
            return payload;
        };

        const settingOptions = typeResponse =>{
            const header = {
                "Content-type": "application/json",
                'Accept': 'application/json',
                "Authorization" : `Bearer ${$cookies.get('__token')}` 
            };

            let options = {
                headers: header,
                validateStatus: function (status) {
                    return status >= 200 && status <= 4022; // Resolve only if the status code is less than 500
                }               
            };

            switch (typeResponse) {
                case 0: options.responseType = 'json'; break;
                case 1: options.responseType = 'blob'; break;            
                default: options.responseType = 'json'; break;
            }
            return options;
        };

        /*Instacian rep*/
        const instance_rp = axios.create({
            baseURL: 'https://consultas.licenciaszac.org/back-end/index.php/',
            headers: {
                'Content-Disposition': "attachment; filename=template.xlsx",
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Cache-Control': 'max-age=0'
            },
            responseType: 'arraybuffer'
        });

        vm.req_rep = async(method, path, data) =>{
            instance_rp.defaults.headers.common['Authorization'] = $cookies.get('__token');
            return instance_rp[method.toLowerCase()](path, data)
            .then(res => res)
            .catch((err) => {
                 console.log(err);
                 return Promise.reject(err);
            });
        }
        ///
        
        vm.fecha_hora = (fdate) => {
            let date = fdate !== undefined ? fdate : new Date();
            let dateStr = date.getFullYear() + "-" +
                ("00" + (date.getMonth() + 1)).slice(-2) + "-" +
                ("00" + date.getDate()).slice(-2) + " " +
                ("00" + date.getHours()).slice(-2) + ":" +
                ("00" + date.getMinutes()).slice(-2) + ":" +
                ("00" + date.getSeconds()).slice(-2)
            return dateStr;
        };

        vm.get_license_yype = (license) => {

        };

        /**
         *  check if license is a construction
         * @param Int  $license
         * @return boolean
         */
        vm.is_construction = (license_type_id) => {
            //? numbers in db, id license type
            return license_type_id >= 1 && license_type_id <= 6 ||
            (license_type_id >= 8 && license_type_id <= 11) ||
            (license_type_id == 15) ||
            (license_type_id >= 25 && license_type_id <= 28);
        };

        /**
         * check if license is an ad
         * * @param License  $license
         * @return boolean
         */
        vm.is_ad = (license_type_id) => {
            return license_type_id >= 17 && license_type_id <= 20;
        };

        vm.checkLicenseType = license_type_id => {
            if (license_type_id >= 1 && license_type_id <= 6 ||
            (license_type_id >= 8 && license_type_id <= 11) ||
            (license_type_id == 15) ||
            (license_type_id >= 25 && license_type_id <= 28)) {
                return 'construction';
            }else if(license_type_id == 7){
                return 'oficial_number';
            }else if(license_type_id == 12){
                return 'urban_services';
            }else if (license_type_id == 13) {
                return 'self-build';
            }else if (license_type_id == 14) {
                return 'safety';
            }else if (license_type_id == 16) {
                return 'compatibility';
            }else if(license_type_id >= 17 && license_type_id <= 19) {
                return 'ad';
            }else if (license_type_id == 20) {
                return 'vehicle_ad';
            }else if (license_type_id == 21) {
                return 'safety_antennas';
            }else if (license_type_id == 22) {
                return 'sfd';
            }else if (license_type_id == 23) {
                return 'completion';
            }else if (license_type_id == 24) {
                return 'break_pavement';
            }
        };


    }

    angular
        .module('app')
        .service('appService', AppService);
})();