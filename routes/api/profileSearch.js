var keystone = require('keystone');
var _        = require('underscore');
var async    = require('async');

function match(p,options){
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
	var p = false;
	var k = options.genres ? options.genres.length : 0;

	if(k>0&&!p.genres) return false;

	for (var i=0;i<k;i++){
		p = p.genres.indexOf(options.genres[i]) > -1;
	}
	if (!p && !k==0){
		//console.log('genre exclusion');
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
				console.log('filter');
				return match(d,options);
			})
			res.send(JSON.stringify(results));
		})
}