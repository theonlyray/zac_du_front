(function () {
    'use strict';

    function AppFactory() {
        loadProgressBar();
        
        const service = {};
        const exts = ['png', 'jpg', 'jpeg', 'pdf', 'zip', 'rar', 'dwg'];
        // const img_exts = ['png', 'jpg', 'jpeg']
        

        /// GROUPS //
        service.formGroups = type => { return licenseGroups(type) }

        const licenseGroups = type => {
            switch (type) {
                case 1 : return [location, construction_desc, construction_backgrounds, construction_owners];
                case 2 : return [location, construction_desc, construction_backgrounds, construction_owners];
                case 3 : return [location, construction_desc, construction_backgrounds, construction_owners];
                case 4 : return [location, construction_desc, construction_owners];
                case 5 : return [location, construction_desc, construction_owners];
                case 6 : return [announcement,location, construction_desc, construction_backgrounds, construction_owners];
                case 7 : return [location, construction_owners];
                case 8 : return [location, construction_desc, construction_backgrounds, construction_owners];
                case 9 : return [location, construction_desc, construction_backgrounds, construction_owners];
                case 10 : return [location, construction_desc, construction_backgrounds, construction_owners];
                case 11 : return [location, construction_desc, construction_backgrounds, construction_owners];
                case 12 : return [location, construction_owners];
                case 13 : return [construction_backgrounds];
                case 15 : return [location, construction_desc, construction_backgrounds, construction_owners];
                case 16 : return [location, construction_boundaries, construction_uses];
                case 17 : return [ad_activity, ad_type_detached, ad_location, ad_desc, ad_validity];
                case 18 : return [ad_activity, ad_type_structural, ad_location, ad_desc, ad_validity];
                case 19 : return [ad_activity, ad_type_detached, ad_location, ad_desc, ad_validity];
                case 20 : return [ad_activity, ad_type_vehicles, ad_desc, ad_validity];
                case 22 : return [location, construction_owners, construction_boundaries_sfds];
                case 24 : return [location, construction_owners];
                case 25 : return [location, construction_desc, construction_backgrounds, construction_owners];
                case 26 : return [location, construction_desc, construction_backgrounds, construction_owners];
                case 27 : return [location, construction_desc, construction_backgrounds, construction_owners];
                case 28 : return [location, construction_desc, construction_backgrounds, construction_owners];
                default:
                    break;
            }
        };

        const announcement = {
            group: 'IMPORTANTE', iGroup:'announcement', fields: [
                { title: 'Si su licencia fue autorizada a través de esta plataforma, podrá solicitar la prorroga en su bandeja de "AUTORIZADAS".', type: 7, size: 12, },
            ]
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
                { title: 'Clave Catastral', field: 'clave_catastral', type: 1, size: 3, value: 'N/A' }, 
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
            group: 'ANTECEDENTES', iGroup: 'backgrounds', fields: [
                // { title: 'La licencia de referencia es física.', field: 'backgroundsPhysicalLicFlag', value: false, type: 4, size: 12},
                { title: 'tabla', field: 'antecedentes', type: 98, size: 12 }]
        };

        const construction_owners = {
            group: 'DATOS DEL PROPIETARIO', iGroup: 'owner', fields: [
                { title: 'Soy el propietario del predio. (Si ud. es el propietario los datos serán tomados de su perfil.)', field: 'ownerFlag', type: 4, size: 12, value: false},
                { title: 'Nombre y apellidos', field: 'nombre_apellidos', type: 1, size: 8, value: 'N/A' },
                { title: 'RFC', field: 'rfc', type: 1, size: 4, value: 'N/A' },
                { title: 'Domicilio', field: 'domicilio', type: 1, size: 12, value: 'N/A' }, 
                { title: 'Ocupacion', field: 'ocupacion', type: 1, size: 6, value: 'N/A' }, 
                { title: 'Teléfono', field: 'telefono', type: 1, size: 6, value: 'N/A' },]
        };
        
        const ad_activity = {
            group: 'ACTIVIDAD', iGroup: 'ad', fields: [
                { title: 'Tipo de actividad', field: 'colocacion', type: 6, size: 12, options: [
                    { title: 'Colocación', value: true, }, 
                    { title: 'Renovación', value: false, },] },
            ]
        };
        
        const ad_type_detached = {
            group: 'TIPO DE ANUNCIO', iGroup: 'ad', fields: [
                { title: 'Tipo de anuncio', field: 'tipo', type: 6, size: 12, 
                    options: [
                        { title: 'Lona adosada a fachada', value: 'Lona adosada a fachada' }, 
                        { title: 'Rótulo en barda o fachada', value: 'Rótulo en barda o fachada' }, 
                        { title: 'Anuncio Luminoso adosado a fachada', value: 'Anuncio Luminoso adosado a fachada' },
                        { title: 'Otro (Especificar en Desc. de Anuncio)', value: 'Otro' },
                    ] 
                },
                { title: 'Cantidad', field: 'cantidad', type: 2, size: 3, value: 1, step: 1, min: 1 },
                { title: 'Descripción del anuncio.', field: 'tipo_descripcion', type: 3, size: 8, value: 'N/A' },
            ]
        };
        const ad_type_structural = {
            group: 'TIPO DE ANUNCIO', iGroup: 'ad', fields: [
                { title: 'Tipo de anuncio', field: 'tipo', type: 6, size: 12, 
                    options: [                        
                        { title: 'Anuncio Luminoso sobre poste', value: 'Anuncio Luminoso sobre poste' },
                        { title: 'Anuncio Espectacular', value: 'Anuncio Espectacular' },
                        { title: 'Pendones en luminaria', value: 'Pendones en luminaria' },
                        { title: 'Otro (Especificar en Desc. de Anuncio)', value: 'Otro' },
                    ] 
                },
                { title: 'Cantidad', field: 'cantidad', type: 2, size: 3, value: 1, step: 1, min: 1 },
                { title: 'Descripción del anuncio.', field: 'tipo_descripcion', type: 3, size: 8, value: 'N/A' },
            ]
        };
        const ad_type_vehicles = {
            group: 'TIPO DE ANUNCIO', iGroup: 'ad', fields: [
                { title: 'Tipo de anuncio', field: 'tipo', type: 6, size: 12, 
                    options: [
                        { title: 'Anuncios en vehículos', value: 'Anuncios en vehículos' },
                        { title: 'Otro (Especificar en Desc. de Anuncio)', value: 'Otro' },
                    ] 
                },
                { title: 'Cantidad', field: 'cantidad', type: 2, size: 3, value: 1, step: 1, min: 1 },
                { title: 'Descripción del anuncio.', field: 'tipo_descripcion', type: 3, size: 8, value: 'N/A' },
            ]
        };
        const ad_type = {
            group: 'TIPO DE ANUNCIO', iGroup: 'ad', fields: [
                { title: 'Tipo de anuncio', field: 'tipo', type: 6, size: 12, 
                    options: [
                        { title: 'Lona adosada a fachada', value: 'Lona adosada a fachada' }, 
                        { title: 'Rótulo en barda o fachada', value: 'Rótulo en barda o fachada' }, 
                        { title: 'Anuncio Luminoso adosado a fachada', value: 'Anuncio Luminoso adosado a fachada' },
                        { title: 'Anuncio Luminoso sobre poste', value: 'Anuncio Luminoso sobre poste' },
                        { title: 'Anuncio Espectacular', value: 'Anuncio Espectacular' },
                        { title: 'Pendones en luminaria', value: 'Pendones en luminaria' },
                        { title: 'Anuncios en vehículos', value: 'Anuncios en vehículos' },
                        { title: 'Otro (Especificar en Desc. de Anuncio)', value: 'Otro' },
                    ] 
                },
                { title: 'Cantidad', field: 'cantidad', type: 2, size: 3, value: 1, step: 1, min: 1 },
                { title: 'Descripción del anuncio.', field: 'tipo_descripcion', type: 3, size: 8, value: 'N/A' },
            ]
        };

        const ad_location = {
            group: 'UBICACIÓN DEL PREDIO', iGroup:'property', fields: [
                { title: 'mapa', type: 99, size: 12, },
                { title: 'Calle', field: 'calle', type: 1, size: 9 }, 
                { title: 'No. Oficial', field: 'no', type: 1, size: 3 }, 
                { title: 'Colonia', field: 'colonia', type: 1, size: 9 },
            ]
        };

        const ad_desc = {
            group: `DESCRIPCIÓN DEL ANUNCIO`, iGroup: 'ad', fields: [
                { title: 'Ancho (m)', field: 'largo', type: 2, size: 4, value: 0, step: 0.01, min: 0 }, 
                { title: 'Largo (m)', field: 'ancho', type: 2, size: 4, value: 0, step: 0.01, min: 0 }, 
                { title: 'Alto (m)', field: 'alto', type: 2, size: 4, value: 0, step: 0.01, min: 0 },
                { title: 'Colores.', field: 'colores', type: 3, size: 6, value: 'N/A' },
                { title: 'Texto.', field: 'texto', type: 3, size: 6, value: 'N/A' },
            ]
        };

        const ad_validity = {
            group: 'VIGENCIA DEL ANUNCIO', iGroup: 'ad', fields: [
                { title: 'Fecha de Inicio de Vigencia', field: 'fecha_inicio', type: 5, size: 6},
                { title: 'Fecha de Fin de Vigencia', field: 'fecha_fin', type: 5, size: 6},
            ]
        };

        const construction_boundaries = {
            group: 'COLINDANCIAS', iGroup: 'uses', fields: [
                { title: 'Descripción de las colindancias', field: 'medidas_colindancia', type: 3, size: 12,  },
                // { title: 'tabla', field: 'antecedentes', type: 97, size: 12 }
            ]
        };

        const construction_uses = {
            group: 'USO DEL PREDIO', iGroup: 'uses', fields: [
                { title: 'Uso actual del predio', field: 'uso_actual', type: 3, size: 6,  },
                { title: 'Uso propuesto', field: 'uso_propuesto', type: 3, size: 6, },  
            ]
        };

        const construction_boundaries_sfds = {
            group: 'COLINDANCIAS', iGroup: 's_f_d', fields: [
                { title: 'Autorización Para', field: 'descripcion', type: 8, size: 6,  },
                { title: 'Descripción de las colindancias', field: 'medidas_colindancia', type: 3, size: 12,  },
                // { title: 'tabla', field: 'antecedentes', type: 97, size: 12 }
            ]
        };

        // service.validar_img = (file) => {
        //     console.log(file);
        //     if (file.filesize < 10485760) {
        //         let ext = file.filename.split('.').pop();
        //         ext = ext.toLowerCase();
        //         console.log(ext);
        //         if (exts.includes(ext)) {
        //             return { status: true, msg: "Enviando archivo" }
        //         } else {
        //             return { status: false, msg: "types de archivos validos imagenes (.jpg .png .jpeg)" }
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
        };

        service.getMapBASE64 = async () => {
            try {
                const draw = kendo.drawing;
                const geom = kendo.geometry;
                const contentSize = new geom.Rect([0, 0], [1200, 600]);
                const imageSize = new geom.Rect([0, 0], [1200, 600]);
                const payload = await draw.drawDOM($("#map"))
                    .then(function (group) {
                        // Fill the background and set the dimensions for the exported image
                        const background = draw.Path.fromRect(imageSize, {
                            fill: {
                                color: "#ffffff",
                            },
                            stroke: null
                        });
                        // Fit content to size, if needed
                        draw.fit(group, contentSize);
                        // Note that the following methods accept arrays
                        draw.align([group], imageSize, "center");
                        draw.vAlign([group], imageSize, "center");
                        // Bundle it all together
                        const wrap = new draw.Group();
                        wrap.append(group);
                        // export the image and crop it for our desired size
                        return draw.exportImage(wrap, {
                            cors: "anonymous"
                        });
                    })
                    .then(function (data) {
                        const resultado = data.replace('data:image/png;base64,', '');
                        return resultado;
                    })
                return payload;
            } catch (error) {
                payload = error;
            }
        }

        return service;
    }

    angular
        .module('app')
        .factory('appFactory', AppFactory)
})();