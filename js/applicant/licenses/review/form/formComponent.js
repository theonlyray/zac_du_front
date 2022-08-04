(function () {
  'use strict';

  const formReviewComponent = {
    templateUrl: 'js/applicant/licenses/review/form/form.html',
    bindings: {
      license: '<',
      folios: '<',
    },
    controller: function ($scope, appService, appFactory, $window,) {
      const vm = this;
      vm.myform = false;
      vm.my_tramite = [];
      vm.touch = false;
      vm.tables = [];      

      vm.$onChanges = (changes) => {
        vm.myform = false;
        vm.licenseData = {};
        vm.backgrounds = [];
        
        if (changes.license.currentValue != undefined) {
            const payload = changes.license.currentValue;
            vm.foliosList = changes.folios.currentValue;
            // console.log(vm.foliosList);
            vm.myform = true;
            vm.license = payload;
            vm.form = appFactory.formGroups(payload.license_type_id);

            //?setting coor to map
            sessionStorage.setItem('__lat', vm.license.property.latitud);
            sessionStorage.setItem('__lng', vm.license.property.longitud);
            
            if (payload.license_type_id <= 2) {
              vm.license.backgrounds = castBackgroundDates(vm.license.backgrounds);
            }else if (payload.license_type_id >= 17 && payload.license_type_id <= 20){
              vm.license.ad = castAdDates(vm.license.ad);
            }

          }          
      };

      

      const castBackgroundDates = object => {
        for (const iterator of object){
          if(iterator.fecha != null) iterator.fecha = new Date(iterator.fecha);
          if(iterator.prior_license_id != null){
            let element = vm.foliosList.find(x => x.id == iterator.prior_license_id);
            iterator.prior_license_id = element.folio;
          }
        }
        return object;
      };
      
      const castAdDates = object => {
        object.colocacion = (object.colocacion == true ? 'Colocación' : 'Renovación');
        object.tipo_descripcion = object.tipo;
        object.fecha_fin = new Date(object.fecha_fin);
        object.fecha_inicio = new Date(object.fecha_inicio);
        return object;
      };
      

      //?background methods
      vm.addBackgrounds = () => { vm.license.backgrounds.push({}); };

      vm.deleteBackgrounds = async (background) => { 
        const licId = $window.sessionStorage.getItem('__licId');

        const response = await appService.axios('delete',`licencias/${licId}/antecendente/${background.id}`);

        if (response.status === 200) {
          toastr.success('Informacion actualizada con éxito');
          vm.license = response.data;
          vm.license.backgrounds = castBackgroundDates(vm.license.backgrounds);
        } else toastr.warning(response.data.message);
        vm.touch = false;
        $scope.$digest();
      };

      const statusMutator = status =>{
        switch (status) {
          case 'Ingresado': return 0;
          case 'Docs. Cargados': return 1;
          case 'Docs. con Observaciones': return 2;
          case 'Docs. Corregidos': return 3;
          case 'Ingreso Validado': return 4;
          case 'Validado Primer Revision': return 5;
          case 'Observaciones Primer Revision': return 6;
          case 'Validado Segunda Revision': return 7;
          case 'Observaciones Segunda Revision': return 8;
          case 'Validado Tercera Revision': return 9;
          case 'Observaciones Tercera Revision': return 10;
          case 'Por Pagar': return 11;
          case 'Pagado': return 12;
          case 'Proceso de Firmas': return 13;
          case 'Autorizado': return 14;
          case 'Cancelado': return 15;
          case 'Rechazado': return 16;
          default: return 0;
        }
      };

      vm.sendReview = async () => {
        if (vm.touch === false) {
          vm.touch = true;

          vm.license.property.latitud = sessionStorage.getItem("__lat");
          vm.license.property.longitud = sessionStorage.getItem("__lng");
          const licId = $window.sessionStorage.getItem('__licId');

          vm.license.estatus = statusMutator(vm.license.estatus);

          if (vm.license.license_type_id <= 2) {
            let backgroundsVerified = checkBackgrounds();
            if (!backgroundsVerified) return;
          }else if(vm.license.license_type_id >= 17 && vm.license.license_type_id <= 20){
            let adsVerified = checkAd();
          }

          const response = await appService.axios('patch',`licencias/${licId}`, vm.license);
          if (response.status === 200) {
            toastr.success('Informacion actualizada con éxito');
            vm.license = response.data;
            vm.license.backgrounds = castBackgroundDates(vm.license.backgrounds);
            vm.license.ad = castAdDates(vm.license.ad);
            $scope.$digest();
          }else if (response.status == 422){ 
            toastr.warning(response.data.message);
            restoreFoliosBackgrounds();
          }
          else{ toastr.warning(response.data.message); restoreFoliosBackgrounds();}
          
          vm.touch = false;
        } else vm.touch = false;
      };
      
      const checkBackgrounds = () => {
        if (angular.isUndefined(vm.license.backgrounds)) vm.license.backgrounds = [ null ];             
        else{
            for (const key in vm.license.backgrounds) {
                if(!angular.isUndefined(vm.license.backgrounds[key].prior_license_id) && 
                  !angular.equals(vm.license.backgrounds[key].prior_license, null)){
                  console.log(vm.license.backgrounds[key].prior_license_id);
                    let element = vm.foliosList.find(x => x.folio == vm.license.backgrounds[key].prior_license_id);
                    console.log(element);
                    if (angular.isUndefined(element)) {
                        toastr.error('El folio de la licencia de antecente no existe, seleccione un valor correcto');
                        return false;
                    }
                    else vm.license.backgrounds[key].prior_license_id = element.id;
                }
            }
        }
        return true;
      };

      const restoreFoliosBackgrounds = () => {
        for (const key in vm.license.backgrounds) {
            if(!angular.isUndefined(vm.license.backgrounds[key].prior_license_id) && 
              !angular.equals(vm.license.backgrounds[key].prior_license, null)){
                let element = vm.foliosList.find(x => x.id == vm.license.backgrounds[key].prior_license_id);
                if (angular.isUndefined(element)) {
                    toastr.error('El folio de la licencia de antecente no existe, seleccione un valor correcto');
                    return false;
                }
                else vm.license.backgrounds[key].prior_license_id = element.folio;
            }
        }
      };

      const checkAd = () => {
        console.log(vm.license.ad.colocacion);    
        if (vm.license.ad.colocacion == 'Colocación') vm.license.ad.colocacion = true;
        else if (vm.license.ad.colocacion == 'Renovación') vm.license.ad.colocacion = false;
        else vm.license.ad.colocacion = (vm.license.ad.colocacion == 'true');
         
        // vm.license.ad.colocacion = (vm.license.ad.colocacion == 'Colocaión' ? true : false);

        if (vm.license.ad.tipo == 'Otro') vm.license.ad.tipo = vm.license.ad.tipo_descripcion;        
      };

      // todo test pending
      vm.updateMap = async () => {
        if (vm.touch === false) {
        let mapa = await appFactory.getMapBASE64();
        const licId = $window.sessionStorage.getItem('__licId');

        const response = await appService.axios('patch',`licencias/${licId}/mapa`, {mapa : mapa});
          if (response !== false) {
            toastr.success('Mapa actualizado con éxito');
            vm.touch = false;
            $window.location.reload();
          } else vm.touch = false;
          $scope.$digest();
        } else vm.touch = false;
      }
    },
    resolve: {
      loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load('extras-solicitud');
      }]
    }
  }

  angular
    .module('app')
    .component('formReviewComponent', formReviewComponent)
})();

var marker;
function initMap() {
  var myLatlng = new google.maps.LatLng(sessionStorage.getItem("__lat"), sessionStorage.getItem("__lng"));
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
    // document.getElementById('current').innerHTML = '<p>Marker dropped: Current Lat: ' + evt.latLng.lat().toFixed(3) + ' Current Lng: ' + evt.latLng.lng().toFixed(3) + '</p>';
  });

  google.maps.event.addListener(marker, 'dragstart', function (evt) {
    // document.getElementById('current').innerHTML = '<p>Currently dragging marker...</p>';
  });

  marker.addListener('click', toggleBounce);
  marker.setMap(map);

}

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}