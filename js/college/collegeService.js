(function () {
    'use strict';

    function colService($cookies) {
        loadProgressBar();

        const vm = this;
        const url = 'http://127.0.0.1:8000/';
        vm.permissionsArray = [];

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

                if (payload.status > 204) {
                    toastr.error(payload.data.message);
                }
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

        vm.setPermissions = usrPermissionsArray =>{
            vm.permissionsArray = usrPermissionsArray;
        };

    }

    angular
        .module('college')
        .service('colService', colService)
})();