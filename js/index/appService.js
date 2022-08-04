(function () {
    'use strict';

    function IndexService($cookies) {
        const vm = this;
        // const url = 'http://api.ciczac.org/';
        const url = 'http://127.0.0.1:8000/';

        vm.axios = async ($method, path, form = null, $header = null) =>{
            let header = settingHeaders($header);
            let payload;

            let options = {
                method: $method,
                headers: header,
                data: form,
                url: `${url}${path}`,
                validateStatus: function (status) {
                    return status >= 200 && status <= 4022; // Resolve only if the status code is less than 500
                }               
            };

            try {
                payload = await axios(options).then(x => { return x });
                if (payload.status !== 200) {
                    toastr.error(payload.data.message);
                }
            } catch (error) {              
                toastr.error(error);
                payload = false;
            }
            return payload;
        };

        const settingHeaders = headerFlag =>{
            let header;
            switch (headerFlag) {
                case null:
                    header = {
                        "Content-type": "application/json",
                        'Accept': 'application/json'
                    };
                    break;
                case 1:
                    header = {
                        "Content-type": "application/json",
                        'Accept': 'application/json',
                        "Authorization": $cookies.get('__token')
                    };
                    break;
            
                default:
                    header = {
                        "Content-type": "application/json",
                        'Accept': 'application/json'
                    };
                    break;
            }

            return header;
        };   
    }

    angular
        .module('app')
        .service('indexService', IndexService)
})();