'use strict'
var app = angular.module('muriquee')

app.factory('MapMarkerService', function(){

	var meIcon = {
        type: 'div',
        iconSize: [5, 5],
        html: '<span class="fa fa-user"></span>',
        popupAnchor:  [0, 0]
    };
	var artistIcon = {
        type: 'div',
        iconSize: [5, 5],
        html: '<span class="fa fa-user"></span>',
        popupAnchor:  [0, 0]
	};
	var venueIcon = {
		type: 'div',
        iconSize: [5, 5],
        html: '<span class="fa fa-building"></span>',
        popupAnchor:  [0, 0]
	};
	var organiserIcon = {
		type: 'div',
        iconSize: [5, 5],
        html: '<span class="fa fa-user-secret"></span>',
        popupAnchor:  [0, 0]
	};

	var markerMessage = function(profile){
		var html  = '<div>'// class="map-marker-message">';
			html +=	'<span>' + profile.name + '<br/></span>';
			profile.genres.forEach(function(genre){
				html += '<div class="label label-primary">'+genre+'&nbsp;</div>'
			});
			html += '<br/>'
			profile.socialLinks.forEach(function(link){
				html += '<a href="'+link+'" target="_blank">'+link + '</a><br/>'
			});
			html += '</div>';
		console.log(html);
		return html;
	}
	var markerIcon = function(profile){
		switch(profile.type){
			case("Artist"): return artistIcon;
			case("Venue"): return venueIcon;
			case("Organiser"): return organiserIcon;
			default: break;
		}
	}

	function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
		var R = 6371; // Radius of the earth in km
		var dLat = deg2rad(lat2-lat1);  // deg2rad below
		var dLon = deg2rad(lon2-lon1); 
		var a = 
		  Math.sin(dLat/2) * Math.sin(dLat/2) +
		  Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
		  Math.sin(dLon/2) * Math.sin(dLon/2)
		  ; 
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
		var d = R * c; // Distance in km
  		return d;
	}

	function deg2rad(deg) {
  		return deg * (Math.PI/180)
	}

	return {
		markerMessage:markerMessage,
		markerIcon:markerIcon,
		meIcon:meIcon,
		distance:getDistanceFromLatLonInKm
	}
})