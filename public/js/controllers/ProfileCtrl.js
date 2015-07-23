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

	$scope.editprofile = {};

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

	$scope.isProfileSelected = function(){
		return $scope.editprofile.name != undefined;
	}


	$scope.loadProfile = function(p, callback){
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
			$localStorage.profile = data;
			$scope.saveStatus = "";
			if (callback){
				callback()
			}
		})
		.error(function(){
			alert('error retrieving negotiations data from server');
		});
	}

	$scope.editProfile = function(p) {
		$scope.editprofile = p;
	}

	$scope.createProfile = function(type){
		console.log($localStorage.profiles);
		if (!type) {
			var type = "Artist";
		}

		console.log(navigator.geolocation)

		if (navigator.geolocation){
			navigator.geolocation.getCurrentPosition(function(position){
				console.log(position)
			})
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
			zip 			: '00000',
			socialLinks 	: [],
			soundcloundId   : 0,
			image           : null,
			creationDate    : new Date(),
			favourites      : [],
			called 			: [],
			tours 			: [],
			geolocation     : {lat:0.0,lon:0.0}
		}
		$scope.editprofile = newProfile;
		$scope.saveStatus = "new unsaved profile";
	}//end create profile

	$scope.loadCalendar = function(){
		if ($localStorage.profile){
			window.location.assign('/calendar');
		}
		else{
			alert('no profile selected');
		}
	}//end load calendar

	$scope.saveProfile = function(p){
		p.genres = $scope.unindexList($scope.editgenres.data);
		if (p){
			var req = {
 				method: 'POST',
 				url: '/api/saveProfile',
 				headers: {
   					'Content-Type': 'application/json'
 				},
 				data: {
 					saveProfile:true,
 					profile:p
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

	$scope.returnToSelection = function(p){
		var r = true;
		if ($scope.saveStatus != "successfully saved profile"){
			r = confirm("Are you sure you want to return without saving your profile?");
		}
		if (r) {
			$scope.editprofile = {};
		}
		$scope.saveStatus = "";
	}

	$scope.getIndexedList = function(list){
        if (!list) return [];
        var res = [];
        var i = 1;
        list.forEach(function(item){
            res.push({
                id:i,
                name:item
            });
            i++;
        })
        return res;
    }
    $scope.unindexList = function(list){
        if (!list) return [];
        var res = [];
        list.forEach(function(item){
            res.push(item.name);
        });
        return res;
    }
    $scope.getGenreList = function(){
    	if ($scope.editprofile.type == 'Artist'){
    		if ($scope.editprofile.subtype){
    			return $localStorage.datalists.splitgenres[$scope.editprofile.subtype];
    		}
    		else {
				return [];
    		}
    	}
    	else {
    		return $localStorage.datalists.genres;
    	}
    }

	$scope.deleteProfile = function(p){
		if (p){
			var req = {
				method: 'POST',
				url: 'api/deleteProfile',
				headers: {
					'Content-Type' : 'application/json'
				},
				data: {
					profile:p
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
	}

	//$scope.onProfileTypeSelectionChanged = function(){
	//	var pt = $localStorage.searchOptions.profileType;
	//	if (pt === 'Artist'){
	//		$scope.profileSubtypes = $localStorage.datalists.artistTypes;
	//	}
	//	else if (pt === 'Venue'){
	//		$scope.profileSubtypes = $localStorage.datalists.venueTypes;
	//	}
	//	else {
	//		$scope.profileSubtypes = $localStorage.datalists.organiserTypes;
	//	}
	//}

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
		$scope.editprofile.socialLinks.push($scope.linkInput.data);
	}

	$scope.editgenres = {data:[]};
	$scope.linkInput = {data:''};
	$scope.saveStatus = '';
	$scope.fetchDataLists();
	$scope.profileSubtypes = $localStorage.datalists.artistTypes;
	

});