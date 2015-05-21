'use strict'
var app = angular.module('muriquee')


app.controller('ProfileCtrl', function($scope, $http, $location, $timeout){
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

	$scope.profiles = [];
	$scope.profile  = undefined
	$http.post('/profilesData')
		.success(function(data){
			$scope.profiles = data;
		})
		.error(function(){
			alert('error retrieving profile data from server');
		});


	$scope.loadProfile = function(p){
        console.log(p)
		$scope.profile = p;
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