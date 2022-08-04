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

            vm.sfdOptions = [
                'Subdivición',
                'Fución',
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
                        vm.requestData.sfd = { descripcion : vm.sfdOptions[0] };
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
                vm.requestData.ad.colocacion = (vm.requestData.ad.colocacion == 'true');
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