'use strict';
var app = angular.module('muriquee')

app.controller('IncomingProposalsCtrl', function($scope, $localStorage, $http,SoundcloudService,Notification){
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
		SoundcloudService();
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
			$localStorage.viewmode = 'negotiation';
			$scope.selectNegotiation(data.negotiations[data.negotiations.length - 1]);
		})
		.error(function(){
			Notification.error('Error accepting proposal');
		})
	}
	$scope.declineProposal = function(p){
		//TODO
		alert(p);
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
			if (data) $localStorage.viewmode = 'negotiation';
            setTimeout(function(){
                var wHeight = window.innerHeight;
                $('#negotiationDetailChatBody').height(wHeight-445);
                var wtf = $('#negotiationDetailChatBody');
                if (wtf[0]){
                	var height = wtf[0].scrollHeight;
            		wtf.scrollTop(height);
            	}
            },500);
		})
		.error(function(){
			Notification.error('Error populating negotiation messages');
		});
	}
});