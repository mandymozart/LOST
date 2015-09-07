'use strict'
var app = angular.module('muriquee')


app.controller('ProfileDetailReadonlyCtrl', function($scope, $localStorage, $http, SoundcloudService, Notification){
	$scope.storage = $localStorage;

	$scope.book = function(){
		var req = {
            method: 'POST',
            url: '/api/sendProposal',
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                profile:$scope.storage.profile,
                profiles:[$scope.storage.selectedResult],
                proposedDate:$scope.storage.selectedDate
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

	SoundcloudService();
})