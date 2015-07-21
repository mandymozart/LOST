'use strict';
var app = angular.module('muriquee')

app.controller('IncomingProposalsCtrl', function($scope, $localStorage, $http){
	$scope.storage = $localStorage;
	$scope.proposals = $localStorage.profile.proposals;

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
	$scope.getDay = function(p){
		return new Date(p.proposedDate).getUTCDate();
	}
	$scope.getMonth = function(p){
		return monthNames[new Date(p.proposedDate).getUTCMonth()];
	}
	$scope.getYear = function(p){
		return new Date(p.proposedDate).getUTCFullYear();
	}

	$scope.showProfile = function(p){
		$localStorage.selectedResult = p;
	}
	$scope.acceptProposal = function(p){
		var req = {
 			method: 'POST',
 			url: '/profilesData',
 			headers: {
   				'Content-Type': 'application/json'
 			},
 			data: {
 				acceptProposal:true,
 				proposal:p,
 				profile:$localStorage.profile
 			}
		}
		$http(req)
		.success(function(data){
			console.log(data);
			$localStorage.profile = data;
			alert('sucessfully accepted proposal');
		})
		.error(function(){
			alert('error accepting proposal');
		})
	}
	$scope.declineProposal = function(p){
		//TODO
		alert(p);
	}
});