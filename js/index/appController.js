(function () {
  'use strict';

  function IndexCtrl($scope, indexFactory, indexService, $cookies, $window) {

    const vm = this;
    vm.touch = false;
    vm.showDroForm  = true;
    vm.showPartForm = false;

    vm.colegios = [
      { "id": 1, "descripcion": "Colegio de Ingenieros",},
      { "id": 2, "descripcion": "Colegio de Arquitectos", },
      { "id": 3, "descripcion": "Colegio de Mecanicos Electrisistas", },
      { "id": 4, "descripcion": "Colegio de Restauradores", }
    ];

    //?regist object data
    vm.regist = { 
      college_id : vm.colegios[0],
      role_id : 9
    };

    /*
    vm.page = 1;
    vm.data_page = 10;
    vm.krf = 0;    
    */

    vm.changeToDro = () =>{
      vm.showDroForm  = true;
      vm.showPartForm = false;
      vm.regist.role_id = 9;
    };
    
    vm.changeToPart = () =>{
      vm.showDroForm  = false;
      vm.showPartForm = true;
      vm.regist.role_id = 10;
    };

    vm.request = (e,data,flag) => {
      e.preventDefault();
      if (vm.touch === false) {
        // vm.touch = true;
        // grecaptcha.ready(function() {
        //   grecaptcha.execute('6LeZbyceAAAAAP3GugV3v2qKygSQH7NV0FjS1rvI', {action: 'submit'}).then(function(token) {            
        //     data.token = token;
                switch (flag) {
                  case 0: login(data); break;
                  case 1: regist(data); break;
                  case 2: recovery(data); break;
                  default: break;
                }            
                vm.touch = false;
        //   });
        // });             
      } else toastr.warning('Proceso en ejecucion, espere un momento');
    }

    const login = async data =>{
      vm.touch = false;
      data.dispositivo =  indexFactory.dispositivo();
      let depid, colid = null;
      let response = await indexService.axios('post',"autenticacion/login", data);
      if (angular.equals(response.status,200)) {
        $cookies.put("__token", response.data.Authorization);
        if (response.data.user.department.length != 0) depid = response.data.user.department[0].id;
        if (response.data.user.college.length != 0)    colid = response.data.user.college[0].id;
        indexFactory.redirect(response.data.user.roles[0].id, response.data.user.id, depid, colid);
      }
    }
    
    const regist = async data =>{
      vm.touch = false;

      data.college_id = data.college_id.id;
      data.dispositivo = await indexFactory.dispositivo();

      let response = await indexService.axios('post',`autenticacion/registro`, data);              
      
      if (angular.equals(response.status,200)) {
        toastr.success('Registro realizadó con éxito.');
        $cookies.put("__token", response.data.Authorization);
        indexFactory.redirect(response.data.user.roles[0].id, response.data.user.id);
      }
      else if (!angular.equals(response.status,200)) toastr.error(response.data.message);
      else toastr.error('Problemas para realizar consulta, contacte con soporte.');
    }

    const recovery = async data =>{
      console.log(data);
      let response = await indexService.axios('post',"autenticacion/recuperacion", data);
      if (angular.equals(response.status, 200)) toastr.success('La nueva contraseña se ha enviado a su correo electrónico.');      
      // else if (angular.equals(response.data.status, false)) toastr.warning(response.data.msg);
      // else toastr.error('Problemas para realizar consulta, contacte con soporte. cdplatino.celaya02@gmail.com, +524921240909');
    }
    
    vm.init = () => 
    {
      if (angular.isDefined($cookies.get('__token')) && angular.isDefined($window.sessionStorage.getItem('utipo'))) 
        indexFactory.redirect($window.sessionStorage.getItem('utipo'));
      // // indexService.peticiones('get',`Config/services`); 
    };

    vm.set_type = data => { $window.sessionStorage.setItem('type',data);}

    vm.list_validated = async () =>{
      vm.type = $window.sessionStorage.getItem('type');
      let response = await indexService.axios('get',`autenticacion/${vm.type}`);
      if (response.status === 200) vm.validates = response.data;
      else toastr.warning(`Problemas para consultar.`);
      $scope.$digest();
    }
  }

  angular
    .module('app')
    .controller('indexCtrl', IndexCtrl)
})();
// (function () {
//   'use strict';

//   function MyCtrl($scope, indexFactory, indexService, $cookies, $window) {   

//     const vm = this;
//     vm.touch = false;
//     vm.first_log_step = true;
//     vm.second_log_step = false;

//     vm.page = 1;
//     vm.data_page = 10;
//     vm.krf = 0;
    
//     // document.getElementById("btn-pass-val").disabled = true;
//     // document.getElementById("rdro").disabled = true;
//     // document.getElementById("rsol").disabled = true;
//     // document.getElementById("rres").disabled = true;

//     vm.init = () => 
//     {
//       if (angular.isDefined($cookies.get('__token')) && angular.isDefined($window.sessionStorage.getItem('utipo'))) 
//         indexFactory.redirect($window.sessionStorage.getItem('utipo'));
//       // indexService.peticiones('get',`Config/services`); 
//     };

//     vm.forms_reg = async flag => { //show reg div
//       vm.krf = flag;
//       let response;
//       switch (flag) {
//         case 0: vm.rLabel = ''; break;
//         case 1: 
//             response = await indexService.peticiones('post',`Common/get_publicol`);        
//             if (response.data) vm.coll_list = response.data;
//             else toastr.warning('Problemas para consultar colegio');
//             response = await indexService.peticiones('post',`Common/get_publicesp`);        
//             if (response.data) vm.esp_list = response.data;
//             else toastr.warning('Problemas para consultar especialidades');
//             vm.specialty = {};
//             vm.dro = { type : 'id_5ebe10d0b4db29.48120814', specialties: [] };
//             vm.rLabel = 'Registro Perito'; 
//           break;
//         case 2: 
//           vm.rLabel = 'Registro Particular'; 
//           vm.part = { type : 'id_5ebe11ce542b89.25367119' };
//           break;
//       }
//       $scope.$digest();
//     }

//     vm.add_esp = data =>{
//       if (angular.isDefined(data.id) && angular.isDefined(data.numreg)) {
//         for (const iterator of vm.esp_list) if (iterator.public_id === data.id) data.descripcion = iterator.descripcion
//         vm.dro.specialties.push(data);
//         vm.specialty = {};
//         console.log(vm.dro);
//       }else toastr.warning('Debe completar todos los datos');
//     }

//     vm.delete_esp = index =>{ vm.dro.specialties.splice(index, 1); }

//     vm.q_data = async flag => {
//       vm.listView = true;
//       let route, response, msg;
//       switch (flag) {
//         case 0: 
//           route = 'Common/get_plcsol'; 
//           vm.label, msg = "Responsables Solidarios Activos";
//           break;
//         case 1: 
//           route = 'Common/get_plcdros';
//           vm.label, msg = "Peritos Activos";
//           break;
//         case 2: 
//           route = 'Common/get_ara';
//           vm.label, msg = "Aranceles Activos";
//           break;
//         case 3: 
//           route = 'Documentos/get_plcdocs';
//           vm.label, msg = "Manuales"; vm.manual = true;
//           break;
      
//         default: break;
//       }
//       response = await indexService.peticiones('post',`${route}`);
//       if (response.status === 200 && flag != 2) vm.data_list = response.data;
//       else if (response.status === 200 && flag == 2) vm.data_list = response.data.data;
//       else toastr.warning(`Problemas para consultar ${msg}`);
//       $scope.$digest();
//     }

//     vm.q_email = async data =>{
//       if (vm.touch === false) {
//         vm.touch = true;
//         // vm.user.dispositivo = await indexFactory.dispositivo();
        
//         const response = await indexService.peticiones('post', 'Authorization/query_email', vm.login);
        
//         if (angular.equals(response.data,true)){ vm.first_log_step = false; vm.second_log_step = true;}
//         else if (angular.equals(response.data,false)) 
//           toastr.error('Correo inexistente, registrese para iniciar.');
//         else if (!angular.equals(response.data,true) && !angular.equals(response.data,false))
//           toastr.error('Problemas para realizar consulta, contacte con soporte.');
                          
//         vm.touch = false; $scope.$digest();
//       } else { toastr.warning('Proceso en ejecucion, espere un momento') }
//     }
      
//     vm.q_pass = async data =>{
//       if (vm.touch === false) {
//         vm.touch = true;
//         let response = await indexService.peticiones('post',"Authorization/login", data);  
//         vm.touch = false;

//         if (angular.equals(response.data.status,true) && !angular.isUndefined(response.data.token)){
//           $cookies.put("__token", response.data.token);
//           indexFactory.redirect(response.data.utype);
//         }
//         else if (angular.equals(response.data.status,false) && angular.equals(response.data.data,0)) 
//           toastr.error('Contraseña incorrecta');
//         else toastr.error('Problemas para realizar consulta, contacte con soporte.');
        
//       } else { toastr.warning('Proceso en ejecucion, espere un momento') }      
//     }
    
//     vm.regist = async data => {
//       if (vm.touch === false) {
//         vm.touch = true;

//         if (data.is_corres == true && data.specialties.length != 0) {
//           let response = await indexService.peticiones('post',`Authorization/regist/${data.type}`, data);  
//           console.log(response.data);
//           vm.touch = false;

//           if (angular.equals(response.data,true)) {
//             toastr.success('Registro realizadó con éxito.');
//           }
//           else if (angular.equals(response.data.status,true) && !angular.isUndefined(response.data.token)){
//             $cookies.put("__token", response.data.token);
//             indexFactory.redirect(response.data.utype);
//           }
//           else if (angular.equals(response.data.status,false)) 
//             toastr.error(response.data.msg);
//           else toastr.error('Problemas para realizar consulta, contacte con soporte.');
//         }else { toastr.warning('Debe de seleccionar por lo menos una especialidad'); vm.touch = false; }
//       } else { toastr.warning('Proceso en ejecucion, espere un momento') }
//     }

//     vm.queryLic = async ()=> {
//       var sPageURL = window.location.search.substring(1);
//       var sURLVariables = sPageURL.split('&');
//       for (var i = 0; i < sURLVariables.length; i++) var sParameterName = sURLVariables[i].split('=');         
//       // console.log(sParameterName[1]);
      
//       const response = await indexService.peticiones('get',`CommonV2/license/${sParameterName[1]}`);

//       if (angular.equals(response.status, false)) toastr.error('No información registrada para este folio');
//       else vm.dataLic = response.data;
//       console.log(response.data);
//       $scope.$digest();
//     }

//     vm.reccontra = async email =>{
//       let response = await indexService.peticiones('post',"Authorization/rec_pass", email); 
      
//       if (angular.equals(response.data.status, true) && angular.equals(response.data.data, null)) toastr.success('La nueva contraseña se ha enviado a su correo electrónico.');
//       else if (angular.equals(response.data.status, false) && angular.equals(response.data.data, 0)) toastr.warning('Correo inexistente.');
//       else toastr.error('Problemas para realizar consulta, contacte con soporte. cdplatino.celaya02@gmail.com, +524921240909');
      
//     }
//   }

//   angular
//     .module('myApp')
//     .controller('myCtrl', MyCtrl)
// })();

//1|a1n3dK6S9Az5gbzJd5rDuLgq7ZQg3btL1jWUjKNQ dro
//2|hYeQetQFnzdq9k11D8gkrN1IgZclE5MsY85ZJzV2 part