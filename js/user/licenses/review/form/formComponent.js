(function () {
  'use strict';

  const formReviewComponent = {
    templateUrl: 'js/user/licenses/review/form/form.html',
    bindings: {
      license: '<',
    },
    controller: function ($scope, usrService, usrFactory, $window) {
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
            vm.myform = true;
            vm.license = payload;
            vm.form = usrFactory.formGroups(payload.license_type_id);
            vm.license.backgrounds = castBackgroundDates(vm.license.backgrounds);
            vm.license.validity = castValidityDates(vm.license.validity);
        }
      };

      const castBackgroundDates = object => {
        for (const iterator of object)
          iterator.fecha = new Date(iterator.fecha);
        return object;
      };
      
      const castValidityDates = object => {
        if(object != null){
          object.fecha_autorizacion = new Date(object.fecha_autorizacion);
          object.fecha_fin_vigencia = new Date(object.fecha_fin_vigencia);
        }
        return object;
      };
      

      //?background methods
      vm.addBackgrounds = () => { vm.license.backgrounds.push({}); };

      vm.deleteBackgrounds = async (background) => { 
        const licId = $window.sessionStorage.getItem('__licId');

        const response = await usrService.axios('delete',`licencias/${licId}/antecendente/${background.id}`);

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
          case 'Ficha de Pago Generada': return 11;
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

          // vm.license.estatus = statusMutator(vm.license.estatus);

          const response = await usrService.axios('patch',`licencias/${licId}`, vm.license);
          if (response.status === 200) {
            toastr.success('Informacion actualizada con éxito');
            vm.license = response.data;
            vm.license.backgrounds = castBackgroundDates(vm.license.backgrounds);
          } else toastr.warning(response.data.message);
          vm.touch = false;
          $scope.$digest();
        } else vm.touch = false;
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
      }
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