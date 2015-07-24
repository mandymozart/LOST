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
	$scope.showProfile = function(p){
		$localStorage.selectedResult = p;
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
                setTimeout(function(){
                    var wHeight = window.innerHeight;
                    $('#negotiationDetailChatBody').height(wHeight-445);
                    var wtf = $('#negotiationDetailChatBody');
                    var height = wtf[0].scrollHeight;
                    wtf.scrollTop(height);
                },500);


		})
		.error(function(){
			alert('error populating negotiation messages');
		});
	}
	$scope.unselectNegotiations = function(){
		$localStorage.selectedNegotiation = undefined;
	}
	$scope.dateFilter = function(n){
		return !$scope.filterDate || ((new Date(n.date).setHours(0,0,0,0)) == (new Date($localStorage.selectedDate).setHours(0,0,0,0)));
	}
	$scope.filterDate = false;
	
});