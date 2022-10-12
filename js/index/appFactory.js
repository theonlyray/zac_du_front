(function () {
    'use strict';

    function IndexFactory($window) {
        loadProgressBar()
        const service = {};

        service.redirect = (utype, uid = null, depid = null, colid = null) => {
            
            $window.sessionStorage.setItem('__utype', utype);
            $window.sessionStorage.setItem('__uid', uid);
            $window.sessionStorage.setItem('__depid', depid);
            $window.sessionStorage.setItem('__colid', colid);
            $window.location = 'user.html';

            if (utype == 1) $window.location = 'sadmin.html';
            if (utype >= 9 && utype <= 10)  $window.location = 'solicitante.html';
            if (utype >= 6 && utype <= 8)   $window.location = 'colegio.html';
        }

        service.dispositivo = () => {
            let OSName = "Unknown OS";
            if (navigator.userAgent.indexOf("Win") != -1) OSName = "Windows";
            else if (navigator.userAgent.indexOf("Mac") != -1) OSName = "MacOS";
            else if (navigator.userAgent.indexOf("X11") != -1) OSName = "UNIX";
            else if (navigator.userAgent.indexOf("Linux") != -1) OSName = "Linux";
            let nav = "Unknown nav";
            if (navigator.userAgent.indexOf("Edg") != -1) nav = "Edge";
            else if (navigator.userAgent.indexOf("Chrome") != -1) nav = "Chrome";
            else if (navigator.userAgent.indexOf("Firefox") != -1) nav = "Firefox";
            return `${OSName} ${nav}`;
        }

        return service;
    }

    angular
        .module('app')
        .factory('indexFactory', IndexFactory)
})();