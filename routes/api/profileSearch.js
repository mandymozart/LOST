var keystone = require('keystone');
var _        = require('underscore');
var async    = require('async');

function match(p, options){
	var res = true;
	//filter by name
	res = res && (options.profileName == "") || (!options.profileName) || (p.name.toLowerCase().indexOf(options.profileName.toLowerCase()) > -1)
	//filter by genres
	var containsGenres = false;
	var k = options.genres ? options.genres.length : 0;
	for (var i=0; i<k; i++){
		containsGenres = containsGenres || (p.genres.indexOf(options.genres[i]) > -1)
	}
	res = res && (containsGenres || k == 0);
	//filter by profile type
	res = res && options.profileType == p.type;
	//filter by profile subtype
	//res = res && options.profileSubtype == p.subtype;
	//return
	return res;
}

exports = module.exports = function(req, res){
	var options = req.body;
	keystone.list('Profile').model.find(function(err, profiles){
		if(err){
			console.log(err);
		}
		//console.log('num profiles:' + profiles.length);
		var results = [];
		for (var i=0;i<profiles.length;i++){
			if (match(profiles[i], options)){
				results.push(profiles[i]);
			}
		}
		//console.log('num results:' + results.length);
		res.send(JSON.stringify(results));
	})
}