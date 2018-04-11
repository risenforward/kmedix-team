angular.module('engineer.controllers', ['ngStorage', 'ngCordova', 'ion-datetime-picker', 'ionic.cloud'])

.controller('changePasswordCtrl', function($scope, authService, $localStorage, $state) {
    $scope.resetPassword = function(resetData) {
        authService.resetPassword(resetData);
    }
})

.controller('EngineerCtrl', function($scope,
    $ionicModal,
    $timeout,
    $ionicPopup,
    authService,
    $localStorage,
    $state,
    $ionicLoading,
    requestListService,
    requestDetailsService,
    requestAttendService,
    requestDoneService,
    logService,
    rescheduleService,
    customerDetailsService,
    getDevicesService,
    deviceDetailsService,
    clinicInstallDevicesService,
    reportCreateService,
    saveLogService,
    $cordovaLaunchNavigator,
    preventiveMaintenanceService,
    completeTaskService,
    uncompleteTaskService,
    setLocationService,
    $cordovaGeolocation,
    mapService,
    requestSparePartService,
    $ionicPush,
    tokenService,
    $ionicSideMenuDelegate,
    $ionicViewService,
    $cordovaPushV5,
    $rootScope

) {


    // $scope.showMenuIcon = true;


    // $scope.myGoBack = function() {
    //     $ionicHistory.goBack();
    // };
    $scope.enableMenuWithBackViews = false;


    // $scope.$on('$ionicView.enter', function() {
    //     $ionicSideMenuDelegate.canDragContent(false);
    // });



    // $scope.$on('$ionicView.afterEnter', function() {
    //     setTimeout(function() {
    //         document.getElementById("custom-overlay").classList.add("removesplashscreen");
    //         document.getElementById("custom-overlay").style.display = "none";
    //     }, 3500);
    // });


    $rootScope.$on('$cordovaPushV5:notificationReceived', function(event, data) {
        console.log(data);
        if (data.title !== "") {
            $ionicLoading.show({ template: data.title + ': ' + data.message, duration: 4000 });
        } else {
            $ionicLoading.show({ template: data.message, duration: 4000 });
        }
    });

    // $scope.$on('cloud:push:notification', function(event, data) {
    //     var msg = data.message;
    //     $ionicLoading.show({ template: msg.title + ': ' + msg.text, duration: 4000 });
    // });



    $scope.irotate = false;
    $scope.reverse = true;

    $scope.sortBy = function(propertyName) {
        if (propertyName === 'device') {
            $scope.irotate1 = !$scope.irotate1;
        }
        if (propertyName === 'customer.clinic_name') {
            $scope.irotate2 = !$scope.irotate2;
        }

        $scope.reverse = ($scope.propertyName === propertyName) ? !$scope.reverse : false;
        $scope.propertyName = propertyName;
    };

    $scope.preventiveMaintenancePopup = function() {
        var clinicPopup = $ionicPopup.confirm({
            title: 'Preventive Maintenance Date',
            templateUrl: 'templates/preventiveMaintenancePopup.html',
            cssClass: 'preventiveMaintenancePopup',
            scope: $scope,
            buttons: [{
                    text: 'OK',
                    onTap: function(e) {
                        return true;
                    }
                },
                {
                    text: 'Cancel',
                    onTap: function(e) {
                        return true;
                    }
                },
            ]
        });

        clinicPopup.then(function(res) {
            if (res) {

            } else {
                // console.log('1801110');
            }
        });
    }



    $scope.requestSparePart = function(id) {
        requestSparePartService.requestSparePart(id)
            .then(function(res) {
                // console.log(res.data.data);
                $scope.getRequestList();
                // $scope.getRequestDetails(res.data.data.id);
                $state.go('app.kmedix-home');
            });
    }



    $scope.customerMap = false;

    $scope.setLocation = function() {
        var posOptions = { timeout: 10000, enableHighAccuracy: false };
        console.log($scope.responseArr);
        $cordovaGeolocation.getCurrentPosition(posOptions)
            .then(function(position) {
                setLocationService.setLocation(position, $scope.responseArr.idCustomer)
                    .then(function(res) {

                        $scope.customerMap = true;

                        console.log(res.data.data.location);
                        $ionicLoading.show({ template: 'Location Saved', duration: 2000 });
                        if (res.data.data.location) {
                            $scope.customerMap = true;
                            $scope.lat = res.data.data.location.latitude;
                            $scope.lng = res.data.data.location.longitude;
                        } else {
                            $scope.lat = false;
                            $scope.lng = false;
                        }
                    })
                    .then(function() {
                        window.history.back();
                        $ionicLoading.show({ template: 'Location saved', duration: 2000 });
                        $scope.initMap($scope.lat, $scope.lng);
                    });
            }, function(err) {
                console.log(err);
            });
    }

    // $ionicModal.fromTemplateUrl('templates/nav-modal.html', {
    //     scope: $scope
    // }).then(function(modal) {
    //     $scope.modal = modal;
    // });


    $ionicModal.fromTemplateUrl('templates/modal-images.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.popupImages = function() {
        if ($scope.responseArr.images.length == 0) {
            $ionicLoading.show({ template: 'There are no images', duration: 2000 });
            return;
        }
        $scope.modal.show();
    };

    $scope.updateSelection = function($event, id) {
        // console.log($event, id);

        var checkbox = $event.target;
        var action = (checkbox.checked ? 'complete' : 'open');

        console.log(action, id);

        if (action == 'complete') {
            completeTaskService.completeTask(id)
                .then(function(res) {
                    // $scope.preventiveMaintenanceData = res.data.data;
                    console.log(res.data.data);
                });
        }

        if (action == 'open') {
            uncompleteTaskService.uncompleteTask(id)
                .then(function(res) {
                    // $scope.preventiveMaintenanceData = res.data.data;
                    console.log(res.data.data);
                });
        }



    }

    $scope.preventiveMaintenance = function(date, tasks) {

        var d = date.toLocaleString(),
            completed = '2';
        if (tasks == "Pending Tasks") {
            completed = '0';
        } else if (tasks == "Completed Tasks") {
            completed = '1';
        }


        console.log(date, tasks);
        $scope.currSelectTask = tasks ? tasks : "All Tasks";
        preventiveMaintenanceService.preventiveMaintenance(d, completed)
            .then(function(res) {
                $scope.preventiveMaintenanceData = res.data.data;
                console.log(res.data.data);
            });
    }

    // ------ nav system
    // $scope.formData = {
    //     dest: "Westminster, London, UK"
    // };
    // $scope.$watch('formData', function(formData) {
    //     if (formData.start != "custom" || formData.custom_start) {
    //         $('#start .custom input').removeClass('error');
    //     }
    //     if (formData.dest != "custom" || formData.custom_dest) {
    //         $('#dest .custom input').removeClass('error');
    //     }
    // }, true);


    $scope.tokenPush = $localStorage.tokenPush;


    $scope.navigate = function() {

        // // Validate
        // if ($scope.formData.start == "custom" && !$scope.formData.custom_start) {
        //     $('#start .custom input').addClass('error');
        //     return;
        // }

        // if ($scope.formData.dest == "custom" && !$scope.formData.custom_dest) {
        //     $('#dest .custom input').addClass('error');
        //     return;
        // }

        var dest = $scope.lat + ', ' + $scope.lng;
        $cordovaLaunchNavigator.navigate(dest, {
            start: "",
            enableDebug: true
        }).then(function() {
            // alert("Navigator launched");
        }, function(err) {
            console.log(err);
        });
    };


    // ------ nav system

    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>



    function getMonth(n) {
        var m;
        switch (n) {
            case 1:
                m = 'January';
                break;
            case 2:
                m = 'February';
                break;
            case 3:
                m = 'March';
                break;
            case 4:
                m = 'April';
                break;
            case 5:
                m = 'May';
                break;
            case 6:
                m = 'June';
                break;
            case 7:
                m = 'July';
                break;
            case 8:
                m = 'August';
                break;
            case 9:
                m = 'September';
                break;
            case 10:
                m = 'October';
                break;
            case 11:
                m = 'November';
                break;
            case 12:
                m = 'December';
                break;
        }
        return m;
    }

    function setMonth(n) {
        var m;
        switch (n) {
            case 'January':
                m = 1;
                break;
            case 'February':
                m = 2;
                break;
            case 'March':
                m = 3;
                break;
            case 'April':
                m = 4;
                break;
            case 'May':
                m = 5;
                break;
            case 'June':
                m = 6;
                break;
            case 'July':
                m = 7;
                break;
            case 'August':
                m = 8;
                break;
            case 'September':
                m = 9;
                break;
            case '1October':
                m = 10;
                break;
            case '1November':
                m = 11;
                break;
            case '1December':
                m = 12;
                break;
        }
        return m;
    }

    $scope.dateNow = new Date();


    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    $scope.pmMonth = getMonth($scope.dateNow.getMonth() + 1);

    $scope.plusMonth = function() {
        $scope.pmMonth = getMonth(setMonth($scope.pmMonth) + 1);
    }

    $scope.minusMonth = function() {
        $scope.pmMonth = getMonth(setMonth($scope.pmMonth) - 1);
    }

    // todo - доделать этот попап!!!!





    // $scope.pmYear = $scope.dateNow.getFullYear();

    // $scope.dateNow.UTC();

    // var Xmas95 = new Date('December 25, 1995 23:15:30');
    // var day = Xmas95.getDate();


    // console.log($scope.dateNow);

    // console.log($scope.pmMonth);

    // console.log($scope.pmYear);
    // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    $scope.saveLog = function(data, time, id) {
        data.spu = $scope.personalDetails;
        console.log(data, time, id);
        if(!data) return true;

        data.laborHours = data.laborHours.toString();
          console.log(data, time, id);
        var clinicPopup = $ionicPopup.confirm({
            title: 'Service Report',
            template: `
                <div class="areyousure-popup">
                    <p>Are you sure?</p>
                </div>
            `,
            cssClass: 'wrapper-areyousure-popup',
            scope: $scope,
            buttons: [{
                    text: 'Yes',
                    onTap: function(e) {
                        saveLogService.saveLog(data, time, id)
                            .then(function(res) {
                                // clear view
                                $scope.addServiceReportData = { 'jobType' : "Repair" , 'laborHours' : 0  , 'payment' : "warranty"};
                                $scope.logData = res.data.data;
                                console.log($scope.logData);
                                $state.go('app.device-service-log');
                            });


                        return true;
                    }
                },
                {
                    text: 'No',
                    onTap: function(e) {
                        return true;
                    }
                },
            ]
        });


    }


    // 14
    $scope.reportCreate = function(id) {
        reportCreateService.reportCreate(id)
            .then(function(res) {
                $scope.reportCreateData = res.data.data;
                console.log(res.data.data);
                $state.go('app.add-service-report');
            });
    }


    $scope.clinicInstallDevices = function(id) {
        clinicInstallDevicesService.clinicInstallDevices(id)
            .then(function(res) {
                $scope.clinicInstallDevicesData = res.data.data;
                $state.go('app.devices-current');
            });
    }


    $scope.initMap = function(latitude, longitude) {
        if (latitude == false || longitude == false) {
            $scope.showCustomerMap = false;
            $scope.showCustomerStartNav = false;
            console.log('close map');
            return;
        } else {
            $scope.showCustomerMap = true;
            $scope.showCustomerStartNav = true;
        }
        console.log(latitude, longitude);
        mapService.gmap(latitude, longitude);
    }




    $scope.getCusomerLogoAndName = function(id) {
        customerDetailsService.customerDetails(id)
            .then(function(res) {
                $scope.currCusomerLogo = res.data.data.image_url;
                $scope.currCusomerName = res.data.data.clinic_name;
            })
    }



    // customerDetailsService
    $scope.customerDetails = function(id) {
        console.log($scope.responseArr);
        $scope.responseArr = {};
        $scope.responseArr.idCustomer = id;
        customerDetailsService.customerDetails(id)
            .then(function(res) {
                $scope.customerDetailsData = res.data.data;

                console.log('>>');
                console.log($scope.customerDetailsData);

                if (res.data.data.active == 1) {
                    $scope.customerDetailsBlock = false;
                } else {
                    $scope.customerDetailsBlock = true;
                }



                if (res.data.data.location) {
                    $scope.customerMap = true;
                    $scope.lat = res.data.data.location.latitude;
                    $scope.lng = res.data.data.location.longitude;
                } else {
                    $scope.lat = false;
                    $scope.lng = false;
                }
            })
            .then(function() {
                $state.go('app.customer-details');
            });
    }




    // log
    $scope.log = function(id) {
        logService.log(id).then(function(res) {
            $scope.logData = res.data.data;
            console.log($scope.logData);
            $state.go('app.device-service-log');
        });
    }


    //  done request

    $scope.areYouSure = function(id) {
        var clinicPopup = $ionicPopup.confirm({
            title: 'Clinic',
            template: `
                <div class="areyousure-popup">
                    <p>Are you sure?</p>
                </div>
            `,
            cssClass: 'wrapper-areyousure-popup',
            scope: $scope,
            buttons: [{
                    text: 'Yes',
                    onTap: function(e) {
                        requestDoneService.requestDone(id)
                            .then(function(res) {
                                $scope.getRequestList();
                                // // console.log(res.data.data);
                                // if (res.data.data.status_name = "Completed") {
                                //     $scope.getRequestDetails(res.data.data.id);
                                // }

                                $state.go('app.kmedix-home');

                            });
                        return true;
                    }
                },
                {
                    text: 'No',
                    onTap: function(e) {
                        return true;
                    }
                },
            ]
        });

        clinicPopup.then(function(res) {
            if (res) {

            } else {
                // console.log('1801110');
            }
        });

    }


    $scope.reschedule = function(id) {
        var clinicPopup = $ionicPopup.confirm({
            title: 'Clinic',
            template: `
                <div class="areyousure-popup">
                    <p>Are you sure?</p>
                </div>
            `,
            cssClass: 'wrapper-areyousure-popup',
            scope: $scope,
            buttons: [{
                    text: 'Yes',
                    onTap: function(e) {
                        rescheduleService.reschedule(id)
                            .then(function(res) {
                                $scope.getRequestList();
                                $state.go('app.kmedix-home');
                            });


                        return true;
                    }
                },
                {
                    text: 'No',
                    onTap: function(e) {
                        return true;
                    }
                },
            ]
        });

        clinicPopup.then(function(res) {
            if (res) {

            } else {
                // console.log('1801110');
            }
        });

    }


    $scope.requestDone = function(id) {
        console.log(id);
        $scope.areYouSure(id);
    }

    $scope.$storage = $localStorage;



    $scope.disabledStartNav = false;
    $scope.disabledReschedule = true;
    $scope.disabledAttend = false;

    $scope.disabledCompleted = true;


    $scope.popup = function() {
        $scope.showCustomerMap = true;
        console.log('open map');
        var clinicPopup = $ionicPopup.confirm({
            // template: '<input type="password" ng-model="data.wifi">',
            title: 'Clinic',
            templateUrl: 'templates/open-popup.html',
            cssClass: 'open-popup',
            scope: $scope,
            buttons: [{
                    text: $scope.responseArr.phonenumber,
                    type: 'popup-btn',
                    onTap: function() {
                        window.open('tel:' + $scope.responseArr.phonenumber);
                    }
                },
                {
                    text: 'Open',
                    type: 'popup-btn',
                    onTap: function() {
                        // console.log($scope.responseArr.idCustomer);
                        $scope.customerDetails($scope.responseArr.idCustomer);
                    }
                },
            ]
        });

        clinicPopup.then(function(res) {
            if (res) {
                // console.log('open');
            } else {
                // console.log('1801110');
            }
        });
    }


    $scope.getDevices = function() {
        getDevicesService.getDevices()
            .then(function(res) {
                console.log(res.data.data);
                $scope.allDevices = res.data.data.devices;
            });
    }

    $scope.deviceDetails = function(id) {
        deviceDetailsService.deviceDetails(id)
            .then(function(res) {
                console.log(res);
                $scope.deviceDetailsData = res.data.data;
                $scope.deviceDetailsData.clinicId = res.data.data.clinic_id ? res.data.data.clinic_id : 1;
                if ($scope.deviceDetailsData.active == 1) {
                    $scope.deviceDetailsData.blocked = false;
                } else {
                    $scope.deviceDetailsData.blocked = true;
                }

                if ($scope.checkDate($scope.deviceDetailsData.warranty_end_at)) {
                    $scope.deviceDetailsData.warranty_end = false;
                } else {
                    $scope.deviceDetailsData.warranty_end = true;
                }
                if($scope.deviceDetailsData.consumable_warranty_end_at )
                {
                  if ($scope.checkDate($scope.deviceDetailsData.consumable_warranty_end_at)) {
                    $scope.deviceDetailsData.consumable_warranty_end = false;
                  } else {
                    $scope.deviceDetailsData.consumable_warranty_end = true;
                  }
                }
              if($scope.deviceDetailsData.contract_level)
              {
                $scope.deviceDetailsData.hasContract = true;
                if ($scope.checkDate($scope.deviceDetailsData.extended_warranty_end_at)) {
                    $scope.deviceDetailsData.contract_end = false;
                } else {
                    $scope.deviceDetailsData.contract_end = true;
                }
              }
                console.log($scope.deviceDetailsData);

                $state.go('app.device-details');
            });
    }

$scope.checkDate = function(dd) {

  var temp1 = "";
var temp2 = "";

var str1 = dd;

var dt1  = str1.substring(0,2);
var mon1 = str1.substring(3,5);
var yr1  = str1.substring(6,10);

temp1 = mon1 + "/" + dt1 + "/" + yr1;

var cfd = Date.parse(temp1);

var date1 = new Date(cfd);
var date2 = new Date();
console.log(date1.toLocaleString());
if(date1 < date2) {
    return false;
}
else {
  return true;
}
}

    $scope.customerDetailsBlock = true;

    $scope.clickTest = function() {
        console.log('Works!');
    }

    $scope.devices = [
        { serialno: "dev12300000", type: "Duetto Model Abc", clinic: "DAR Alshifa" },
        { serialno: "dev45600000", type: "Duetto Model Xyz", clinic: "DAR Alshifa" },
        { serialno: "dev12300000", type: "Duetto Model Abc", clinic: "DAR Alshifa" },
        { serialno: "dev45600000", type: "Duetto Model Rrr", clinic: "DAR Alshifa" },
        { serialno: "dev17800000", type: "Duetto Model Abc", clinic: "DAR Alshifa" },
        { serialno: "dev12300000", type: "Duetto Model Abc", clinic: "DAR Alshifa" },
        { serialno: "dev17800000", type: "Duetto Model Abc", clinic: "DAR Alshifa" },
        { serialno: "dev12300000", type: "Duetto Model Fff", clinic: "DAR Alshifa" },
    ];

    $scope.devicestwo = [
        { device: "Duetto v2", clinic: "DAR Alshifa", checked: false },
        { device: "XDev n100", clinic: "DAR Alshifa2", checked: true },
        { device: "Duetto v3", clinic: "DAR Alshifa3", checked: true },
        { device: "Duetto v4", clinic: "DAR Alshifa", checked: false },
        { device: "XDev n100", clinic: "DAR Alshifa", checked: true },
        { device: "Duetto v2", clinic: "DAR Alshifa2", checked: true },
        { device: "Duetto v1", clinic: "DAR Alshifa", checked: false },
        { device: "XDev n100", clinic: "DAR Alshifa3", checked: true }
    ];

    $scope.search = function() {
        if (($scope.devices.serialno == $scope.searchCustomer) && ($scope.devices.type == $scope.searchType)) {
            return true;
        }
        return false;
    }


    $scope.types = [
        { type: 'Lasik' },
        { type: 'Duettu' },
        { type: 'Multifunction lasylaser' },
    ];
    // $scope.devices = [
    //     { image: 'img/clinic.png', name: 'DEV45509010 Duetto Device', type: 'Lasik' },
    //     { image: 'img/clinic.png', name: 'DEV45509010 Duetto Device', type: 'Lasik' },
    //     { image: 'img/clinic.png', name: 'DEV45509010 Duetto Device', type: 'Lasik' },
    //     { image: 'img/clinic.png', name: 'DEV45509020 Duetto Device', type: 'Duettu' },
    //     { image: 'img/clinic.png', name: 'DEV45509020 Duetto Device', type: 'Duettu' },
    //     { image: 'img/clinic.png', name: 'DEV45509030 Duetto Device', type: 'Multifunction lasylaser' }
    // ];
    $scope.currType = '';
    $scope.currSelect = 'All types';
    $scope.changeType = function(newType) {
        if (newType === '') {
            $scope.currSelect = 'All types';
            $scope.currType = newType;
        } else {
            $scope.currSelect = newType;
            $scope.currType = newType;
        }
    }
    $scope.custom = true;
    $scope.toggleCustom = function() {
        $scope.custom = $scope.custom === false ? true : false;
    };


    // auth
    $scope.signOut = function() {
        $ionicViewService.clearHistory();
        $scope.unregisterNotifications();
        $state.go('app.login');
    }

    $scope.myEmail = $localStorage.myEmail;
    $scope.myUsername = $localStorage.myUsername;
    $scope.myLogo = $localStorage.myLogo;

    $scope.ch = $localStorage.ch;

    // $scope.registerNotifications = function() {
    //     console.log('prepare to register');
    //     $ionicPush.register().then(function(t) {
    //         return $ionicPush.saveToken(t);
    //     }).then(function(t) {
    //         console.log(t.token)
    //         $localStorage.appToken = t.token;
    //         tokenService.postToken(t.token)
    //             .then(function(res) {
    //                 console.log(res);
    //                 $localStorage.ch = true;
    //                 $scope.ch = true;
    //                 console.log('push registred!');
    //             }, function() {
    //                 $scope.ch = false;
    //                 $localStorage.ch = false;

    //             });
    //     });
    // }

    $scope.registerNotifications = function() {
        var options = {
            android: {
                senderID: "793381233959"
            },
            ios: {
                alert: "true",
                badge: "true",
                sound: "true"
            },
            windows: {}
        };

        $cordovaPushV5.initialize(options)
            .then(function() {
                $cordovaPushV5.onNotification();
                $cordovaPushV5.onError();
                $cordovaPushV5.register()
                    .then(function(t) {
                        console.log(t);
                        $localStorage.appToken = t;
                        tokenService.postToken(t)
                            .then(function(res) {
                                console.log(res);
                                $localStorage.ch = true;
                                $scope.ch = true;
                                console.log('push registred!');
                            });
                    })
            });
    }


    $scope.unregisterNotifications = function() {
        console.log('prepare to unregister');
        console.log($localStorage.appToken);
        var options = ['793381233959'];

        $cordovaPushV5.unregister(options).then(function() {
            return tokenService.deleteToken($localStorage.appToken)
        }).then(function(res) {
            $localStorage.appToken = false;
            $localStorage.apiToken = null;
            $localStorage.role = null;
            $localStorage.myUsername = null;
            $localStorage.myLogo = null;
            $localStorage.showitem = null;
            $scope.myUsername = '';
            $localStorage.myEmail = null;
            $scope.myEmail = null;
            $localStorage.ch = false;
            $scope.ch = false;
            console.log('push unregistred!');
            console.log('разлогинился!');
        }, function() {
            $localStorage.appToken = false;
            $localStorage.apiToken = null;
            $localStorage.role = null;
            $localStorage.myUsername = null;
            $localStorage.myLogo = null;
            $localStorage.showitem = null;
            $scope.myUsername = '';
            $localStorage.myEmail = null;
            $scope.myEmail = null;
            $localStorage.ch = false;
            $scope.ch = false;
            console.log('разлогинился!');
        });
    }


    $scope.toggleNotifications = function(ch) {
        console.log(ch);
        if (ch) {
            console.log('prepare to register');
            //---------------------
            var options = {
                android: {
                    senderID: "793381233959"
                },
                ios: {
                    alert: "true",
                    badge: "true",
                    sound: "true"
                },
                windows: {}
            };

            $cordovaPushV5.initialize(options)
                .then(function() {
                    $cordovaPushV5.onNotification();
                    $cordovaPushV5.onError();
                    $cordovaPushV5.register()
                        .then(function(t) {
                            console.log(t.token)
                            $localStorage.appToken = t.token;
                            tokenService.postToken(t.token)
                                .then(function(res) {
                                    console.log(res);
                                    $localStorage.ch = true;
                                    $scope.ch = true;
                                    console.log('push registred!');
                                }, function() {
                                    $scope.ch = false;
                                    $localStorage.ch = false;
                                });
                        })
                });

            //-------------------
            // $ionicPush.register().then(function(t) {
            //     return $ionicPush.saveToken(t);
            // }).then(function(t) {
            //     console.log(t.token)
            //     $localStorage.appToken = t.token;
            //     tokenService.postToken(t.token)
            //         .then(function(res) {
            //             console.log(res);
            //             $localStorage.ch = true;
            //             $scope.ch = true;
            //             console.log('push registred!');
            //         }, function() {
            //             $scope.ch = false;
            //             $localStorage.ch = false;
            //         });
            // });





        } else {
            console.log('prepare to unregister');

            var options = {
                android: {
                    senderID: "793381233959"
                },
                ios: {
                    alert: "true",
                    badge: "true",
                    sound: "true"
                },
                windows: {}
            };




            $cordovaPushV5.unregister(options).then(function() {
                return tokenService.deleteToken($localStorage.appToken)
            }).then(function(res) {
                $localStorage.appToken = false;
                $localStorage.ch = false;
                $scope.ch = false;
                console.log('push unregistred!');
                console.log('разлогинился!');
            }, function() {
                $scope.ch = true;
                $localStorage.ch = true;
            });
        }
    }

    $scope.login = function(auth) {
        $ionicViewService.clearHistory();
        if (auth) {
            // console.log(auth);
            authService.authenticate(auth)
                .then(function(res) {
                    console.log(res);
                    $scope.myEmail = $localStorage.myEmail
                    $scope.myUsername = $localStorage.myUsername;
                    $scope.myLogo = $localStorage.myLogo;
                    $scope.registerNotifications();
                }, function(error) {
                    $ionicLoading.show({ template: 'Incorrect login or password', duration: 2000 });
                });
        } else {
            $ionicLoading.show({ template: 'Enter login and password', duration: 2000 });
        }
    }

    //  get requests list
    $scope.getRequestList = function() {
        requestListService.getRequestList()
            .then(function(res) {
                $scope.assigned = res.data.data.assigned;

                console.log(res.data.data);
                // console.log(res.data.data.assigned);




                // $scope.assigned = res.data.data.assigned.filter(function(obj) {
                //     if (obj.status_name !== 'Completed') {
                //         return true;
                //     }
                // });

                // console.log($scope.assigned);




                $scope.unassigned = res.data.data.not_assigned;
            });
    }



    $scope.consumableWarrantyShow = true;

    // get request details
    $scope.getRequestDetails = function(id) {
        requestDetailsService.getRequestDetails(id)
            .then(function(res) {
                console.log(res);
                $scope.responseArr = {};
                $scope.responseArr.serial = res.data.data.device.serial_number;
                $scope.responseArr.model = res.data.data.device.model;
                $scope.responseArr.model = res.data.data.device.model;
                $scope.responseArr.date = res.data.data.device.install_date;
                $scope.responseArr.warranty = res.data.data.device.warranty_end_at;

                if ($scope.checkDate($scope.responseArr.warranty)) {
                    $scope.responseArr.warranty_end = false;
                } else {
                    $scope.responseArr.warranty_end = true;
                }
                if (res.data.data.device.consumable_warranty_end_at !== false) {
                    $scope.responseArr.consumableWarranty = res.data.data.device.consumable_warranty_end_at;
                    $scope.consumableWarrantyShow = true;

                      if ($scope.checkDate($scope.responseArr.consumableWarranty)) {
                        $scope.responseArr.consumable_warranty_end = false;
                      } else {
                        $scope.responseArr.consumable_warranty_end = true;
                      }

                } else {
                    $scope.consumableWarrantyShow = false;
                }

                $scope.responseArr.contract_level = res.data.data.device.contract_level;
                $scope.responseArr.extended_warranty_end_at = res.data.data.device.extended_warranty_end_at;
                if($scope.responseArr.contract_level)
                {
                  $scope.responseArr.hasContract = true;
                  if ($scope.checkDate($scope.responseArr.extended_warranty_end_at)) {
                      $scope.responseArr.contract_end = false;
                  } else {
                      $scope.responseArr.contract_end = true;
                  }
                }

                $scope.responseArr.description = res.data.data.description;
                $scope.responseArr.clinicname = res.data.data.customer.clinic_name;
                $scope.responseArr.phonenumber = res.data.data.customer.phone_number;
                $scope.responseArr.img = res.data.data.device.image_url;
                $scope.responseArr.id = res.data.data.id;
                $scope.responseArr.idDevice = res.data.data.device.id;
                $scope.responseArr.idCustomer = res.data.data.customer.id / 1;
                $scope.responseArr.images = res.data.data.images;
                // console.log(res.data.data);
                //++mye
                if (res.data.data.attended) {
                    $scope.responseArr.attendedDate = res.data.data.attended.date;
                }
                else{
                    $scope.responseArr.attendedDate = 'Unknown';
                }
                if (res.data.data.customer.location) {
                    $scope.showCustomerMap = true;
                    $scope.showCustomerStartNav = true;
                    $scope.lat = res.data.data.customer.location.latitude;
                    $scope.lng = res.data.data.customer.location.longitude;
                } else {
                    $scope.showCustomerMap = false;
                    $scope.showCustomerStartNav = false;
                }


                if (res.data.data.customer.active == 1) {
                    $scope.responseArr.blocked = false;
                } else {
                    $scope.responseArr.blocked = true;
                }

                if (res.data.data.status_name == "Unassigned") {
                    $state.go('app.request-details-unassigned');
                } else if (res.data.data.status_name == "Pending") {
                    $state.go('app.request-details-pending');
                } else if (res.data.data.status_name == "Completed") {
                    $state.go('app.request-details-completed');
                } else {
                    $state.go('app.request-details-assigned');
                }
                console.log(res.data.data.status_name);
                $scope.getCusomerLogoAndName($scope.responseArr.idCustomer);
            });
    }

    $scope.currentDate = new Date();
    $scope.minDate = new Date(2105, 6, 1);
    $scope.maxDate = new Date(2015, 6, 31);

    // $scope.datePickerCallback = function(val) {
    //     if (!val) {
    //         $ionicLoading.show({ template: 'Please pick a date and a time', duration: 2000 });
    //         // console.log($scope.responseArr.id);
    //     } else {
    //         // requestAttendService.requestAttend(id, val)
    //         //     .then(function () {
    //         //         console.log('All done. You can check it.');
    //         //     })

    //         console.log('Selected date is : ', val);
    //         // console.log($scope.responseArr.id);
    //     }
    // };

    // $scope.$watch('datetimeValue', function() {
    //     console.log('New value: ' + $scope.datetimeValue);
    // });

    $scope.requestAttend = function(id, val) {
        function addHours(date, h){
            date.setHours(date.getHours()+h);
            return date;
        }

        requestAttendService.requestAttend(id, addHours(val, 3).toISOString())
            .then(function(res) {
                $scope.getRequestList();
                // $scope.getRequestDetails(res.data.data.id);
                $state.go('app.kmedix-home');
            })
    }
    $scope.addServiceReportData = { 'jobType' : "Repair" , 'laborHours' : 0  , 'payment' : "warranty"};
    $scope.jobType = [
        "Repair", "Preventive maintenance"
    ];

    $scope.payment = [
        "will be billed", "warranty", "contract", "F.O.C"
    ];

    $scope.personalDetails = [
        {
            'qty':'',
            'partno':'',
            'desc':''
        },
    ];

    $scope.addNew = function(personalDetail){
        $scope.personalDetails.push({
            'qty': "",
            'partno': "",
            'desc': "",
        });
    };

    $scope.remove = function(){
        var newDataList=[];
        $scope.selectedAll = false;
        angular.forEach($scope.personalDetails, function(selected){
            if(!selected.selected){
                newDataList.push(selected);
            }
        });
        $scope.personalDetails = newDataList;
    };

    $scope.checkAll = function () {
        if (!$scope.selectedAll) {
            $scope.selectedAll = true;
        } else {
            $scope.selectedAll = false;
        }
        angular.forEach($scope.personalDetails, function(personalDetail) {
            personalDetail.selected = $scope.selectedAll;
        });
    };

    $scope.view_pdf = function (url) {
        if (ionic.Platform.isAndroid()) {
            url = 'https://docs.google.com/viewer?url=' + encodeURIComponent(url);
        }
        var ref = window.open(url, '_self', 'location=no');
    };

})

/*  DELETE THIS JUST FOR TESTS  */
.controller('testCtrl', ['$scope', function($scope) {
    $scope.items = [
        { name: 'Preventive maintenance' },
        { name: 'Change 1 part' },
        { name: 'Preventive maintenance' },
        { name: 'Preventive maintenance' }
    ];

    $scope.toggle = false;
}]);
