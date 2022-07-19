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


    }

    angular
        .module('app')
        .service('appService', AppService)
})();