(function () {
  'use strict';
  toastr.options = {
    "closeButton": true,
    "progressBar": true,
  }
  angular
    .module('app', ['ngCookies', 'ui.bootstrap', 'naif.base64', 'ngRoute', 'kendo.directives', 'oc.lazyLoad']);
})();