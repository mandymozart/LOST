'use strict'
var app = angular.module('muriquee')


app.controller('ProfileCtrl', function($scope, $http, $localStorage, MapMarkerService, Notification){

	setInterval(function(){
		if ($localStorage.profile){
			console.log('profile reloaded');
			$scope.loadProfile($localStorage.profile);
		}
	}, 30000);

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

	$scope.editprofile = {
			name            : '',
			about 		    : '',
			genres          : [],
			type            : '',
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
		};

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
	$scope.fetchProfiles(undefined);

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
		$scope.center.lat = $scope.markers.m.lat = parseFloat(p.geolocation.lat);
		$scope.center.lng = $scope.markers.m.lng = parseFloat(p.geolocation.lon);

		$scope.center.zoom = 6;
	}

	$scope.createProfile = function(type){
		//console.log($localStorage.profiles);
		if (!type) {
			var type = "Artist";
		}

		//console.log(navigator.geolocation)

		//if (navigator.geolocation){
		//	navigator.geolocation.getCurrentPosition(function(position){
		//		console.log(position)
		//	})
		//}

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

	$scope.markers = {
		m : {
			title:$scope.editprofile.name,
            lat:parseFloat($scope.editprofile.geolocation.lat),
            lng:parseFloat($scope.editprofile.geolocation.lon),
            message:"<span>Drag this marker to your profile's location<br/></span>",
            focus:true,
            draggable:true,
            icon:MapMarkerService.markerIcon($scope.editprofile)
		}
	}

	$scope.loadCalendar = function(){
		if ($localStorage.profile){
			window.location.assign('/calendar');
		}
		else{
			alert('no profile selected');
		}
	}//end load calendar

	$scope.saveProfile = function(p){
		//p.genres = $scope.unindexList($scope.editgenres.data);
		p.genres = $scope.editgenres.data;
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
				Notification.success('Successfully saved profile');
				$scope.saveStatus = "successfully saved profile";
				$scope.fetchProfiles(function(){
					$scope.editprofile.name = undefined;
					//$scope.editprofile = data;
				});
				$scope.editprofile = {};
				$scope.saveStatus = "";
			})
			.error(function(){
				$scope.saveStatus = "Error saving profile";
			});
		}
		else $scope.saveStatus = "No profile selected to save";
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
		var r = true;
				
		r = confirm("Are you sure you want to delete forever this profile?");
					
		if (p || r){
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
				$scope.editprofile = {};
				$scope.saveStatus = "";
				Notification.success('This profile has been terminated indefinitely!');
			})
			.error(function(){
				alert('error deleting profile');
			})
		}
	}

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
		if ($scope.linkInput.data){
			$scope.editprofile.socialLinks.push($scope.linkInput.data);
		}
	}

	$scope.onZipEntered = function(){
		if (!$scope.editprofile) return;
		var req = {
 			method: 'POST',
 			url: '/api/geoinfoQuery',
 			headers: {
   				'Content-Type': 'application/json'
 			},
 			data: {
 				zip:$scope.editprofile.zip,
 				country:$scope.country.data
 			}
		}
		$http(req)
		.success(function(data){
			if (data.length == 0){
				Notification.error('Unknown zip code!');
				return;
			}
			$scope.editprofile.geolocation = data[0].geolocation;
			$scope.markers.m.lat = data[0].geolocation.lat;
			$scope.markers.m.lng = data[0].geolocation.lon;

		})
		.error(function(){
			alert('error retrieving negotiations data from server');
		});

	}

	$scope.toggleGenre = function(genre)
	{
		var i = $scope.editgenres.data.indexOf(genre);
		if (i < 0)
		{
			$scope.editgenres.data.push(genre);
		}
		else
		{
			$scope.editgenres.data.splice(i,1);
		}
	}

	$scope.clearGenreSelection = function(){
		$scope.editgenres.data = [];
	}

	$scope.$on('leafletDirectiveMarker.drag', function(event,args){
		$scope.editprofile.geolocation.lat = $scope.mouseposition.lat;
		$scope.editprofile.geolocation.lon = $scope.mouseposition.lng;
    });

    $scope.$on('leafletDirectiveMap.click', function(event){
        $scope.eventDetected = "Click";
        //console.log(event);
    });

    $scope.$on('leafletDirectiveMap.mousemove', function(event, args){
        $scope.mouseposition = args.leafletEvent.latlng;
    });

	$scope.editgenres = {data:[]};
	$scope.linkInput = {data:''};
	$scope.country = {data:''};
	$scope.saveStatus = '';
	$scope.fetchDataLists();
	$scope.mouseposition = {
		lat:0,
		lon:0
	}
	$scope.countries = ["Afghanistan","Albania","Algeria","Andorra","Angola","Anguilla","Antigua &amp; Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas"
		,"Bahrain","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia &amp; Herzegovina","Botswana","Brazil","British Virgin Islands"
		,"Brunei","Bulgaria","Burkina Faso","Burundi","Cambodia","Cameroon","Cape Verde","Cayman Islands","Chad","Chile","China","Colombia","Congo","Cook Islands","Costa Rica"
		,"Cote D Ivoire","Croatia","Cruise Ship","Cuba","Cyprus","Czech Republic","Denmark","Djibouti","Dominica","Dominican Republic","Ecuador","Egypt","El Salvador","Equatorial Guinea"
		,"Estonia","Ethiopia","Falkland Islands","Faroe Islands","Fiji","Finland","France","French Polynesia","French West Indies","Gabon","Gambia","Georgia","Germany","Ghana"
		,"Gibraltar","Greece","Greenland","Grenada","Guam","Guatemala","Guernsey","Guinea","Guinea Bissau","Guyana","Haiti","Honduras","Hong Kong","Hungary","Iceland","India"
		,"Indonesia","Iran","Iraq","Ireland","Isle of Man","Israel","Italy","Jamaica","Japan","Jersey","Jordan","Kazakhstan","Kenya","Kuwait","Kyrgyz Republic","Laos","Latvia"
		,"Lebanon","Lesotho","Liberia","Libya","Liechtenstein","Lithuania","Luxembourg","Macau","Macedonia","Madagascar","Malawi","Malaysia","Maldives","Mali","Malta","Mauritania"
		,"Mauritius","Mexico","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","Namibia","Nepal","Netherlands","Netherlands Antilles","New Caledonia"
		,"New Zealand","Nicaragua","Niger","Nigeria","Norway","Oman","Pakistan","Palestine","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Poland","Portugal"
		,"Puerto Rico","Qatar","Reunion","Romania","Russia","Rwanda","Saint Pierre &amp; Miquelon","Samoa","San Marino","Satellite","Saudi Arabia","Senegal","Serbia","Seychelles"
		,"Sierra Leone","Singapore","Slovakia","Slovenia","South Africa","South Korea","Spain","Sri Lanka","St Kitts &amp; Nevis","St Lucia","St Vincent","St. Lucia","Sudan"
		,"Suriname","Swaziland","Sweden","Switzerland","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Timor L'Este","Togo","Tonga","Trinidad &amp; Tobago","Tunisia"
		,"Turkey","Turkmenistan","Turks &amp; Caicos","Uganda","Ukraine","United Arab Emirates","United Kingdom","Uruguay","Uzbekistan","Venezuela","Vietnam","Virgin Islands (US)"
		,"Yemen","Zambia","Zimbabwe"];
	
	angular.extend($scope,$scope.markers);
	angular.extend($scope,{
		center : {
			lat : 53.30,
			lng : 13.25,
			zoom : 6
		},
		defaults: {
            scrollWheelZoom: false,
            doubleClickZoom: true,
            maxZoom:16,
            minZoom:3
        },
        events: {
            map: {
                enable: ['zoomstart', 'drag', 'click', 'mousemove'],
                logic: 'emit'
            }
        }
	})
	$scope.saveStatus = 'successfully saved profile';
	$scope.returnToSelection($scope.editprofile);
	$scope.saveStatus = '';
});