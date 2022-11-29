(function () {
  'use strict';

  const formReviewComponent = {
    templateUrl: 'js/user/licenses/review/form/form.html',
    bindings: {
      license: '<',
      folios: '<',
    },
    controller: function ($scope, usrService, usrFactory, $window) {
      const vm = this;
      vm.myform = false;
      vm.my_tramite = [];
      vm.touch = false;
      vm.tables = [];
      
      /**Data to datalist and selects request from factory */
      vm.polygonTypeOptions = usrFactory.polygonTypeOptions;
      vm.sfdOptions = usrFactory.sfdOptions;
      vm.detinationsList = usrFactory.detinationsList;
      /****/
      const sleep = ms => {
        return new Promise(resolve => setTimeout(resolve, ms));
    };

      vm.$onChanges = async (changes) => {
        vm.myform = false;
        vm.licenseData = {};
        vm.backgrounds = [];
        
        if (changes.license.currentValue != undefined) {
            const payload = changes.license.currentValue;
            vm.foliosList = changes.folios.currentValue;
            
            vm.myform = true;
            vm.license = payload;

            if (payload.license_type_id == 6 || payload.license_type_id == 23) {//?extension termination upodate with db id
              let typeId = vm.license.backgrounds[0].prior_license.license_type_id;
              vm.form = usrFactory.formGroups(typeId);            
            }else{
              vm.form = usrFactory.formGroups(payload.license_type_id);
            }              

            //? numbers in db, id license type
            if (payload.license_type_id <= 6 || 
               ( payload.license_type_id >= 8 && payload.license_type_id <= 11 ) || 
               ( payload.license_type_id == 13) || ( payload.license_type_id == 15) || ( payload.license_type_id == 23) ||
               ( payload.license_type_id >= 25 && payload.license_type_id <= 28 )
            ){
              vm.license.backgrounds = castBackgroundDates(vm.license.backgrounds);
            }else if (payload.id == 22) {                        
              // vm.requestData.s_f_d.descripcion : vm.sfdOptions[0] };
            }else if (payload.license_type_id >= 17 && payload.license_type_id <= 20){
              vm.license.ad = castAdDates(vm.license.ad);
            }else if(vm.license.license_type_id == 14){
              restoreSafetyDestinity();
            }else if(vm.license.license_type_id == 16){
              getLandUses();              
            }

            vm.license.validity = castValidityDates(vm.license.validity);
        }
      };

      const castBackgroundDates = object => {
        for (const iterator of object){
          if(iterator.fecha != null) iterator.fecha = new Date(iterator.fecha);
          if(iterator.prior_license_id != null){
            let element = vm.foliosList.find(x => x.id == iterator.prior_license_id);
            console.log(element);
            iterator.prior_license_id = element.folio;
          }
        }
        return object;
      };
      
      const castValidityDates = object => {
        if(object != null){
          object.fecha_autorizacion = new Date(object.fecha_autorizacion);
          object.fecha_fin_vigencia = new Date(object.fecha_fin_vigencia);
        }
        return object;
      };

      const castAdDates = object => {
        // object.colocacion = (object.colocacion == true ? 'Colocación' : 'Renovación');
        object.tipo_descripcion = object.tipo;
        object.fecha_fin = new Date(object.fecha_fin);
        object.fecha_inicio = new Date(object.fecha_inicio);
        return object;
      };
      

      //?background methods
      vm.addBackgrounds = () => { vm.license.backgrounds.push({}); };

      vm.deleteBackgrounds = async (background) => {
        if (angular.isDefined(background.id)) {
          
          const licId = $window.sessionStorage.getItem('__licId');
          
          const response = await usrService.axios('delete',`licencias/${licId}/antecendente/${background.id}`);
          
          if (response.status === 200) {
            toastr.success('Informacion actualizada con éxito');
            vm.license = response.data;
            vm.license.backgrounds = castBackgroundDates(vm.license.backgrounds);
          } else toastr.warning(response.data.message);
          vm.touch = false;
          $scope.$digest();
        }else{
          vm.license.backgrounds.splice(vm.license.backgrounds.length - 1, 1);
        }
      };

      const statusMutator = status =>{
        switch (status) {
          case 'Ingresado': return 0;
          case 'Docs. Cargados': return 1;
          case 'Docs. con Observaciones': return 2;
          case 'Docs. Corregidos': return 3;
          case 'Ingreso Validado': return 4;
          case 'Docs y Planos Validados': return 5;
          case 'Por Pagar': return 6;
          case 'Autorizado': return 7;
          case 'Cancelado': return 8;
          case 'Rechazado': return 9;
          default: return 0;
        }
      };

      vm.sendReview = async () => {
        if (vm.touch === false) {
          vm.touch = true;

          if (vm.license.property !== null) {            
            vm.license.property.latitud = sessionStorage.getItem("__lat");
            vm.license.property.longitud = sessionStorage.getItem("__lng");
          }
          const licId = $window.sessionStorage.getItem('__licId');

          vm.license.estatus = statusMutator(vm.license.estatus);
          
          if (vm.license.license_type_id <= 2) {
            let backgroundsVerified = checkBackgrounds();
            if (!backgroundsVerified) return;
          }else if(vm.license.license_type_id >= 17 && vm.license.license_type_id <= 20){
            let adsVerified = checkAd();
          }else if (vm.license.license_type_id == 14) { //safety certificate
            let safetyVerified = checkSafetyDestinity();
            if (!safetyVerified) return;
          }else if (vm.license.license_type_id == 16){
            let landUsescheked = checkLandUses();
            if (!landUsescheked) return;
          }

          const response = await usrService.axios('patch',`licencias/${licId}`, vm.license);
          if (response.status === 200) {
            toastr.success('Informacion actualizada con éxito');
            vm.license = response.data;
            vm.license.backgrounds = castBackgroundDates(vm.license.backgrounds);
            vm.license.ad = castAdDates(vm.license.ad);
            restoreLandUses();
          }else if (response.status == 422){
            toastr.warning(response.data.message);
            restoreFoliosBackgrounds();
          }
          else{ toastr.warning(response.data.message); restoreFoliosBackgrounds();}
          vm.license.license_type_id == 14 ? restoreSafetyDestinity() : null;

          vm.touch = false;
          $scope.$digest();
        } else vm.touch = false;
      };
      
      const checkSafetyDestinity = () => {
        if(vm.license.safety != null && !angular.isUndefined(vm.license.safety.destino)){
            let element = vm.detinationsList.find(x => x.desc == vm.license.safety.destino);
            if (angular.isUndefined(element)) {
                toastr.error('El destino de piso o cubierta no existe, seleccione un valor correcto');
                vm.touch = false;
                return false;
            }
            else vm.license.safety.destino = element.id;
        }
        
        return true;
      };

      const restoreSafetyDestinity = () => {
          if(!angular.isUndefined(vm.license.safety.destino) && 
            !angular.equals(vm.license.safety.destino, null)){
              let element = vm.detinationsList.find(x => x.id == vm.license.safety.destino);
              if (angular.isUndefined(element)) {
                  toastr.error('El destino de piso o cubierta no existe, seleccione un valor correcto');
                  return false;
              }
              else vm.license.safety.destino = element.desc;
              $scope.$digest();
          }
      };

      const checkBackgrounds = () => {
        if (angular.isUndefined(vm.license.backgrounds)) vm.license.backgrounds = [ null ];             
        else{
            for (const key in vm.license.backgrounds) {
                if(!angular.isUndefined(vm.license.backgrounds[key].prior_license_id) && 
                  !angular.equals(vm.license.backgrounds[key].prior_license, null)){
                    let element = vm.foliosList.find(x => x.folio == vm.license.backgrounds[key].prior_license_id);
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
        // if (vm.license.ad.colocacion == 'Colocación') vm.license.ad.colocacion = true;
        // else if (vm.license.ad.colocacion == 'Renovación') vm.license.ad.colocacion = false;
        // else vm.license.ad.colocacion = (vm.license.ad.colocacion == 'true');
         
        // vm.license.ad.colocacion = (vm.license.ad.colocacion == 'Colocaión' ? true : false);

        if (vm.license.ad.tipo == 'Otro') vm.license.ad.tipo = vm.license.ad.tipo_descripcion;        
      };

      // todo test pending
      vm.updateMap = async () => {
        if (vm.touch === false) {
        let mapa = await usrFactory.getMapBASE64();
        const licId = $window.sessionStorage.getItem('__licId');

        const response = await usrService.axios('patch',`licencias/${licId}/mapa`, {mapa : mapa});
          if (response !== false) {
            toastr.success('Mapa actualizado con éxito');
            vm.touch = false;
            $window.location.reload();
          } else vm.touch = false;
          $scope.$digest();
        } else vm.touch = false;
      };
      
      vm.useSelected = landUse => {
        vm.landUse = vm.landUses.find( x => x.nombre == vm.license.compatibility_certificate.land_use_id);

        if (angular.isDefined(vm.landUse)) getLandUsesDescs();
        console.log(landUse);
      };
      /**/
      const getLandUses = async () => {
        let request = await usrService.axios('get', 'usos');
        vm.landUses = request.data;

        restoreLandUses();
      };

      const getLandUsesDescs = async () => {
        let request = await usrService.axios('get', `usos/${vm.license.compatibility_certificate.land_use_id}`);
        vm.landUsesDesc = request.data.descriptions;
        console.log(vm.landUsesDesc);
      };
      /**/
      const checkLandUses = () => {

        if(vm.license.compatibility_certificate != null && !angular.isUndefined(vm.license.compatibility_certificate.land_use_id)){
          let element = vm.landUses.find(x => x.nombre == vm.license.compatibility_certificate.land_use_id);
          if (angular.isUndefined(element)) {
              toastr.error('El uso de suelo no existe, seleccione un valor correcto');
              vm.touch = false;
              return false;
          }
          else vm.license.compatibility_certificate.land_use_id = element.id;
        }
        
        if(vm.license.compatibility_certificate != null && !angular.isUndefined(vm.license.compatibility_certificate.land_use_description_id)){
          let element = vm.landUsesDesc.find(x => x.descripcion == vm.license.compatibility_certificate.land_use_description_id);
          if (angular.isUndefined(element)) {
              toastr.error('La descripción de uso de suelo no existe, seleccione un valor correcto');
              vm.touch = false;
              return false;
          }
          else vm.license.compatibility_certificate.land_use_description_id = element.id;
        }

        return true;
      };

      const restoreLandUses = async () => {
        if(vm.license.compatibility_certificate != null && !angular.isUndefined(vm.license.compatibility_certificate.land_use_id)){
          let element = vm.landUses.find(x => x.id == vm.license.compatibility_certificate.land_use_id);
          if (angular.isUndefined(element)) {
              toastr.error('El uso de suelo no existe, seleccione un valor correcto');
              vm.touch = false;
              return false;
          }
          else{             
            getLandUsesDescs();
            vm.license.compatibility_certificate.land_use_id = element.nombre;
          }
        }

        await sleep(1000);//sleep validation to get response from land use descriptions
        if(vm.license.compatibility_certificate != null && !angular.isUndefined(vm.license.compatibility_certificate.land_use_description_id)){
          let element = vm.landUsesDesc.find(x => x.id == vm.license.compatibility_certificate.land_use_description_id);
          console.log(element);
          if (angular.isUndefined(element)) {
              toastr.error('La descripción de uso de suelo no existe, seleccione un valor correcto');
              vm.touch = false;
              return false;
          }
          else vm.license.compatibility_certificate.land_use_description_id = element.descripcion;
        }
        $scope.$digest();
      };

    },
    resolve: {
      loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
        return $ocLazyLoad.load('extras-solicitud');
      }]
    }
  }

  angular
    .module('user')
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