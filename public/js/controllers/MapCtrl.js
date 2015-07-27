'use strict';
var app = angular.module('muriquee')

app.controller('MapCtrl', function($scope,$localStorage,leafletData,leafletBoundsHelpers,MapMarkerService){
	$scope.storage = $localStorage;
	$scope.storage.viewmode = 'calendar';
	var p = $localStorage.profile;
	$localStorage.profileMarker = {
		name:p.name,
        lat:parseFloat(p.geolocation.lat),
        lng:parseFloat(p.geolocation.lon),
        message:MapMarkerService.markerMessage($localStorage.profile),
        focus:false,
        draggable:false,
        icon:MapMarkerService.markerIcon($localStorage.profile)
	};
	$scope.defaults = {
		scrollWheelZoom: false,
		doubleClickZoom: true
	};
	$scope.center = {
		lat : $localStorage.profile.geolocation.lat,
		lng : $localStorage.profile.geolocation.lon,
		zoom : 4
	};
})

//app.controller('MapCtrl', function($scope, $localStorage, olData){
//	$scope.storage = $localStorage;
//	$localStorage.center = {
//        lat: $localStorage.profile.geolocation.lat,
//        lng: $localStorage.profile.geolocation.lat,
//        zoom: 4
//	}
//	$scope.homemarker = {
//        lat:parseFloat($localStorage.profile.geolocation.lat),
//        lng:parseFloat($localStorage.profile.geolocation.lng),
//        label: {
//            message:$localStorage.profile.name,
//            //message: '<img src="profile/pic/something.jpg"></img>'
//            show:true,
//            showOnMouseOver:true,
//            //style:{
//            //    //anchor: [0.5, 1],
//            //    //anchorXUnits: 'fraction',
//            //    //anchorYUnits: 'fraction',
//            //    //opacity: 0.90,
//            //    //src:'images/markers/someMarker.png'
//            //}
//        }
//    }
//    $scope.searchradius = {
//    	name:'searchradius',
//    	lat:$scope.homemarker.lat,
//    	lng:$scope.homemarker.lng,
//    	style:{
//    		image:{
//    			circle:{
//    				radius:80,
//    				fill:{
//    					color: 'rgba(0, 0, 255, 0.6)'
//    				},
//    				stroke:{
//    					color: 'white',
//                        width: 3
//    				}
//    			}
//    		}
//    	}
//    };
//
//	$scope.defaults = {
//		events: {
//            map: [ 'singleclick', 'pointermove' ]
//        }
//	};
//
//	$scope.mouseposition = {};
//	$scope.clickposition = {};
//	$scope.projection = 'EPSG:3857';
//
//	$scope.$on('openlayers.map.pointermove', function(event, data){
//		$scope.$apply(function() {
//            if ($scope.projection === data.projection) {
//                $scope.mouseposition = data.coord;
//            } 
//            else {
//                var p = ol.proj.transform([ data.coord[0], data.coord[1] ], data.projection, $scope.projection);
//                $scope.mouseposition = {
//                    lat: p[1],
//                    lng: p[0],
//                }
//            }
//        });
//	});
//	$scope.$on('openlayers.map.singleclick', function(event, data){
//		$scope.$apply(function(){
//			if ($scope.projection === data.projection) {
//                $scope.clickposition = data.coord;
//            } 
//            else {
//                var p = ol.proj.transform([ data.coord[0], data.coord[1] ], data.projection, $scope.projection);
//                $scope.clickposition = {
//                    lat: p[1],
//                    lng: p[0],
//                    projection: $scope.projection
//                }
//            }
//		})
//	});
//
//});
//