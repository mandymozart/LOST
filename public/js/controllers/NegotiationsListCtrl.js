'use strict'

var app = angular.module('muriquee');

app.controller('NegotiationsListCtrl', function($scope, $localStorage, $http){
	$scope.negotiations = $localStorage.profile.negotiations;
	$scope.storage = $localStorage;
	
	$scope.otherProfile = function(n){
		if (n.sender._id == $localStorage.profile._id){
			return n.receiver;
		}
		else{
			return n.sender;
		}
	}

	$scope.selectNegotiation = function(n){
		//var req = {
 		//	method: 'POST',
 		//	url: '/profilesData',
 		//	headers: {
   		//		'Content-Type': 'application/json'
 		//	},
 		//	data: {
 		//		populateNegotiationMessages:true,
 		//		negotiation:$localStorage.selectedNegotiation
 		//	}
		//};
		//$http(req)
		//.success(function(data){
		//	$localStorage.selectedNegotiation = data;
		//	//$localStorage.selectedNegotiation.other = undefined; //TODO
		//})
		//.error(function(){
		//	alert('error retreiveing negotiations messages from server');
		//});
		$localStorage.selectedNegotiation = n;
	}
});