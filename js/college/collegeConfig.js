(function () {
	const enrutado = function ($ocLazyLoadProvider, $routeProvider) {

        $ocLazyLoadProvider.config({
			loadedModules: ['college'], modules: [
                {
					name: 'licenses',
					files: ['js/college/licenses/licensesController.js']
				},{
                    name: 'request',
                    files: ['js/college/licenses/request/requestController.js',
                        'js/college/licenses/form/formComponent.js']
                },
                {
                    name: 'review',
                    files: ['js/college/licenses/review/request/requestController.js',
                        'js/college/licenses/review/form/formComponent.js']
                },
                {
                    name: 'requirements',
                    files: ['js/college/licenses/requirements/reqController.js']
                },
                {
                    name: 'users',
                    files: ['js/college/users/usersController.js']
                },                
                {
                    name: 'documents',
                    files: ['js/college/docs/docsController.js']
                },
                {
                    name: 'profile',
                    files: ['js/college/profile/profileController.js']
                },
            ]
		});

        $routeProvider
			.when('/tramites/:licStat', {
				templateUrl: 'js/college/licenses/index.html',
				controller: 'licensesController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('licenses');
					}]
				}
			})
			.when('/solicitud', {
				templateUrl: 'js/college/licenses/request/request.html',
				controller: 'requestController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('request');
					}]
				}
			})
			.when('/review', {
				templateUrl: 'js/college/licenses/review/request/request.html',
				controller: 'requestController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('review');
					}]
				}
			})
			.when('/license_reqs', {
				templateUrl: 'js/college/licenses/requirements/index.html',
				controller: 'reqController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('requirements');
					}]
				}
			})
			.when('/usuarios/:role', {
				templateUrl: 'js/college/users/index.html',
				controller: 'usersController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('users');
					}]
				}
			})
			.when('/documentos', {
				templateUrl: 'js/college/docs/index.html',
				controller: 'docsController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('documents');
					}]
				}
			})
			.when('/tramites', {
				templateUrl: 'js/college/licTypes/index.html',
				controller: 'licTypeController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('licTypes');
					}]
				}
			})
			.when('/perfil', {
				templateUrl: 'js/college/profile/index.html',
				controller: 'profileController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('profile');
					}]
				}
			})
			.otherwise("/tramites/Proceso");      
    }

        angular
		.module('college')
		.config(enrutado)
})();