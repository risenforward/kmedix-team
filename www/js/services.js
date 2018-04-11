angular.module('engineer.services', ['ngStorage', 'ngCordova'])

.factory('mapService', function() {
    function gmap(lat, lng) {
        console.log(lat, lng);
        var myLatlng = new google.maps.LatLng(lat, lng);

        var mapOptions = {
            center: myLatlng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var el = angular.element(document.querySelector('#map'))[0];

        console.log(el);


        var map = new google.maps.Map(el, mapOptions);

        var marker = new google.maps.Marker({
            position: myLatlng,
            map: map,
            title: 'Uluru (Ayers Rock)'
        })
    };
    return {
        gmap: gmap
    }
})

.factory('requestListService', function($http, $localStorage) {
    function getRequestList() {
        var promise = $http({
                url: 'http://46.101.87.109/api/v1/serviceRequests',
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                },
                params: {
                    api_token: $localStorage.apiToken
                }
            })
            .success(function(response, status, headers, config) {
                // console.log(response);
            })
            .error(function(response, status, headers, config) {
                console.log('Something went wrong');
            })
        return promise;
    }
    return {
        getRequestList: getRequestList
    }
})

.factory('getDevicesService', function($http, $localStorage) {
    function getDevices() {
        var promise = $http({
                url: 'http://46.101.87.109/api/v1/devices',
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                },
                params: {
                    api_token: $localStorage.apiToken
                }
            })
            .success(function(response, status, headers, config) {
                console.log(response);
            })
            .error(function(response, status, headers, config) {
                console.log(response);
            })
        return promise;
    }
    return {
        getDevices: getDevices
    }
})

.factory('deviceDetailsService', function($http, $localStorage) {
    function deviceDetails(id) {
        var promise = $http({
                url: 'http://46.101.87.109/api/v1/devices/' + id,
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                },
                params: {
                    api_token: $localStorage.apiToken
                }
            })
            .success(function(response, status, headers, config) {
                // console.log(response);
            })
            .error(function(response, status, headers, config) {
                console.log('Something went wrong');
            })
        return promise;
    }
    return {
        deviceDetails: deviceDetails
    }
})

.factory('clinicInstallDevicesService', function($http, $localStorage) {
    function clinicInstallDevices(id) {
        var promise = $http({

                url: 'http://46.101.87.109/api/v1/customers/' + id + '/devices',
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                },
                params: {
                    api_token: $localStorage.apiToken
                }
            })
            .success(function(response, status, headers, config) {
                // console.log(response);
            })
            .error(function(response, status, headers, config) {
                console.log('Something went wrong');
            })
        return promise;
    }
    return {
        clinicInstallDevices: clinicInstallDevices
    }
})


// 14
.factory('reportCreateService', function($http, $localStorage) {
    function reportCreate(id) {
        var promise = $http({
                url: 'http://46.101.87.109/api/v1/devices/' + id + '/serviceLog/create',
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                },
                params: {
                    api_token: $localStorage.apiToken
                }
            })
            .success(function(response, status, headers, config) {
                // console.log(response);
            })
            .error(function(response, status, headers, config) {
                console.log('Something went wrong');
            })
        return promise;
    }
    return {
        reportCreate: reportCreate
    }
})

.factory('requestDetailsService', function($http, $localStorage) {
    function getRequestDetails(id) {
        var promise = $http({
                url: 'http://46.101.87.109/api/v1/serviceRequests/' + id,
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                },
                params: {
                    api_token: $localStorage.apiToken
                }
            })
            .success(function(response, status, headers, config) {
                // console.log(response);
            })
            .error(function(response, status, headers, config) {
                console.log('Something went wrong');
            })
        return promise;
    }
    return {
        getRequestDetails: getRequestDetails
    }
})

.factory('logService', function($http, $localStorage) {
    function log(id) {
        var promise = $http({
                url: 'http://46.101.87.109/api/v1/devices/' + id + '/serviceLog',
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                },
                params: {
                    api_token: $localStorage.apiToken
                }
            })
            .success(function(response, status, headers, config) {
                // console.log(response);
            })
            .error(function(response, status, headers, config) {
                console.log('Something went wrong');
            })
        return promise;
    }
    return {
        log: log
    }
})

.factory('preventiveMaintenanceService', function($http, $localStorage) {
    function preventiveMaintenance(date, completed) {
        console.log(date, completed);
        var promise = $http({
                url: 'http://46.101.87.109/api/v1/preventiveMaintenance/tasks',
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                },
                params: {
                    api_token: $localStorage.apiToken,
                    date: date,
                    completed: completed
                }
            })
            .success(function(response, status, headers, config) {
                // console.log(response);
            })
            .error(function(response, status, headers, config) {
                console.log('Something went wrong');
            })
        return promise;
    }
    return {
        preventiveMaintenance: preventiveMaintenance
    }
})


// customer details
.factory('customerDetailsService', function($http, $localStorage) {
    function customerDetails(id) {
        var promise = $http({
                url: 'http://46.101.87.109/api/v1/customers/' + id,
                method: 'GET',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                },
                params: {
                    api_token: $localStorage.apiToken
                }
            })
            .success(function(response, status, headers, config) {
                // console.log(response);
            })
            .error(function(response, status, headers, config) {
                console.log('Something went wrong');
            })
        return promise;
    }
    return {
        customerDetails: customerDetails
    }
})

.factory('tokenService', function($http, $localStorage) {

    var currPlatform = ionic.Platform.isIOS() ? 1 : 2;

    function postToken(token) {
        var promise = $http({
                url: 'http://46.101.87.109/api/v1/tokens',
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                },
                data: {
                    api_token: $localStorage.apiToken,
                    app_token: token,
                    platform: currPlatform
                }
            })
            .success(function(response, status, headers, config) {
                console.log(response);
            })
            .error(function(response, status, headers, config) {
                console.log('Something went wrong');
            });
        return promise;
    }

    function deleteToken(token) {
        var promise = $http({
                url: 'http://46.101.87.109/api/v1/tokens',
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                },
                data: {
                    api_token: $localStorage.apiToken,
                    app_token: token,
                    platform: currPlatform,
                    _method: "delete"
                }
            })
            .success(function(response, status, headers, config) {
                console.log(response);
            })
            .error(function(response, status, headers, config) {
                console.log(response);
            });
        return promise;
    }

    return {
        postToken: postToken,
        deleteToken: deleteToken
    }
})


.factory('saveLogService', function($http, $localStorage) {
    function saveLog(data, time, id) {
        console.log(
            'api_token: ' + $localStorage.apiToken,
            'description: ' + data.description,
            'service_date: ' + time,
            'complain: ' + data.complain,
            'laborHours: ' + data.laborHours,
            'counters: ' + data.counters,
            'url: ' + 'http://46.101.87.109/api/v1/devices/' + id + '/serviceLog'
        );
        console.log(data.counters);
        var promise = $http({
                url: 'http://46.101.87.109/api/v1/devices/' + id + '/serviceLog',
                method: 'POST',
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                },
                data: {
                    api_token: $localStorage.apiToken,
                    description: data.description,
                    service_date: time,
                    complain: data.complain,
                    laborHours: data.laborHours,
                    counters: data.counters,
                    jobType: data.jobType,
                    payment: data.payment,
                    spu: data.spu
                }
            })
            .success(function(response, status, headers, config) {
                // console.log(response);
            })
            .error(function(response, status, headers, config) {
                console.log(response);
            })
        return promise;
    }
    return {
        saveLog: saveLog
    }
})

.factory('authService', function($http, $localStorage, $state, $ionicLoading) {


    function authenticate(auth) {
        var promise = $http({
                method: 'POST',
                url: 'http://46.101.87.109/api/v1/engineers/auth/login',
                data: { email: auth.email, password: auth.password },
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                }
            })
            .success(function(data, status, headers, config) {
                var role = data.data.role;
                $localStorage.myEmail = data.data.email;
                $localStorage.apiToken = data.data.api_token;
                $localStorage.role = role;
                $localStorage.myUsername = data.data.name;

                if (role !== "TECHNICAL_SUPPORT_ENGINEER") {
                    $localStorage.showitem = false;
                } else {
                    $localStorage.showitem = true;
                }
                // console.log('Залогинелся!');
                // console.log(data.data);
                // $ionicLoading.show({ template: 'Залогинелся!', duration: 3000 });
                $state.go('app.kmedix-home');

            })
            .error(function(data, status, headers, config) {
                console.log(data.meta.error_message);
            });
        return promise;
    };

    function resetPassword(resetData) {
        console.log(
            "api_token " + $localStorage.apiToken,
            "email " + $localStorage.myEmail,
            "password " + resetData.oldPassword,
            "new_password " + resetData.newPassword,
            "new_password_confirmation " + resetData.newPasswordConfirmation
        );
        $http({
                url: "http://46.101.87.109/api/v1/engineers/password/reset",
                method: "PUT",
                headers: {

                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                },
                data: {
                    "api_token": $localStorage.apiToken,
                    "email": $localStorage.myEmail,
                    "password": resetData.oldPassword,
                    "new_password": resetData.newPassword,
                    "new_password_confirmation": resetData.newPasswordConfirmation
                }
            })
            .success(function(data, status, headers, config) {
                console.log('Пароль изменен!');
                $state.go('app.login');
            })
            .error(function(data, status, headers, config) {
                console.log('Пароль НЕ изменен! ERROR!');
                console.log(data.meta.error_message);
            });
    };

    function isAuthenticated() {
        if ($localStorage.apiToken) {
            return true;
        } else {
            // console.log($localStorage);
            return false;
        }
    };

    return {
        authenticate: authenticate,
        resetPassword: resetPassword,
        isAuthenticated: isAuthenticated
    }
})

.factory('completeTaskService', function($http,
    $localStorage,
    $state) {

    function completeTask(id) {
        var promise = $http({
                url: "http://46.101.87.109/api/v1/preventiveMaintenance/tasks/" + id + "/complete",
                method: "PUT",
                headers: {

                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                },
                data: {
                    "api_token": $localStorage.apiToken
                }
            })
            .success(function(data, status, headers, config) {
                console.log(data);
            })
            .error(function(data, status, headers, config) {
                console.log(data);
            });
        return promise;
    }
    return {
        completeTask: completeTask
    }
})

.factory('uncompleteTaskService', function($http,
    $localStorage,
    $state) {

    function uncompleteTask(id) {
        var promise = $http({
                url: "http://46.101.87.109/api/v1/preventiveMaintenance/tasks/" + id + "/uncomplete",
                method: "PUT",
                headers: {

                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                },
                data: {
                    "api_token": $localStorage.apiToken
                }
            })
            .success(function(data, status, headers, config) {
                console.log(data);
            })
            .error(function(data, status, headers, config) {
                console.log(data);
            });
        return promise;
    }
    return {
        uncompleteTask: uncompleteTask
    }
})

// Request attend

.factory('requestAttendService', function($http,
        $localStorage,
        $state,
        $ionicLoading) {

        function requestAttend(id, val) {

            var promise = $http({
                    url: "http://46.101.87.109/api/v1/serviceRequests/" + id + "/attend",
                    method: "PUT",
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                    },
                    data: {
                        "api_token": $localStorage.apiToken,
                        "date": val.toString()
                    }
                })
                .success(function(data, status, headers, config) {
                    console.log(data);
                })
                .error(function(data, status, headers, config) {
                    console.log(data);
                });
            return promise;
        }

        return {
            requestAttend: requestAttend
        }
    })
    // Reschedule

.factory('rescheduleService', function($http,
    $localStorage,
    $state,
    $ionicLoading) {

    function reschedule(id) {
        var promise = $http({
                url: "http://46.101.87.109/api/v1/serviceRequests/" + id + "/reschedule",
                method: "PUT",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                },
                data: { "api_token": $localStorage.apiToken }
            })
            .success(function(data, status, headers, config) {
                // $state.go('app.kmedix-home');
                console.log('rescheduule done!');
                console.log(data);
            })
            .error(function(data, status, headers, config) {
                // console.log('Пароль НЕ изменен! ERROR!');
                console.log(data);
            });
        return promise;
    }

    return {
        reschedule: reschedule
    }
})


.factory('requestSparePartService', function($http,
    $localStorage,
    $state,
    $ionicLoading) {

    function requestSparePart(id) {
        var promise = $http({
                url: "http://46.101.87.109/api/v1/serviceRequests/" + id + "/pending",
                method: "PUT",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                },
                data: { "api_token": $localStorage.apiToken }
            })
            .success(function(data, status, headers, config) {
                // $state.go('app.kmedix-home');
                console.log('rescheduule done!');
                console.log(data);
            })
            .error(function(data, status, headers, config) {
                // console.log('Пароль НЕ изменен! ERROR!');
                console.log(data);
            });
        return promise;
    }

    return {
        requestSparePart: requestSparePart
    }
})

// Request DONE

.factory('requestDoneService', function($http,
    $localStorage,
    $state,
    $ionicLoading) {

    function requestDone(id) {
        console.log(id);
        var promise = $http({
                url: "http://46.101.87.109/api/v1/serviceRequests/" + id + "/complete",
                method: "PUT",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                },
                data: {
                    "api_token": $localStorage.apiToken
                }
            })
            .success(function(data, status, headers, config) {

            })
            .error(function(data, status, headers, config) {
                // console.log('Пароль НЕ изменен! ERROR!');
                console.log(data.meta.error_message);
            });
        return promise;
    }

    return {
        requestDone: requestDone
    }
})


.factory('setLocationService', function($http,
    $localStorage,
    $state,
    $ionicLoading) {

    function setLocation(position, id) {
        // console.log(id);
        var promise = $http({
                url: "http://46.101.87.109/api/v1/customers/" + id + "/location",
                method: "PUT",
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization'
                },
                data: {
                    "api_token": $localStorage.apiToken,
                    "latitude": position.coords.latitude,
                    "longitude": position.coords.longitude
                }
            })
            .success(function(data, status, headers, config) {

            })
            .error(function(data, status, headers, config) {
                // console.log('Пароль НЕ изменен! ERROR!');
                console.log(data.meta.error_message);
            });
        return promise;
    }

    return {
        setLocation: setLocation
    }
})


.service('$cordovaLaunchNavigator', ['$q', function($q) {
    "use strict";

    var $cordovaLaunchNavigator = {};
    $cordovaLaunchNavigator.navigate = function(destination, options) {
        var q = $q.defer(),
            isRealDevice = ionic.Platform.isWebView();

        if (!isRealDevice) {
            q.reject("launchnavigator will only work on a real mobile device! It is a NATIVE app launcher.");
        } else {
            try {

                var successFn = options.successCallBack || function() {},
                    errorFn = options.errorCallback || function() {},
                    _successFn = function() {
                        successFn();
                        q.resolve();
                    },
                    _errorFn = function(err) {
                        errorFn(err);
                        q.reject(err);
                    };

                options.successCallBack = _successFn;
                options.errorCallback = _errorFn;

                launchnavigator.navigate(destination, options);
            } catch (e) {
                q.reject("Exception: " + e.message);
            }
        }
        return q.promise;
    };

    return $cordovaLaunchNavigator;
}])
