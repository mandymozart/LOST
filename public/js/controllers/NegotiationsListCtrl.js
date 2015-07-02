'use strict'

var app = angular.module('muriquee');

app.controller('NegotiationsListCtrl', function($scope, $localStorage, $http){
	$scope.storage = $localStorage;
	$localStorage.selectedNegotiation = undefined;
	
	$scope.otherProfile = function(n){
		if (n.sender._id == $localStorage.profile._id){
			return n.receiver;
		}
		else{
			return n.sender;
		}
	}

	$scope.selectNegotiation = function(n){
		var req = {
			method: 'POST',
 			url: '/api/populateNegotiationMessages',
 			headers: {
   				'Content-Type': 'application/json'
 			},
			data:{
				negotiation:n
			}
		};
		$http(req)
		.success(function(data){
			$localStorage.selectedNegotiation = data;
		})
		.error(function(){
			alert('error populating negotiation messages');
		});
	}
	$scope.unselectNegotiations = function(){
		$localStorage.selectedNegotiation = undefined;
	}
	$scope.dateFilter = function(n){
		return !filterDate || n.date == $localStorage.selectedDate;
	}
	$scope.filterDate = false;
});