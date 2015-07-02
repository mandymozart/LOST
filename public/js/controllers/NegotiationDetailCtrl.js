'use strict'

var app = angular.module('muriquee');

app.controller('NegotiationDetailCtrl', function($scope, $localStorage, $http){
	$scope.models = {}
	$scope.models.messageAreaText = '';
	$scope.storage = $localStorage;

	$scope.sent = function(nm){
		return nm.sender === $localStorage.profile._id;
	}
	$scope.send = function(){
		//alert($scope.models.messageAreaText);
		var req = {
 			method: 'POST',
 			url: '/api/sendNegotiationMessage',
 			headers: {
   				'Content-Type': 'application/json'
 			},
 			data: {
 				negotiation:$localStorage.selectedNegotiation,
 				message:$scope.models.messageAreaText,
 				profile:$localStorage.profile
 			}
		};
		$http(req)
		.success(function(data){
			var req = {
				method: 'POST',
 				url: '/api/populateNegotiationMessages',
 				headers: {
   					'Content-Type': 'application/json'
 				},
				data:{
					negotiation:data
				}
			};
			$http(req)
			.success(function(data){
				$localStorage.selectedNegotiation = data;
			})
			.error(function(){
				alert('error populating negotiation messages');
			});
		})
		.error(function(){
			alert('error posting negotiation message');
		});
	}
	$scope.offer = function(){
		var req = {
			method : 'POST',
			url : '/api/submitNegotiationOffer',
			headers : {
				'Content-Type':'application/json'
			} ,
			data : {
				negotiation:$localStorage.selectedNegotiation,
				offer:$localStorage.selectedNegotiation.currentOffer
			}
		}
		$http(req)
		.success(function(data){
			$localStorage.selectedNegotiation = data;
		})
		.error(function(){
			alert('error submitting offer');
		})
	}
	$scope.accept = function(){
		//TODO
	}
	$scope.decline = function(){
		//TODO
	}
});