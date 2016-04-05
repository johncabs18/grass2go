"use strict"

var app = angular.module('proweaver.services',[]);

app.factory('Auth', ['$http','$rootScope', 
			 function($http,  $rootScope)
{
	$rootScope.baseURL      = 'http://web.proweaverlinks.com/tech/grass2golcs/';
	$rootScope.userIds       = 0;
	$rootScope.isLogged = false;
	$rootScope.property_name = '';
    $rootScope.property_address = '';
    $rootScope.property_postCode = '';
    $rootScope.property_phone = '';
    $rootScope.property_email = '';
	$rootScope.card_name = '';
    $rootScope.card_number = '';
    $rootScope.card_startDate = '';
    $rootScope.card_endDate = '';
    $rootScope.card_issueNumber = '';
    $rootScope.datePick = '';
    $rootScope.latLong = [];
	$rootScope.appoint_id = 0;
	$rootScope.modalView = false;

    var fac  = {};

	fac.STORE_DATA = function(database,data)
	{
		localStorage.setItem(database,JSON.stringify(data));
	}

	fac.FETCH_DATA = function(name)
	{
		var checker = localStorage.getItem(name);
		return checker ? JSON.parse(checker) : false;
	}

	fac.REQUEST = function(obj)
	{ 
		var http = $http(
			                {
			                    method            : obj.method,
			                    url               : obj.url,
			                    data              : obj.data,
			                    params            : obj.params,
			                    transformRequest  : angular.identity,
			                    headers           : { 'Content-Type':undefined }
			                }
	                    );
		return http;
	}	

	return fac;
}]);

app.factory('Storage',['$rootScope',
			   function($rootScope)
{
	var fac    = {};
	var events = [];
	fac.STORE_EVENT = function(data)
	{
		events = data;
	}

	fac.GET_EVENT   = function()
	{
		return events;
	}
	return fac;
}]);

app.directive('noCacheSrc', function($window) {
  return {
    priority: 99,
    link: function(scope, element, attrs) {
      attrs.$observe('noCacheSrc', function(noCacheSrc) {
        noCacheSrc += '?' + (new Date()).getTime();
        attrs.$set('src', noCacheSrc);
      });
    }
  }
});
