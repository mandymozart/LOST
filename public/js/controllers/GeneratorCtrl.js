'use strict';
var app = angular.module('muriquee')

app.controller('GeneratorCtrl', function($scope, $http){
	$scope.no = 0;
	$scope.msg = "";

	$scope.submit = function(){
		var req = {
 			method: 'POST',
 			url: '/generatorPost',
 			headers: {
   				'Content-Type': 'application/json'
 			},
 			data: {
 				n:$scope.no
 			}
		}
		$http(req)
		.success(function(data){
			$scope.msg = "success";
		})
		.error(function(){
			$scope.msg = "error";
		});
	}
})