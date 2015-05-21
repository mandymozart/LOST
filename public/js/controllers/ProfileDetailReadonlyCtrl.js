'use strict'
var app = angular.module('muriquee')


app.controller('ProfileDetailReadonlyCtrl', function($scope, $localStorage){
	$scope.storage = $localStorage;
})