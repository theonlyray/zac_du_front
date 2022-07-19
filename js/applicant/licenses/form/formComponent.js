(function () {
    'use strict';
    
    const formComponent = {        
        templateUrl: 'js/applicant/licenses/form/form.html',
        bindings: {
            request: '<',
        },
        controller: function (appService, $window, appFactory) {
            const vm = this;
            vm.touch = false;
            
            vm.$onChanges = (changes) => {
                vm.myform = false;
                vm.requestData = {};
                vm.backgrounds = [];

                if (changes.request.currentValue != undefined) {
                    const payload = changes.request.currentValue;
                    vm.myform = true;
                    vm.typeId = payload.id;
                    vm.form = appFactory.formGroups(payload.id);
                    // // console.log(vm.form);
                }
            };

            //?background methods
            vm.addBackgrounds = () => { vm.backgrounds.push({}); };
            vm.deleteBackgrounds = (index) => { vm.backgrounds.splice(index, 1); };
            
            vm.sendRequest = async() => {
                if (vm.touch === false) {
                    vm.touch = true;
                    
                    vm.requestData.license_type_id = vm.typeId;
                    if (vm.requestData.property) {
                        vm.requestData.property.latitud  = $window.sessionStorage.getItem('__lat');
                        vm.requestData.property.longitud = $window.sessionStorage.getItem('__lng');                        
                        vm.requestData.property.mapa = await appFactory.getMapBASE64();
                    }

                    if (angular.isUndefined(vm.requestData.backgrounds)) vm.requestData.backgrounds = [ null ];             

                    const response  = await appService.axios('post', 'licencias', vm.requestData);

                    if (response.status == 200){ 
                        toastr.success('Trámite generado con exito, cargue los documentos para continuar.');
                        $window.sessionStorage.setItem('__licId', response.data.id);
                        $window.location = "#!license_reqs";
                    }else if (response.status == 422) toastr.warning(response.data.message);
                    else toastr.error('Error en la solicitud, consulta con soporte. '. response.data.message);

                    vm.touch = false;
                }else {
                    toastrr.warning('El proceso a comenzado, espera un momento')
                }
            };
        //     vm.new_tramite = async () => {
        //         if (vm.touch === false) {
        //             vm.touch = true;
        //             try {
        //                 // console.log(vm.my_tramite);
        //                 let send = true;
        //                 let is_can = ($window.sessionStorage.getItem('__is_can') == 'true');
        //                 if (vm.my_tramite[0] === undefined) {
        //                     // vm.my_tramite[0] = {};
        //                     toastrr.warning('Debe seleccionar un trámite');
        //                     send = false;
        //                     vm.touch = false;
        //                 }else{
        //                     if (!angular.isUndefined(vm.my_tramite[0].para)){
        //                         if (vm.my_tramite[0].para == 'Canalización' && !is_can){
        //                             toastrr.warning('Sólo los peritos acreditados en Canalizaciones por el Mpio. pueden generar este tipo de tramites.');
        //                             send = false;
        //                             vm.touch = false;
        //                         }
        //                     }
        //                 }
                                                                    
        //                 if (vm.form.length > 2 && vm.form[2].id_grupo == 2 && vm.form[2].tipo == 1) {
        //                     const mapa = await myService.convertir_mapa()
        //                     const fecha = myService.fecha_hora()
        //                     vm.my_tramite[2].mapa = mapa;
        //                     vm.my_tramite[2].mapa_nombre = `mapa_${fecha}.png`;
        //                     console.log(vm.my_tramite);
        //                 }
        //                 const body = {
        //                     tipo_tramite: vm.tipo_tramite, solicitud: vm.my_tramite,
        //                     lat: $window.sessionStorage.getItem('__lat'), long: $window.sessionStorage.getItem('__lng')
        //                 };
        //                 // console.log(body);
        //                 if (send) {
        //                     const response = await myService.peticiones('post','Formalities/preload', body);
        //                     // console.log(response.data);
        //                     if (response.data.status == true) {
        //                         $window.sessionStorage.setItem('__id_lic', response.data.id);
        //                         $window.sessionStorage.setItem('__tipo', response.data.tipo_licencia);
        //                         $window.sessionStorage.setItem('__type', 'solicitud');

        //                         const res_docs = await myService.peticiones('post','Documents/formalitie', response.data);
        //                         // console.log(res_docs);
        //                         if (res_docs.data.status == true) toastrr.success('Datos guardados con éxito');
        //                         else toastrr.warning('Problemas para guardar, contacte con soporte');                            

        //                         if (response.data.tipo_licencia == 'id_5eb6e201276057.09165433') $window.location = "#!aranceles";
        //                         else $window.location = "#!tramite_documentos";

        //                     }else toastrr.warning('Problemas para guardar, contacte con soporte');
        //                     vm.touch = false;
        //                 }                        
        //             } catch (error) {
        //                 vm.touch = false;
        //                 console.log(error);
        //                 toastrr.error(error)
        //             }
        //         } else {
        //             toastrr.warning('El proceso a comenzado, espera un momento')
        //         }
        //     }
        },
        // resolve: {
        //     loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
        //         return $ocLazyLoad.load('extras-solicitud');
        //     }]
        // }
    };

    angular
        .module('app')
        .component('formComponent', formComponent)
})();

var marker;
function initMap() {    
    let lat = 22.774286330471714;
    let lng = -102.58732274627991;
    var myLatlng = new google.maps.LatLng(lat, lng);
    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 15,
        center: myLatlng,
        mapTypeId: "satellite",
    });
    var infoWindow = new google.maps.InfoWindow({ map: map });
    // Try HTML5 geolocation.
    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        draggable: true,
        animation: google.maps.Animation.DROP,
        title: 'Ubicación del predio'
    });

    google.maps.event.addListener(marker, 'dragend', function (evt) {
        sessionStorage.setItem('__lat', evt.latLng.lat());
        sessionStorage.setItem('__lng', evt.latLng.lng());
    });

    google.maps.event.addListener(marker, 'dragstart', function (evt) {});

    marker.addListener('click', toggleBounce);
    marker.setMap(map);
};

function toggleBounce() {
    if (marker.getAnimation() !== null) marker.setAnimation(null);
    else marker.setAnimation(google.maps.Animation.BOUNCE);
};