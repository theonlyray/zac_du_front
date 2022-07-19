(function () {
	const enrutado = function ($ocLazyLoadProvider, $routeProvider) {

        $ocLazyLoadProvider.config({
			loadedModules: ['app'], modules: [
                {
					name: 'licenses',
					files: ['js/applicant/licenses/licensesController.js']
				},{
                    name: 'request',
                    files: ['js/applicant/licenses/request/requestController.js',
                        'js/applicant/licenses/form/formComponent.js']
                },
                {
                    name: 'review',
                    files: ['js/applicant/licenses/review/request/requestController.js',
                        'js/applicant/licenses/review/form/formComponent.js']
                },
                {
                    name: 'requirements',
                    files: ['js/applicant/licenses/requirements/reqController.js']
                },
                {
                    name: 'profile',
                    files: ['js/applicant/profile/profileController.js']
                },
                //{
                //     name: 'dutyspro',
                //     files: ['js/applicant/licenses/duty_pro/dutyproController.js']
                // },{
                // },{
                //     name: 'readDutyspro',
                //     files: ['js/applicant/dutys_pro/dutysproController.js']
                // },{
                //     name: 'solidary',
                //     files: ['js/applicant/licenses/solidary/solidaryController.js']
                // },{
                //     name: 'readSolidary',
                //     files: ['js/applicant/solidary/solidaryController.js']
                // },{
                //     name: 'pay',
                //     files: ['js/applicant/licenses/pay/payController.js']
                // },{
                //     name: 'docs_usr',
                //     files: ['js/applicant/documents/documentsController.js']
                // },{
                //     name: 'profile',
                //     files: ['js/applicant/profile/profileController.js']
                // },{
				// 	name: 'ticket',
				// 	files: ['js/applicant/ticket/ticketController.js']
				// },
            ]
		});

        $routeProvider
			.when('/tramites/:licStat', {
				templateUrl: 'js/applicant/licenses/index.html',
				controller: 'licensesController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('licenses');
					}]
				}
			})
            .when('/solicitud', {
                templateUrl: 'js/applicant/licenses/request/request.html',
                controller: 'requestController',
                controllerAs: 'vm',
                resolve: {
                    loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('request');
                    }]
                }
            })
            .when('/review', {
                templateUrl: 'js/applicant/licenses/review/request/request.html',
                controller: 'requestController',
                controllerAs: 'vm',
                resolve: {
                    loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('review');
                    }]
                }
            })
            .when('/license_reqs', {
                templateUrl: 'js/applicant/licenses/requirements/requirements.html',
                controller: 'reqController',
                controllerAs: 'vm',
                resolve: {
                    loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
                        return $ocLazyLoad.load('requirements');
                    }]
                }
            })
            .when('/perfil', {
				templateUrl: 'js/applicant/profile/index.html',
				controller: 'profileController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('profile');
					}]
				}
			})
            // .when('/aranceles', {
            //     templateUrl: 'js/applicant/licenses/duty_pro/duty_pro.html',
            //     controller: 'dutyproController',
            //     controllerAs: 'vm',
            //     resolve: {
            //         loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
            //             return $ocLazyLoad.load('dutyspro');
            //         }]
            //     }
            // })
            // .when('/consultar_aranceles', {
            //     templateUrl: 'js/applicant/dutys_pro/duty_pro.html',
            //     controller: 'dutysproController',
            //     controllerAs: 'vm',
            //     resolve: {
            //         loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
            //             return $ocLazyLoad.load('readDutyspro');
            //         }]
            //     }
            // })
            // .when('/solidarios', {
            //     templateUrl: 'js/applicant/licenses/solidary/solidary.html',
            //     controller: 'solidaryController',
            //     controllerAs: 'vm',
            //     resolve: {
            //         loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
            //             return $ocLazyLoad.load('solidary');
            //         }]
            //     }
            // })
            // .when('/corresponsables', {
            //     templateUrl: 'js/applicant/solidary/solidary.html',
            //     controller: 'solidaryController',
            //     controllerAs: 'vm',
            //     resolve: {
            //         loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
            //             return $ocLazyLoad.load('readSolidary');
            //         }]
            //     }
            // })
            // .when('/pago', {
            //     templateUrl: 'js/applicant/licenses/pay/pay.html',
            //     controller: 'payController',
            //     controllerAs: 'vm',
            //     resolve: {
            //         loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
            //             return $ocLazyLoad.load('pay');
            //         }]
            //     }
            // })
            // .when('/docs_usr', {
            //     templateUrl: 'js/applicant/documents/documents.html',
            //     controller: 'documentsController',
            //     controllerAs: 'vm',
            //     resolve: {
            //         loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
            //             return $ocLazyLoad.load('docs_usr');
            //         }]
            //     }
            // })
            // .when('/biblioteca', {
            //     templateUrl: 'js/applicant/documents/library.html',
            //     controller: 'documentsController',
            //     controllerAs: 'vm',
            //     resolve: {
            //         loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
            //             return $ocLazyLoad.load('docs_usr');
            //         }]
            //     }
            // })
            // .when('/profile', {
            //     templateUrl: 'js/applicant/profile/profile.html',
            //     controller: 'profileController',
            //     controllerAs: 'vm',
            //     resolve: {
            //         loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
            //             return $ocLazyLoad.load('profile');
            //         }]
            //     }
            // })
            // .when('/ticket', {
			// 	templateUrl: 'js/applicant/ticket/ticket.html',
			// 	controller: 'ticketController',
			// 	controllerAs: 'vm',
			// 	resolve: {
			// 		loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
			// 			return $ocLazyLoad.load('ticket');
			// 		}]
			// 	}
			// })
            .otherwise("/tramites/Proceso");            
    }

        angular
		.module('app')
		.config(enrutado)
})();