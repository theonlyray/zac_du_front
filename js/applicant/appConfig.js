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
                    name: 'payment',
                    files: ['js/applicant/licenses/payment/paymentController.js']
                },
                {
                    name: 'profile',
                    files: ['js/applicant/profile/profileController.js']
                },
                {
                    name: 'documents',
                    files: ['js/applicant/docs/docsController.js']
                },
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
			}).when('/documentos', {
				templateUrl: 'js/applicant/docs/index.html',
				controller: 'docsController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('documents');
					}]
				}                
			}).when('/pago', {
				templateUrl: 'js/applicant/licenses/payment/index.html',
				controller: 'paymentController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('payment');
					}]
				}
			})
            .otherwise("/tramites/Proceso");            
    };

        angular
		.module('app')
		.config(enrutado)
})();