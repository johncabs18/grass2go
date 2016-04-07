angular.module('proweaver', ['ionic','ionic.service.core', 'proweaver.controllers', 'proweaver.services','ngCordova','ionic-timepicker','onezone-datepicker','ionic-ratings','ionic.rating'])

.config(function($compileProvider){
  // $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|ftp|mailto|file|tel):/);
  $compileProvider.imgSrcSanitizationWhitelist(/^\s*(https?|file|blob|cdvfile|content):|data:image\//);
})
.run(function($ionicPlatform, $rootScope) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);    
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  $rootScope.showToast = function(msg)
  {
    window.plugins.toast.showShortBottom(msg, 
        function(a) { console.log('toast success: ' + a) }, 
        function(b) { console.log('toast error: ' + b) });
  }

})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
  .state('menu', {
    url: '/menu',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'menuCtrl'
  })

  .state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginCtrl'
  })

  .state('forgotPass', {
    url: '/forgotPass',
    templateUrl: 'templates/forgotPass.html',
    controller: 'forgotPassCtrl'
  })

  .state('personalAccount', {
    url: '/personalAccount',
    templateUrl: 'templates/personalAccount.html',
    controller: 'personalAccountCtrl'
  })

  .state('businessAccount', {
    url: '/businessAccount',
    templateUrl: 'templates/businessAccount.html',
    controller: 'businessAccountCtrl'
  })

  .state('viewMap', {
    url: '/viewMap',
    templateUrl: 'templates/viewMap.html',
    controller: 'viewMapCtrl'
  })

  .state('paymentSection', {
    url: '/paymentSection',
    templateUrl: 'templates/paymentSection.html',
    controller: 'paymentSectionCtrl'
  })

  .state('profileSection', {
    url: '/profileSection',
    templateUrl: 'templates/profileSection.html',
    controller: 'profileSectionCtrl'
  })

  .state('menu.calendar', {
    url: '/calendar',
    views: {
      'menuContent': {
        templateUrl: 'templates/calendar.html',
        controller: 'calendarCtrl'
      }
    }
  })

  .state('menu.calendarBusiness', {
    url: '/calendarBusiness',
    views: {
      'menuContent': {
        templateUrl: 'templates/calendarBusiness.html',
        controller: 'calendarBusinessCtrl'
      }
    }
  })

  .state('menu.calendarList', {
    url: '/calendarList',
    views: {
      'menuContent': {
        templateUrl: 'templates/calendarList.html',
        controller: 'calendarListCtrl'
      }
    }
  })

  .state('menu.calendarBusinessList', {
    url: '/calendarBusinessList',
    views: {
      'menuContent': {
        templateUrl: 'templates/calendarBusinessList.html',
        controller: 'calendarBusinessListCtrl'
      }
    }
  })
  
  .state('menu.myAccount', {
    url: '/myAccount',
    views: {
      'menuContent': {
        templateUrl: 'templates/myAccount.html',
        controller: 'myAccountCtrl'
      }
    }
  })

  .state('menu.invoice', {
    url: '/invoice',
    views: {
      'menuContent': {
        templateUrl: 'templates/invoice.html',
        controller: 'invoiceCtrl'
      }
    }
  })

  .state('menu.services', {
    url: '/services',
    views: {
      'menuContent': {
        templateUrl: 'templates/services.html',
        controller: 'servicesCtrl'
      }
    }
  })

  .state('menu.agents', {
    url: '/agents',
    views: {
      'menuContent': {
        templateUrl: 'templates/agents.html',
        controller: 'agentsCtrl'
      }
    }
  })

  .state('menu.appointProvider', {
    url: '/appointProvider',
    views: {
      'menuContent': {
        templateUrl: 'templates/appointProvider.html',
        controller: 'appointProviderCtrl'
      }
    }
  })

  .state('menu.pendingBookings', {
    url: '/pendingBookings',
    views: {
      'menuContent': {
        templateUrl: 'templates/pending.html',
        controller: 'pendingCtrl'
      }
    }
  })

  .state('menu.myBusinessAccount', {
    url: '/myBusinessAccount',
    views: {
      'menuContent': {
        templateUrl: 'templates/myBusinessAccount.html',
        controller: 'myBusinessAccountCtrl'
      }
    }
  })

  .state('menu.viewMap1', {
    url: '/viewMap1',
    views: {
      'menuContent': {
        templateUrl: 'templates/viewMap1.html',
        controller: 'viewMap1Ctrl'
      }
    }
  })

  .state('menu.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
        controller: 'dashboardCtrl'
      }
    }
  })

  .state('menu.listPersonalAccount', {
    url: '/listPersonalAccount',
    views: {
      'menuContent': {
        templateUrl: 'templates/ListPersonalAccount.html',
        controller: 'listPersonalAccountCtrl'
      }
    }
  })

  .state('menu.listBusinessAccount', {
    url: '/listBusinessAccount',
    views: {
      'menuContent': {
        templateUrl: 'templates/ListBusinessAccount.html',
        controller: 'listBusinessAccountCtrl'
      }
    }
  })

  .state('menu.listInactiveAccount', {
    url: '/listInactiveAccount',
    views: {
      'menuContent': {
        templateUrl: 'templates/ListInactiveAccount.html',
        controller: 'listInactiveAccountCtrl'
      }
    }
  })

  .state('menu.viewMap2', {
    url: '/viewMap2',
    views: {
      'menuContent': {
        templateUrl: 'templates/viewMap2.html',
        controller: 'viewMap2Ctrl'
      }
    }
  })

  .state('menu.viewMap3', {
    url: '/viewMap3',
    views: {
      'menuContent': {
        templateUrl: 'templates/viewMap3.html',
        controller: 'viewMap3Ctrl'
      }
    }
  })

  .state('menu.providers', {
    url: '/providers',
    views: {
      'menuContent': {
        templateUrl: 'templates/providers.html',
        controller: 'providersCtrl'
      }
    }
  })

  .state('menu.viewMap4', {
    url: '/viewMap4',
    views: {
      'menuContent': {
        templateUrl: 'templates/viewMap4.html',
        controller: 'viewMap4Ctrl'
      }
    }
  });

  // .state('playlists', {
  //   url: "/playlists",
  //   templateUrl: "templates/playlists.html",
  //   controller:  'playlistsCtrl'
  // })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/menu/calendar');
});
