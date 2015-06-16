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
		$scope.storage = {};
		$scope.storage = $localStorage.$default({
			profiles       : [],
			profile        : {},
			searchOptions  : {},
			searchResults  : [],
			selectedResult : {},
			selectedDate   : new Date()
		});
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
		$scope.profile = p;
		$scope.storage.profile = p;
		var req = {
 			method: 'POST',
 			url: '/profilesData',
 			headers: {
   				'Content-Type': 'application/json'
 			},
 			data: {
 				populateNegotiations:true,
 				profile:$localStorage.profile
 			}
		}
		$http(req)
		.success(function(data){
			resetStorage();
			$scope.saveStatus = "";
			$localStorage.negotiations = data;
		})
		.error(function(){
			alert('error retreiveing negotiations data from server');
		});
	}
	$scope.createProfile = function(){
		if ($scope.profiles.length == 0) return;
		$scope.profiles.push({
			user  : $scope.profiles[0].user,
			name  : "enter profile name here",
			about : {
				brief : "brief description",
				extended : "longer description"
			},
			negotiations : []
		});
		$scope.profile = $scope.profiles[$scope.profiles.length - 1];
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
				var i = $scope.profiles.indexOf($scope.profile);
				$scope.fetchProfiles(function(){
					console.log($scope.profiles[i])
					$scope.loadProfile($scope.profiles[i]);
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