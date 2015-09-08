'use strict'
var app = angular.module('muriquee')

app.controller('ProfileSearchResultsCtrl', function($scope, $localStorage, $http,SoundcloudService,Notification){
	$scope.storage = $localStorage;

    var monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec"
    ]

    $scope.getDay = function(){
        return new Date($localStorage.selectedDate).getUTCDate();
    }
    $scope.getMonth = function(){
        return monthNames[new Date($localStorage.selectedDate).getUTCMonth()];
    }
    $scope.getYear = function(){
        return new Date($localStorage.selectedDate).getUTCFullYear();
    }

	$scope.showProfile = function(p){
        $localStorage.selectedResult = p;
        SoundcloudService();
    }
    $scope.onResultClicked = function(p){
        console.log(p);
        if (p.isRemembered)
        //clicked result already remembered
        {
            $scope.removeRememberedProfile(p);
        }
        else if (!$localStorage.selectedResult || $localStorage.selectedResult._id != p._id) 
        //first time clicked
        {
            $scope.showProfile(p);
            $scope.rememberProfile(p, false);
        }
    }
	$scope.rememberProfile = function(p){
    	if (!$scope.storage.rememberedProfiles){
            $scope.storage.rememberedProfiles = [];
        }
        if ($scope.storage.rememberedProfiles.indexOf(p) == -1){
            $scope.storage.rememberedProfiles.push(p);
            p.isRemembered = true;
            //Notification.success(p.name + ' was added to your remembered list');
        }
    }
    $scope.removeRememberedProfile = function(p){
        var i = $scope.storage.rememberedProfiles.indexOf(p);
        $scope.storage.rememberedProfiles.splice(i, 1);
        p.isRemembered = false;
        //Notification.primary(p.name + ' was removed from your remembered list');
    }
    $scope.rememberAll = function(){
        var n = $scope.storage.rememberedProfiles.length;
        $scope.storage.searchResults.forEach($scope.rememberProfile,false);
        n = $scope.storage.rememberedProfiles.length - n;
        Notification.success('' + n  + ' profile' + (n == 1 ? ' was ' : 's were ') + 'added to your remembered list');
    }
    $scope.removeAll = function(){
        $scope.storage.rememberedProfiles.forEach(function(p){
            p.isRemembered = false;
        });
        var n = $scope.storage.rememberedProfiles.length;
        $scope.storage.rememberedProfiles = [];
        Notification.primary('' + n + ' profile' + (n == 1 ? ' was ' : 's were ') + 'removed from your remembered list');
    }
    $scope.resultOrderFunction = function(profile){
        return (profile.isRemembered ? '_____' : '') + profile.name;
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

    $scope.resultOrderFunction = function(profile){
        return (profile.isRemembered ? '_____' : '') + profile.name;
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