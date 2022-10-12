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
                    name: 'order',
                    files: ['js/user/licenses/order/orderController.js']
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
                    name: 'departments',
                    files: ['js/user/departments/depController.js']
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
                    name: 'uses',
                    files: ['js/user/uses/usesController.js']
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
				templateUrl: 'js/user/licenses/requirements/index.html',
				controller: 'reqController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('requirements');
					}]
				}
			})
			.when('/orden', {
				templateUrl: 'js/user/licenses/order/index.html',
				controller: 'orderController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('order');
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
			.when('/departamentos', {
				templateUrl: 'js/user/departments/index.html',
				controller: 'depController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('departments');
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
			.when('/usos', {
				templateUrl: 'js/user/uses/index.html',
				controller: 'usesController',
				controllerAs: 'vm',
				resolve: {
					loadModule: ['$ocLazyLoad', function ($ocLazyLoad) {
						return $ocLazyLoad.load('uses');
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