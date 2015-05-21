'use strict';
var app = angular.module('muriquee')

app.controller('NavbarCtrl', function($scope, $localStorage){
	$scope.profile = $localStorage.profile;
	$scope.profiles = $localStorage.profiles;
})