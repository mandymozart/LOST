'use strict'
var app = angular.module('muriquee')


app.controller('ProfileDetailReadonlyCtrl', function($scope, $localStorage, SoundcloudService){
	$scope.storage = $localStorage;

	SoundcloudService();
})