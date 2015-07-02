'use strict'
var app = angular.module('muriquee')

app.controller('ProfileSearchCtrl', function($scope, $http, $localStorage){
	//listeners
	$scope.submitSearch = function(index){
		$localStorage.searchOptions.profileSearch = true;
		var req = {
 			method: 'POST',
 			url: '/profilesData',
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
 			url: '/profilesData',
 			headers: {
   				'Content-Type': 'application/json'
 			},
 			data: {
 				profile:$scope.storage.profile,
 				profiles:$scope.storage.rememberedProfiles,
 				proposedDate:$scope.storage.selectedDate,
 				sendProposal:true
 			}
		}
		$http(req)
		.success(function(data){
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
		var pt = $scope.storage.searchOptions.profileType;
		if (pt === 'Artist'){
			$scope.profileSubtypes = $scope.artistTypes;
		}
		else if (pt === 'Venue'){
			$scope.profileSubtypes = $scope.venueTypes;
		}
		else {
			$scope.profileSubtypes = $scope.organiserTypes;
		}
		$scope.storage.searchOptions.subtypes = []
	}

	$scope.storage = $localStorage;
	if (!$scope.storage.rememberedProfiles){
		$scope.storage.rememberedProfiles = [];
	}

	$scope.profileTypes   = ['Artist', 'Venue', 'Promoter'];

	$scope.artistTypes    = ['Solo Performer', 'Band', 'Magician', 'Orchestra'];
	$scope.venueTypes     = ['Concert Hall', 'Live Hall', 'Club', 'Open Air', 'Bar'];
	$scope.organiserTypes = ['Live', 'Club', 'Festival', 'Avant Garde'];

	$scope.profileSubtypes = $scope.artistTypes;

    $scope.getProfileTypes = function(){
        var res = []
        for(var i,)
    }

	$scope.genres         = ['Rock','Pop','Classic','Deep House','Hip Hop','Experimental','Techno','Acid House'];
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