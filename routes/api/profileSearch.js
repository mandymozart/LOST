var keystone = require('keystone');
var _        = require('underscore');
var async    = require('async');

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

function match(p,options){
	//filter by location switch on when map works
	/*
	if (options.geolocation && options.radius){
		var lat1 = options.geolocation.lat;
		var lon1 = options.geolocation.lon;
		var lat2 = p.geolocation.lat;
		var lon2 = p.geolocation.lon;
		var d = getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2);
		//console.log('filter by location, r = ' + d)
		if (d > options.radius){
			return false;
		}
	}
	*/

	//filter by type:
	if (p.type != options.profileType){
		//console.log('type exclusion');
		return false;
	}
	//filter by subtype:   
	//TODO
	if (false){ 
		//console.log('subtype exclusion');
		return false
	}
	//filter by name:
	if (options.profileName && options.profileName != ""){
		if (p.name.toLowerCase().indexOf(options.profileName.toLowerCase()) == -1){
			return false;
		}
	}
	//filter by genres:
	var q = false;
	var k = options.genres ? options.genres.length : 0;

	if(k>0 && !p.genres) {
		//console.log('exc 1, k = ' + k +', p = ' + p);
		return false;
	}

	for (var i=0;i<k;i++){
		q = p.genres.indexOf(options.genres[i]) > -1;
	}
	if (!q && !k==0){
		//console.log('genre exclusion, p = ' + p + ', k = ' + k);
		return false;
	}

	//end
	return true;
}


exports = module.exports = function(req, res){
	var options = req.body;
	console.log(options);
	if (!options.profileType){ res.send([]); return; }

	keystone.list('Profile').model.find()
		.exec(function(err, docs){
			var results = _.filter(docs, function(d){
				return match(d,options);
			})
			res.send(JSON.stringify(results));
		})
}