'use strict'
var app = angular.module('muriquee')

app.controller('ProfileSearchCtrl', function($scope, $http){
	//listeners
	$scope.tabchanged = function(index){
		$scope.searchOptions.profileTypes = $scope.profileTypes[index];
	}
	$scope.radiochanged = function(index){
		alert('click');
	}
	$scope.submitSearch = function(index){
		var req = {
 			method: 'POST',
 			url: '/profilesData',
 			headers: {
   				'Content-Type': 'application/json'
 			},
 			data: JSON.stringify($scope.searchOptions)
		}
		$http(req)
		.success(function(data){
			$scope.searchResults = data;
			$scope.searchResultsCount = JSON.stringify($scope.searchResults.length);
		})
		.error(function(){
			alert('error retreiving data from server');
		})
		//TODO
		//$scope.searchResults.push({name:"name", type:"type", genres:["polka","jazz"]});		
	}
	$scope.showProfile = function(p){
		//TODO
		alert('show profile: \n' + JSON.stringify(p));
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

	$scope.profileTypes   = ['Artist', 'Venue', 'Promoter'];
	$scope.artistTypes    = ['Solo Performer', 'Band', 'Magician', 'Orchestra'];
	$scope.venueTypes     = ['Concert Hall', 'Live Hall', 'Club', 'Open Air', 'Bar'];
	$scope.genres         = ['Rock','Pop','Classic','Deep House','Hip Hop','Experimental','Techno','Acid House'];
	$scope.organiserTypes = ['Live', 'Club', 'Festival', 'Avant Garde'];
	$scope.searchOptions  = {
		profileType    : 'Artist',
		location       : [ 0.0, 0.0 ],
		radius         : 15.0,
		genres         : [],
		subtype        : '',
		profileName    : ''
	};
	$scope.searchResults = [];
	$scope.searchResultsCount = 0;
});