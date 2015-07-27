'use strict'
var app = angular.module('muriquee')

app.factory('GeocodingService', function($http){

	var url = 'http://nominatim.openstreetmap.org/search/';

	var geocode = function(query){
		var req = {

		}
	}
	var reverseGeocode = function(lat, lon){

	}
	return {
		geocode:geocode,
		reverseGeocode:reverseGeocode
	}
})