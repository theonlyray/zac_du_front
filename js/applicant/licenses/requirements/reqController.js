(function () {
    'use strict';
  
    function reqController($scope, $window, appService, appFactory) {
      const vm = this;
      vm.touch = false;

      vm.docType = false; //?filter byt req type
      // vm.docs = [];
      vm.init = async () => {
        const licId = $window.sessionStorage.getItem('__licId');

        const response  = await appService.axios('get', `licencias/${licId}`);
        
        if (response.status == 200) vm.license = response.data;
        else toastr.error(response.data.message);

        $scope.$digest();
      };

        vm.sendFile = async (file, req) => {
        if (vm.touch === false) {          
          vm.touch = true;

          const validation = await appFactory.docValidation(file);
          console.log(validation);
          if (validation.status === true) {
            const licId = $window.sessionStorage.getItem('__licId');
            const payload = { 
              archivo: file.base64, 
              estatus: req.archivo_ubicacion == null ? 1 : 3, //?if the path exists it is the correction if not insertion 
              nombre: file.filename,
              comentario: req.comentario,
            };
            
            const response = await appService.axios('patch',`licencias/${licId}/requisitos/${req.id}`, payload);
            
            if (response.status == 200){
               vm.license = response.data;
               toastr.success("Documento cargado con éxito");
            }else toastr.error(response.data.message);
            
            $scope.$digest();
          } else toastr.error(validation.msg);
          vm.touch = false
        } else {
          toastr.warning('El proceso a comenzado, espera un momento')
        }
      };

      vm.validation = async flag => {
        if (vm.touch === false) {
            vm.touch = true;
            const licId = $window.sessionStorage.getItem('__licId');

            vm.license.estatus = flag;
            
            const response = await appService.axios('patch',`licencias/${licId}/validaciones`, vm.license);
            if (response.status === 200) {
                toastr.success('Actualizado con exito');
                vm.license = response.data;
                $scope.$digest();
            }else toastr.error(response.data.message);
            vm.touch = false;
        } else toastr.warning('Proceso en ejecución, espera un momento');
      };

      vm.observations = async flag => {
        if (vm.touch === false) {
            vm.touch = true;
            const licId = $window.sessionStorage.getItem('__licId');

            vm.license.estatus = flag;
            
            const response = await appService.axios('patch',`licencias/${licId}/observaciones`, vm.license);
            if (response.status === 200) {
                toastr.success('Actualizado con exito');
                vm.license = response.data;
                $scope.$digest();
            }else toastr.error(response.data.message);
            vm.touch = false;
        } else toastr.warning('Proceso en ejecución, espera un momento');
      };
    //   vm.t_docs = async () => {
    //     vm.pro_type = ($window.sessionStorage.getItem('utipo') == 'id_5ebe10d0b4db29.48120814');
    //     vm.tipo = $window.sessionStorage.getItem('__type');
    //     if (angular.isUndefined(vm.type)) vm.type = 'solicitud';
    //     const id_lic = $window.sessionStorage.getItem('__id_lic');
    //     const tramite_res = await appService.peticiones('get',`Formalities/request/${id_lic}`);
    //     const response = await appService.peticiones('get',`Documents/formalitie/${id_lic}`);
        
    //     // console.log(tramite_res.data);
    //     if(tramite_res.data.data.length != 0) vm.solicitud = setting(tramite_res.data.data[0]);
    //     else{
    //       const tramite_res = await appService.peticiones('get',`Formalities/request_form/${id_lic}`);
    //       vm.solicitud = setting(tramite_res.data[0]);
    //     }
    //     vm.docs = preset(response.data);
    //     console.log(vm.docs);
    //     vm.touch = false
    //     $scope.$digest();
    //   };

    //   function preset(array) {
    //     for (const iterator of array)
    //       iterator.tipo = (iterator.tipo == '1');        
    //     return array
    //   }
    //   function setting(array) {
    //       array.estatus = Number(array.estatus); let est = array.estatus;
    //       //console.log(array);
    //       switch (est) {
    //         case 1: array.estatus_desc = "Solicitado"; break;
    //         case 2: array.estatus_desc = "Docs. Cargados"; break;
    //         case 3: array.estatus_desc = "Docs. con Observaciones"; break;
    //         case 4: array.estatus_desc = "Docs. Corregidos"; break;
    //         case 5: array.estatus_desc = "Docs. Validados"; break;
    //         case 6: array.estatus_desc = "Por pagar"; break;
    //         case 7: array.estatus_desc = "Pagado"; break;
    //         case 8: array.estatus_desc = "Pago con observaciones"; break;
    //         case 9: array.estatus_desc = "Pago corregido"; break;
    //         case 10: array.estatus_desc = "Para Firma de Solicitante"; break;
    //         case 11: array.estatus_desc = "Firmado por Solicitante"; break;
    //         case 12: array.estatus_desc = "Para Autorización."; break;
    //         case 13: array.estatus_desc = "Autorizado"; break;
    //         case 14: array.estatus_desc = "Cancelado"; break;
    //         case 15: array.estatus_desc = "Bloqueado"; break;
    //         case 16: array.estatus_desc = "Restaurado"; break;
    //         case 17: array.estatus_desc = "Desbloqueado"; break;
    //         default: array.estatus_desc = "Undefined";
    //       }
    //     // if($window.sessionStorage.getItem('__isdrflag')) vm.toPay = monto_pagar(vm.licenciasList);
    //     return array
    //   }
  
    //   vm.send_file = async (file, doc) => {
    //     if (vm.touch === false) {
    //       vm.touch = true;
    //       const payload = await appFactory.validar_img(file);
    //       console.log(payload.status);
    //       if (payload.status === true) {
    //         const id_lic = $window.sessionStorage.getItem('__id_lic');
    //         const body = { archivo: file, document:doc, id_lic:id_lic }
            
    //         const response = await appService.peticiones('patch',`Documents/formalitie/${doc.public_id}`, body);
            
    //         if (response.data.status == true) {
    //           toastr.success("Documento cargado con éxito");
    //           vm.t_docs();
    //           // $window.location = "#!tramites/proceso";
    //         }else if(response.data.status === false) toastr.warning(response.data.msg);
    //         else toastr.success('Problemas para guardar, consulte con soporte');
    //         vm.touch = false;
    //       } else {
    //         toastr.error(payload.msg)
    //         vm.touch = false
    //       }
    //     } else {
    //       toastr.warning('El proceso a comenzado, espera un momento')
    //     }
    //   }
  
    //   vm.change_est = async flag => {
    //     if (vm.touch === false) {
    //         vm.touch = true;
    //         const id_lic = $window.sessionStorage.getItem('__id_lic');
    //         let payload = { flag : flag, tipo : vm.tipo }
    //         const response = await appService.peticiones('patch',`Formalities/license/${id_lic}`, payload);
    //         if (response != false) {
    //             toastr.success('Actualizado con exito');
    //             vm.t_docs();
    //             // $window.location = '#!/';
    //         } else {
    //             vm.touch = false;
    //             console.log('algo salio mal');
    //         }
    //     } else toastr.warning('Proceso en ejecución, espera un momento');
    // }
    }
  
    angular
      .module('app')
      .controller('reqController', reqController)
  })();