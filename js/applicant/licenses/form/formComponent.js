(function () {
    'use strict';
    
    const formComponent = {        
        templateUrl: 'js/applicant/licenses/form/form.html',
        bindings: {
            request: '<',
        },
        controller: function (appService, $window, appFactory, $scope) {
            const vm = this;
            vm.touch = false;
            
            vm.foliosList = [
                {id:0, folio:'No hay licencias generadas'}
            ];
            
            vm.detinationsList = [
                {id:1, desc:'Casa Habitación'},
                {id:2, desc:'Departamentos'},
                {id:3, desc:'Viviendas'},
                {id:4, desc:'Dormitorios'},
                {id:5, desc:'Cuartos de Hotel'},
                {id:6, desc:'Internados de Escuela'},
                {id:7, desc:'Cuarteles'},
                {id:8, desc:'Cárceles'},
                {id:9, desc:'Correccionales'},
                {id:10, desc:'Hospitales y similares'},
                {id:11, desc:'Oficinas'},
                {id:12, desc:'Despachos'},
                {id:13, desc:'Laboratorios'},
                {id:14, desc:'Aulas'},
                {id:15, desc:'Pasillos'},
                {id:16, desc:'Escaleras'},
                {id:17, desc:'Rampas'},
                {id:18, desc:'Vestíbulos'},
                {id:19, desc:'Pasajes de acceso libre al público'},
                {id:20, desc:'Estadios'},
                {id:21, desc:'Lugares de Reunión sin asientos individuales'},
                {id:22, desc:'Bibliotecas'},
                {id:23, desc:'Templos'},
                {id:24, desc:'Cines'},
                {id:25, desc:'Teatros'},
                {id:26, desc:'Gimnasion'},
                {id:27, desc:'Salones de baile'},
                {id:28, desc:'Restaurantes'},
                {id:29, desc:'Salas de juego y similares'},
                {id:30, desc:'Comercios'},
                {id:31, desc:'Fabricas'},
                {id:32, desc:'Bodegas'},
                {id:33, desc:'Azoteas con pendientes mayor a 5%'},
                {id:34, desc:'Azoteas con pendientes no mayor a 5%, otras cubiertas cualquier pendiente'},
                {id:35, desc:'Volados en vía pública, marquesinas, balcones y similares'},
                {id:36, desc:'Garajes y Estacionamientso para vehículos'},
            ];

            vm.sfdOptions = [
                'Subdivición',
                'Fusión',
                'Desmebración',
            ];

            vm.$onChanges = (changes) => {
                vm.myform = false;
                vm.requestData = {};
                vm.backgrounds = [];
                vm.boundaries = [];

                if (changes.request.currentValue != undefined) {
                    const payload = changes.request.currentValue;
                    vm.myform = true;
                    vm.typeId = payload.id;
                    vm.form = appFactory.formGroups(payload.id);
                    console.log(payload.id);

                    if (payload.id == 22) {                        
                        vm.requestData.s_f_d = { descripcion : vm.sfdOptions[0] };
                    }
                    getFolios();
                }
            };

            //?get folio list
            const getFolios = async () =>{
                const response  = await appService.axios('get', 'folios');
                if (response.status == 200) {
                    vm.foliosList = response.data;
                }
                $scope.$digest();
            };

            //?background methods
            vm.addBackgrounds = () => { vm.backgrounds.push({}); };
            vm.deleteBackgrounds = (index) => { 
                vm.backgrounds.splice(index, 1);
                delete vm.requestData.backgrounds[index];
            };
            
            //?boundaries methods
            vm.addBoundaries = () => { vm.boundaries.push({}); };
            vm.deleteBoundaries = (index) => { 
                vm.boundaries.splice(index, 1);
                delete vm.requestData.boundaries[index];
            };
            
            vm.sendRequest = async() => {
                if (vm.touch === false) {
                    vm.touch = true;
                    
                    vm.requestData.license_type_id = vm.typeId;
                    if (vm.requestData.property) {
                        vm.requestData.property.latitud  = $window.sessionStorage.getItem('__lat');
                        vm.requestData.property.longitud = $window.sessionStorage.getItem('__lng');                        
                        vm.requestData.property.mapa = await appFactory.getMapBASE64();
                    }                    

                    //? numbers in db, id license type
                    if (vm.typeId <= 6 ||
                        (vm.typeId >= 8 && vm.typeId <= 11) ||
                        (vm.typeId == 13) || (vm.typeId == 15) ||
                        (vm.typeId >= 25 && vm.typeId <= 28)
                    ) {
                        let backgroundsVerified = checkBackgrounds();
                        if (!backgroundsVerified) return;
                    }else if(vm.typeId >= 17 && vm.typeId <= 20){
                        let adsVerified = checkAd();
                    }else if (vm.typeId == 14) { //safety certificate
                        let safetyVerified = checkSafetyDestinity();
                        if (!safetyVerified) return;
                    }
                    console.log(vm.requestData);
                    const response  = await appService.axios('post', 'licencias', vm.requestData);
                    vm.touch = false;

                    if (response.status == 200){ 
                        toastr.success('Trámite generado con exito, cargue los documentos para continuar.');
                        $window.sessionStorage.setItem('__licId', response.data.id);
                        $window.location = "#!license_reqs";
                    }else if (response.status == 422){ 
                        toastr.warning(response.data.message);
                        restoreFoliosBackgrounds();
                    }
                    else toastr.error(`Error en la solicitud,  ${response.data.message}`); 
                    
                    vm.touch = false;
                }else {
                    toastr.warning('El proceso a comenzado, espera un momento')
                }
            };

            const checkSafetyDestinity = () => {
                if(vm.requestData.safety != null && !angular.isUndefined(vm.requestData.safety.destino)){
                    let element = vm.detinationsList.find(x => x.desc == vm.requestData.safety.destino);
                    if (angular.isUndefined(element)) {
                        toastr.error('El destino de piso o cubierta no existe, seleccione un valor correcto');
                        vm.touch = false;
                        return false;
                    }
                    else vm.requestData.safety.destino = element.id;
                }
                
                return true;
            };

            const checkBackgrounds = () => {
                if (angular.isUndefined(vm.requestData.backgrounds) || angular.equals(vm.requestData.backgrounds, {})) vm.requestData.backgrounds = [ null ];             
                else{
                    for (const key in vm.requestData.backgrounds) {
                        if(vm.requestData.backgrounds[key] != null && !angular.isUndefined(vm.requestData.backgrounds[key].prior_license_id)){
                            let element = vm.foliosList.find(x => x.folio == vm.requestData.backgrounds[key].prior_license_id);
                            if (angular.isUndefined(element)) {
                                toastr.error('El folio de la licencia de antecente no existe, seleccione un valor correcto');
                                vm.touch = false;
                                return false;
                            }
                            else vm.requestData.backgrounds[key].prior_license_id = element.id;
                        }
                    }
                }
                return true;
            };

            const restoreFoliosBackgrounds = () => {
                if (angular.isUndefined(vm.requestData.backgrounds) || angular.equals(vm.requestData.backgrounds, {})) vm.requestData.backgrounds = [ null ];
                else{
                    for (const key in vm.requestData.backgrounds) {
                        if(vm.requestData.backgrounds[key] != null && !angular.isUndefined(vm.requestData.backgrounds[key].prior_license_id)){
                            let element = vm.foliosList.find(x => x.id == vm.requestData.backgrounds[key].prior_license_id);
                            if (angular.isUndefined(element)) {
                                toastr.error('El folio de la licencia de antecente no existe, seleccione un valor correcto');
                                return false;
                            }
                            else vm.requestData.backgrounds[key].prior_license_id = element.folio;
                        }
                    }
                }
            };

            const checkAd = () => {
                // vm.requestData.ad.colocacion = (vm.requestData.ad.colocacion == 'true');
                if (vm.requestData.ad.tipo == 'Otro') vm.requestData.ad.tipo = vm.requestData.ad.tipo_descripcion;

            };
        },
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