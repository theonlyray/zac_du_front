(function () {
    'use strict';

    function UsrFactory() {
        loadProgressBar()
        const service = {};
        const exts = ['png', 'jpg', 'jpeg', 'pdf', 'zip', 'rar', 'dwg']
        const img_exts = ['png', 'jpg', 'jpeg']

        /// GROUPS //
        service.formGroups = type => { return licenseGroups(type) };

        const licenseGroups = type => {
            switch (type) {
                case 1 : return [location, construction_desc, construction_backgrounds, construction_owners, validity];
                case 2 : return [location, construction_desc, construction_backgrounds, construction_owners, validity];
                default:
                    break;
            }
        };

        const location = {
            group: 'UBICACIÓN DEL PREDIO', iGroup:'property', fields: [
                { title: 'mapa', type: 99, size: 12, },
                { title: 'Calle', field: 'calle', type: 1, size: 9 }, 
                { title: 'No. Oficial', field: 'no', type: 1, size: 3 }, 
                { title: 'Colonia', field: 'colonia', type: 1, size: 9 },
                { title: 'Sección', field: 'seccion', type: 1, size: 3, value: 'N/A'}, 
                { title: 'Manzana', field: 'manzana', type: 1, size: 3, value: 'N/A' },
                { title: 'Lote', field: 'lote', type: 1, size: 3, value: 'N/A' }, 
                { title: 'Boleta de Impuesto Predial No.', field: 'no_predial', type: 1, size: 6 },
                { 
                    title: 'Superficie del terreno', field: 'sup_terreno', 
                    type: 2, size: 4, value: 0, step: 0.01, min: 1,
                },
                { 
                    title: 'Superficie construida', field: 'sup_construida', 
                    type: 2, size: 4, value : 0, step: 0.01, min: 1,
                },
                { 
                    title: 'Superficie no construida', field: 'sup_no_construida', 
                    type: 2, size: 4, value : 0, step: 0.01, min: 0,
                },
            ]
        };

        const construction_desc = {
            group: `DESCRIPCIÓN DE LA OBRA`, subtitle: 'Sup. Const. o Reg. m2', iGroup: 'construction', fields: [
                // { title: 'Obra (Indicar el Nombre del Proyecto)',      field: 'name', type: 1, size: 12 },                
                { title: 'Sup. Const. o Reg. m2', field: 'label', type: 11, size: 12}, //?label
                { title: 'Sotano', field: 'sotano', type: 2, size: 2, value: 0, step: 0.01, min: 0 }, 
                { title: 'Planta Baja', field: 'planta_baja', type: 2, size: 2, value: 0, step: 0.01, min: 0 }, 
                { title: 'Mezzanine', field: 'mezzanine', type: 2, size: 2, value: 0, step: 0.01, min: 0 }, 
                { title: 'Primer Piso', field: 'primer_piso', type: 2, size: 2, value: 0, step: 0.01, min: 0 }, 
                { title: 'Segundo Piso', field: 'segundo_piso', type: 2, size: 2, value: 0, step: 0.01, min: 0 }, 
                { title: 'Tercer Piso', field: 'tercer_piso', type: 2, size: 2, value: 0, step: 0.01, min: 0 }, 
                { title: 'Cuarto Piso', field: 'cuarto_piso', type: 2, size: 2, value: 0, step: 0.01, min: 0 }, 
                { title: 'Quinto Piso', field: 'quinto_piso', type: 2, size: 2, value: 0, step: 0.01, min: 0 }, 
                { title: 'Sexto Piso', field: 'sexto_piso', type: 2, size: 2, value: 0, step: 0.01, min: 0 }, 
                { title: 'Descubierta', field: 'descubierta', type: 2, size: 2, value: 0, step: 0.01, min: 0}, 
                { title: 'Sup. Cubierta por Ampliación, Cons o Regularización', field: 'sup_total_amp_reg_const', type: 2, size: 3, min: 1},
                { title: 'Descripción de la obra.', field: 'descripcion', type: 3, size: 12, value: 'N/A' },
            ]
        };
        
        const construction_backgrounds = {
            group: 'ANTECEDENTES', iGroup: 'backgrounds', fields: [{ title: 'tabla', field: 'antecedentes', type: 98, size: 12 }]
        };

        const construction_owners = {
            group: 'DATOS DEL PROPIETARIO', iGroup: 'owner', fields: [
                { title: 'Soy el propietario del predio. (Si ud. es el propietario los datos serán tomados de su perfil.)', field: 'ownerFlag', type: 4, size: 12},
                { title: 'Nombre y apellidos', field: 'nombre_apellidos', type: 1, size: 8, value: 'N/A' },
                { title: 'RFC', field: 'rfc', type: 1, size: 4, value: 'N/A' },
                { title: 'Domicilio', field: 'domicilio', type: 1, size: 12, value: 'N/A' }, 
                { title: 'Ocupacion', field: 'ocupacion', type: 1, size: 6, value: 'N/A' }, 
                { title: 'Teléfono', field: 'telefono', type: 1, size: 6, value: 'N/A' },]
        };
        
        const validity = {
            group: 'VIGENCIA DE LA LICENCIA', iGroup: 'validity', fields: [
                { title: 'Fecha de Inicio de Vigencia', field: 'fecha_autorizacion', type: 5, size: 5},
                { title: 'Fecha de Fin de Vigencia', field: 'fecha_fin_vigencia', type: 5, size: 5},
                { title: 'Días Totales', field: 'dias_total', type: 2, size: 2, value: 0 },
            ]
        };

        // service.validar_img = (file) => {
        //     console.log(file);
        //     if (file.filesize < 10485760) {
        //         let ext = file.filename.split('.').pop();
        //         ext = ext.toLowerCase();
        //         if (exts.includes(ext)) {
        //             return { status: true, msg: "Enviando archivo" }
        //         } else {
        //             return { status: false, msg: "tipos de archivos validos imagenes (.jpg .png .jpeg)" }
        //         }
        //     } else {
        //         return { status: false, msg: "archivo muy extenso 10 MB maximo" }
        //     }
        // }

        service.docValidation = (file) => {
            // console.log(file);
            if (file.filesize < 10485760) {
                let ext = file.filename.split('.').pop();
                ext = ext.toLowerCase();
                if (exts.includes(ext)) {
                    return { status: true, msg: "Enviando archivo" }
                } else {
                    return { status: false, msg: "types de archivos validos imagenes (.jpg .png .jpeg) pdf (.pdf) compresiones ( .rar .zip)" }
                }
            } else {
                return { status: false, msg: "archivo muy extenso 10 MB maximo" }
            }
        };

        service.val_form_img = (a, b, c) => {
            if (a, b, c) return { status: true };
            else {
                return { status: false, msg: "archivo muy extenso 10 MB maximo" }
            }
        }

        service.val_update_img = a => {
            if (a) return { status: true };
            else {
                return { status: false, msg: "archivo muy extenso 10 MB maximo" }
            }
        }

        return service;
    }

    angular
        .module('user')
        .factory('usrFactory', UsrFactory)
})();