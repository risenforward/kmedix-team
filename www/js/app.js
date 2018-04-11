angular.module('engineer', ['ionic', 'ionic.cloud', 'engineer.controllers', 'engineer.services', 'ngCordova'])

    .config(function ($ionicCloudProvider) {
        $ionicCloudProvider.init({
            "core": {
                "app_id": "296c94eb"
            },
            "push": {
                "sender_id": "793381233959",
                "pluginConfig": {
                    "ios": {
                        "badge": true,
                        "sound": "default"
                    },
                    "android": {
                        "iconColor": "#cccccc"
                    }
                }
            }
        });
    })

    .run(function ($ionicPlatform, $rootScope, $cordovaPushV5, $state, authService, $localStorage) {

        $ionicPlatform.ready(function () {
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            // $cordovaPushV5.setBadgeNumber(0);

            var options = {
                android: {
                    senderID: "433457825451"
                },
                ios: {
                    alert: "true",
                    badge: "true",
                    sound: "true"
                },
                windows: {}
            };

            $cordovaPushV5.initialize(options).then(function () {
                $cordovaPushV5.setBadgeNumber(0);
            });


            console.log(authService.isAuthenticated());

            if (!authService.isAuthenticated()) {
                console.log('if 1');
                $state.go('app.login');
            }
        })


        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {

            // console.log(toState);

            if (toState.name == "app.login") {
                // event.preventDefault();
                // $state.go('app.login');
                return;
            }

            if (!authService.isAuthenticated() && toState.data == undefined) {
                event.preventDefault();
                console.log('if 3');
                $state.go('app.login');
            }

            if ($localStorage.role !== "TECHNICAL_SUPPORT_ENGINEER" && toState.access !== undefined && toState.access.denied) {
                event.preventDefault();
                console.log('Сlinical инженерам отказано в доступе!');
                $state.go(fromState.name);
            }
        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $ionicConfigProvider.tabs.position('top');
        $ionicConfigProvider.backButton.previousTitleText(false).text('');
        $stateProvider

            .state('app', {
                url: '/app',
                abstract: true,
                templateUrl: 'templates/menu.html',
                controller: 'EngineerCtrl'
            })

            .state('app.kmedix-home', {
                url: '/kmedix-home',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/kmedix-home.html'
                    }
                }
            })
            .state('app.request-details-assigned', {
                url: '/request-details-assigned',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/request-details-assigned.html'
                    }
                }
            })
            .state('app.request-details-completed', {
                url: '/request-details-completed',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/request-details-completed.html'
                    }
                }
            })
            .state('app.request-details-pending', {
                url: '/request-details-pending',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/request-details-pending.html'
                    }
                },
                access: { denied: true }
            })
            .state('app.request-details-unassigned', {
                url: '/request-details-unassigned',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/request-details-unassigned.html'
                    }
                }
            })
            .state('app.devices', {
                url: '/devices',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/devices.html'
                    }
                },
                access: { denied: true }
            })
            .state('app.devices-current', {
                url: '/devices-current',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/devices-current.html'
                    }
                },
                access: { denied: true }
            })
            .state('app.device-details', {
                url: '/device-details',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/device-details.html'
                    }
                },
                access: { denied: true }
            })
            .state('app.customer-details', {
                url: '/customer-details',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/customer-details.html'
                    }
                }
            })
            .state('app.add-service-report', {
                url: '/add-service-report',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/add-service-report.html'
                    }
                },
                access: { denied: true }
            })
            .state('app.device-service-log', {
                url: '/device-service-log',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/device-service-log.html'
                    }
                },
                access: { denied: true }
            })
            .state('app.preventive-maintenance', {
                url: '/preventive-maintenance',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/preventive-maintenance.html'
                    }
                },
                access: { denied: true }
            })

            .state('app.login', {
                url: '/login',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/login.html'
                    }
                },
                data: { noLogin: true }
            })


            .state('app.change-password', {
                url: '/change-password',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/change-password.html'
                    }
                },
                controller: 'changePasswordCtrl'
            })

            .state('app.settings', {
                url: '/settings',
                views: {
                    'menuContent': {
                        templateUrl: 'templates/settings.html'
                    }
                }
            });


        $urlRouterProvider.otherwise('/app/kmedix-home');
    });