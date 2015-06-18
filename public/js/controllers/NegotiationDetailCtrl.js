'use strict'

var app = angular.module('muriquee');

app.controller('NegotiationDetailCtrl', function($scope, $localStorage, $http){
	$scope.negotiation = $localStorage.selectedNegotiation;
	$scope.messageAreaText = " ";
	$scope.profile = $localStorage.profile;
	$scope.storage = $localStorage;

	$scope.sent = function(nm){
		return nm.sender === $localStorage.profile._id;
	}
	$scope.send = function(){
		//alert(messageAreaText);
		var req = {
 			method: 'POST',
 			url: '/profilesData',
 			headers: {
   				'Content-Type': 'application/json'
 			},
 			data: {
 				sendNegotiationMessage:true,
 				negotiation:$localStorage.selectedNegotiation,
 				message:$scope.messageAreaText,
 				profile:$localStorage.profile
 			}
		};
		$http(req)
		.success(function(data){
			$localStorage.selectedNegotiation = data;
			//$localStorage.selectedNegotiation.other = undefined; //TODO
		})
		.error(function(){
			alert('error posting negotiation message');
		});
	}
});