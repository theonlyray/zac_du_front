(function () {
	const enrutado = function ($ocLazyLoadProvider, $routeProvider) {

        $ocLazyLoadProvider.config({
			loadedModules: ['user'], modules: [
                {
					name: 'licenses',
					files: ['js/user/licenses/licensesController.js']
				},{
                    name: 'request',
                    files: ['js/user/licenses/request/requestController.js',
                        'js/user/licenses/form/formComponent.js']
                },
                {
                    name: 'review',
                    files: ['js/user/licenses/review/request/requestController.js',
                        'js/user/licenses/review/form/formComponent.js']
                },
                {
                    name: 'requirements',
                    files: ['js/user/licenses/requirements/reqController.js']
                },
                {
                    name: 'users',
                    files: ['js/user/users/usersController.js']
                },
                {
                    name: 'roles',
                    files: ['js/user/roles/rolesController.js']
                },
                {
                    name: 'units',
                    files: ['js/user/units/unitsController.js']
                },
                {
                    name: 'documents',
                    files: ['js/user/docs/docsController.js']
                },
                {
                    name: 'licTypes',
                    files: ['js/user/licTypes/licTypeController.js']
                },
                {
                    name: 'profile',
                    files: ['js/user/profile/profileController.js']
                },
            ]
		});

        $routeProvider
			.when('/tramites/:licStat', {
				templateUrl: 'js/user/licenses/index.html',
				controller: 'licensesController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('licenses');
					}]
				}
			})
			.when('/solicitud', {
				templateUrl: 'js/user/licenses/request/request.html',
				controller: 'requestController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('request');
					}]
				}
			})
			.when('/review', {
				templateUrl: 'js/user/licenses/review/request/request.html',
				controller: 'requestController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('review');
					}]
				}
			})
			.when('/license_reqs', {
				templateUrl: 'js/user/licenses/requirements/requirements.html',
				controller: 'reqController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('requirements');
					}]
				}
			})
			.when('/usuarios/:role', {
				templateUrl: 'js/user/users/index.html',
				controller: 'usersController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('users');
					}]
				}
			})
			.when('/roles', {
				templateUrl: 'js/user/roles/index.html',
				controller: 'rolesController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('roles');
					}]
				}
			})
			.when('/unidades', {
				templateUrl: 'js/user/units/index.html',
				controller: 'unitsController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('units');
					}]
				}
			})
			.when('/documentos', {
				templateUrl: 'js/user/docs/index.html',
				controller: 'docsController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('documents');
					}]
				}
			})
			.when('/tramites', {
				templateUrl: 'js/user/licTypes/index.html',
				controller: 'licTypeController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('licTypes');
					}]
				}
			})
			.when('/perfil', {
				templateUrl: 'js/user/profile/index.html',
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
		.module('user')
		.config(enrutado)
})();