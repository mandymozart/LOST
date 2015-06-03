'use strict'

var app = angular.module('muriquee');

app.controller('NegotiationDetailCtrl', function($scope, $localStorage){
	$scope.negotiation = $localStorage.selectedNegotiation;
	$scope.messageAreaText = " ";
	$scope.profile = $localStorage.profile;

	$scope.sent = function(nm){
		return nm.sender === $localStorage.profile._id;
	}
	$scope.send = function(){
		//TODO
		alert($scope.messageAreaText);
	}
});