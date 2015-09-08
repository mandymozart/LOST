'use strict'

var app = angular.module('muriquee');

app.controller('NegotiationDetailCtrl', function($scope, $localStorage, $http,SoundcloudService,Notification){
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
		//Notification($scope.models.messageAreaText);
		if ($scope.models.messageAreaText == ""){
			Notification('Please enter a message first');
			return;
		}
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
		console.log(req.data);
		$http(req)
		.success(function(data){
			if (data.err){
				Notification(data.message);
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
                setTimeout(function(){
                    var wtf = $('#negotiationDetailChatBody');
                    var height = wtf[0].scrollHeight;
                    wtf.scrollTop(height);
                },500);
			})
			.error(function(){
				Notification('error populating negotiation messages');
			});
		})
		.error(function(){
			Notification('error posting negotiation message');
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
			Notification.info('Your offer was sent and is awaiting reply!')
		})
		.error(function(){
			Notification('error submitting offer');
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
			Notification.success('Successfully accepted negotiation');
		})
		.error(function(){
			Notification.error('Error accepting negotiation');
		})
	}
	$scope.decline = function(){
		var p = confirm('Are you sure you want to delete this negotiation?');
		if (!p) return;
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
			for (var i=0;i<$localStorage.profile.negotiations.length;i++){
				if ($localStorage.profile.negotiations[i]._id == $localStorage.selectedNegotiation._id){
					$localStorage.profile.negotiations.splice(i,1);
					break;
				} 
			}
			$localStorage.selectedNegotiation = undefined;
			$localStorage.viewmode = 'calendar';
			Notification.warning('Negotiation was declined')
		})
		.error(function(){
			Notification('error declining negotiation');
		})
	}
	$scope.otherProfile = function(){
		var n = $localStorage.selectedNegotiation;
		if (n.sender._id == $localStorage.profile._id){
			return n.receiver;
		}
		else{
			return n.sender;
		}
	}
	$scope.showProfile = function(){
		$localStorage.selectedResult = $scope.otherProfile();
		SoundcloudService();
	}
	$scope.close = function(){
		//$localStorage.selectedNegotiation = undefined;
		$localStorage.viewmode = 'calendar';
		return false;
	}
	$scope.isNegotiationClosed = function(){
		return $localStorage.selectedNegotiation.status == "closed";
	}
	$scope.isNegotiationOpen = function(){
		return $localStorage.selectedNegotiation.status == "open";
	}
	$scope.hasAccepted = function(p){
		if (!p) return false;
		var n = $localStorage.selectedNegotiation;
		var s = n.sender;
		var r = n.receiver;
		if (n.status == 'sender_accepted' && p.slug == s.slug){
			return true;
		}
		if (n.status == 'receiver_accepted' && p.slug == r.slug){
			return true;
		}
		return false;
	}

	$scope.formatMessage = function(msg){
		return msg.replace(/(?:\r\n|\r|\n)/g, '<br />')
	}
});