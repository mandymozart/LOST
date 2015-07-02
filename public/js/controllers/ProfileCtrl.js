'use strict'
var app = angular.module('muriquee')


app.controller('ProfileCtrl', function($scope, $http, $localStorage){

	function resetStorage(){
		$scope.storage = $localStorage.$default({
			profiles       : [],
			profile        : {},
			searchOptions  : {},
			searchResults  : [],
			selectedResult : {},
			selectedDate   : new Date()
		});
		$localStorage.searchResults = [];
		$localStorage.rememberedProfiles = [];
		$localStorage.negotiations = [];
		$localStorage.selectedNegotiation = undefined;
		$localStorage.selectedResult = undefined;
		$localStorage.searchOptions = {};
		$localStorage.profile = {};
	}

	resetStorage();
	$localStorage.profiles = [];

	$scope.fetchProfiles = function(callback){
		$http.get('/api/getUserProfiles')
			.success(function(data){
				$scope.storage.profiles = data;
				if (callback) callback();
			})
			.error(function(){
				alert('error retrieving profile data from server');
			});
	}
	$scope.fetchProfiles();


	$scope.loadProfile = function(p){
		if (!p._id) {
			$scope.saveStatus = "unsaved profile";
			return;
		}

		var req = {
 			method: 'POST',
 			url: '/api/populateProfile',
 			headers: {
   				'Content-Type': 'application/json'
 			},
 			data: {
 				profile:p
 			}
		}
		$http(req)
		.success(function(data){
			resetStorage();
			$scope.storage.profile = data;
			$scope.saveStatus = "";
		})
		.error(function(){
			alert('error retreiveing negotiations data from server');
		});
	}
	$scope.createProfile = function(type){
		console.log($localStorage.profiles);
		if (!type) {
			var type = "Artist";
		}

		var newProfile = {
			name            : '',
			about 		    : '',
			genres          : [],
			type            : type,
			subtype         : '',
			negotiations 	: [],
			proposals 		: [],
			state 			: 'draft',
			zip 			: '000',
			socialLinks 	: [],
			soundcloundId   : 0,
			image           : null,
			creationDate    : new Date(),
			favourites      : [],
			called 			: [],
			tours 			: []
		}
		$localStorage.profile = newProfile;
		$localStorage.profiles.push(newProfile);

		console.log($localStorage.profiles);
	}//end create profile

	$scope.loadCalendar = function(){
		if ($localStorage.profile){
			window.location.assign('/calendar');
		}
		else{
			alert('no profile selected');
		}
	}//end load calendar

	$scope.saveProfile = function(){
		if ($localStorage.profile){
			var req = {
 				method: 'POST',
 				url: '/api/saveProfile',
 				headers: {
   					'Content-Type': 'application/json'
 				},
 				data: {
 					saveProfile:true,
 					profile:$localStorage.profile
 				}
			}
			$http(req)
			.success(function(data){
				$scope.saveStatus = "successfully saved profile";
				$scope.fetchProfiles(function(){
					console.log('fetched');
				});
			})
			.error(function(){
				$scope.saveStatus = "error saving profile";
			});
		}
		else $scope.saveStatus = "no profile selected to save";
	}

	$scope.deleteProfile = function(p){
		var req = {
			method: 'POST',
			url: 'api/deleteProfile',
			headers: {
				'Content-Type' : 'application/json'
			},
			data: {
				profile:$localStorage.profile
			}
		}
		$http(req)
		.success(function(data){
			alert('successfully deleted profile');
		})
		.error(function(){
			alert('error deleting profile');
		})
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
	}

	$scope.fetchDataLists = function(){
		var req = {
			method  : 'GET',
			url     : 'api/getDataLists',
			headers : {
				'Content-Type' : 'application/json'
			},
			data    : {

			}
		}
		$http(req)
		.success(function(data){
			$localStorage.datalists = data;
		})
		.error(function(){
			alert('error fetching data lists');
		})
	}

	$scope.addSocialLink = function(){
		$localStorage.profile.socialLinks.push($scope.linkInput);
	}

	$scope.linkInput = "";
	$scope.saveStatus = "";
	$scope.fetchDataLists();
	$scope.profileSubtypes = $localStorage.datalists.artistTypes;
	

});