'use strict'
var app = angular.module('muriquee')

app.controller('ProfileSearchCtrl', function($scope, $http, $localStorage){
	//listeners
	$scope.submitSearch = function(index){
		var req = {
 			method: 'POST',
 			url: '/api/profileSearch',
 			headers: {
   				'Content-Type': 'application/json'
 			},
 			data: JSON.stringify($localStorage.searchOptions)
		}
		$http(req)
		.success(function(data){
			$localStorage.searchResults = data;
			$scope.searchResultsCount = $localStorage.searchResults.length;
		})
		.error(function(){
			alert('error retreiving data from server');
		})
	}
	$scope.showProfile = function(p){
		$localStorage.selectedResult = p;
	}
	$scope.pingProfile = function(p){
		//TODO
		alert('ping profile: \n' + JSON.stringify(p));
	}
	$scope.commentProfile = function(p){
		//TODO
		alert('commentProfile: \n' + JSON.stringify(p));
	}
	$scope.rememberProfile = function(p){
		if (!$scope.storage.rememberedProfiles){
			$scope.storage.rememberedProfiles = [];
		}
		if ($scope.storage.rememberedProfiles.indexOf(p) == -1){
			$scope.storage.rememberedProfiles.push(p);
			p.isRemembered = true;
		}
	}
	$scope.removeRemeberedProfile = function(p){
		var i = $scope.storage.rememberedProfiles.indexOf(p);
		$scope.storage.rememberedProfiles.splice(i, 1);
		p.isRemembered = false;
	}
	$scope.rememberAll = function(){
		$scope.storage.searchResults.forEach($scope.rememberProfile);
	}
	$scope.removeAll = function(){
		$scope.storage.rememberedProfiles.forEach(function(p){
			p.isRemembered = false;
		});
		$scope.storage.rememberedProfiles = [];
	}
	$scope.pushCall = function(){
		var req = {
 			method: 'POST',
 			url: '/api/sendProposal',
 			headers: {
   				'Content-Type': 'application/json'
 			},
 			data: {
 				profile:$scope.storage.profile,
 				profiles:$scope.storage.rememberedProfiles,
 				proposedDate:$scope.storage.selectedDate,
 			}
		}
		$http(req)
		.success(function(data){
			$localStorage.
			alert('sucessfully sent proposals');
		})
		.error(function(){
			alert('error sending proposals');
		})
	}

	//filters
	$scope.filterOnTour = function(p){
		//TODO
		return true;
	}
	$scope.filterResident = function(p){
		//TODO
		return false;
	}

	$scope.onProfileTypeSelectionChanged = function(){
		var pt = $localStorage.searchOptions.profileType;
		if (pt === 'Artist'){
			$scope.profileSubtypes = $localStorage.datalists.artistTypes;
		}
		else if (pt === 'Venue'){
			$scope.profileSubtypes = $localStorage.datalists.venueTypes;
		}
		else {
			$scope.profileSubtypes = $localStorage.datalists.organiserTypes;
		}
		$scope.storage.searchOptions.subtypes = []
	}

	$scope.storage = $localStorage;
	if (!$scope.storage.rememberedProfiles){
		$scope.storage.rememberedProfiles = [];
	}

	$scope.profileTypes   = ['Artist', 'Venue', 'Promoter'];

	$scope.profileSubtypes = [];

	if ($localStorage.searchOptions === {}){
		$localStorage.searchOptions  = {
			profileType    : 'Artist',
			location       : [ 0.0, 0.0 ],
			radius         : 15.0,
			genres         : [],
			subtypes       : [],
			profileName    : ''
		};
	}
	$scope.searchResultsCount = $localStorage.searchResults.length;
});