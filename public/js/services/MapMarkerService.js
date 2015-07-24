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

	return {
		markerMessage:markerMessage,
		markerIcon:markerIcon,
		meIcon:meIcon
	}
})