'use strict'
var app = angular.module('muriquee')

app.factory('SoundcloudService', function($http,$sce,$localStorage){
	// Soundcloud CLIENT_ID App: Muriquee
	var CLIENT_ID = '484fa82604cfcb7af90278f8f464fb51';

	var soundcloudUrlToData = function(url){
		// Fetches profile player uri for iframe and profile image 
		$http.get('http://api.soundcloud.com/resolve.json?url=' + url + '&client_id=' + CLIENT_ID).
		success(function(data, status, headers, config) {
			console.log($localStorage.selectedResult);
			// Soundcloud Embed
			var soundcloud_embed_uri = 'https://w.soundcloud.com/player/?url=' + data.uri + '&amp;auto_play=false&amp;hide_related=true&amp;show_comments=true&amp;show_user=false&amp;show_reposts=false';
			$localStorage.selectedResult.soundcloud_embed_code = $sce.trustAsHtml('<iframe width="100%" height="480" scrolling="no" frameborder="no" src="'+ soundcloud_embed_uri +'"></iframe>');
			// Soundcloud Detail if About is empty
			if($localStorage.selectedResult.about == ""){
				$localStorage.selectedResult.about = data.description;
			}
			if($localStorage.selectedResult.image == undefined){
				$localStorage.selectedResult.image = $sce.trustAsUrl(data.avatar_url);
			}


		}).
		error(function(data, status, headers, config) {
			//console.log(data);
			$localStorage.selectedResult.soundcloud_embed_code =  undefined;
		});
	}
	var soundcloudCrawler = function(){
		var socialLinks = $localStorage.selectedResult.socialLinks;
		var soundcloudLink = undefined;
		var link = '';
		socialLinks.forEach(function(link){
			console.log(link)
			if (link != undefined){
				if (link.indexOf("soundcloud") >-1) {
			    	soundcloudLink = link;
				}
			}
		})
		if(soundcloudLink){
			soundcloudUrlToData(soundcloudLink);
		}
	}

	return soundcloudCrawler;

});