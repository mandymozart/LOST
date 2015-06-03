'use strict'
var app = angular.module('muriquee')

app.controller('ProfileSearchCtrl', function($scope, $http, $localStorage){
	//listeners
	$scope.submitSearch = function(index){
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

	//filters
	$scope.filterOnTour = function(p){
		//TODO
		return true;
	}
	$scope.filterResident = function(p){
		//TODO
		return false;
	}

	$scope.storage = $localStorage;

	$scope.profileTypes   = ['Artist', 'Venue', 'Promoter'];
	$scope.artistTypes    = ['Solo Performer', 'Band', 'Magician', 'Orchestra'];
	$scope.venueTypes     = ['Concert Hall', 'Live Hall', 'Club', 'Open Air', 'Bar'];
	$scope.organiserTypes = ['Live', 'Club', 'Festival', 'Avant Garde'];
	$scope.genres         = ['Rock','Pop','Classic','Deep House','Hip Hop','Experimental','Techno','Acid House'];
	if ($localStorage.searchOptions === {}){
		$localStorage.searchOptions  = {
			profileType    : 'Artist',
			location       : [ 0.0, 0.0 ],
			radius         : 15.0,
			genres         : [],
			subtype        : '',
			profileName    : ''
		};
	}
	$scope.searchResultsCount = $localStorage.searchResults.length;
});