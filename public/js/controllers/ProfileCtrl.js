'use strict'
var app = angular.module('muriquee')


app.controller('ProfileCtrl', function($scope, $http, $localStorage, Profile){
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

	$scope.storage = $localStorage.$default({
		profiles       : [],
		profile        : {},
		searchOptions  : {},
		searchResults  : [],
		selectedResult : {}
	});

	$scope.profiles = [];
	$scope.profile  = undefined

	$http.post('/profilesData')
		.success(function(data){
			$scope.profiles = data;
			$scope.storage.profiles = data;
		})
		.error(function(){
			alert('error retrieving profile data from server');
		});


	$scope.loadProfile = function(p){
		$scope.profile = p;
		$scope.storage.profile = p;
		console.log(Profile.getProfile());
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
});