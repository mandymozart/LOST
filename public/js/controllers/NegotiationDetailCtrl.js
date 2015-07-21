'use strict'

var app = angular.module('muriquee');

app.controller('NegotiationDetailCtrl', function($scope, $localStorage, $http){
	$scope.models = {}
	$scope.models.messageAreaText = '';
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
        return new Date($localStorage.selectedNegotiation.date).getUTCDate();
    }
    $scope.getMonth = function(){
        return monthNames[new Date($localStorage.selectedNegotiation.date).getUTCMonth()];
    }
    $scope.getYear = function(){
        return new Date($localStorage.selectedNegotiation.date).getUTCFullYear();
    }
    $scope.getHours = function(){
        return new Date($localStorage.selectedNegotiation.date).getUTCHours();
    }
    $scope.getMinutes = function(){
        return new Date($localStorage.selectedNegotiation.date).getUTCMinutes();
    }
    $scope.getSeconds = function(){
        return new Date($localStorage.selectedNegotiation.date).getUTCSeconds();
    }


	$scope.sent = function(nm){
		return nm.sender === $localStorage.profile._id;
	}
	$scope.send = function(){
		//alert($scope.models.messageAreaText);
		var req = {
 			method: 'POST',
 			url: '/api/sendNegotiationMessage',
 			headers: {
   				'Content-Type': 'application/json'
 			},
 			data: {
 				negotiation:$localStorage.selectedNegotiation,
 				message:$scope.models.messageAreaText,
 				profile:$localStorage.profile
 			}
		};
		$http(req)
		.success(function(data){
			if (data.err){
				alert(data.message);
				return;
			}
			var req = {
				method: 'POST',
 				url: '/api/populateNegotiationMessages',
 				headers: {
   					'Content-Type': 'application/json'
 				},
				data:{
					negotiation:data
				}
			};
			$http(req)
			.success(function(data){
				$localStorage.selectedNegotiation = data;
			})
			.error(function(){
				alert('error populating negotiation messages');
			});
		})
		.error(function(){
			alert('error posting negotiation message');
		});
	}
	$scope.offer = function(){
		var req = {
			method : 'POST',
			url : '/api/submitNegotiationOffer',
			headers : {
				'Content-Type':'application/json'
			} ,
			data : {
				negotiation:$localStorage.selectedNegotiation,
				offer:$localStorage.selectedNegotiation.currentOffer
			}
		}
		$http(req)
		.success(function(data){
			$localStorage.selectedNegotiation = data;
		})
		.error(function(){
			alert('error submitting offer');
		})
	}
	$scope.accept = function(){
		var req = {
			method : 'POST',
			url : '/api/acceptNegotiation',
			headers : {
				'Content-Type':'application/json'
			},
			data : {
				profile : $localStorage.profile,
				negotiation : $localStorage.selectedNegotiation
			}
		}
		$http(req)
		.success(function(data){
			$localStorage.selectedNegotiation = data;
			alert('successfully accepted negotiation. status: ' + data.status);
		})
		.error(function(){
			alert('error accepting negotiation');
		})
	}
	$scope.decline = function(){
		var req = {
			method : 'POST',
			url : '/api/rejectNegotiation',
			headers : {
				'Content-Type':'application/json'
			},
			data : {
				profile : $localStorage.profile,
				negotiation : $localStorage.selectedNegotiation
			}
		}
		$http(req)
		.success(function(data){
			$localStorage.selectedNegotiation = data;
			alert('successfully declined negotiation. status: ' + data.status);
		})
		.error(function(){
			alert('error declining negotiation');
		})
	}
});