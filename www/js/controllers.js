// New stand Alone
"use strict"

var app = angular.module('proweaver.controllers',['ngCordova']);

app.run(function(){/*some code here*/})


.controller('menuCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth','$cordovaToast', '$cordovaLocalNotification', '$interval',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth, $cordovaToast, $cordovaLocalNotification, $interval)
{ 
  
  var isLogged = Auth.FETCH_DATA('userid');
  $scope.name = isLogged.profile_firstname;
  $scope.userlog = isLogged.user;
  $scope.company_name = isLogged.company_name;

  /* initialize menu */
    $rootScope.initializeMenu = function()
    {
      if(isLogged.user == 'business')
      {
        $scope.getPending();
      }
    }
    $scope.getPending = function()
    {
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getPendingBooking";
      obj.data   = new FormData();
      obj.data.append('provider_id',isLogged.provider_id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                                if(success.data != 0)
                                {
                                  $scope.pending = success.data.length;
                                  $ionicLoading.hide();
                                }
                                else
                                {
                                  $scope.pending = 0;
                                  $ionicLoading.hide();
                                }
                            },
                            function(error) {
                                console.log(error);
                              }
                            );
    }
  /* /. */

  $scope.myAccount = function()
  {
    $scope.activeTab = 'myAccount';
    window.location.href="#/menu/myAccount";
  }

  $scope.calendar = function()
  {
    $scope.activeTab = 'calendar';
    window.location.href="#/menu/calendar";
  }

  $scope.invoice = function()
  {
    $scope.activeTab = 'invoice';
    window.location.href="#/menu/invoice";
  }

  $scope.logout = function()
  {
    $ionicLoading.show({
      template: 'Logging Out <br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
    });
    $cordovaLocalNotification.cancel(1).then(function (result) {
      // ...
    });
    setTimeout(function(){
      // $rootScope.showToast("Thank You");
      Auth.STORE_DATA('userid', '');
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
      window.location.href = '#/login';
      $ionicLoading.hide();
    },3000);
  }

  /* initialize menu */
    $rootScope.initializeMenu();
  /* /. */
}])

.controller('loginCtrl',['$scope','$rootScope','$ionicLoading','$ionicModal','$ionicPlatform','Auth','$cordovaToast', '$ionicActionSheet', '$cordovaLocalNotification',
                function($scope,  $rootScope,  $ionicLoading,  $ionicModal,  $ionicPlatform,  Auth, $cordovaToast,  $ionicActionSheet, $cordovaLocalNotification) 
{
  
  // Variables Area
    $scope.user          = []; 
    $scope.property      = []; 
    $scope.user.email     = '';
    $scope.user.pass     = '';
    var backbutton=0;
    var clicked = false;
    $rootScope.backButtonPressedOnceToExit = false;
  // Variables Area ENDS

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */

  // Login Starts 
    $scope.login = function(loginCredentials)
    {
      if(loginCredentials.$valid)
      {
        $ionicLoading.show({
          template: 'Logging In <br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
        });
        var obj    = new Object();
        obj.method = 'POST';
        obj.url    = $rootScope.baseURL + "?func=userLogin ";
        obj.data   = new FormData();
        obj.data.append('email',$scope.user.email);
        obj.data.append('password',$scope.user.pass);
        obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
        obj.params = {};
        Auth.REQUEST(obj).then(function(success) {
                                if(success.data == '0')
                                {
                                  $rootScope.showToast('Incorrect Email/Password');
                                  $ionicLoading.hide();
                                }
                                else
                                {
                                  setTimeout(function(){
                                    if(success.data.user == 'personal')
                                    {
                                      var usr = new Object();
                                      usr.user = success.data.user;
                                      usr.account_id = success.data.data[0].account_id;
                                      usr.property_name = success.data.data[0].property_name;
                                      usr.property_address = success.data.data[0].property_address;
                                      usr.property_postal_code = success.data.data[0].property_postal_code;
                                      usr.property_phone = success.data.data[0].property_phone;
                                      usr.property_email = success.data.data[0].property_email;
                                      usr.card_name = success.data.data[0].card_name;
                                      usr.card_number = success.data.data[0].card_number;
                                      usr.card_start_date = success.data.data[0].card_start_date;
                                      usr.card_end_date = success.data.data[0].card_end_date;
                                      usr.card_issue_number = success.data.data[0].card_issue_number;
                                      usr.profile_email = success.data.data[0].profile_email;
                                      usr.profile_key = success.data.data[0].profile_key;
                                      usr.profile_firstname = success.data.data[0].profile_firstname;
                                      usr.profile_lastname = success.data.data[0].profile_lastname;
                                      usr.remember = true;
                                      $rootScope.isLogged = true;
                                      $scope.login_modal.hide();
                                      Auth.STORE_DATA('userid',usr);
                                      window.location.href = "#/menu/calendar";
                                    }
                                    else if(success.data.user == 'business')
                                    {
                                      if(success.data.data[0].status == 'active')
                                      {
                                        var usr = new Object();
                                        usr.user = success.data.user;
                                        usr.provider_id = success.data.data[0].provider_id;
                                        usr.company_name = success.data.data[0].company_name;
                                        usr.latitude = success.data.data[0].latitude;
                                        usr.longitude = success.data.data[0].longitude;
                                        usr.phone = success.data.data[0].phone;
                                        usr.property_email = success.data.data[0].property_email;
                                        usr.email = success.data.data[0].email;
                                        usr.business_key = success.data.data[0].business_key;
                                        usr.date_created = success.data.data[0].date_created;
                                        usr.remember = true;
                                        $rootScope.isLogged = true;

                                        $scope.login_modal.hide();
                                        Auth.STORE_DATA('userid',usr);
                                        window.location.href = "#/menu/calendarBusiness";
                                      }
                                      else
                                      {
                                        $ionicLoading.hide();
                                        console.log('Your account is still Inactive !');
                                        $rootScope.showToast('Your account is still Inactive !');

                                      }
                                    }
                                    else if(success.data.user == 'admin')
                                    {
                                      var usr = new Object();
                                      usr.user = success.data.user;
                                      usr.admin_id = success.data.data[0].admin_id;
                                      usr.email = success.data.data[0].email;
                                      usr.date_created = success.data.data[0].date_created;
                                      usr.remember = true;
                                      $rootScope.isLogged = true;

                                      $scope.login_modal.hide();
                                      Auth.STORE_DATA('userid',usr);
                                      window.location.href = "#/menu/dashboard";
                                    }
                                    $ionicLoading.hide();
                                  },3000);
                                }
                              },
                              function(error) { 
                                    // $scope.user.email     = '';
                                    // $scope.user.pass     = '';
                                    // var usr = new Object();
                                    // usr.remember = true;
                                    // usr.user = "personal";
                                    // $rootScope.isLogged = true;
                                    // $scope.login_modal.hide();
                                    // Auth.STORE_DATA('userid',usr);
                                    // window.location.href = "#/menu/calendar";
                                    $ionicLoading.hide();
                                    $rootScope.showToast('Invalid Email/Password');
                                }
                              );  
      }
      else
      {
        $rootScope.showToast('Email and Password are required !');
      }
      
    }
  // Login Ends 

  /* login form */
    $scope.showLoginForm = function()
    {
      $scope.login_modal.show();
    }
      // -------------- Modal ---------------
        $ionicModal.fromTemplateUrl('loginForm.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.login_modal = modal;
        });
      // -------------- End Modal ---------------

      /* Close Modal */
        $scope.closeModal = function() { 
          $scope.user.email     = '';
          $scope.user.pass     = '';
          $scope.login_modal.hide();
        };
      /* /. */

      /* Close Modal */
        $scope.closeLoginModal = function() {
          $scope.login_modal.hide();
          window.location.href="#/forgotPass";
        };
      /* /. */
  /* /. */

  /* registration part */
    $scope.showReg = function()
    {
      clicked = true;
      // Show the action sheet
       var hideSheet = $ionicActionSheet.show({
         buttons: [
            { text: 'I want a Personal Account' },
            { text: 'I want a Business Account' },
          ],
          cancelText: 'Cancel',
          cancel: function() {
              clicked = false;
            },
          buttonClicked: function(index) {
            if(index == 0)
            {
              $scope.personalAccountModal();
            }
            else
            {
              $scope.businessAccountModal();
            }
            return true;
          }
       });
    }

    /* registration form part for personal account */
      $scope.personalAccountModal = function()
      {
        window.location.href = "#/personalAccount"; //property info form
      }
    /* /. */

    /* registration form part for business account */
      $scope.businessAccountModal = function()
      {
        window.location.href = "#/businessAccount"; //property info form
      }
    /* /. */

  /* /. */
}])

.controller('forgotPassCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth','$cordovaToast', '$ionicActionSheet',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth,  $cordovaToast,  $ionicActionSheet) 
{
  
  $scope.user = [];
  var clicked = false;
  /* function for initialize main*/
    $rootScope.initializeFPass = function()
    {
      clicked = true;
      // Show the action sheet
       var hideSheet = $ionicActionSheet.show({
         buttons: [
            { text: 'Personal Account' },
            { text: 'Business Account' },
          ],
          cancelText: 'Cancel',
          cancel: function() {
              clicked = false;
            },
          buttonClicked: function(index) {
            if(index == 0)
            {
              $scope.tbl = "tbl_personal_account";
            }
            else
            {
              $scope.tbl = "tbl_business_account";
            }
            return true;
          }
       });
    }
  /* /. */

  /* recover password*/
    $scope.recover = function(email)
    {
      if(email.$valid)
      {
        $ionicLoading.show({
          template: 'Sending Password to your email<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
        });
        var obj    = new Object();
        obj.method = 'POST';
        obj.url    = $rootScope.baseURL + "email.php";
        obj.data   = new FormData();
        obj.data.append('email',$scope.user.email);
        obj.data.append('tbl_name',$scope.tbl);
        obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
        obj.params = {};
        Auth.REQUEST(obj).then(function(success) {
          console.log(success.data);
                                if(success.data == 1)
                                {
                                  console.log('The password was sent to your email !');
                                  $rootScope.showToast('The password was sent to your email !');
                                }
                                else if(success.data == "Invalid Email")
                                {
                                  console.log("Invalid Email");
                                  $rootScope.showToast('Failed !');
                                }
                                else
                                {
                                  console.log('Failed !');
                                  $rootScope.showToast('Failed !');
                                }
                                $scope.user.email = "";
                                window.location.href = "#/login";
                                $ionicLoading.hide();
                              },
                              function(error) {
                                  console.log(error);
                                  $ionicLoading.hide();
                                  $rootScope.showToast('Failed !');
                                }
                              ); 
      }
         
    }
  /* /. */

  /* Initialization */
    $rootScope.initializeFPass();
  /* /. */
}])

.controller('personalAccountCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth) 
{
  
  $scope.property = [];
  $rootScope.backButtonPressedOnceToExit = false; 
  /* function for initialize main*/
    $rootScope.initializePersonalAccount = function()
    {
      $scope.property.name = $rootScope.property_name;
      $scope.property.address = $rootScope.property_address;
      $scope.property.post_code = $rootScope.property_postCode;
      $scope.property.phone = $rootScope.property_phone;
      // $scope.property.email = $rootScope.property_email;
    }
  /* /. */

  /* go to payment section */
    $scope.paymentSection = function(data)
    {
      if (data.$valid) 
      {
        $rootScope.property_name = $scope.property.name;
        $rootScope.property_address = $scope.property.address;
        $rootScope.property_postCode = $scope.property.post_code;
        $rootScope.property_phone = $scope.property.phone;
        // $rootScope.property_email = $scope.property.email;
        window.location.href = '#/paymentSection';
      }
      else
      {
        // alert("Please fill up the form");
        $rootScope.showToast("Please fill out the fields !");
      }
    }
  /* /. */

  /* Initialization */
    $rootScope.initializePersonalAccount();
  /* /. */

  /* close */
    $scope.close = function()
    {
      $scope.property.name = "";
      $scope.property.address = "";
      $scope.property.post_code = "";
      $scope.property.phone = "";
      $scope.property.email = "";
    }
  /* /. */

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */
}])

.controller('businessAccountCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth', '$cordovaGeolocation',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth,  $cordovaGeolocation) 
{
  
  $scope.business = [];
  $rootScope.backButtonPressedOnceToExit = false; 
  $scope.view_map = false; 
  /* function for initialize main*/
    $rootScope.initializeBusinessAccount = function()
    {
      $ionicLoading.show({
        template: 'Fetching your location <br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation.getCurrentPosition(posOptions)
        .then(function (position) {
          var lat  = position.coords.latitude;
          var long = position.coords.longitude;
          $scope.business.lat = lat;
          $scope.business.long = long;
          var location = [lat,long];
          $scope.location = location;
          $scope.view_map = true;
          $rootScope.showToast("The GPS successfully locate your location !");
          $ionicLoading.hide();
        }, function(err) {
          $scope.view_map = false; 
          $rootScope.showToast("Check your GPS and try again !");
          $ionicLoading.hide();
        });
    }
  /* /. */

  /* View Map */
    $scope.viewMap = function(location)
    {
      $rootScope.latLong = location;
      window.location.href = "#/viewMap";
      $scope.view_map = false; 
    }
  /* /. */

  /* navigate */
    $scope.navigate = function()
    {
      $rootScope.initializeBusinessAccount();
    }
  /* /. */

  /* add business account */
    $scope.addBusinessAccount = function(data)
    {
      if(data.$valid)
      {
        $ionicLoading.show({
          template: '<ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
        });
        var obj    = new Object();
        obj.method = 'POST';
        obj.url    = $rootScope.baseURL + "?func=addBusinessAccount";
        obj.data   = new FormData();
        obj.data.append('company_name',$scope.business.name);
        obj.data.append('certification_number',$scope.business.cert_num);
        obj.data.append('latitude',$scope.business.lat);
        obj.data.append('longitude',$scope.business.long);
        obj.data.append('phone',$scope.business.phone);
        obj.data.append('email',$scope.business.email);
        obj.data.append('password',$scope.business.password);
        obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
        obj.params = {};

        Auth.REQUEST(obj).then(function(success) {
                                console.log(success.data);
                                if(success.data == 1)
                                {
                                  $rootScope.showToast('Successfully Added !');
                                }
                                else
                                {
                                  $rootScope.showToast('Failed !');
                                }
                                $ionicLoading.hide();
                                window.location.href = "#/menu/login";
                              },
                              function(error) {
                                  console.log(error);
                                  $ionicLoading.hide();
                                  $rootScope.showToast('Failed !');
                                }
                              );  
      }
    }
  /* /. */

  /* Initialization */
    $rootScope.initializeBusinessAccount();
  /* /. */

  /* close */
    $scope.close = function()
    {

    }
  /* /. */

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */
}])

.controller('viewMapCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth', '$compile',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth, $compile) 
{
  
  $rootScope.backButtonPressedOnceToExit = false; 
  var latitude = $rootScope.latLong[0];
  var longitude = $rootScope.latLong[1];

  /* map */
    function initialize() {
      var center = {lat: latitude, lng: longitude};
      var mapProp = {
        center:center,
        zoom:15,
        mapTypeId:google.maps.MapTypeId.ROADMAP
      };
      console.log(center);
      var map  = new google.maps.Map(document.getElementById("googleMap"),mapProp);
      var marker = new google.maps.Marker({
        position: center,
        map: map,
        title: 'Hello World!'
      });

    }

    $ionicPlatform.ready(initialize);
  /* /. */

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */
}])

.controller('paymentSectionCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth) 
{

  
  $scope.card = []; 
  $rootScope.backButtonPressedOnceToExit = false; 
  /* function for initialize main*/
    $rootScope.initializePayment = function()
    {

    }
  /* /. */

  /* go to payment section */
    $scope.profileSection = function(data)
    {
      if (data.$valid) 
      {
        $rootScope.property_name = $rootScope.property_name;
        $rootScope.property_address = $rootScope.property_address;
        $rootScope.property_postCode = $rootScope.property_postCode;
        $rootScope.property_phone = $rootScope.property_phone;
        // $rootScope.property_email = $rootScope.property_email;
        $rootScope.card_name = $scope.card.name;
        $rootScope.card_number = $scope.card.number;
        $rootScope.card_startDate = $scope.card.start_date;
        $rootScope.card_endDate = $scope.card.end_date;
        $rootScope.card_issueNumber = $scope.card.issue_number;
        window.location.href = '#/profileSection';
      }
      else
      {
        // alert("Please fill up the form");
        $rootScope.showToast("Please fill out the fields !");
      }
    }
  /* /. */

  /* Initialization */
    $rootScope.initializePayment();
  /* /. */

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */
}])

.controller('profileSectionCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth) 
{
  
  $scope.profile = [];
  $rootScope.backButtonPressedOnceToExit = false; 
  var property_name = $rootScope.property_name;
  var property_address = $rootScope.property_address;
  var property_postCode = $rootScope.property_postCode;
  var property_phone = $rootScope.property_phone;
  // var property_email = $rootScope.property_email;
  var card_name = $rootScope.card_name;
  var card_number = $rootScope.card_number;
  var card_startDate = $rootScope.card_startDate;
  var card_endDate = $rootScope.card_endDate;
  var card_issueNumber = $rootScope.card_issueNumber;

  /* function for initialize main*/
    $rootScope.initializeProfile = function()
    {

    }
  /* /. */

  /* register function */
    $scope.registerUser = function(data)
    {
      if(data.$valid)
      {
        $ionicLoading.show({
          template: 'Registering this Account<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
        });
        var obj    = new Object();
        obj.method = 'POST';
        obj.url    = $rootScope.baseURL + "?func=addPersonalAccount";
        obj.data   = new FormData();
        obj.data.append('property_name',property_name);
        obj.data.append('property_address',property_address);
        obj.data.append('property_postCode',property_postCode);
        obj.data.append('property_phone',property_phone);
        // obj.data.append('property_email',property_email);
        obj.data.append('card_name',card_name);
        obj.data.append('card_number',card_number);
        obj.data.append('card_startDate',moment(card_startDate).format('YYYY-MM-DD'));
        obj.data.append('card_endDate',moment(card_endDate).format('YYYY-MM-DD'));
        obj.data.append('card_issueNumber',card_issueNumber);
        obj.data.append('profile_email',$scope.profile.email);
        obj.data.append('profile_password',$scope.profile.password);
        obj.data.append('profile_fname',$scope.profile.fname);
        obj.data.append('profile_lname',$scope.profile.lname);
        obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
        obj.params = {};

        Auth.REQUEST(obj).then(function(success) {
                                console.log(success.data);
                                window.location.href = "#/login";
                                if(success.data == 1)
                                {
                                  $rootScope.showToast('Successfully Added !');
                                }
                                else
                                {
                                  $rootScope.showToast('Failed !');
                                }
                                $ionicLoading.hide();
                              },
                              function(error) {
                                  console.log(error);
                                  $ionicLoading.hide();
                                  $rootScope.showToast('Failed !');
                                }
                              );  
      }
      else
      {
        // alert("Please fill up the form");
        $rootScope.showToast("Please fill out the fields !");
      }
      
    }
  /* /. */

  /* Initialization */
    $rootScope.initializeProfile();
  /* /. */

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */
}])

.controller('calendarCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth', '$cordovaCalendar', '$cordovaToast', '$cordovaNetwork', '$cordovaSplashscreen', '$cordovaLocalNotification',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth,  $cordovaCalendar, $cordovaToast, $cordovaNetwork, $cordovaSplashscreen, $cordovaLocalNotification) 
{
  
  $rootScope.backButtonPressedOnceToExit = false; 
  var isLogged = Auth.FETCH_DATA('userid');

  /* function for initialize main*/
    $rootScope.initializeMain = function()
    {
      $scope.navTitle='<img class="title-image" src="img/header_logo.png" style="margin-left:40%;height: 40px;margin-top: 2px;"/>';
      $('.ionic-fullcalendar')
      .fullCalendar(
        {
          header:{
            left:'prev',
            center:'title',
            right:'next'
          },
          height:'auto',
          dayClick:$scope.SELECT_CALENDAR_DATE,
          eventClick:$scope.SELECT_CALENDAR_EVENT,
          events: $scope.LOAD_CALENDAR_EVENTS,
          eventLimit:3
        }
      );

      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getAppointmentByDay";
      obj.data   = new FormData();
      obj.data.append('account_id',isLogged.account_id);
      obj.data.append('appoint_pref_date',moment(new Date()).format('YYYY-MM-DD'));
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                                if(success.data == 1)
                                {
                                  $cordovaLocalNotification.schedule({
                                    id: 1,
                                    title: 'Grass2go Lawn Care Services',
                                    text: "You have appointment today !",
                                    icon: 'res://app_icon.png',
                                    data: {
                                      customProperty: 'custom value'
                                    }
                                  }).then(function (result) {
                                    console.log('Notification 1 triggered');
                                  });
                                }
                                else
                                {
                                  $cordovaLocalNotification.schedule({
                                    id: 1,
                                    title: 'Grass2go Lawn Care Services',
                                    text: "No appointment for today !",
                                    icon: 'res://app_icon.png',
                                    data: {
                                      customProperty: 'custom value'
                                    }
                                  }).then(function (result) {
                                    console.log('Notification 1 triggered');
                                  });
                                }
                                
                            },
                            function(error) {
                                console.log(error);
                              }
                            );
    }
  /* /. */

  /* calendar event */
    $scope.SELECT_CALENDAR_DATE = function(date, jsEvent, view)
    {
      var x = moment(date).format('MM-DD-YYYY');
      var date_pick = moment(x).format('x');
      // if(date_pick >= date_today)
      // {
        $rootScope.datePick = x;
        window.location.href = '#/menu/calendarList';
      // }
      // else
      // {
      //   $rootScope.showToast("Cant schedule on that day !");
      // }
      
    }
  /* /. */

  /* click event */
    $scope.SELECT_CALENDAR_EVENT = function(events, jsEvent, view)
    {
      var date = events.start._i;
      var x = moment(date).format('MM-DD-YYYY');
      var date_pick = moment(x).format('x');

      $rootScope.datePick = x;
      window.location.href = '#/menu/calendarList';
    }
  /* /. */

  /* load events */
    $scope.LOAD_CALENDAR_EVENTS = function(start, end, timezone, callback)
    {
      $ionicLoading.show({
        template: 'Fetching Data<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });

      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=fetchEvents";
      obj.data   = new FormData();
      obj.data.append('profile_id',isLogged.account_id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};

      Auth.REQUEST(obj).then(function(success) { 
                                  var events               = [];
                                  var color                = "";
                                  var events_data          = success.data[0];
                                  if(events_data != null)
                                  {       
                                    for(var i = 0; i<events_data.length; i++)
                                    {
                                      var tmp_event  = events_data[i];
                                      if(tmp_event.status == 'approved')
                                      {
                                        color = "#33CD5F";
                                      }
                                      else if(tmp_event.status == 'declined')
                                      {
                                        color = "#EF473A";
                                      }
                                      else if(tmp_event.status == 'pending')
                                      {
                                        color = "#387EF5";
                                      }
                                      else if(tmp_event.status == 'unfinish')
                                      {
                                        color = "#FFC900";
                                      }
                                      var eventDate = tmp_event.appoint_pref_date + " " + tmp_event.appoint_pref_time;
                                      //push the tmp events 
                                      events.push({
                                                    title      : " ", 
                                                    start      : eventDate,
                                                    id         : tmp_event.appoint_id,
                                                    end        : eventDate,
                                                    color      : color
                                                  });
                                    }   
                                    callback(events);                                     
                                  }
                                $ionicLoading.hide();
                              },
                              function(error) { 
                                $ionicLoading.hide();
                              }
                            );
    }
  /* /. */

  /* Check if login */
    $scope.isLogged = function()
    {
      $ionicPlatform.ready(function() {
        setTimeout(function() {
          $cordovaSplashscreen.hide();
        }, 3000);
      });
      var redirect = true;
      if($rootScope.isLogged)
      {
        if(isLogged.user == 'personal')
        {
          redirect = true;
          $rootScope.initializeMain();
        }
        else if(isLogged.user == 'business')
        {
          window.location.href = "#/menu/calendarBusiness";
        }
        else if(isLogged.user == 'admin')
        {
          window.location.href = "#/menu/dashboard";
        }
        else
        {
          // listen for Offline event
          $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            var offlineState = networkState;
            if (offlineState == "none")
            {
              $rootScope.showToast("Check your network connections and try again !",'long', 'center');
            }
          });
          window.location.href = '#/login';
        }
      } 
      else
      {

        if(isLogged.user == 'personal')
        {
          redirect = isLogged.remember ? true : false;
          $rootScope.initializeMain();
        }
        else if(isLogged.user == 'business')
        {
          window.location.href = "#/menu/calendarBusiness";
        }
        else if(isLogged.user == 'admin')
        {
          window.location.href = "#/menu/dashboard";
        }
        else
        {
          // listen for Offline event
          $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            var offlineState = networkState;
            if (offlineState == "none")
            {
              $rootScope.showToast("Check your network connections and try again !",'long', 'center');
            }
          });
          window.location.href = '#/login';
        }
      }
      if(!redirect)
      // else
      {
        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
          var offlineState = networkState;
          if (offlineState == "none")
          {
            $rootScope.showToast("Check your network connections and try again !",'long', 'center');
          }
        });
        window.location.href = '#/login';
      }
    }
  /* /. */

  /* refresh */
    $scope.refresh = function()
    {
      $rootScope.initializeMain();
    }
  /* /. */

  /* Initialization */
    $scope.isLogged();
  /* /. */

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */
}])

.controller('calendarBusinessCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth', '$cordovaCalendar', '$cordovaToast', '$cordovaNetwork', '$cordovaSplashscreen', '$cordovaLocalNotification',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth,  $cordovaCalendar, $cordovaToast, $cordovaNetwork, $cordovaSplashscreen, $cordovaLocalNotification) 
{
  
  $rootScope.backButtonPressedOnceToExit = false;
  var isLogged = Auth.FETCH_DATA('userid'); 

  /* function for initialize main*/
    $rootScope.initializeCalendarBusiness = function()
    {
      $scope.navTitle='<img class="title-image" src="img/header_logo.png" style="margin-left:40%;height: 40px;margin-top: 2px;"/>';
      $('.ionic-fullcalendar')
      .fullCalendar(
        {
          header:{
            left:'prev',
            center:'title',
            right:'next'
          },
          height:'auto',
          dayClick:$scope.SELECT_CALENDAR_DATE,
          eventClick:$scope.SELECT_CALENDAR_EVENT,
          events: $scope.LOAD_CALENDAR_EVENTS,
          eventLimit:3
        }
      );

      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getPendingBooking";
      obj.data   = new FormData();
      obj.data.append('provider_id',isLogged.provider_id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                                    if(success.data != 0)
                                    {
                                      var pending = success.data.length;
                                    }
                                    else
                                    {
                                      var pending = 0;
                                    }
                                   
                                    $cordovaLocalNotification.schedule({
                                      id: 1,
                                      title: 'Grass2go Lawn Care Services',
                                      text: "You have "+pending+" pending appointment(s) !",
                                      icon: 'res://app_icon.png',
                                      data: {
                                        customProperty: 'custom value'
                                      }
                                    }).then(function (result) {
                                      console.log('Notification 1 triggered');
                                    });
                            },
                            function(error) {
                                console.log(error);
                              }
                            );
    }
  /* /. */

  /* calendar event */
    $scope.SELECT_CALENDAR_DATE = function(date, jsEvent, view)
    {
      var x = moment(date).format('MM-DD-YYYY');
      var date_pick = moment(x).format('x');
      // if(date_pick >= date_today)
      // {
        $rootScope.datePick = x;
        window.location.href = '#/menu/calendarBusinessList';
      // }
      // else
      // {
      //   $rootScope.showToast("Cant schedule on that day !");
      // }
      
    }
  /* /. */

  /* click event */
    $scope.SELECT_CALENDAR_EVENT = function(events, jsEvent, view)
    {
      var date = events.start._i;
      var x = moment(date).format('MM-DD-YYYY');
      var date_pick = moment(x).format('x');

      $rootScope.datePick = x;
      window.location.href = '#/menu/calendarBusinessList';
    }
  /* /. */

  /* load events */
    $scope.LOAD_CALENDAR_EVENTS = function(start, end, timezone, callback)
    {
      $ionicLoading.show({
        template: 'Fetching Data <br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });

      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=fetchProviderEvents";
      obj.data   = new FormData();
      obj.data.append('provider_id',isLogged.provider_id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) { 
                                  var events               = [];
                                  var color                = "";
                                  var events_data          = success.data[0];
                                  if(events_data != null)
                                  {       
                                    for(var i = 0; i<events_data.length; i++)
                                    {
                                      var tmp_event  = events_data[i];
                                      var eventDate = tmp_event.appoint_pref_date + " " + tmp_event.appoint_pref_time;
                                      if(tmp_event.status == 'approved')
                                      {
                                        color = "#33CD5F";
                                      }
                                      else if(tmp_event.status == 'declined')
                                      {
                                        color = "#EF473A";
                                      }
                                      else if(tmp_event.status == 'pending')
                                      {
                                        color = "#387EF5";
                                      }
                                      else if(tmp_event.status == 'unfinish')
                                      {
                                        color = "#FFC900";
                                      }
                                      //push the tmp events 
                                      events.push({
                                                    title      : " ", 
                                                    start      : eventDate,
                                                    id         : tmp_event.appoint_id,
                                                    end        : eventDate,
                                                    color      : color
                                                  });
                                    }   
                                    callback(events);                                     
                                  }
                                $ionicLoading.hide();
                              },
                              function(error) { 
                                $ionicLoading.hide();
                              }
                            );
    }
  /* /. */

  /* Check if login */
    $scope.isLogged = function()
    {
      var isLogged = Auth.FETCH_DATA('userid');
      var redirect = true;
      if($rootScope.isLogged)
      {
        if(isLogged.user == 'business')
        {
          redirect = true;
          $rootScope.initializeCalendarBusiness();
        }
        else if(isLogged.user == 'personal')
        {
          window.location.href = "#/menu/calendar";
        }
        else
        {
          // listen for Offline event
          $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            var offlineState = networkState;
            if (offlineState == "none")
            {
              $rootScope.showToast("Check your network connections and try again !",'long', 'center');
            }
          });
          window.location.href = '#/login';
        }
      } 
      else
      {
        if(isLogged.user == 'business')
        {
          redirect = isLogged.remember ? true : false;
          $rootScope.initializeCalendarBusiness();
        }
        else if(isLogged.user == 'personal')
        {
          window.location.href = "#/menu/calendar";
        }
        else
        {
          // listen for Offline event
          $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
            var offlineState = networkState;
            if (offlineState == "none")
            {
              $rootScope.showToast("Check your network connections and try again !",'long', 'center');
            }
          });
          window.location.href = '#/login';
        }
      }
      if(!redirect)
      {
        // listen for Offline event
        $rootScope.$on('$cordovaNetwork:offline', function(event, networkState){
          var offlineState = networkState;
          if (offlineState == "none")
          {
            $rootScope.showToast("Check your network connections and try again !",'long', 'center');
          }
        });
        window.location.href = '#/login';
      }
    }
  /* /. */

  /* refresh */
    $scope.refresh = function()
    {
      $rootScope.initializeCalendarBusiness();
    }
  /* /. */

  /* Initialization */
    $rootScope.initializeCalendarBusiness();
    $scope.isLogged();
  /* /. */

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */
}])

.controller('calendarListCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth', '$ionicModal', '$ionicPopup',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth,  $ionicModal, $ionicPopup ) 
{
  
  $rootScope.backButtonPressedOnceToExit = false; 
  $scope.appoint = [];
  $scope.appoint.pref_contacted = "Phone";
  $scope.appoint.best_time = "Anytime";
  $scope.appoint.state = "Alabama";
  var isLogged = Auth.FETCH_DATA('userid');
  $scope.valid = false;
  $scope.timef = false;
  var total = 0;
  $scope.company = [];
  $scope.agent_info = [];

  $scope.items = [{
        val: "house",
        title: "Houses"
    }, {
        val: "apartment",
        title: "Apartments"
    }, {
        val: "ground",
        title: "Grounds"
    }];

  /* function for initialize main*/
    $rootScope.initializeList = function()
    {
      $scope.navTitle='<img class="title-image" src="img/header_logo.png" style="margin-left:40%;height: 40px;margin-top: 2px;"/>';
      $scope.date = $rootScope.datePick;
      var d = new Date();
      var n = moment(d).format('MM-DD-YYYY');

      $scope.appoint.date =moment($scope.date).format('MMM D, YYYY');
      $scope.date_pick =moment($scope.date).format('x');
      $scope.date_today =moment(n).format('x');

      if($scope.date_pick >= $scope.date_today)
      {
        $scope.valid = true;
      }

      $scope.appoint.fullname = isLogged.profile_firstname + " " + isLogged.profile_lastname;
      $scope.appoint.email = isLogged.profile_email;
      $scope.appoint.address = isLogged.property_address;
      $scope.appoint.phone = isLogged.property_phone;

      $scope.timePickerObject = {
        inputEpochTime: ((new Date()).getHours() * 60 * 60), //Optional
        step: 5,  //Optional
        format: 12,  //Optional
        titleLabel: '12-hour Format',  //Optional
        setLabel: 'Set',  //Optional
        closeLabel: 'Close',  //Optional
        setButtonType: 'button-positive',  //Optional
        closeButtonType: 'button-stable',  //Optional
        callback: function (val) {    //Mandatory
          if(typeof (val) == 'undefined')
          {
            $scope.timePickerObject;
            $scope.appoint.time = '';
          }
          else
          {
            var selectedTime = new Date(val * 1000);
            $scope.appoint.time = selectedTime.getUTCHours()+':'+selectedTime.getUTCMinutes();
            $scope.timef = true;
          }
          // timePickerCallback(val);
        }
      };
      $scope.title = moment($scope.date).format('MMM D, YYYY');
      $ionicLoading.show({
        template: 'Fetching appointments on this date<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });

      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=fetchEventsByDay";
      obj.data   = new FormData();
      obj.data.append('profile_id',isLogged.account_id);
      obj.data.append('appoint_pref_date',moment($scope.date).format('YYYY-MM-DD'));
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                                $scope.events = success.data[0];
                                for(var i = 0; i < $scope.events.length ; i++)
                                {
                                  if(i != $scope.events.length)
                                  {

                                    var appointId = $scope.events[i].appoint_id;
                                    $scope.getCompany(success.data[0][i].provider_id,i);
                                    $scope.getAgent(appointId,i);
                                  }
                                }
                              },
                              function(error) { 
                                $ionicLoading.hide();
                              }
                            );
    }
  /* /. */

  /* get company */
    $scope.getCompany = function(id,index)
    {
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getProvider";
      obj.data   = new FormData();
      obj.data.append('provider_id',id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) { 
                                  $scope.company[index] = success.data[0][0];
                                  $ionicLoading.hide();
                              },
                              function(error) { 
                              }
                            );
    }
  /* /. */

  /* get agent */
    $scope.getAgent = function(id,index)
    {
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getAgentByAppoint";
      obj.data   = new FormData();
      obj.data.append('appoint_id',id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                                  $scope.agent_info[index] = success.data[0][0];
                                  $ionicLoading.hide();
                              },
                              function(error) { 
                              }
                            );
    }
  /* /. */

  /* format date and time */
    $scope.formatTime = function(time)
    {
      var ftime = time;
      var stime = ftime.split(':');
      var hh = stime[0];
      var hr = hh > 12 ? hh-12 : hh;
      var mm = stime[1];
      var ampm = hh < 12 ? "AM" : "PM";
      var format = hr+":"+mm+" "+ampm;
      return format;
    }

    $scope.formatDate = function(date)
    {
      var d = moment(date).format('MMMM DD,YYYY');
      return d;
    }
  /* /. */

  /* Add Appointment*/
    $scope.add_appointment = function(date)
    {
      // $rootScope.showToast(date);
      $scope.addEventForm.show();
    }
      // -------------- Modal ---------------
        $ionicModal.fromTemplateUrl('addEvent.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.addEventForm = modal;
        });
      // -------------- End Modal ---------------

      /* Close Modal */
        $scope.closeAddEventModal = function() {
          $scope.addEventForm.hide();
        };
      /* /. */

  /* /. */

  /* next page */
    $scope.next = function(data)
    {
      if(data.$valid)
      {
        $ionicLoading.show({
          template: '<ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
        });
        var obj    = new Object();
          obj.method = 'POST';
          obj.url    = $rootScope.baseURL + "?func=addAppointment";
          obj.data   = new FormData();
          obj.data.append('profile_id',isLogged.account_id);
          obj.data.append('appoint_fullname',$scope.appoint.fullname);
          obj.data.append('appoint_address',$scope.appoint.address);
          obj.data.append('appoint_city',$scope.appoint.city);
          obj.data.append('appoint_state',$scope.appoint.state);
          obj.data.append('appoint_zip',$scope.appoint.zip);
          obj.data.append('appoint_pref_contacted',$scope.appoint.pref_contacted);
          obj.data.append('appoint_phone',$scope.appoint.phone);
          obj.data.append('appoint_fax',$scope.appoint.fax);
          obj.data.append('appoint_email',$scope.appoint.email);
          obj.data.append('appoint_time_call',$scope.appoint.best_time);
          obj.data.append('appoint_pref_date',$scope.appoint.date);
          obj.data.append('appoint_pref_time',$scope.appoint.time);
          obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
          obj.params = {};
          Auth.REQUEST(obj).then(function(success) {
            console.log(success.data);
                                  if(success.data >= 1)
                                  {
                                    $rootScope.appoint_id = success.data;
                                    $scope.closeAddEventModal();
                                    window.location.href="#/menu/appointProvider";
                                    // alert('Successfully Added !');
                                  }
                                  else
                                  {
                                    // alert('Failed !');
                                    $rootScope.showToast('Failed !');
                                  }
                                  
                                },
                                function(error) {
                                    console.log(error);
                                    $ionicLoading.hide();
                                    $rootScope.showToast('Failed !');
                                  }
                                );
      }
    }
  /* /. */

  /* cancel appoint */
    $scope.cancel_appoint = function(id)
    {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Cancel Appointment',
        template: 'Are you sure you want to cancel this appointment?'
      });

      confirmPopup.then(function(res) {
        if(res) {
          $ionicLoading.show({
            template: 'Cancelling appointment<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
          });
          var obj    = new Object();
            obj.method = 'POST';
            obj.url    = $rootScope.baseURL + "?func=cancelAppointment";
            obj.data   = new FormData();
            obj.data.append('appoint_id',id);
            obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
            obj.params = {};

            Auth.REQUEST(obj).then(function(success) {
                                    if(success.data >= 1)
                                    {
                                      window.location.href="#/menu/calendar";
                                      // alert('Successfully Added !');
                                      $rootScope.showToast('Your appointment will be now cancelled !');
                                    }
                                    else
                                    {
                                      // alert('Failed !');
                                      $rootScope.showToast('Failed !');
                                    }
                                    $ionicLoading.hide();
                                  },
                                  function(error) {
                                      console.log(error);
                                      $ionicLoading.hide();
                                      $rootScope.showToast('Failed !');
                                    }
                                  );
        } else {
          console.log('Cancel');
        }
      });
    }
  /* /. */

  /* view invoice */
    $scope.viewInvoice = function(id)
    {
      $ionicLoading.show({
        template: 'Fetching Invoice <br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=viewInvoice";
      obj.data   = new FormData();
      obj.data.append('appoint_id',id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                                if(success.data == 0)
                                {
                                  $rootScope.showToast('Error');
                                  $ionicLoading.hide();
                                }
                                else
                                {
                                  // $ionicLoading.hide();
                                  $scope.invoice = success.data;
                                  var obj    = new Object();
                                  obj.method = 'POST';
                                  obj.url    = $rootScope.baseURL + "?func=getProfile";
                                  obj.data   = new FormData();
                                  obj.data.append('profile_id',success.data[0].profile_id);
                                  obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
                                  obj.params = {};
                                  Auth.REQUEST(obj).then(function(success) {
                                                          $scope.profile = success.data[0][0];
                                                          var obj    = new Object();
                                                          obj.method = 'POST';
                                                          obj.url    = $rootScope.baseURL + "?func=getListOfServices";
                                                          obj.data   = new FormData();
                                                          obj.data.append('appoint_id',id);
                                                          obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
                                                          obj.params = {};
                                                          Auth.REQUEST(obj).then(function(success1) {
                                                                                    $scope.listService = success1.data;
                                                                                    for(var y = 0 ; y < success1.data.length+1 ; y++)
                                                                                    {
                                                                                      if(y == success1.data.length)
                                                                                      {
                                                                                        $scope.servicetotal = total;
                                                                                        setTimeout(function(){
                                                                                          $scope.viewInvoiceInfo.show();
                                                                                          $ionicLoading.hide();
                                                                                        }, 3000);
                                                                                      }
                                                                                      else
                                                                                      {
                                                                                        total += parseFloat(success1.data[y].cost); 
                                                                                      }
                                                                                    }
                                                                                },
                                                                                function(error) {
                                                                                    console.log(error);
                                                                                    $ionicLoading.hide();
                                                                                    $rootScope.showToast('Failed !');
                                                                                  }
                                                                                );
                                                        },
                                                        function(error) {
                                                            console.log(error);
                                                            $ionicLoading.hide();
                                                            $rootScope.showToast('Failed !');
                                                          }
                                                        );
                                }
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }
    // -------------- Modal ---------------
      $ionicModal.fromTemplateUrl('viewInvoiceInfo.html', {
        scope: $scope,
        animation: 'slide-in-up',
        hardwareBackButtonClose: false
      }).then(function(modal) {
        $scope.viewInvoiceInfo = modal;
      });
    // -------------- End Modal ---------------

    /* Close Modal */
      $scope.closeInvoiceModal = function() {
        total = 0;
        $scope.viewInvoiceInfo.hide();
      };
    /* /. */
  /* /. */

  /* service total */
    $scope.total = function(service_total, serv_tax, gratuity)
    {
      if(isNaN(gratuity))
      {
        gratuity = 0;
      }
      if(isNaN(serv_tax))
      {
        serv_tax = 0;
      }
      var n = parseFloat(service_total)+parseFloat(gratuity)+parseFloat(serv_tax);
      return n.toFixed(2);
    }
  /* /. */

  /* check NaN */
    $scope.checkNan = function(num)
    {
      if(isNaN(num))
      {
        var n = parseFloat(0);
        return n.toFixed(2);
      }
      else
      {
        var n = parseFloat(num);
        return n.toFixed(2);
      }
    }
  /* /. */

  /* finish appointment */
    $scope.finishAppoint = function(id)
    {
      $rootScope.appoint_id = id;
      window.location.href="#/menu/appointProvider";
    }
  /* /. */

  /* Initialization */
      $rootScope.initializeList();
  /* /. */

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */
}])

.controller('calendarBusinessListCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth', '$ionicModal', '$ionicPopup', '$ionicScrollDelegate',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth,  $ionicModal, $ionicPopup, $ionicScrollDelegate ) 
{
  
  $rootScope.backButtonPressedOnceToExit = false; 
  $scope.appoint = [];
  $scope.appoint.pref_contacted = 0;
  $scope.appoint.best_time = 0;
  $scope.appoint.state = 0;
  var isLogged = Auth.FETCH_DATA('userid');
  $scope.valid = false;
  $scope.profile = [];
  $scope.view_info = false;
  var listOfService = [];
  var total = 0;
  $scope.some_model = [];
  $scope.feed = [];
  $scope.error = false;
  $scope.company = [];
  $scope.agent_info = [];

  /* function for initialize main*/
    $rootScope.initializeList = function()
    {
      $scope.navTitle='<img class="title-image" src="img/header_logo.png" style="margin-left:40%;height: 40px;margin-top: 2px;"/>';
      $scope.date = $rootScope.datePick;
      var d = new Date();
      var n = moment(d).format('MM-DD-YYYY');

      $scope.appoint.date =moment($scope.date).format('MMM D, YYYY');
      $scope.date_pick =moment($scope.date).format('x');
      $scope.date_today =moment(n).format('x');

      if($scope.date_pick >= $scope.date_today)
      {
        $scope.valid = true;
      }
      $scope.title = moment($scope.date).format('MMM D, YYYY');
      $ionicLoading.show({
        template: 'Fetching appointments on this date<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=fetchProviderEventsByDay";
      obj.data   = new FormData();
      obj.data.append('provider_id',isLogged.provider_id);
      obj.data.append('appoint_pref_date',moment($scope.date).format('YYYY-MM-DD'));
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                                $scope.events = success.data[0];
                                for(var i = 0; i < $scope.events.length ; i++)
                                {
                                  if(i != $scope.events.length)
                                  {
                                    $scope.fetchCompanyName(i,$scope.events[i].profile_id);
                                    var appointId = $scope.events[i].appoint_id;
                                    $scope.getCompany(success.data[0][i].provider_id,i);
                                    $scope.getAgent(appointId,i);
                                    $ionicLoading.hide();
                                    // var obj    = new Object();
                                    // obj.method = 'POST';
                                    // obj.url    = $rootScope.baseURL + "?func=getProfile";
                                    // obj.data   = new FormData();
                                    // obj.data.append('profile_id',$scope.events[i].profile_id);
                                    // obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
                                    // obj.params = {};
                                    // Auth.REQUEST(obj).then(function(success) {
                                    //                           $scope.profile[i] = success.data[0][0];
                                    //                           $ionicLoading.hide();
                                    //                       },
                                    //                       function(error) {
                                    //                           console.log(error);
                                    //                           $ionicLoading.hide();
                                    //                           $rootScope.showToast('Failed !');
                                    //                         }
                                    //                       );
                                  }
                                }
                              },
                              function(error) { 
                                $ionicLoading.hide();
                              }
                            );
    }
  /* /. */

  /* fetch company name */
    $scope.fetchCompanyName = function(index, profile_id)
    {
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getProfile";
      obj.data   = new FormData();
      obj.data.append('profile_id',profile_id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                                $scope.profile[index] = success.data[0][0];
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }
  /* /. */

  /* get company */
    $scope.getCompany = function(id,index)
    {
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getProvider";
      obj.data   = new FormData();
      obj.data.append('provider_id',id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) { 
                                  $scope.company[index] = success.data[0][0];
                                  $ionicLoading.hide();
                              },
                              function(error) { 
                              }
                            );
    }
  /* /. */

  /* get agent */
    $scope.getAgent = function(id,index)
    {
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getAgentByAppoint";
      obj.data   = new FormData();
      obj.data.append('appoint_id',id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                                  $scope.agent_info[index] = success.data[0][0];
                                  $scope.baseURL = $rootScope.baseURL;
                                  $ionicLoading.hide();
                              },
                              function(error) { 
                              }
                            );
    }
  /* /. */

  /* format date */
    $scope.formatTime = function(time)
    {
      var ftime = time;
      var stime = ftime.split(':');
      var hh = stime[0];
      var hr = hh > 12 ? hh-12 : hh;
      var mm = stime[1];
      var ampm = hh < 12 ? "AM" : "PM";
      var format = hr+":"+mm+" "+ampm;
      return format;
    }

    $scope.formatDate = function(date)
    {
      var d = moment(date).format('MMMM DD,YYYY');
      return d;
    }
  /* /. */

  /* Add Appointment*/
    $scope.add_appointment = function(date)
    {
      // $rootScope.showToast(date);
      $scope.addEventForm.show();
    }
      // -------------- Modal ---------------
        // $ionicModal.fromTemplateUrl('addEvent.html', {
        //   scope: $scope,
        //   animation: 'slide-in-up'
        // }).then(function(modal) {
        //   $scope.addEventForm = modal;
        // });
      // -------------- End Modal ---------------

      /* Close Modal */
        $scope.closeAddEventModal = function() {
          $scope.addEventForm.hide();
        };
      /* /. */

  /* /. */

  /* view info */
    $scope.viewInfo = function(id)
    {
      $ionicLoading.show({
        template: 'Fetching data<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getAppointment";
      obj.data   = new FormData();
      obj.data.append('appoint_id',id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                                $scope.event_ = success.data[0];
                                $scope.view_info.show();
                                $ionicLoading.hide();
                              },
                              function(error) { 
                                $ionicLoading.hide();
                              }
                            );
      // $scope.view_info = true;
      // setTimeout(function(){
      //   $ionicScrollDelegate.resize();
      // },100);
    } 

     // -------------- Modal ---------------
        $ionicModal.fromTemplateUrl('info.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.view_info = modal;
        });
      // -------------- End Modal ---------------

      /* Close Modal */
        $scope.closeInfoModal = function() {
          $scope.view_info.hide();
        };
      /* /. */
    // $scope.hideInfo = function(index)
    // {
    //   $scope.view_info = false;
    //   setTimeout(function(){
    //     $ionicScrollDelegate.resize();
    //   },100);
    // } 
  /* /. */

  /* approval of appointment */
    $scope.btn_action = function(id,stat,date,yard_size)
    {
      
      var status = "";
      if(stat == 0 || stat == '0')
      {
          var confirmPopup = $ionicPopup.confirm({
            title: 'Declining Appointment',
            template: 'Are you sure you want to decline this appointment?'
           });

          confirmPopup.then(function(res) {
          if(res) {
            status = "declined";
            $ionicLoading.show({
              template: 'Declining appointment<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
            });
            $scope.approved(id,status);
          } else {
            console.log('You are not sure');
          }
        });
      }
      else
      {
        status = "approved";
        $ionicLoading.show({
          template: 'Fetching available agents<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
        });
        var obj    = new Object();
        obj.method = 'POST';
        obj.url    = $rootScope.baseURL + "?func=getAgentByProvider";
        obj.data   = new FormData();
        obj.data.append('provider_id',isLogged.provider_id);
        obj.data.append('date',moment(date).format('YYYY-MM-DD'));
        obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
        obj.params = {};
        Auth.REQUEST(obj).then(function(success) {
                                if(success.data == 0)
                                {
                                  $rootScope.showToast('No available agent !');
                                }
                                else
                                {
                                  $scope.agents = success.data;
                                  $scope.appoint.agent = 0;
                                  $rootScope.appoint_id = id;
                                  $scope.yard_size = yard_size;
                                  $scope.appointAgent.show();
                                }
                                $ionicLoading.hide();
                              },
                              function(error) {
                                  console.log(error);
                                  $ionicLoading.hide();
                                  $rootScope.showToast('Failed !');
                                }
                              );
      }
    }
  /* /. */

  // -------------- Modal ---------------
        $ionicModal.fromTemplateUrl('appointAgent_.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.appointAgent = modal;
        });
      // -------------- End Modal ---------------

      /* Close Modal */
        $scope.closeAppointAgentModal = function() {
          $scope.appointAgent.hide();
        };

  /* appoint agent */
    $scope.addAppointAgent = function(data)
    {
      if($scope.appoint.agent == 0)
      {
        $scope.error = true;
      }
      else
      {
        $scope.error = false;
      }
      if(data.$valid)
      {
        if($scope.appoint.agent != 0)
        {
          $scope.error = false;
          $ionicLoading.show({
            template: 'Approving appointment<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
          });
          var obj    = new Object();
          obj.method = 'POST';
          obj.url    = $rootScope.baseURL + "?func=addAppointAgent";
          obj.data   = new FormData();
          obj.data.append('provider_id',isLogged.provider_id);
          obj.data.append('agent_id',$scope.appoint.agent);
          obj.data.append('appoint_id',$rootScope.appoint_id);
          obj.data.append('service_tax',$scope.appoint.serv_tax);
          obj.data.append('gratuity_amount',$scope.appoint.amount);
          obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
          obj.params = {};
          Auth.REQUEST(obj).then(function(success) {
                                  if(success.data >= 1)
                                  {
                                    $scope.stat = "approved";
                                    $scope.approved($scope.appoint_id,$scope.stat);
                                  }
                                  else
                                  {
                                    $rootScope.showToast('Failed !');
                                  }
                                  $ionicLoading.hide();
                                },
                                function(error) {
                                    console.log(error);
                                    $ionicLoading.hide();
                                    $rootScope.showToast('Failed !');
                                  }
                                );

        }
        else
        {
          $scope.error = true;
        }
      }
    }
  /* /. */

  /* approved */
    $scope.approved = function(id,status)
    {
      for(var a = 1 ; a <= 5 ; a++)
      {
        if(a == 1)
        {
          $scope.some_model[a] = true;
        }
        else
        {
          $scope.some_model[a] = false;
        }
        
      }
      // $scope.rate.show();
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=actionAppointment";
      obj.data   = new FormData();
      obj.data.append('appoint_id',id);
      obj.data.append('status',status);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                              if(success.data >= 1)
                              {
                                $rootScope.showToast('You '+status+' the appointment !');

                                if(status == 'declined')
                                {
                                  window.location.href="#/menu/calendarBusiness";
                                }
                                else
                                {
                                  var obj    = new Object();
                                  obj.method = 'POST';
                                  obj.url    = $rootScope.baseURL + "?func=getAppointment";
                                  obj.data   = new FormData();
                                  obj.data.append('appoint_id',id);
                                  obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
                                  obj.params = {};
                                  Auth.REQUEST(obj).then(function(success) {
                                                            
                                                            $scope.account_id = success.data[0].profile_id;
                                                            $scope.appointAgent.hide();
                                                            $scope.rate.show();
                                                        },
                                                        function(error) {
                                                            console.log(error);
                                                            $ionicLoading.hide();
                                                            $rootScope.showToast('Failed !');
                                                          }
                                                        );
                                }
                                 $ionicLoading.hide();
                              }
                              else
                              {
                                $rootScope.showToast('Failed !');
                              }
                              $ionicLoading.hide();
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }

    // -------------- Modal ---------------
        $ionicModal.fromTemplateUrl('rating.html', {
          scope: $scope,
          animation: 'slide-in-up',
          hardwareBackButtonClose: false
        }).then(function(modal) {
          $scope.rate = modal;
        });
      // -------------- End Modal ---------------

      /* Close Modal */
        $scope.closeRateModal = function() {
          $scope.rate.hide();
        };
  /* /. */

  /* status ucword*/
    $scope.ucword = function(word)
    {
      if(word == 'approved')
      {
        var a = "Approved";
        return a;
      }
      else
      {
        var a = "Declined";
        return a;
      }
    }
  /* /. */

  /* view invoice */
    $scope.viewInvoice = function(id)
    {
      $ionicLoading.show({
        template: 'Fetching Invoice <br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=viewInvoice";
      obj.data   = new FormData();
      obj.data.append('appoint_id',id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                                if(success.data == 0)
                                {
                                  $rootScope.showToast('Error');
                                  $ionicLoading.hide();
                                }
                                else
                                {
                                  $scope.invoice = success.data;
                                  var obj    = new Object();
                                  obj.method = 'POST';
                                  obj.url    = $rootScope.baseURL + "?func=getProfile";
                                  obj.data   = new FormData();
                                  obj.data.append('profile_id',success.data[0].profile_id);
                                  obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
                                  obj.params = {};
                                  Auth.REQUEST(obj).then(function(success) {
                                                          $scope.profile = success.data[0][0];
                                                          var obj    = new Object();
                                                          obj.method = 'POST';
                                                          obj.url    = $rootScope.baseURL + "?func=getListOfServices";
                                                          obj.data   = new FormData();
                                                          obj.data.append('appoint_id',id);
                                                          obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
                                                          obj.params = {};
                                                          Auth.REQUEST(obj).then(function(success1) {
                                                                                    $scope.listService = success1.data;
                                                                                    for(var y = 0 ; y < success1.data.length+1 ; y++)
                                                                                    {
                                                                                      if(y == success1.data.length)
                                                                                      {
                                                                                        $scope.servicetotal = total;
                                                                                        $scope.viewInvoiceInfo.show();
                                                                                        $ionicLoading.hide();
                                                                                      }
                                                                                      else
                                                                                      {
                                                                                        total += parseFloat(success1.data[y].cost); 
                                                                                      }
                                                                                    }
                                                                                },
                                                                                function(error) {
                                                                                    console.log(error);
                                                                                    $ionicLoading.hide();
                                                                                    $rootScope.showToast('Failed !');
                                                                                  }
                                                                                );
                                                        },
                                                        function(error) {
                                                            console.log(error);
                                                            $ionicLoading.hide();
                                                            $rootScope.showToast('Failed !');
                                                          }
                                                        );
                                }
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }

    // -------------- Modal ---------------
      $ionicModal.fromTemplateUrl('viewInvoiceInfo.html', {
        scope: $scope,
        animation: 'slide-in-up',
        hardwareBackButtonClose: false
      }).then(function(modal) {
        $scope.viewInvoiceInfo = modal;
      });
    // -------------- End Modal ---------------

    /* Close Modal */
      $scope.closeInvoiceModal = function() {
        total = 0;
        $scope.viewInvoiceInfo.hide();
      };
    /* /. */
  /* /. */

  /* service total */
    $scope.total = function(service_total, serv_tax, gratuity)
    {
      if(isNaN(gratuity))
      {
        gratuity = 0;
      }
      if(isNaN(serv_tax))
      {
        serv_tax = 0;
      }
      var n = parseFloat(service_total)+parseFloat(gratuity)+parseFloat(serv_tax);
      return n.toFixed(2);
    }
  /* /. */

  /* check NaN */
    $scope.checkNan = function(num)
    {
      if(isNaN(num))
      {
        var n = parseFloat(0);
        return n.toFixed(2);
      }
      else
      {
        var n = parseFloat(num);
        return n.toFixed(2);
      }
    }
  /* /. */

  /* rate */
    $scope.rating = function(val)
    {
      var a = 0;
      for(a = 1 ; a <= 5 ; a++)
      {
        if(a <= val)
        {
          $scope.some_model[a] = true;
        }
        else
        {
          $scope.some_model[a] = false;
        }
      }
      $scope.rate_ = val;
    }
  /* /. */

  /* submit review */
    $scope.submitReview = function(id)
    {
      $ionicLoading.show({
        template: 'Submitting ... <br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=addCustReview";
      obj.data   = new FormData();
      obj.data.append('account_id',id);
      obj.data.append('star_rating',$scope.rate_);
      obj.data.append('comment',$scope.feed.feedback);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                              if(success.data >= 1)
                              {
                                $rootScope.showToast('Thank You !');
                                window.location.href="#/menu/calendarBusiness";
                                $scope.rate.hide();
                                $ionicLoading.hide();
                              }
                              else
                              {
                                $rootScope.showToast('Failed !');
                                $scope.rate.hide();
                                $ionicLoading.hide();
                              }
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }
  /* /. */

  /* view customer */
    $scope.viewCust = function(id)
    {
      var tmp1 = 0;
      var tmp2 = 0;
      var tmp3 = 0;
      var tmp4 = 0;
      var tmp5 = 0;
      var tmp_tot = 0;

      $ionicLoading.show({
        template: 'Fetching data<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      $scope.rating = {};
      $scope.rate = {};
      $scope.rating.max = 5;

      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getPersonalAccount";
      obj.data   = new FormData();
      obj.data.append('account_id',id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                              $scope.userInfo = success.data[0];
                              $scope.view_cust.show();
                              var obj    = new Object();
                              obj.method = 'POST';
                              obj.url    = $rootScope.baseURL + "?func=getUserReview";
                              obj.data   = new FormData();
                              obj.data.append('account_id',id);
                              obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
                              obj.params = {};
                              Auth.REQUEST(obj).then(function(success) {
                                                      if (success.data != 0)
                                                      {
                                                        $scope.view_ratings = true;
                                                        for(var i = 0 ; i < success.data.length ; i++)
                                                        {
                                                          tmp_tot += parseInt(success.data[i].star_rating);
                                                          if(success.data[i].star_rating == 1)
                                                          {
                                                            tmp1 += parseInt(success.data[i].star_rating);
                                                          }
                                                          else if(success.data[i].star_rating == 2)
                                                          {
                                                            tmp2 += parseInt(success.data[i].star_rating);
                                                          }
                                                          else if(success.data[i].star_rating == 3)
                                                          {
                                                            tmp3 += parseInt(success.data[i].star_rating);
                                                          }
                                                          else if(success.data[i].star_rating == 4)
                                                          {
                                                            tmp4 += parseInt(success.data[i].star_rating);
                                                          }
                                                          else if(success.data[i].star_rating == 5)
                                                          {
                                                            tmp5 += parseInt(success.data[i].star_rating);
                                                          }
                                                        }
                                                        
                                                        var avg_ = (tmp1*1) + (tmp2*2) + (tmp3*3) + (tmp4*4) + (tmp5*5);
                                                        var average_ = parseInt(avg_) / parseInt(tmp_tot);
                                                        $scope.avg = average_.toFixed(2);
                                                        $scope.tot = tmp_tot;
                                                        $scope.rating.rate = $scope.avg;
                                                        $scope.rate.one =  (parseInt(tmp1) / parseInt(tmp_tot)) * 100;
                                                        $scope.rate.two =  (parseInt(tmp2) / parseInt(tmp_tot)) * 100;
                                                        $scope.rate.three =  (parseInt(tmp3) / parseInt(tmp_tot)) * 100;
                                                        $scope.rate.four =  (parseInt(tmp4) / parseInt(tmp_tot)) * 100;
                                                        $scope.rate.five =  (parseInt(tmp5) / parseInt(tmp_tot)) * 100;
                                                        $ionicLoading.hide();
                                                      }
                                                      else
                                                      {

                                                        $scope.view_ratings = false;
                                                        $scope.closeInfoModal();
                                                        $ionicLoading.hide();
                                                      }
                                                    },
                                                    function(error) {
                                                        console.log(error);
                                                        $ionicLoading.hide();
                                                        $rootScope.showToast('Failed !');
                                                      }
                                                    );
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }
    // -------------- Modal ---------------
      $ionicModal.fromTemplateUrl('viewCustInfo.html', {
        scope: $scope,
        animation: 'slide-in-up',
        hardwareBackButtonClose: false
      }).then(function(modal) {
        $scope.view_cust = modal;
      });
    // -------------- End Modal ---------------

    /* Close Modal */
      $scope.closeCustModal = function() {
        $scope.view_cust.hide();
      };
  /* /. */

  /* Initialization */
    $rootScope.initializeList();
  /* /. */

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */
}])

.controller('myAccountCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth', '$ionicModal',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth, $ionicModal) 
{
  
  $rootScope.backButtonPressedOnceToExit = false; 
  var isLogged = Auth.FETCH_DATA('userid');
  $scope.profile = [];
  $scope.view_ratings = false;

  /* function for initialize main*/
    $rootScope.initializeMyAccount = function()
    {
      var tmp1 = 0;
      var tmp2 = 0;
      var tmp3 = 0;
      var tmp4 = 0;
      var tmp5 = 0;
      var tmp_tot = 0;

      $scope.navTitle='<img class="title-image" src="img/header_logo.png" style="margin-left:40%;height: 40px;margin-top: 2px;"/>';
      $ionicLoading.show({
        template: 'Fetching data<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });

      $scope.rating = {};
      $scope.rate = {};
      $scope.rating.max = 5;

      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getPersonalAccount";
      obj.data   = new FormData();
      obj.data.append('account_id',isLogged.account_id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                              $scope.userInfo = success.data[0];
                              var obj    = new Object();
                              obj.method = 'POST';
                              obj.url    = $rootScope.baseURL + "?func=getUserReview";
                              obj.data   = new FormData();
                              obj.data.append('account_id',isLogged.account_id);
                              obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
                              obj.params = {};
                              Auth.REQUEST(obj).then(function(success) {
                                                      if (success.data != 0)
                                                      {
                                                        $scope.view_ratings = true;
                                                        for(var i = 0 ; i < success.data.length ; i++)
                                                        {
                                                          tmp_tot += parseInt(success.data[i].star_rating);
                                                          if(success.data[i].star_rating == 1)
                                                          {
                                                            tmp1 += parseInt(success.data[i].star_rating);
                                                          }
                                                          else if(success.data[i].star_rating == 2)
                                                          {
                                                            tmp2 += parseInt(success.data[i].star_rating);
                                                          }
                                                          else if(success.data[i].star_rating == 3)
                                                          {
                                                            tmp3 += parseInt(success.data[i].star_rating);
                                                          }
                                                          else if(success.data[i].star_rating == 4)
                                                          {
                                                            tmp4 += parseInt(success.data[i].star_rating);
                                                          }
                                                          else if(success.data[i].star_rating == 5)
                                                          {
                                                            tmp5 += parseInt(success.data[i].star_rating);
                                                          }
                                                        }
                                                        
                                                        var avg_ = (tmp1*1) + (tmp2*2) + (tmp3*3) + (tmp4*4) + (tmp5*5);
                                                        var average_ = parseInt(avg_) / parseInt(tmp_tot);
                                                        $scope.avg = average_.toFixed(2);
                                                        $scope.tot = tmp_tot;
                                                        $scope.rating.rate = $scope.avg;
                                                        $scope.rate.one =  (parseInt(tmp1) / parseInt(tmp_tot)) * 100;
                                                        $scope.rate.two =  (parseInt(tmp2) / parseInt(tmp_tot)) * 100;
                                                        $scope.rate.three =  (parseInt(tmp3) / parseInt(tmp_tot)) * 100;
                                                        $scope.rate.four =  (parseInt(tmp4) / parseInt(tmp_tot)) * 100;
                                                        $scope.rate.five =  (parseInt(tmp5) / parseInt(tmp_tot)) * 100;
                                                        $ionicLoading.hide();
                                                      }
                                                      else
                                                      {

                                                        $scope.view_ratings = false;
                                                        $ionicLoading.hide();
                                                      }
                                                    },
                                                    function(error) {
                                                        console.log(error);
                                                        $ionicLoading.hide();
                                                        $rootScope.showToast('Failed !');
                                                      }
                                                    );
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }
  /* /. */

  /* format */
    $scope.formatDate = function(date)
    {
      var d = moment(date).format('MMMM YYYY');
      return d;
    }
  /* /. */

  /* modal */
    $scope.editUser = function(id)
    {
      $ionicLoading.show({
        template: '<ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getPersonalAccount";
      obj.data   = new FormData();
      obj.data.append('account_id',isLogged.account_id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                              $scope.profile.email = success.data[0].profile_email;
                              $scope.profile.property_name = success.data[0].property_name;
                              $scope.profile.property_address = success.data[0].property_address;
                              $scope.profile.property_postal_code = success.data[0].property_postal_code;
                              $scope.profile.property_phone = success.data[0].property_phone;
                              $scope.profile.card_name = success.data[0].card_name;
                              $scope.profile.card_number = success.data[0].card_number;
                              $scope.profile.card_start_date = new Date(success.data[0].card_start_date);
                              $scope.profile.card_end_date = new Date(success.data[0].card_end_date);
                              $scope.profile.card_issue_number = success.data[0].card_issue_number;
                              $scope.profile.profile_password = success.data[0].profile_key;
                              $scope.edit_user.show();
                              $ionicLoading.hide();
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }

    // -------------- Modal ---------------
        $ionicModal.fromTemplateUrl('editUser.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.edit_user = modal;
        });
      // -------------- End Modal ---------------

      /* Close Modal */
        $scope.closeEditModal = function() {
          $scope.edit_user.hide();
        };
      /* /. */
  /* /. */

  /* update user */
    $scope.updateUser = function(data)
    {
      if(data.$valid)
      {
        $ionicLoading.show({
          template: 'Updating information<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
        });
        var obj    = new Object();
        obj.method = 'POST';
        obj.url    = $rootScope.baseURL + "?func=updateUser";
        obj.data   = new FormData();
        obj.data.append('account_id',isLogged.account_id);
        obj.data.append('profile_email',$scope.profile.email);
        obj.data.append('property_name',$scope.profile.property_name);
        obj.data.append('property_address',$scope.profile.property_address);
        obj.data.append('property_postal_code',$scope.profile.property_postal_code);
        obj.data.append('property_phone',$scope.profile.property_phone);
        obj.data.append('card_name',$scope.profile.card_name);
        obj.data.append('card_number',$scope.profile.card_number);
        obj.data.append('card_start_date',moment($scope.profile.card_start_date).format('YYYY-MM-DD'));
        obj.data.append('card_end_date',moment($scope.profile.card_end_date).format('YYYY-MM-DD'));
        obj.data.append('card_issue_number',$scope.profile.card_issue_number);
        obj.data.append('profile_password',$scope.profile.profile_password);
        obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
        obj.params = {};
        Auth.REQUEST(obj).then(function(success) {
                                if(success.data == 1)
                                {
                                  $rootScope.showToast('Successfully Updated !');
                                  $rootScope.initializeMyAccount();
                                }
                                else
                                {
                                  $rootScope.showToast('Failed to update !');
                                  $rootScope.initializeMyAccount();
                                }

                                $scope.closeEditModal();
                                $ionicLoading.hide();
                              },
                              function(error) {
                                  console.log(error);
                                  $ionicLoading.hide();
                                  $rootScope.showToast('Failed !');
                                }
                              );
      }
    }
  /* /. */

  /* Initialization */
    $rootScope.initializeMyAccount();
  /* /. */

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */
}])

.controller('invoiceCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth', '$cordovaDatePicker',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth, $cordovaDatePicker) 
{
  
  $rootScope.backButtonPressedOnceToExit = false; 
  $scope.date = [];
  var total = 0;
  $scope.serv_name = [];
  $scope.serv_cost = [];
  $scope.pick = [];
  $scope.view = false;
  $scope.searchView = false;
  $scope.pick.id = 0;
  $scope.hide = true;
  var isLogged = Auth.FETCH_DATA('userid');

  /* function for initialize main*/
    $rootScope.initializeInvoice = function()
    {
      $scope.navTitle='<img class="title-image" src="img/header_logo.png" style="margin-left:30%;height: 40px;margin-top: 2px;"/>';
      $scope.onezoneDatepicker = {
        date: new Date(), // MANDATORY                     
        mondayFirst: false,                
        months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],                    
        daysOfTheWeek: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],     
        startDate: new Date(1989, 12, 31),             
        endDate: new Date(2024, 12, 31),                    
        disablePastDays: false,
        disableSwipe: false,
        disableWeekend: false,
        disableDates: [],
        disableDaysOfWeek: [],
        showDatepicker: true,
        showTodayButton: true,
        calendarMode: false,
        hideCancelButton: false,
        hideSetButton: false,
        highlights: [{date: new Date(),color: '#E6FFE0',textColor: '#000'}],
        callback: function(value){
          $scope.invoice = '';
          $scope.select_time = '';
          $scope.date.pick = moment(value).format('MMMM DD, YYYY');
          var d = moment(value).format('YYYY-MM-DD');
          $scope.getInvoice(d);
        }
      };
    }
  /* /. */

  /* show search */
    $scope.showSearch = function()
    {
      $scope.searchView = true;
    }
  /* /. */

  /* date pick */
    $scope.getInvoice = function(date)
    {
      $scope.pick.date = date;
      $ionicLoading.show({
        template: 'Fetching Invoice <br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=viewInvoiceByDate";
      obj.data   = new FormData();
      obj.data.append('profile_id',isLogged.account_id);
      obj.data.append('appoint_pref_date',date);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                                // console.log(success.data);
                                // $ionicLoading.hide();
                                if(success.data == 0)
                                {
                                  $scope.searchView = false;
                                  $scope.view = false;
                                  $scope.hide = true;
                                  $rootScope.showToast('No Invoice found !');
                                  $ionicLoading.hide();
                                }
                                else
                                {
                                  $ionicLoading.hide();
                                  $scope.select_time = success.data;
                                  $scope.view = true;
                                  $scope.pick.id = 0;
                                }
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }
  /* /. */

  /* format date */
    $scope.formatTime = function(time)
    {
      var ftime = time;
      var stime = ftime.split(':');
      var hh = stime[0];
      var hr = hh > 12 ? hh-12 : hh;
      var mm = stime[1];
      var ampm = hh < 12 ? "AM" : "PM";
      var format = hr+":"+mm+" "+ampm;
      return format;
    }

    $scope.formatDate = function(date)
    {
      var d = moment(date).format('MMMM DD,YYYY');
      return d;
    }
  /* /. */

  /* service total */
    $scope.total = function(service_total, serv_tax, gratuity)
    {
      if(isNaN(gratuity))
      {
        gratuity = 0;
      }
      if(isNaN(serv_tax))
      {
        serv_tax = 0;
      }
      if(isNaN(service_total))
      {
        service_total = 0;
      }
      var n = parseFloat(service_total)+parseFloat(gratuity)+parseFloat(serv_tax);
      return n.toFixed(2);
    }
  /* /. */

  /* check NaN */
    $scope.checkNan = function(num)
    {
      if(isNaN(num))
      {
        var n = parseFloat(0);
        return n.toFixed(2);
      }
      else
      {
        var n = parseFloat(num);
        return n.toFixed(2);
      }
    }
  /* /. */

  /* filter */
    $scope.filterInvoice = function()
    {
      $scope.searchView = false;
      $scope.hide = false;
      total = 0;
      $ionicLoading.show({
        template: 'Fetching Invoice <br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=viewInvoice";
      obj.data   = new FormData();
      obj.data.append('appoint_id',$scope.pick.id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                                if(success.data == 0)
                                {
                                  $scope.invoice = '';
                                  $ionicLoading.hide();
                                }
                                else
                                {
                                  $scope.invoice = success.data;
                                  var obj    = new Object();
                                  obj.method = 'POST';
                                  obj.url    = $rootScope.baseURL + "?func=getListOfServices";
                                  obj.data   = new FormData();
                                  obj.data.append('appoint_id',$scope.pick.id);
                                  obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
                                  obj.params = {};
                                  Auth.REQUEST(obj).then(function(success1) {
                                                            $scope.listService = success1.data;
                                                            for(var y = 0 ; y < success1.data.length+1 ; y++)
                                                            {
                                                              if(y == success1.data.length)
                                                              {
                                                                $scope.servicetotal = total;
                                                                $ionicLoading.hide();
                                                              }
                                                              else
                                                              {
                                                                total += parseFloat(success1.data[y].cost); 
                                                              }
                                                            }
                                                        },
                                                        function(error) {
                                                            console.log(error);
                                                            $ionicLoading.hide();
                                                            $rootScope.showToast('Failed !');
                                                          }
                                                        );
                                }
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }
  /* /. */

  /* Initialization */
    $rootScope.initializeInvoice();
  /* /. */

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */
}])

.controller('servicesCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth', '$ionicModal', '$ionicActionSheet', '$ionicPopup',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth,  $ionicModal, $ionicActionSheet, $ionicPopup ) 
{
  
  $rootScope.backButtonPressedOnceToExit = false; 
  $scope.service = [];
  var clicked = false;
  var isLogged = Auth.FETCH_DATA('userid');

  /* function for initialize main*/
    $rootScope.initializeServices = function()
    {
      $ionicLoading.show({
        template: 'Fetching data<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      $scope.navTitle='<img class="title-image" src="img/header_logo.png" style="margin-left:30%;height: 40px;margin-top: 2px;"/>';
      var obj    = new Object();
        obj.method = 'POST';
        obj.url    = $rootScope.baseURL + "?func=getServices";
        obj.data   = new FormData();
        obj.data.append('provider_id',isLogged.provider_id);
        obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
        obj.params = {};

        Auth.REQUEST(obj).then(function(success) {
                                $scope.allServices = success.data[0];
                                $ionicLoading.hide();
                              },
                              function(error) {
                                  $ionicLoading.hide();
                                  console.log(error);
                                  $ionicLoading.hide();
                                  $rootScope.showToast('Failed !');
                                }
                              );
    }
  /* /. */

  /* Add Appointment*/
    $scope.add_service = function()
    {
      $scope.addService.show();
    }
      // -------------- Modal ---------------
        $ionicModal.fromTemplateUrl('addService.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.addService = modal;
        });
      // -------------- End Modal ---------------

      /* Close Modal */
        $scope.closeAddModal = function() {
          $scope.addService.hide();
        };
      /* /. */
  /* /. */

  /* Add Services */
    $scope.create_service = function(data)
    {
      if(data.$valid)
      {
        $ionicLoading.show({
          template: 'Creating service<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
        });
        var obj    = new Object();
        obj.method = 'POST';
        obj.url    = $rootScope.baseURL + "?func=addServices";
        obj.data   = new FormData();
        obj.data.append('provider_id',isLogged.provider_id);
        obj.data.append('service_name',$scope.service.name);
        obj.data.append('service_cost',$scope.service.cost);
        obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
        obj.params = {};

        Auth.REQUEST(obj).then(function(success) {
                                if(success.data == 1)
                                {
                                  $scope.closeAddModal();
                                  $scope.service.name = '';
                                  $scope.service.cost = '';
                                  $rootScope.initializeServices();
                                  // alert('Successfully Added !');
                                  $rootScope.showToast('Successfully Added !');
                                }
                                else
                                {
                                  // alert('Failed !');
                                  $rootScope.showToast('Failed !');
                                }
                                $ionicLoading.hide();
                              },
                              function(error) {
                                  console.log(error);
                                  $ionicLoading.hide();
                                  $rootScope.showToast('Failed !');
                                }
                              );
      }
    }
  /* sction sheet */
    $scope.actionService = function(id,name,cost)
    {
      clicked = true;
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
         buttons: [
            { text: 'Edit Service' },
            { text: 'Delete Service' },
          ],
          cancelText: 'Cancel',
          cancel: function() {
              clicked = false;
            },
          buttonClicked: function(index) {
            if(index == 0)
            {
              $scope.editModal(id,name,cost);
            }
            else
            {
              $scope.deleteServices(id);
            }
            return true;
          }
       });
    }
  /* /. */

  /* edit modal */
    $scope.editModal = function(id,name,cost)
    {
      $scope.service.id = id;
      $scope.service.name = name;
      $scope.service.cost = parseFloat(cost);
      $scope.editServiceModal.show();
    }
      // -------------- Modal ---------------
        $ionicModal.fromTemplateUrl('editServModal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.editServiceModal = modal;
        });
      // -------------- End Modal ---------------

      /* Close Modal */
        $scope.closeEditModal = function() {
          $scope.service.name = '';
          $scope.service.cost = '';
          $scope.editServiceModal.hide();
        };
      /* /. */
  /* /. */

  /* update service */
    $scope.update_service = function(data)
    {
      if(data.$valid)
      {
        $ionicLoading.show({
          template: 'Updating service<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
        });
        var obj    = new Object();
          obj.method = 'POST';
          obj.url    = $rootScope.baseURL + "?func=updateServices";
          obj.data   = new FormData();
          obj.data.append('service_id',$scope.service.id);
          obj.data.append('service_name',$scope.service.name);
          obj.data.append('service_cost',$scope.service.cost);
          obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
          obj.params = {};
          Auth.REQUEST(obj).then(function(success) {
                                  if(success.data == 1)
                                  {
                                    $scope.closeEditModal();
                                    $scope.service.id = '';
                                    $scope.service.name = '';
                                    $scope.service.cost = '';
                                    $rootScope.initializeServices();
                                    // alert('Successfully Updated !');
                                    $rootScope.showToast('Successfully Updated !');
                                  }
                                  else
                                  {
                                    // alert('Failed !');
                                    $rootScope.showToast('Failed !');
                                  }
                                  $ionicLoading.hide();
                                },
                                function(error) {
                                    console.log(error);
                                    $ionicLoading.hide();
                                    $rootScope.showToast('Failed !');
                                  }
                                );
      }
    }
  /* /. */

  /* delete services */
    $scope.deleteServices = function(id)
    {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete Service',
        template: 'Are you sure you want to delete this service?'
      });

      confirmPopup.then(function(res) {
        if(res) {
          $ionicLoading.show({
            template: 'Deleting service<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
          });
          var obj    = new Object();
              obj.method = 'POST';
              obj.url    = $rootScope.baseURL + '?func=deleteService';
              obj.data   = new FormData();
              obj.data.append('service_id',id);
              obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
              obj.params = {};
              Auth.REQUEST(obj).then(function(success) {
                                        console.log(success.data);
                                        if(success.data == '1')
                                        {
                                          // alert('Successfully Deleted');
                                          $rootScope.initializeServices();
                                          $rootScope.showToast('Successfully Deleted');
                                        }
                                        else
                                        {
                                          // alert('Failed');
                                          $rootScope.showToast('Failed');
                                        }
                                        $ionicLoading.hide();
                                    },
                                    function(error) { 
                                        console.log(error);
                                        $ionicLoading.hide();
                                      }
                                    );
        } else {
          console.log('Cancel');
        }
      });
    }
  /* /. */

  /* Initialization */
    $rootScope.initializeServices();
  /* /. */

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */
}])

.controller('agentsCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth', '$ionicModal', '$ionicActionSheet', '$ionicPopup', '$cordovaImagePicker',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth,  $ionicModal, $ionicActionSheet, $ionicPopup, $cordovaImagePicker ) 
{
  
  $rootScope.backButtonPressedOnceToExit = false; 
  $scope.agent = [];
  var clicked = false;
  var isLogged = Auth.FETCH_DATA('userid');

  /* function for initialize main*/
    $rootScope.initializeAgents = function()
    {
      $ionicLoading.show({
        template: 'Fetching data<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      $scope.navTitle='<img class="title-image" src="img/header_logo.png" style="margin-left:28%;height: 40px;margin-top: 2px;"/>';
      var obj    = new Object();
        obj.method = 'POST';
        obj.url    = $rootScope.baseURL + "?func=getAgents";
        obj.data   = new FormData();
        obj.data.append('provider_id',isLogged.provider_id);
        obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
        obj.params = {};

        Auth.REQUEST(obj).then(function(success) {
          console.log(success.data[0]);
                                $scope.allAgents = success.data[0];
                                $scope.baseURL = $rootScope.baseURL;
                                $ionicLoading.hide();
                              },
                              function(error) {
                                  $ionicLoading.hide();
                                  console.log(error);
                                  $ionicLoading.hide();
                                  $rootScope.showToast('Failed !');
                                }
                              );
    }
  /* /. */

  /* Add Appointment*/
    $scope.add_agent = function()
    {
      $scope.agent.img = '';
      $scope.addAgent.show();
    }
      // -------------- Modal ---------------
        $ionicModal.fromTemplateUrl('addAgent.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.addAgent = modal;
        });
      // -------------- End Modal ---------------

      /* Close Modal */
        $scope.closeAddModal = function() {
          $scope.addAgent.hide();
        };
      /* /. */
  /* /. */

  /* Add Services */
    $scope.create_agent = function(data)
    {
      if(data.$valid)
      {
        $ionicLoading.show({
          template: 'Creating agent<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
        });

        var win = function (r) {
          if(r.responseCode == 200)
          {
            var obj    = new Object();
            obj.method = 'POST';
            obj.url    = $rootScope.baseURL + "?func=addAgent";
            obj.data   = new FormData();
            obj.data.append('provider_id',isLogged.provider_id);
            obj.data.append('agent_fname',$scope.agent.fname);
            obj.data.append('agent_lname',$scope.agent.lname);
            obj.data.append('agent_email',$scope.agent.email);
            obj.data.append('agent_phone',$scope.agent.phone);
            obj.data.append('agent_img',r.response);
            obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
            obj.params = {};
            Auth.REQUEST(obj).then(function(success) {
                                    if(success.data == 1)
                                    {
                                      $scope.closeAddModal();
                                      $rootScope.initializeAgents();
                                      $scope.agent.fname = '';
                                      $scope.agent.lname = '';
                                      $scope.agent.email = '';
                                      $scope.agent.phone = '';
                                      $scope.agent.img = '';
                                      // alert('Successfully Added !');
                                      $rootScope.showToast('Successfully Added !');
                                    }
                                    else
                                    {
                                      // alert('Failed !');
                                      $rootScope.showToast('Failed !');
                                    }
                                    $ionicLoading.hide();
                                  },
                                  function(error) {
                                      console.log(error);
                                      $ionicLoading.hide();
                                      $rootScope.showToast('Failed !');
                                    }
                                  );
            $ionicLoading.hide();
          }
        }

        var fail = function (error) {
          //alert(error);
        }

        var options = new FileUploadOptions();
        //alert(JSON.stringify(options));
        options.fileKey = "file";
        options.fileName = $scope.agent.img.substr($scope.agent.img.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";

        var params = {};
        params.value1 = "test";
        params.value2 = "param";

        options.params = params;
        options.headers = { Connection: "close" };
        options.chunkedMode = false;

        var ft = new FileTransfer();
        ft.upload($scope.agent.img, encodeURI($rootScope.baseURL+"?func=uploadPic"), win, fail, options, false);
      }
    }
  /* sction sheet */
    $scope.actionAgent = function(id,fname,lname,email,phone,img)
    {
      clicked = true;
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
         buttons: [
            { text: 'Edit Agent' },
            { text: 'Delete Agent' },
          ],
          cancelText: 'Cancel',
          cancel: function() {
              clicked = false;
            },
          buttonClicked: function(index) {
            if(index == 0)
            {
              $scope.editModal(id,fname,lname,email,phone,img);
            }
            else
            {
              $scope.deleteAgent(id);
            }
            return true;
          }
       });
    }
  /* /. */

  /* edit modal */
    $scope.editModal = function(id,fname,lname,email,phone,img)
    {
      $scope.img_ = img;
      $scope.agent.id = id;
      $scope.agent.fname = fname;
      $scope.agent.lname = lname;
      $scope.agent.email = email;
      $scope.agent.phone = phone;
      $scope.agent.img_ = img;
      if($scope.img_ == '')
      {
        $scope.agent.img = '';
      }
      else
      {
        $scope.agent.img = $rootScope.baseURL+img;
      }
      $scope.editAgentModal.show();
    }
      // -------------- Modal ---------------
        $ionicModal.fromTemplateUrl('editAgntModal.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.editAgentModal = modal;
        });
      // -------------- End Modal ---------------

      /* Close Modal */
        $scope.closeEditModal = function() {
          $scope.agent.fname = '';
          $scope.agent.lname = '';
          $scope.agent.email = '';
          $scope.agent.phone = '';
          $scope.editAgentModal.hide();
        };
      /* /. */
  /* /. */

  /* update service */
    $scope.update_agent = function(data)
    {
      if(data.$valid)
      {
        $ionicLoading.show({
          template: 'Updating agent<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
        });
        if($scope.img_ == '')
        {
          var obj    = new Object();
          obj.method = 'POST';
          obj.url    = $rootScope.baseURL + "?func=updateAgent";
          obj.data   = new FormData();
          obj.data.append('agent_id',$scope.agent.id);
          obj.data.append('agent_fname',$scope.agent.fname);
          obj.data.append('agent_lname',$scope.agent.lname);
          obj.data.append('agent_email',$scope.agent.email);
          obj.data.append('agent_phone',$scope.agent.phone);
          obj.data.append('agent_img','');
          obj.data.append('agent_img_','');
          obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
          obj.params = {};
          Auth.REQUEST(obj).then(function(success) {
                                  if(success.data == 1)
                                  {
                                    $scope.closeEditModal();
                                    $scope.agent.id = '';
                                    $scope.agent.fname = '';
                                    $scope.agent.lname = '';
                                    $scope.agent.email = '';
                                    $scope.agent.phone = '';
                                    $scope.agent.img = ''
                                    $rootScope.initializeAgents();
                                    // alert('Successfully Updated !');
                                    $rootScope.showToast('Successfully Updated !');
                                  }
                                  else
                                  {
                                    // alert('Failed !');
                                    $rootScope.showToast('Failed !');
                                  }
                                  $ionicLoading.hide();
                                },
                                function(error) {
                                    console.log(error);
                                    $ionicLoading.hide();
                                    $rootScope.showToast('Failed !');
                                  }
                                );
        }
        else
        {
          var win = function (r) {
            var obj    = new Object();
            obj.method = 'POST';
            obj.url    = $rootScope.baseURL + "?func=updateAgent";
            obj.data   = new FormData();
            obj.data.append('agent_id',$scope.agent.id);
            obj.data.append('agent_fname',$scope.agent.fname);
            obj.data.append('agent_lname',$scope.agent.lname);
            obj.data.append('agent_email',$scope.agent.email);
            obj.data.append('agent_phone',$scope.agent.phone);
            obj.data.append('agent_img',r.response);
            obj.data.append('agent_img_',$scope.agent.img_);
            obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
            obj.params = {};
            Auth.REQUEST(obj).then(function(success) {
                                    if(success.data == 1)
                                    {
                                      $scope.closeEditModal();
                                      $scope.agent.id = '';
                                      $scope.agent.fname = '';
                                      $scope.agent.lname = '';
                                      $scope.agent.email = '';
                                      $scope.agent.phone = '';
                                      $scope.agent.img = ''
                                      $rootScope.initializeAgents();
                                      // alert('Successfully Updated !');
                                      $rootScope.showToast('Successfully Updated !');
                                    }
                                    else
                                    {
                                      // alert('Failed !');
                                      $rootScope.showToast('Failed !');
                                    }
                                    $ionicLoading.hide();
                                  },
                                  function(error) {
                                      console.log(error);
                                      $ionicLoading.hide();
                                      $rootScope.showToast('Failed !');
                                    }
                                  );
          }
        }

        var fail = function (error) {
          //alert(error);
        }

        var options = new FileUploadOptions();
        //alert(JSON.stringify(options));
        options.fileKey = "file";
        options.fileName = $scope.agent.img.substr($scope.agent.img.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";

        var params = {};
        params.value1 = "test";
        params.value2 = "param";

        options.params = params;
        options.headers = { Connection: "close" };
        options.chunkedMode = false;

        var ft = new FileTransfer();
        ft.upload($scope.agent.img, encodeURI($rootScope.baseURL+"?func=uploadPic"), win, fail, options, false);
      }
    }
  /* /. */

  /* delete services */
    $scope.deleteAgent = function(id)
    {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete Agent',
        template: 'Are you sure you want to delete this agent?'
      });

      confirmPopup.then(function(res) {
        if(res) {
          $ionicLoading.show({
            template: 'Deleting agent<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
          });
          var obj    = new Object();
              obj.method = 'POST';
              obj.url    = $rootScope.baseURL + '?func=deleteAgent';
              obj.data   = new FormData();
              obj.data.append('agent_id',id);
              obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
              obj.params = {};
              Auth.REQUEST(obj).then(function(success) {
                                        console.log(success.data);
                                        if(success.data == '1')
                                        {
                                          // alert('Successfully Deleted');
                                          $rootScope.initializeAgents();
                                          $rootScope.showToast('Successfully Deleted');
                                        }
                                        else
                                        {
                                          // alert('Failed');
                                          $rootScope.showToast('Failed');
                                        }
                                        $ionicLoading.hide();
                                    },
                                    function(error) { 
                                        console.log(error);
                                        $ionicLoading.hide();
                                      }
                                    );
        } else {
          console.log('Cancel');
        }
      });
    }
  /* /. */

  /* get pic */
    $scope.getPic = function()
    {
      var options = {
       maximumImagesCount: 1,
       width: 800,
       height: 800,
       quality: 80
      };

      $cordovaImagePicker.getPictures(options)
        .then(function (results) {
          for (var i = 0; i < results.length; i++) {
            $scope.img_ = results[i];;
            $scope.agent.img = results[i];
          }
        }, function(error) {
          // error getting photos
        });
    }
  /* /. */

  /* Initialization */
    $rootScope.initializeAgents();
  /* /. */

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */
}])

.controller('appointProviderCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth', '$cordovaGeolocation', '$filter',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth,  $cordovaGeolocation, $filter) 
{
  
  $rootScope.backButtonPressedOnceToExit = false; 
  $scope.appoint = [];
  $scope.error = false;
  var count = 0;

  /* function for initialize main*/
    $rootScope.initializeAppointProvider = function()
    {
      $ionicLoading.show({
        template: 'Fetching Provider that nears you ! <br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation.getCurrentPosition(posOptions)
        .then(function (position) {
          var lat  = position.coords.latitude
          var long = position.coords.longitude

          var obj    = new Object();
          obj.method = 'POST';
          obj.url    = $rootScope.baseURL + "?func=getNearProvider";
          obj.data   = new FormData();
          obj.data.append('lat',lat);
          obj.data.append('long',long);
          obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
          obj.params = {};

          Auth.REQUEST(obj).then(function(success) {
                                    $scope.appoint.company_id = success.data[0][0].provider_id;
                                    $scope.appoint.company_name = success.data[0][0].company_name;
                                    $scope.appoint.phone = success.data[0][0].phone;
                                    $scope.appoint.email = success.data[0][0].email;

                                    var obj    = new Object();
                                    obj.method = 'POST';
                                    obj.url    = $rootScope.baseURL + "?func=getServices";
                                    obj.data   = new FormData();
                                    obj.data.append('provider_id',success.data[0][0].provider_id);
                                    obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
                                    obj.params = {};
                                    Auth.REQUEST(obj).then(function(success) {
                                                            if(success.data[0] == 0) 
                                                            {
                                                              $rootScope.showToast('No provider\'s services found !');
                                                              $ionicLoading.hide();
                                                            }
                                                            else
                                                            {
                                                              $scope.services = success.data[0];
                                                              $ionicLoading.hide();
                                                            }
                                                          },
                                                          function(error) {
                                                              $ionicLoading.hide();
                                                              $rootScope.showToast('Failed !');
                                                            }
                                                          );
                                },
                                function(error) {
                                    console.log(error);
                                    $ionicLoading.hide();
                                    $rootScope.showToast('Failed !');
                                  }
                                );
        }, function(err) {
          $ionicLoading.hide();
          $rootScope.showToast("Check your GPS and try again !");
          
        });
    }
  /* /. */

  /* submit appointment */
    $scope.submit = function(data)
    {
      var checkboxes = $scope.appoint.services;
        if(!checkboxes)
        {
          $scope.error = true;
        }
        if(data.$valid)
        {
          if(!checkboxes)
          {
            $scope.error = true;
          }
          else
          {
            $scope.error = false;
            var temp = '';
            $.each( $scope.appoint.services, function( key, value ) 
            {
              if(value == true)
              {
                temp+=key+'-';
              }
            });
            if(temp != "")
            {
              $ionicLoading.show({
                template: 'Submitting Appointment<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
              });
              var obj    = new Object();
              obj.method = 'POST';
              obj.url    = $rootScope.baseURL + "?func=addProviderAppointment";
              obj.data   = new FormData();
              obj.data.append('appoint_id',$rootScope.appoint_id);
              obj.data.append('provider_id',$scope.appoint.company_id);
              obj.data.append('yard_size',$scope.appoint.size);
              obj.data.append('services',temp);
              obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
              obj.params = {};
              Auth.REQUEST(obj).then(function(success) {
                                      if(success.data >= 1)
                                      {
                                        var obj    = new Object();
                                        obj.method = 'POST';
                                        obj.url    = $rootScope.baseURL + "?func=addAppointmentPayment";
                                        obj.data   = new FormData();
                                        obj.data.append('appoint_id',$rootScope.appoint_id);
                                        obj.data.append('services',temp);
                                        obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
                                        obj.params = {};
                                        Auth.REQUEST(obj).then(function(success) {
                                                                if(success.data >= 1)
                                                                {
                                                                  $ionicLoading.hide();
                                                                  window.location.href="#/menu/calendar";
                                                                  $rootScope.showToast('Successfully Booked !');
                                                                  // alert('Successfully Added !');
                                                                }
                                                                else
                                                                {
                                                                  $ionicLoading.hide();
                                                                  $rootScope.showToast('Failed !');
                                                                }
                                                                
                                                              },
                                                              function(error) {
                                                                  console.log(error);
                                                                  $ionicLoading.hide();
                                                                  $rootScope.showToast('Failed !');
                                                                }
                                                              );
                                      }
                                      else
                                      {
                                        $ionicLoading.hide();
                                        $rootScope.showToast('Failed !');
                                      }
                                      
                                    },
                                    function(error) {
                                        console.log(error);
                                        $ionicLoading.hide();
                                        $rootScope.showToast('Failed !');
                                      }
                                    ); 
            }
            else
            {
              $scope.error = true;
            }
            
          }
        }
    }
  /* /. */

  /* Initialization */
    $rootScope.initializeAppointProvider();
  /* /. */

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */
}])

.controller('pendingCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth', '$cordovaGeolocation', '$ionicModal', '$ionicPopup', '$interval',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth,  $cordovaGeolocation,$ionicModal, $ionicPopup, $interval) 
{
  
  $rootScope.backButtonPressedOnceToExit = false; 
  $scope.appoint = [];
  var isLogged = Auth.FETCH_DATA('userid');
  $scope.events = [];
  $scope.profile = [];
   var listOfService = [];
   var total = 0;
   $scope.some_model = [];
   $scope.feed = [];
   $scope.error = false;

  /* function for initialize main*/
    $rootScope.initializePending = function()
    {
      $scope.navTitle='<img class="title-image" src="img/header_logo.png" style="margin-left:40%;height: 40px;margin-top: 2px;"/>';
      $ionicLoading.show({
        template: 'Fetching data<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getPendingBooking";
      obj.data   = new FormData();
      obj.data.append('provider_id',isLogged.provider_id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                                if(success.data != 0)
                                {
                                  $scope.appoints = success.data;
                                  $ionicLoading.hide();
                                }
                                else
                                {
                                  $scope.appoints = 0;
                                  $ionicLoading.hide();
                                }
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }
  /* /. */

  /* fetch company name */
    $scope.fetchCompanyName = function(index, profile_id)
    {
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getProfile";
      obj.data   = new FormData();
      obj.data.append('profile_id',profile_id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                                $scope.profile[index] = success.data[0][0];
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }
  /* /. */

  /* format date */
    $scope.formatTime = function(time)
    {
      var ftime = time;
      var stime = ftime.split(':');
      var hh = stime[0];
      var hr = hh > 12 ? hh-12 : hh;
      var mm = stime[1];
      var ampm = hh < 12 ? "AM" : "PM";
      var format = hr+":"+mm+" "+ampm;
      return format;
    }

    $scope.formatDate = function(date)
    {
      var d = moment(date).format('MMMM DD,YYYY');
      return d;
    }

    $scope.formatDateX = function(date)
    {
      var d = moment(date).format('x');
      var dt = moment(new Date()).format('x');
      if(d >= dt)
      {
        return true;
      }
      else
      {
        return false;
      }
    }
  /* /. */

  /* view pending bookings */
    $scope.viewBooking = function(id)
    {
      $ionicLoading.show({
        template: 'Fetching data<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getAppointment";
      obj.data   = new FormData();
      obj.data.append('appoint_id',id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                                $scope.events = success.data;
                                // for(var i = 0; i < $scope.events.length ; i++)
                                // {
                                //   if(i != $scope.events.length)
                                //   {
                                var obj    = new Object();
                                obj.method = 'POST';
                                obj.url    = $rootScope.baseURL + "?func=getProfile";
                                obj.data   = new FormData();
                                obj.data.append('profile_id',$scope.events[0].profile_id);
                                obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
                                obj.params = {};
                                Auth.REQUEST(obj).then(function(success) {
                                                          $scope.profile = success.data[0][0];

                                                          var obj    = new Object();
                                                          obj.method = 'POST';
                                                          obj.url    = $rootScope.baseURL + "?func=getPendingBookingById";
                                                          obj.data   = new FormData();
                                                          obj.data.append('provider_id',isLogged.provider_id);
                                                          obj.data.append('appoint_id',id);
                                                          obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
                                                          obj.params = {};

                                                          Auth.REQUEST(obj).then(function(success) {
                                                                                    $scope.booking_ = success.data;
                                                                                    $ionicLoading.hide();
                                                                                    $scope.booking.show();
                                                                                },
                                                                                function(error) {
                                                                                    $ionicLoading.hide();
                                                                                    console.log(error);
                                                                                    $ionicLoading.hide();
                                                                                    $rootScope.showToast('Failed !');
                                                                                  }
                                                                                );
                                                      },
                                                      function(error) {
                                                          console.log(error);
                                                          $ionicLoading.hide();
                                                          $rootScope.showToast('Failed !');
                                                        }
                                                      );
                                //   }
                                // }
                              },
                              function(error) { 
                                $ionicLoading.hide();
                              }
                            );
    }

    // -------------- Modal ---------------
        $ionicModal.fromTemplateUrl('Booking.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.booking = modal;
        });
      // -------------- End Modal ---------------

      /* Close Modal */
        $scope.closeBookingModal = function() {
          $scope.booking.hide();
        };
      /* /. */
  /* /. */

  /* approval of appointment */
    $scope.btn_action = function(id,stat,date,yard_size)
    {
      
      var status = "";
      if(stat == 0 || stat == '0')
      {
          var confirmPopup = $ionicPopup.confirm({
            title: 'Declining Appointment',
            template: 'Are you sure you want to decline this appointment?'
           });

          confirmPopup.then(function(res) {
          if(res) {
            status = "declined";
            $ionicLoading.show({
              template: 'Declining appointment<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
            });
            $scope.approved(id,status);
          } else {
            console.log('You are not sure');
          }
        });
      }
      else
      {
        status = "approved";
        $ionicLoading.show({
          template: 'Fetching available agents<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
        });
        var obj    = new Object();
        obj.method = 'POST';
        obj.url    = $rootScope.baseURL + "?func=getAgentByProvider";
        obj.data   = new FormData();
        obj.data.append('provider_id',isLogged.provider_id);
        obj.data.append('date',moment(date).format('YYYY-MM-DD'));
        obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
        obj.params = {};
        Auth.REQUEST(obj).then(function(success) {
                                if(success.data == 0)
                                {
                                  $rootScope.showToast('No available agent !');
                                }
                                else
                                {
                                  $scope.agents = success.data;
                                  $scope.appoint.agent = 0;
                                  $rootScope.appoint_id = id;
                                  $scope.yard_size = yard_size;
                                  $scope.appointAgent.show();
                                }
                                $ionicLoading.hide();
                              },
                              function(error) {
                                  console.log(error);
                                  $ionicLoading.hide();
                                  $rootScope.showToast('Failed !');
                                }
                              );
      }
    }
  /* /. */

  // -------------- Modal ---------------
        $ionicModal.fromTemplateUrl('appointAgent_.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.appointAgent = modal;
        });
      // -------------- End Modal ---------------

      /* Close Modal */
        $scope.closeAppointAgentModal = function() {
          $scope.appointAgent.hide();
        };

  /* appoint agent */
    $scope.addAppointAgent = function(data)
    {
      if($scope.appoint.agent == 0)
      {
        $scope.error = true;
      }
      else
      {
        $scope.error = false;
      }
      if(data.$valid)
      {
        if($scope.appoint.agent == 0)
        {
          $scope.error = true;
        }
        else
        {
          $scope.error = false;
          $ionicLoading.show({
            template: 'Approving appointment<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
          });
          var obj    = new Object();
          obj.method = 'POST';
          obj.url    = $rootScope.baseURL + "?func=addAppointAgent";
          obj.data   = new FormData();
          obj.data.append('provider_id',isLogged.provider_id);
          obj.data.append('agent_id',$scope.appoint.agent);
          obj.data.append('appoint_id',$rootScope.appoint_id);
          obj.data.append('service_tax',$scope.appoint.serv_tax);
          obj.data.append('gratuity_amount',$scope.appoint.amount);
          obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
          obj.params = {};
          Auth.REQUEST(obj).then(function(success) {
                                  if(success.data >= 1)
                                  {
                                    $scope.stat = "approved";
                                    $scope.approved($scope.appoint_id,$scope.stat);
                                  }
                                  else
                                  {
                                    $rootScope.showToast('Failed !');
                                  }
                                  $ionicLoading.hide();
                                },
                                function(error) {
                                    console.log(error);
                                    $ionicLoading.hide();
                                    $rootScope.showToast('Failed !');
                                  }
                                );
        }
      }
    }
  /* /. */

  /* approved */
    $scope.approved = function(id,status)
    {
      for(var a = 1 ; a <= 5 ; a++)
      {
        if(a == 1)
        {
          $scope.some_model[a] = true;
        }
        else
        {
          $scope.some_model[a] = false;
        }
        
      }
      // $scope.rate.show();
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=actionAppointment";
      obj.data   = new FormData();
      obj.data.append('appoint_id',id);
      obj.data.append('status',status);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                              if(success.data >= 1)
                              {
                                $rootScope.showToast('You '+status+' the appointment !');

                                if(status == 'declined')
                                {
                                  $rootScope.initializePending();
                                  $scope.booking.hide();
                                }
                                else
                                {
                                  $scope.booking.hide();
                                  $scope.rate.show();
                                  var obj    = new Object();
                                  obj.method = 'POST';
                                  obj.url    = $rootScope.baseURL + "?func=getAppointment";
                                  obj.data   = new FormData();
                                  obj.data.append('appoint_id',id);
                                  obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
                                  obj.params = {};
                                  Auth.REQUEST(obj).then(function(success) {
                                                            $scope.account_id = success.data[0].profile_id;
                                                            $scope.appointAgent.hide();
                                                        },
                                                        function(error) {
                                                            console.log(error);
                                                            $ionicLoading.hide();
                                                            $rootScope.showToast('Failed !');
                                                          }
                                                        );
                                }
                                 $ionicLoading.hide();
                              }
                              else
                              {
                                $rootScope.showToast('Failed !');
                              }
                              $ionicLoading.hide();
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }

    // -------------- Modal ---------------
        $ionicModal.fromTemplateUrl('rating.html', {
          scope: $scope,
          animation: 'slide-in-up',
          hardwareBackButtonClose: false
        }).then(function(modal) {
          $scope.rate = modal;
        });
      // -------------- End Modal ---------------

      /* Close Modal */
        $scope.closeRateModal = function() {
          $scope.rate.hide();
        }
  /* /. */

  /* status ucword*/
    $scope.ucword = function(word)
    {
      if(word == 'approved')
      {
        var a = "Approved";
        return a;
      }
      else
      {
        var a = "Declined";
        return a;
      }
    }
  /* /. */

  /* view invoice */
    $scope.viewInvoice = function(id)
    {
      $ionicLoading.show({
        template: 'Fetching Invoice <br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=viewInvoice";
      obj.data   = new FormData();
      obj.data.append('appoint_id',id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                                if(success.data == 0)
                                {
                                  $rootScope.showToast('Error');
                                  $ionicLoading.hide();
                                }
                                else
                                {
                                  $scope.invoice = success.data;
                                  var obj    = new Object();
                                  obj.method = 'POST';
                                  obj.url    = $rootScope.baseURL + "?func=getProfile";
                                  obj.data   = new FormData();
                                  obj.data.append('profile_id',success.data[0].profile_id);
                                  obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
                                  obj.params = {};
                                  Auth.REQUEST(obj).then(function(success) {
                                                          $scope.profile = success.data[0][0];
                                                          var obj    = new Object();
                                                          obj.method = 'POST';
                                                          obj.url    = $rootScope.baseURL + "?func=getListOfServices";
                                                          obj.data   = new FormData();
                                                          obj.data.append('appoint_id',id);
                                                          obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
                                                          obj.params = {};
                                                          Auth.REQUEST(obj).then(function(success1) {
                                                                                    $scope.listService = success1.data;
                                                                                    for(var y = 0 ; y < success1.data.length+1 ; y++)
                                                                                    {
                                                                                      if(y == success1.data.length)
                                                                                      {
                                                                                        $scope.servicetotal = total;
                                                                                        setTimeout(function(){
                                                                                          $scope.viewInvoiceInfo.show();
                                                                                          $ionicLoading.hide();
                                                                                        }, 3000);
                                                                                      }
                                                                                      else
                                                                                      {
                                                                                        total += parseFloat(success1.data[y].cost); 
                                                                                      }
                                                                                    }
                                                                                },
                                                                                function(error) {
                                                                                    console.log(error);
                                                                                    $ionicLoading.hide();
                                                                                    $rootScope.showToast('Failed !');
                                                                                  }
                                                                                );
                                                        },
                                                        function(error) {
                                                            console.log(error);
                                                            $ionicLoading.hide();
                                                            $rootScope.showToast('Failed !');
                                                          }
                                                        );
                                }
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }

    // -------------- Modal ---------------
      $ionicModal.fromTemplateUrl('viewInvoiceInfo.html', {
        scope: $scope,
        animation: 'slide-in-up',
        hardwareBackButtonClose: false
      }).then(function(modal) {
        $scope.viewInvoiceInfo = modal;
      });
    // -------------- End Modal ---------------

    /* Close Modal */
      $scope.closeInvoiceModal = function() {
        total = 0;
        $scope.viewInvoiceInfo.hide();
      }
    /* /. */
  /* /. */

  /* service total */
    $scope.total = function(service_total, serv_tax, gratuity)
    {
      if(isNaN(gratuity))
      {
        gratuity = 0;
      }
      if(isNaN(serv_tax))
      {
        serv_tax = 0;
      }
      var n = parseFloat(service_total)+parseFloat(gratuity)+parseFloat(serv_tax);
      return n.toFixed(2);
    }
  /* /. */

  /* check NaN */
    $scope.checkNan = function(num)
    {
      if(isNaN(num))
      {
        var n = parseFloat(0);
        return n.toFixed(2);
      }
      else
      {
        var n = parseFloat(num);
        return n.toFixed(2);
      }
    }
  /* /. */

  /* rate */
    $scope.rating = function(val)
    {
      var a = 0;
      for(a = 1 ; a <= 5 ; a++)
      {
        if(a <= val)
        {
          $scope.some_model[a] = true;
        }
        else
        {
          $scope.some_model[a] = false;
        }
      }
      $scope.rate_ = val;
    }
  /* /. */

  /* submit review */
    $scope.submitReview = function(id)
    {
      $ionicLoading.show({
        template: 'Submitting ... <br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=addCustReview";
      obj.data   = new FormData();
      obj.data.append('account_id',id);
      obj.data.append('star_rating',$scope.rate_);
      obj.data.append('comment',$scope.feed.feedback);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                              if(success.data >= 1)
                              {
                                $rootScope.showToast('Thank You !');
                                $rootScope.initializePending()
                                window.location.href="#/menu/calendarBusiness";
                                $scope.rate.hide();
                                $ionicLoading.hide();
                              }
                              else
                              {
                                $rootScope.showToast('Failed !');
                                $scope.rate.hide();
                                $ionicLoading.hide();
                              }
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }
  /* /. */

  /* view customer */
    $scope.viewCust = function(id)
    {
      var tmp1 = 0;
      var tmp2 = 0;
      var tmp3 = 0;
      var tmp4 = 0;
      var tmp5 = 0;
      var tmp_tot = 0;

      $ionicLoading.show({
        template: 'Fetching data<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      $scope.rating = {};
      $scope.rate = {};
      $scope.rating.max = 5;

      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getPersonalAccount";
      obj.data   = new FormData();
      obj.data.append('account_id',id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                              $scope.userInfo = success.data[0];
                              $scope.view_cust.show();
                              var obj    = new Object();
                              obj.method = 'POST';
                              obj.url    = $rootScope.baseURL + "?func=getUserReview";
                              obj.data   = new FormData();
                              obj.data.append('account_id',id);
                              obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
                              obj.params = {};
                              Auth.REQUEST(obj).then(function(success) {
                                                      if (success.data != 0)
                                                      {
                                                        $scope.view_ratings = true;
                                                        for(var i = 0 ; i < success.data.length ; i++)
                                                        {
                                                          tmp_tot += parseInt(success.data[i].star_rating);
                                                          if(success.data[i].star_rating == 1)
                                                          {
                                                            tmp1 += parseInt(success.data[i].star_rating);
                                                          }
                                                          else if(success.data[i].star_rating == 2)
                                                          {
                                                            tmp2 += parseInt(success.data[i].star_rating);
                                                          }
                                                          else if(success.data[i].star_rating == 3)
                                                          {
                                                            tmp3 += parseInt(success.data[i].star_rating);
                                                          }
                                                          else if(success.data[i].star_rating == 4)
                                                          {
                                                            tmp4 += parseInt(success.data[i].star_rating);
                                                          }
                                                          else if(success.data[i].star_rating == 5)
                                                          {
                                                            tmp5 += parseInt(success.data[i].star_rating);
                                                          }
                                                        }
                                                        
                                                        var avg_ = (tmp1*1) + (tmp2*2) + (tmp3*3) + (tmp4*4) + (tmp5*5);
                                                        var average_ = parseInt(avg_) / parseInt(tmp_tot);
                                                        $scope.avg = average_.toFixed(2);
                                                        $scope.tot = tmp_tot;
                                                        $scope.rating.rate = $scope.avg;
                                                        $scope.rate.one =  (parseInt(tmp1) / parseInt(tmp_tot)) * 100;
                                                        $scope.rate.two =  (parseInt(tmp2) / parseInt(tmp_tot)) * 100;
                                                        $scope.rate.three =  (parseInt(tmp3) / parseInt(tmp_tot)) * 100;
                                                        $scope.rate.four =  (parseInt(tmp4) / parseInt(tmp_tot)) * 100;
                                                        $scope.rate.five =  (parseInt(tmp5) / parseInt(tmp_tot)) * 100;
                                                        $ionicLoading.hide();
                                                      }
                                                      else
                                                      {

                                                        $scope.view_ratings = false;
                                                        $ionicLoading.hide();
                                                      }
                                                    },
                                                    function(error) {
                                                        console.log(error);
                                                        $ionicLoading.hide();
                                                        $rootScope.showToast('Failed !');
                                                      }
                                                    );
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }
    // -------------- Modal ---------------
      $ionicModal.fromTemplateUrl('viewCustInfo.html', {
        scope: $scope,
        animation: 'slide-in-up',
        hardwareBackButtonClose: false
      }).then(function(modal) {
        $scope.view_cust = modal;
      });
    // -------------- End Modal ---------------

    /* Close Modal */
      $scope.closeCustModal = function() {
        $scope.view_cust.hide();
      };
  /* /. */

  /* Initialization */
    $interval($rootScope.initializePending(),1000);
  /* /. */

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */
}])

.controller('myBusinessAccountCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth', '$ionicModal', '$cordovaGeolocation',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth, $ionicModal, $cordovaGeolocation) 
{
  
  $rootScope.backButtonPressedOnceToExit = false; 
  var isLogged = Auth.FETCH_DATA('userid');
  $scope.profile = [];
  $scope.view_ratings = false;
  $scope.view_map = false;

  /* function for initialize main*/
    $rootScope.initializeMyAccount = function()
    {
      var tmp1 = 0;
      var tmp2 = 0;
      var tmp3 = 0;
      var tmp4 = 0;
      var tmp5 = 0;
      var tmp_tot = 0;

      $scope.navTitle='<img class="title-image" src="img/header_logo.png" style="margin-left:40%;height: 40px;margin-top: 2px;"/>';
      $ionicLoading.show({
        template: 'Fetching data<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });

      $scope.rating = {};
      $scope.rate = {};
      $scope.rating.max = 5;

      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getBusinessAccount";
      obj.data   = new FormData();
      obj.data.append('provider_id',isLogged.provider_id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                              $scope.userInfo = success.data[0];
                              var location = [parseFloat(success.data[0].latitude),parseFloat(success.data[0].longitude)];
                              $scope.location = location;
                              $ionicLoading.hide();
                              // var obj    = new Object();
                              // obj.method = 'POST';
                              // obj.url    = $rootScope.baseURL + "?func=getProviderReview";
                              // obj.data   = new FormData();
                              // obj.data.append('provider_id',isLogged.provider_id);
                              // obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
                              // obj.params = {};
                              // Auth.REQUEST(obj).then(function(success) {
                              //                         if (success.data != 0)
                              //                         {
                              //                           $scope.view_ratings = true;
                              //                           for(var i = 0 ; i < success.data.length ; i++)
                              //                           {
                              //                             tmp_tot += parseInt(success.data[i].star_rating);
                              //                             if(success.data[i].star_rating == 1)
                              //                             {
                              //                               tmp1 += parseInt(success.data[i].star_rating);
                              //                             }
                              //                             else if(success.data[i].star_rating == 2)
                              //                             {
                              //                               tmp2 += parseInt(success.data[i].star_rating);
                              //                             }
                              //                             else if(success.data[i].star_rating == 3)
                              //                             {
                              //                               tmp3 += parseInt(success.data[i].star_rating);
                              //                             }
                              //                             else if(success.data[i].star_rating == 4)
                              //                             {
                              //                               tmp4 += parseInt(success.data[i].star_rating);
                              //                             }
                              //                             else if(success.data[i].star_rating == 5)
                              //                             {
                              //                               tmp5 += parseInt(success.data[i].star_rating);
                              //                             }
                              //                           }
                                                        
                              //                           var avg_ = (tmp1*1) + (tmp2*2) + (tmp3*3) + (tmp4*4) + (tmp5*5);
                              //                           $scope.avg = parseInt(avg_) / parseInt(tmp_tot);
                              //                           $scope.tot = tmp_tot;
                              //                           $scope.rating.rate = $scope.avg;
                              //                           $scope.rate.one =  (parseInt(tmp1) / parseInt(tmp_tot)) * 100;
                              //                           $scope.rate.two =  (parseInt(tmp2) / parseInt(tmp_tot)) * 100;
                              //                           $scope.rate.three =  (parseInt(tmp3) / parseInt(tmp_tot)) * 100;
                              //                           $scope.rate.four =  (parseInt(tmp4) / parseInt(tmp_tot)) * 100;
                              //                           $scope.rate.five =  (parseInt(tmp5) / parseInt(tmp_tot)) * 100;
                              //                           $ionicLoading.hide();
                              //                         }
                              //                         else
                              //                         {

                              //                           $scope.view_ratings = false;
                              //                           $ionicLoading.hide();
                              //                         }
                              //                       },
                              //                       function(error) {
                              //                           console.log(error);
                              //                           $ionicLoading.hide();
                              //                           $rootScope.showToast('Failed !');
                              //                         }
                              //                       );
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }
  /* /. */

  /* format */
    $scope.formatDate = function(date)
    {
      var d = moment(date).format('MMMM YYYY');
      return d;
    }
  /* /. */

  /* modal */
    $scope.editUser = function(id)
    {
      $ionicLoading.show({
        template: '<ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getBusinessAccount";
      obj.data   = new FormData();
      obj.data.append('provider_id',isLogged.provider_id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) { 
                              $scope.profile.company_name = success.data[0].company_name;
                              $scope.profile.certification_number = success.data[0].certification_number;
                              $scope.profile.latitude = success.data[0].latitude;
                              $scope.profile.longitude = success.data[0].longitude;
                              $scope.profile.phone = success.data[0].phone;
                              $scope.profile.email = success.data[0].email;
                              $scope.profile.profile_key = success.data[0].profile_key;
                              var location = [parseFloat($scope.profile.latitude),parseFloat($scope.profile.longitude)];
                              $scope.location = location;
                              $scope.edit_business.show();
                              $ionicLoading.hide();
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }

    // -------------- Modal ---------------
        $ionicModal.fromTemplateUrl('editBusiness.html', {
          scope: $scope,
          animation: 'slide-in-up'
        }).then(function(modal) {
          $scope.edit_business = modal;
        });
      // -------------- End Modal ---------------

      /* Close Modal */
        $scope.closeEditModal = function() {
          $scope.edit_business.hide();
        };
      /* /. */
  /* /. */

  /* update user */
    $scope.updateUser = function()
    {
      $ionicLoading.show({
        template: 'Updating information<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=updateBusinessUser";
      obj.data   = new FormData();
      obj.data.append('provider_id',isLogged.provider_id);
      obj.data.append('company_name',$scope.profile.company_name);
      obj.data.append('certification_number',$scope.profile.certification_number);
      obj.data.append('latitude',$scope.profile.latitude);
      obj.data.append('longitude',$scope.profile.longitude);
      obj.data.append('phone',$scope.profile.phone);
      obj.data.append('email',$scope.profile.email);
      obj.data.append('profile_key',$scope.profile.profile_key);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                              if(success.data == 1)
                              {
                                $rootScope.showToast('Successfully Updated !');
                                $rootScope.initializeMyAccount();
                              }
                              else
                              {
                                $rootScope.showToast('Failed to update !');
                                $rootScope.initializeMyAccount();
                              }

                              $scope.closeEditModal();
                              $ionicLoading.hide();
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }
  /* /. */

  /* navigate */
    $scope.navigate = function()
    {
      $ionicLoading.show({
        template: 'Fetching your location <br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation.getCurrentPosition(posOptions)
        .then(function (position) {
          var lat  = position.coords.latitude;
          var long = position.coords.longitude;
          $scope.profile.latitude = lat;
          $scope.profile.longitude = long;
          var location = [lat,long];
          $scope.location = location;
          $scope.view_map = true;
          $ionicLoading.hide();
          // $rootScope.showToast("The GPS successfully locate your location !");
        }, function(err) {
          $scope.view_map = false; 
          $rootScope.showToast("Check your GPS and try again !");
          $ionicLoading.hide();
        });
    }
  /* /. */

  /* View Map */
    $scope.viewMap = function(location)
    {
      $rootScope.latLong = location;
      $scope.closeEditModal();
      window.location.href = "#/menu/viewMap1";
    }
  /* /. */

  /* Initialization */
    $rootScope.initializeMyAccount();
  /* /. */

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */
}])

.controller('viewMap1Ctrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth', '$compile',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth, $compile) 
{
  
  $rootScope.backButtonPressedOnceToExit = false; 
  var latitude = $rootScope.latLong[0];
  var longitude = $rootScope.latLong[1];

  /* map */
    function initialize() {
      var center = {lat: latitude, lng: longitude};
      var mapProp = {
        center:center,
        zoom:15,
        mapTypeId:google.maps.MapTypeId.ROADMAP
      };
      console.log(center);
      var map  = new google.maps.Map(document.getElementById("googleMap"),mapProp);
      var marker = new google.maps.Marker({
        position: center,
        map: map,
        title: 'Hello World!'
      });

    }

    $ionicPlatform.ready(initialize);
  /* /. */

  /* close */
    $scope.close = function()
    {
      $rootScope.modalView = true;
      window.location.href="#/menu/myBusinessAccount"
    }
  /* /. */

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */
}])

.controller('dashboardCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth', '$compile', '$interval', '$cordovaLocalNotification',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth, $compile, $interval, $cordovaLocalNotification) 
{
  
  $rootScope.backButtonPressedOnceToExit = false;

  /* initialize main */
    $rootScope.initializeDashboard = function()
    {
      $scope.navTitle='<img class="title-image" src="img/header_logo.png" style="margin-left:40%;height: 40px;margin-top: 2px;"/>';
      $ionicLoading.show({
        template: 'Fetching data<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });

      $('.ionic-fullcalendar')
      .fullCalendar(
        {
          header:{
            left:'prev',
            center:'title',
            right:'next'
          },
          height:'auto'
        }
      );
      
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getAllPersonalAccounts";
      obj.data   = new FormData();
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) { 
                              if(success.data == 0)
                              {
                                $scope.countPerAccount = 0;
                              }
                              else
                              {
                                $scope.countPerAccount = success.data.length;
                              }
                              $scope.personalAccount = success.data;
                              var perCount = 0;
                              for(var x = 0; x < $scope.countPerAccount; x++)
                              {
                                if(moment($scope.personalAccount[x].date_created).format('YYYY-MM-DD') == moment(new Date()).format('YYYY-MM-DD'))
                                {
                                  perCount+=1;
                                }
                              }
                              $scope.newPerAccount = perCount;
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );

      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getAllBusinessAccounts";
      obj.data   = new FormData();
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                              if(success.data == 0)
                              {
                                $scope.countBusAccount = 0;
                              }
                              else
                              {
                                $scope.countBusAccount = success.data.length;
                              }
                              $scope.businessAccount = success.data;
                              var busCount = 0;
                              for(var x = 0; x < $scope.countBusAccount; x++)
                              {
                                if(moment($scope.businessAccount[x].date_created).format('YYYY-MM-DD') == moment(new Date()).format('YYYY-MM-DD'))
                                {
                                  busCount+=1;
                                }
                              }
                              $scope.newBusAccount = busCount;
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );

      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getAllInactiveBusinessAccounts";
      obj.data   = new FormData();
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                              if(success.data == 0)
                              {
                                $scope.countBusInAccount = 0;
                              }
                              else
                              {
                                $scope.countBusInAccount = success.data.length;
                              }
                              $ionicLoading.hide();
                                $cordovaLocalNotification.schedule({
                                  id: 1,
                                  title: 'Grass2go Lawn Care Services',
                                  text: $scope.countBusInAccount+" inactive business account(s) !",
                                  icon: 'res://app_icon.png',
                                  data: {
                                    customProperty: 'custom value'
                                  }
                                }).then(function (result) {
                                  console.log('Notification 1 triggered');
                                });
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }
  /* /. */

  $scope.tick = function()
  {
    $scope.datetime = moment(new Date()).format('ddd, MMMM DD,YYYY hh:mm:ss A ');
  }

  /*view more */
    $scope.viewMore = function()
    {
      window.location.href = "#/menu/listInactiveAccount";
    }
  /* /. */
  /* initialization */
    $rootScope.initializeDashboard();
    $interval($scope.tick, 1000);
  /* /. */

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */
}])

.controller('listPersonalAccountCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth', '$compile', '$interval', '$ionicActionSheet', '$ionicModal', '$ionicPopup',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth, $compile, $interval, $ionicActionSheet , $ionicModal, $ionicPopup ) 
{
  
  $rootScope.backButtonPressedOnceToExit = false; 
  var clicked = false; 
  $scope.view_ratings = false;

  /* initialize main */
    $rootScope.initializePerAccount = function()
    {
      $scope.navTitle='<img class="title-image" src="img/header_logo.png" style="margin-left:40%;height: 40px;margin-top: 2px;"/>';
      $ionicLoading.show({
        template: 'Fetching data<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getAllPersonalAccounts";
      obj.data   = new FormData();
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) { 
                              $scope.perAccount = success.data;
                              $ionicLoading.hide();
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }
  /* /. */

  /* sction sheet */
    $scope.actionPersonal = function(id)
    {
      clicked = true;
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
         buttons: [
            { text: 'View Information' },
            { text: 'Delete Account' },
          ],
          cancelText: 'Cancel',
          cancel: function() {
              clicked = false;
            },
          buttonClicked: function(index) {
            if(index == 0)
            {
              $scope.viewCust(id);
            }
            else
            {
              $scope.deleteAccount(id);
            }
            return true;
          }
       });
    }
  /* /. */

  /* view customer */
    $scope.viewCust = function(id)
    {
      var tmp1 = 0;
      var tmp2 = 0;
      var tmp3 = 0;
      var tmp4 = 0;
      var tmp5 = 0;
      var tmp_tot = 0;

      $ionicLoading.show({
        template: 'Fetching data<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      $scope.rating = {};
      $scope.rate = {};
      $scope.rating.max = 5;

      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getPersonalAccount";
      obj.data   = new FormData();
      obj.data.append('account_id',id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                              $scope.userInfo = success.data[0];
                              $scope.view_cust.show();
                              var obj    = new Object();
                              obj.method = 'POST';
                              obj.url    = $rootScope.baseURL + "?func=getUserReview";
                              obj.data   = new FormData();
                              obj.data.append('account_id',id);
                              obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
                              obj.params = {};
                              Auth.REQUEST(obj).then(function(success) {
                                                      if (success.data != 0)
                                                      {
                                                        $scope.view_ratings = true;
                                                        for(var i = 0 ; i < success.data.length ; i++)
                                                        {
                                                          tmp_tot += parseInt(success.data[i].star_rating);
                                                          if(success.data[i].star_rating == 1)
                                                          {
                                                            tmp1 += parseInt(success.data[i].star_rating);
                                                          }
                                                          else if(success.data[i].star_rating == 2)
                                                          {
                                                            tmp2 += parseInt(success.data[i].star_rating);
                                                          }
                                                          else if(success.data[i].star_rating == 3)
                                                          {
                                                            tmp3 += parseInt(success.data[i].star_rating);
                                                          }
                                                          else if(success.data[i].star_rating == 4)
                                                          {
                                                            tmp4 += parseInt(success.data[i].star_rating);
                                                          }
                                                          else if(success.data[i].star_rating == 5)
                                                          {
                                                            tmp5 += parseInt(success.data[i].star_rating);
                                                          }
                                                        }
                                                        
                                                        var avg_ = (tmp1*1) + (tmp2*2) + (tmp3*3) + (tmp4*4) + (tmp5*5);
                                                        var average_ = parseInt(avg_) / parseInt(tmp_tot);
                                                        $scope.avg = average_.toFixed(2);
                                                        $scope.tot = tmp_tot;
                                                        $scope.rating.rate = $scope.avg;
                                                        $scope.rate.one =  (parseInt(tmp1) / parseInt(tmp_tot)) * 100;
                                                        $scope.rate.two =  (parseInt(tmp2) / parseInt(tmp_tot)) * 100;
                                                        $scope.rate.three =  (parseInt(tmp3) / parseInt(tmp_tot)) * 100;
                                                        $scope.rate.four =  (parseInt(tmp4) / parseInt(tmp_tot)) * 100;
                                                        $scope.rate.five =  (parseInt(tmp5) / parseInt(tmp_tot)) * 100;
                                                        $ionicLoading.hide();
                                                      }
                                                      else
                                                      {
                                                        $scope.view_ratings = false;
                                                        $ionicLoading.hide();
                                                      }
                                                    },
                                                    function(error) {
                                                        console.log(error);
                                                        $ionicLoading.hide();
                                                        $rootScope.showToast('Failed !');
                                                      }
                                                    );
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }
    // -------------- Modal ---------------
      $ionicModal.fromTemplateUrl('viewCustInfo.html', {
        scope: $scope,
        animation: 'slide-in-up',
        hardwareBackButtonClose: false
      }).then(function(modal) {
        $scope.view_cust = modal;
      });
    // -------------- End Modal ---------------

    /* Close Modal */
      $scope.closeCustModal = function() {
        $scope.view_cust.hide();
      };
  /* /. */

  /* delete services */
    $scope.deleteAccount = function(id)
    {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete Account',
        template: 'Are you sure you want to delete this personal account?'
      });

      confirmPopup.then(function(res) {
        if(res) {
          $ionicLoading.show({
            template: 'Deleting <br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
          });
          var obj    = new Object();
              obj.method = 'POST';
              obj.url    = $rootScope.baseURL + '?func=deletePersonal';
              obj.data   = new FormData();
              obj.data.append('account_id',id);
              obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
              obj.params = {};
              Auth.REQUEST(obj).then(function(success) {
                                        console.log(success.data);
                                        if(success.data == '1')
                                        {
                                          // alert('Successfully Deleted');
                                          $rootScope.initializePerAccount();
                                          $rootScope.showToast('Successfully Deleted');
                                        }
                                        else
                                        {
                                          // alert('Failed');
                                          $rootScope.showToast('Failed');
                                        }
                                        $ionicLoading.hide();
                                    },
                                    function(error) { 
                                        console.log(error);
                                        $ionicLoading.hide();
                                      }
                                    );
        } else {
          console.log('Cancel');
        }
      });
    }
  /* /. */

  /* initialization */
    $rootScope.initializePerAccount();
  /* /. */

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */
}])

.controller('listBusinessAccountCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth', '$compile', '$interval', '$ionicActionSheet', '$ionicModal', '$ionicPopup',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth, $compile, $interval, $ionicActionSheet, $ionicModal, $ionicPopup) 
{
  
  $rootScope.backButtonPressedOnceToExit = false;
  var clicked = false; 

  /* initialize main */
    $rootScope.initializeBusAccount = function()
    {
      $scope.navTitle='<img class="title-image" src="img/header_logo.png" style="margin-left:40%;height: 40px;margin-top: 2px;"/>';
      $ionicLoading.show({
        template: 'Fetching data<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getAllBusinessAccounts";
      obj.data   = new FormData();
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) { 
                              $scope.countBusAccount = success.data.length;
                              $scope.businessAccount = success.data;
                              $ionicLoading.hide();
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }
  /* /. */

  /* sction sheet */
    $scope.actionBusiness = function(id)
    {
      clicked = true;
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
         buttons: [
            { text: 'View Information' },
            { text: 'Delete Account' },
          ],
          cancelText: 'Cancel',
          cancel: function() {
              clicked = false;
            },
          buttonClicked: function(index) {
            if(index == 0)
            {
              $scope.viewAcc(id);
            }
            else
            {
              $scope.deleteAccount(id);
            }
            return true;
          }
       });
    }
  /* /. */

  /* view */
    $scope.viewAcc = function(id)
    {
      var tmp1 = 0;
      var tmp2 = 0;
      var tmp3 = 0;
      var tmp4 = 0;
      var tmp5 = 0;
      var tmp_tot = 0;

      $scope.navTitle='<img class="title-image" src="img/header_logo.png" style="margin-left:40%;height: 40px;margin-top: 2px;"/>';
      $ionicLoading.show({
        template: 'Fetching data<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });

      $scope.rating = {};
      $scope.rate = {};
      $scope.rating.max = 5;

      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getBusinessAccount";
      obj.data   = new FormData();
      obj.data.append('provider_id',id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                              $scope.userInfo = success.data[0];
                              $scope.view_businesss.show();
                              $ionicLoading.hide();
                              // var obj    = new Object();
                              // obj.method = 'POST';
                              // obj.url    = $rootScope.baseURL + "?func=getProviderReview";
                              // obj.data   = new FormData();
                              // obj.data.append('provider_id',isLogged.provider_id);
                              // obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
                              // obj.params = {};
                              // Auth.REQUEST(obj).then(function(success) {
                              //                         if (success.data != 0)
                              //                         {
                              //                           $scope.view_ratings = true;
                              //                           for(var i = 0 ; i < success.data.length ; i++)
                              //                           {
                              //                             tmp_tot += parseInt(success.data[i].star_rating);
                              //                             if(success.data[i].star_rating == 1)
                              //                             {
                              //                               tmp1 += parseInt(success.data[i].star_rating);
                              //                             }
                              //                             else if(success.data[i].star_rating == 2)
                              //                             {
                              //                               tmp2 += parseInt(success.data[i].star_rating);
                              //                             }
                              //                             else if(success.data[i].star_rating == 3)
                              //                             {
                              //                               tmp3 += parseInt(success.data[i].star_rating);
                              //                             }
                              //                             else if(success.data[i].star_rating == 4)
                              //                             {
                              //                               tmp4 += parseInt(success.data[i].star_rating);
                              //                             }
                              //                             else if(success.data[i].star_rating == 5)
                              //                             {
                              //                               tmp5 += parseInt(success.data[i].star_rating);
                              //                             }
                              //                           }
                                                        
                              //                           var avg_ = (tmp1*1) + (tmp2*2) + (tmp3*3) + (tmp4*4) + (tmp5*5);
                              //                           $scope.avg = parseInt(avg_) / parseInt(tmp_tot);
                              //                           $scope.tot = tmp_tot;
                              //                           $scope.rating.rate = $scope.avg;
                              //                           $scope.rate.one =  (parseInt(tmp1) / parseInt(tmp_tot)) * 100;
                              //                           $scope.rate.two =  (parseInt(tmp2) / parseInt(tmp_tot)) * 100;
                              //                           $scope.rate.three =  (parseInt(tmp3) / parseInt(tmp_tot)) * 100;
                              //                           $scope.rate.four =  (parseInt(tmp4) / parseInt(tmp_tot)) * 100;
                              //                           $scope.rate.five =  (parseInt(tmp5) / parseInt(tmp_tot)) * 100;
                              //                           $ionicLoading.hide();
                              //                         }
                              //                         else
                              //                         {

                              //                           $scope.view_ratings = false;
                              //                           $ionicLoading.hide();
                              //                         }
                              //                       },
                              //                       function(error) {
                              //                           console.log(error);
                              //                           $ionicLoading.hide();
                              //                           $rootScope.showToast('Failed !');
                              //                         }
                              //                       );
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }
    // -------------- Modal ---------------
      $ionicModal.fromTemplateUrl('viewBusinessInfo.html', {
        scope: $scope,
        animation: 'slide-in-up',
        hardwareBackButtonClose: false
      }).then(function(modal) {
        $scope.view_businesss = modal;
      });
    // -------------- End Modal ---------------

    /* Close Modal */
      $scope.closeBusinesssModal = function() {
        $scope.view_businesss.hide();
      };
  /* /. */

  /* delete services */
    $scope.deleteAccount = function(id)
    {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete Account',
        template: 'Are you sure you want to delete this business account?'
      });

      confirmPopup.then(function(res) {
        if(res) {
          $ionicLoading.show({
            template: 'Deleting <br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
          });
          var obj    = new Object();
          obj.method = 'POST';
          obj.url    = $rootScope.baseURL + '?func=deleteBusiness';
          obj.data   = new FormData();
          obj.data.append('provider_id',id);
          obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
          obj.params = {};
          Auth.REQUEST(obj).then(function(success) {
                                    console.log(success.data);
                                    if(success.data == '1')
                                    {
                                      // alert('Successfully Deleted');
                                      $rootScope.initializeBusAccount();
                                      $rootScope.showToast('Successfully Deleted');
                                    }
                                    else
                                    {
                                      // alert('Failed');
                                      $rootScope.showToast('Failed');
                                    }
                                    $ionicLoading.hide();
                                },
                                function(error) { 
                                    console.log(error);
                                    $ionicLoading.hide();
                                  }
                                );
        } else {
          console.log('Cancel');
        }
      });
    }
  /* /. */

  /* initialization */
    $rootScope.initializeBusAccount();
  /* /. */

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */
}])

.controller('listInactiveAccountCtrl',['$scope','$rootScope','$ionicPlatform','$ionicHistory','$ionicLoading','Auth', '$compile', '$interval', '$ionicActionSheet', '$ionicModal', '$ionicPopup',
                function($scope,  $rootScope,  $ionicPlatform,  $ionicHistory,  $ionicLoading,  Auth, $compile, $interval, $ionicActionSheet, $ionicModal, $ionicPopup) 
{
  
  $rootScope.backButtonPressedOnceToExit = false;
  var clicked = false; 

  /* initialize main */
    $rootScope.initializeInactiveAccount = function()
    {
      $scope.navTitle='<img class="title-image" src="img/header_logo.png" style="margin-left:40%;height: 40px;margin-top: 2px;"/>';
      $ionicLoading.show({
        template: 'Fetching data<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });
      
      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getAllInactiveBusinessAccounts";
      obj.data   = new FormData();
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) { 
                              $scope.countBusInAccount = success.data.length;
                              $scope.inactiveAccount = success.data;
                              $ionicLoading.hide();
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }
  /* /. */

  /* sction sheet */
    $scope.actionInactive = function(id)
    {
      clicked = true;
      // Show the action sheet
      var hideSheet = $ionicActionSheet.show({
         buttons: [
            { text: 'View Information' },
            { text: 'Delete Account' },
            { text: 'Activate Account' },
          ],
          cancelText: 'Cancel',
          cancel: function() {
              clicked = false;
            },
          buttonClicked: function(index) {
            if(index == 0)
            {
              $scope.viewAcc(id);
            }
            else if(index == 1)
            {
              $scope.deleteAccount(id);
            }
            else if(index == 2)
            {
              $scope.activeAccount(id);
            }
            return true;
          }
       });
    }
  /* /. */

  /* view */
    $scope.viewAcc = function(id)
    {
      var tmp1 = 0;
      var tmp2 = 0;
      var tmp3 = 0;
      var tmp4 = 0;
      var tmp5 = 0;
      var tmp_tot = 0;

      $scope.navTitle='<img class="title-image" src="img/header_logo.png" style="margin-left:40%;height: 40px;margin-top: 2px;"/>';
      $ionicLoading.show({
        template: 'Fetching data<br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
      });

      $scope.rating = {};
      $scope.rate = {};
      $scope.rating.max = 5;

      var obj    = new Object();
      obj.method = 'POST';
      obj.url    = $rootScope.baseURL + "?func=getBusinessAccount";
      obj.data   = new FormData();
      obj.data.append('provider_id',id);
      obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
      obj.params = {};
      Auth.REQUEST(obj).then(function(success) {
                              $scope.userInfo = success.data[0];
                              $scope.view_businesss.show();
                              $ionicLoading.hide();
                              // var obj    = new Object();
                              // obj.method = 'POST';
                              // obj.url    = $rootScope.baseURL + "?func=getProviderReview";
                              // obj.data   = new FormData();
                              // obj.data.append('provider_id',isLogged.provider_id);
                              // obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
                              // obj.params = {};
                              // Auth.REQUEST(obj).then(function(success) {
                              //                         if (success.data != 0)
                              //                         {
                              //                           $scope.view_ratings = true;
                              //                           for(var i = 0 ; i < success.data.length ; i++)
                              //                           {
                              //                             tmp_tot += parseInt(success.data[i].star_rating);
                              //                             if(success.data[i].star_rating == 1)
                              //                             {
                              //                               tmp1 += parseInt(success.data[i].star_rating);
                              //                             }
                              //                             else if(success.data[i].star_rating == 2)
                              //                             {
                              //                               tmp2 += parseInt(success.data[i].star_rating);
                              //                             }
                              //                             else if(success.data[i].star_rating == 3)
                              //                             {
                              //                               tmp3 += parseInt(success.data[i].star_rating);
                              //                             }
                              //                             else if(success.data[i].star_rating == 4)
                              //                             {
                              //                               tmp4 += parseInt(success.data[i].star_rating);
                              //                             }
                              //                             else if(success.data[i].star_rating == 5)
                              //                             {
                              //                               tmp5 += parseInt(success.data[i].star_rating);
                              //                             }
                              //                           }
                                                        
                              //                           var avg_ = (tmp1*1) + (tmp2*2) + (tmp3*3) + (tmp4*4) + (tmp5*5);
                              //                           $scope.avg = parseInt(avg_) / parseInt(tmp_tot);
                              //                           $scope.tot = tmp_tot;
                              //                           $scope.rating.rate = $scope.avg;
                              //                           $scope.rate.one =  (parseInt(tmp1) / parseInt(tmp_tot)) * 100;
                              //                           $scope.rate.two =  (parseInt(tmp2) / parseInt(tmp_tot)) * 100;
                              //                           $scope.rate.three =  (parseInt(tmp3) / parseInt(tmp_tot)) * 100;
                              //                           $scope.rate.four =  (parseInt(tmp4) / parseInt(tmp_tot)) * 100;
                              //                           $scope.rate.five =  (parseInt(tmp5) / parseInt(tmp_tot)) * 100;
                              //                           $ionicLoading.hide();
                              //                         }
                              //                         else
                              //                         {

                              //                           $scope.view_ratings = false;
                              //                           $ionicLoading.hide();
                              //                         }
                              //                       },
                              //                       function(error) {
                              //                           console.log(error);
                              //                           $ionicLoading.hide();
                              //                           $rootScope.showToast('Failed !');
                              //                         }
                              //                       );
                            },
                            function(error) {
                                console.log(error);
                                $ionicLoading.hide();
                                $rootScope.showToast('Failed !');
                              }
                            );
    }
    // -------------- Modal ---------------
      $ionicModal.fromTemplateUrl('viewBusinessInfo.html', {
        scope: $scope,
        animation: 'slide-in-up',
        hardwareBackButtonClose: false
      }).then(function(modal) {
        $scope.view_businesss = modal;
      });
    // -------------- End Modal ---------------

    /* Close Modal */
      $scope.closeBusinesssModal = function() {
        $scope.view_businesss.hide();
      };
  /* /. */

  /* delete services */
    $scope.deleteAccount = function(id)
    {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Delete Account',
        template: 'Are you sure you want to delete this business account?'
      });

      confirmPopup.then(function(res) {
        if(res) {
          $ionicLoading.show({
            template: 'Deleting <br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
          });
          var obj    = new Object();
          obj.method = 'POST';
          obj.url    = $rootScope.baseURL + '?func=deleteBusiness';
          obj.data   = new FormData();
          obj.data.append('provider_id',id);
          obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
          obj.params = {};
          Auth.REQUEST(obj).then(function(success) {
                                    console.log(success.data);
                                    if(success.data == '1')
                                    {
                                      // alert('Successfully Deleted');
                                      $rootScope.initializeInactiveAccount();
                                      $rootScope.showToast('Successfully Deleted');
                                    }
                                    else
                                    {
                                      // alert('Failed');
                                      $rootScope.showToast('Failed');
                                    }
                                    $ionicLoading.hide();
                                },
                                function(error) { 
                                    console.log(error);
                                    $ionicLoading.hide();
                                  }
                                );
        } else {
          console.log('Cancel');
        }
      });
    }
  /* /. */

  /* active services */
    $scope.activeAccount = function(id)
    {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Activate Account',
        template: 'Are you sure you want to activate this business account?'
      });

      confirmPopup.then(function(res) {
        if(res) {
          $ionicLoading.show({
            template: 'Activating <br><ion-spinner class="spinner-calm" icon="lines"></ion-spinner>'
          });
          var obj    = new Object();
          obj.method = 'POST';
          obj.url    = $rootScope.baseURL + '?func=activeBusiness';
          obj.data   = new FormData();
          obj.data.append('provider_id',id);
          obj.data.append('loginSecret','0ff9346b4edc8dc033bff30762bc3c15d465d3f');
          obj.params = {};
          Auth.REQUEST(obj).then(function(success) {
                                    console.log(success.data);
                                    if(success.data == '1')
                                    {
                                      // alert('Successfully Deleted');
                                      $rootScope.initializeInactiveAccount();
                                      $rootScope.showToast('Successfully Activated');
                                    }
                                    else
                                    {
                                      // alert('Failed');
                                      $rootScope.showToast('Failed');
                                    }
                                    $ionicLoading.hide();
                                },
                                function(error) { 
                                    console.log(error);
                                    $ionicLoading.hide();
                                  }
                                );
        } else {
          console.log('Cancel');
        }
      });
    }
  /* /. */

  /* initialization */
    $rootScope.initializeInactiveAccount();
  /* /. */

  /* back button of device not allowed */
    $ionicPlatform.registerBackButtonAction(function ()
    {
      $rootScope.showToast("Only the App's back button is allowed.");
    }, 100);
  /* /. */
}])