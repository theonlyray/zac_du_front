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

      vm.sfdOptions = [
        'Subdivición',
        'Fución',
        'Desmebración',
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
            
            if (vm.license.license_type_id <= 2 ||
              (vm.license.license_type_id >= 8 && vm.license.license_type_id <= 11) ||
              (vm.license.license_type_id == 13) || (vm.license.license_type_id == 15) ||
              (vm.license.license_type_id >= 25 && vm.license.license_type_id <= 28)
            ) {
              vm.license.backgrounds = castBackgroundDates(vm.license.backgrounds);
            }else if (payload.license_type_id >= 17 && payload.license_type_id <= 20){
              vm.license.ad = castAdDates(vm.license.ad);
            }else if(vm.license.license_type_id == 14){
              restoreSafetyDestinity();
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
        // object.colocacion = (object.colocacion == true ? 'Colocación' : 'Renovación');
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

          vm.license.property.latitud = sessionStorage.getItem("__lat");
          vm.license.property.longitud = sessionStorage.getItem("__lng");
          const licId = $window.sessionStorage.getItem('__licId');

          vm.license.estatus = statusMutator(vm.license.estatus);

          if (vm.license.license_type_id <= 2 ||
            (vm.license.license_type_id >= 8 && vm.license.license_type_id <= 11) ||
            (vm.license.license_type_id == 13) || (vm.license.license_type_id == 15) ||
            (vm.license.license_type_id >= 25 && vm.license.license_type_id <= 28)
          ) {
            let backgroundsVerified = checkBackgrounds();
            if (!backgroundsVerified) return;
          }else if(vm.license.license_type_id >= 17 && vm.license.license_type_id <= 20){
            let adsVerified = checkAd();
          }else if (vm.license.license_type_id == 14) { //safety certificate
            let safetyVerified = checkSafetyDestinity();
            if (!safetyVerified) return;
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
            vm.license.backgrounds[0] == null ? restoreFoliosBackgrounds() : null;
          }
          else{ toastr.warning(response.data.message); restoreFoliosBackgrounds();}
          vm.license.license_type_id == 14 ? restoreSafetyDestinity() : null;
          
          vm.touch = false;
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
        // console.log(vm.license.ad.colocacion);    
        // if (vm.license.ad.colocacion == 'Colocación') vm.license.ad.colocacion = true;
        // else if (vm.license.ad.colocacion == 'Renovación') vm.license.ad.colocacion = false;
        // else vm.license.ad.colocacion = (vm.license.ad.colocacion == 'true');
         
        // vm.license.ad.colocacion = (vm.license.ad.colocacion == 'Colocaión' ? true : false);

        if (vm.license.ad.tipo == 'Otro') vm.license.ad.tipo = vm.license.ad.tipo_descripcion;        
      };

      // todo test pending
      vm.updateMap = async () => {
        if (vm.touch === false) {
        let mapa = await appFactory.getMapBASE64();
        const licId = $window.sessionStorage.getItem('__licId');

        const response = await appService.axios('patch',`licencias/${licId}/mapa`, {mapa : mapa});
          if (response.status == 200) {
            toastr.success('Mapa actualizado con éxito');
            vm.touch = false;
            // $window.location.reload();
          } else if (response.status == 422){ 
            toastr.warning(response.data.message);
            restoreFoliosBackgrounds();
          }
          else toastr.error(`Error en la solicitud,  ${response.data.message}`);
          $scope.$digest();
          vm.touch = false;
        } else vm.touch = false;
        
      };
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
  if (document.getElementById('map') !== null) {
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
}

function toggleBounce() {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}