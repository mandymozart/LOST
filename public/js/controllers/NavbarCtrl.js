'use strict';
var app = angular.module('muriquee')

app.controller('NavbarCtrl', function($scope, $localStorage){
	$scope.profile = $localStorage.profile;
	$scope.profiles = $localStorage.profiles;

	var monthNames = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	]

	$scope.getDay = function(){
		return new Date($localStorage.selectedDate).getUTCDate();
	}
	$scope.getMonth = function(){
		return monthNames[new Date($localStorage.selectedDate).getUTCMonth()];
	}
	$scope.getYear = function(){
		return new Date($localStorage.selectedDate).getUTCFullYear();
	}
})