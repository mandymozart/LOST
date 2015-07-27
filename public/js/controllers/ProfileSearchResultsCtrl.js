'use strict'
var app = angular.module('muriquee')

app.controller('ProfileSearchResultsCtrl', function($scope, $localStorage, $http,SoundcloudService,Notification){
	$scope.storage = $localStorage;

	$scope.showProfile = function(p){
        $localStorage.selectedResult = p;
        SoundcloudService();
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
                Notification.success('Sucessfully sent proposals for: <br />' + $localStorage.selectedDate);
            })
            .error(function(){
                Notification.error('error sending proposals');
            })
    }

    $scope.searchResultsCount = $localStorage.searchResults.length;

    $scope.$watch('$localStorage.selectedNegotiation', function() {
       if($localStorage.selectedNegotiation == undefined){
            setTimeout(function(){
                $('#profileSearchResultsTab').height(window.innerHeight-490);
            },500);
       }
    });
})