'use strict'
var app = angular.module('muriquee')


app.controller('ProfileCtrl', function($scope, $http, $localStorage){
	function updateView(){
		$('#profile-name-area').val($scope.profile.name);
		$('#profile-about-brief-area').val($scope.profile.about.brief);
		$('#profile-about-extended-area').val($scope.profile.about.extended);
	}

	$scope.safeApply = function(fn) {
  		var phase = this.$root.$$phase;
  		if(phase == '$apply' || phase == '$digest') {
   			if(fn && (typeof(fn) === 'function')) {
      			fn();
    		}
  		} else {
    		this.$apply(fn);
  		}
	};

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
	}

	resetStorage();

	$scope.profiles = [];
	$scope.profile  = undefined

	$scope.fetchProfiles = function(callback){
		$http.post('/profilesData')
			.success(function(data){
				$scope.profiles = data;
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
 			url: '/profilesData',
 			headers: {
   				'Content-Type': 'application/json'
 			},
 			data: {
 				populateNegotiations:true,
 				profile:p
 			}
		}
		$http(req)
		.success(function(data){
			resetStorage();
			$scope.profile = data;
			$scope.storage.profile = data;
			$scope.saveStatus = "";
		})
		.error(function(){
			alert('error retreiveing negotiations data from server');
		});
	}
	$scope.createProfile = function(){
		if ($scope.profiles.length == 0) return;
		var newProfile = {
			user  : $scope.profiles[0].user,
			name  : "enter profile name here",
			about : {
				brief : "brief description",
				extended : "longer description"
			},
			negotiations : [],
		}
		$scope.profile = newProfile;
		$scope.saveProfile();
	}
	$scope.loadCalendar = function(){
		if ($scope.profile){
			window.location.assign('/calendar');
		}
		else{
			alert('no profile selected');
		}
	}
	$scope.saveProfile = function(){
		if ($scope.profile){
			var req = {
 				method: 'POST',
 				url: '/profilesData',
 				headers: {
   					'Content-Type': 'application/json'
 				},
 				data: {
 					saveProfile:true,
 					profile:$scope.profile
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

	$scope.saveStatus     = "";

	$scope.profileTypes   = ['Artist', 'Venue', 'Organiser'];
	$scope.artistTypes    = ['Solo Performer', 'Band', 'Magician', 'Orchestra'];
	$scope.venueTypes     = ['Concert Hall', 'Live Hall', 'Club', 'Open Air', 'Bar'];
	$scope.organiserTypes = ['Live', 'Club', 'Festival', 'Avant Garde'];
	$scope.genres         = ['Rock','Pop','Classic','Deep House','Hip Hop','Experimental','Techno','Acid House'];
	
});