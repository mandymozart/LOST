var keystone = require('keystone');
var _        = require('underscore');

function match(p, options){

	console.log(p.name)
	var res = 
		(p.name.indexOf(options.profileName) > -1) &&
		((p.type == options.profileType)) &&
		(!p.subtype || (p.subtype == options.subtype)) &&
		(p.genres.indexOf(options.genre) > -1);
	return res;
}

exports = module.exports = function(req, res){
	var user = req.user;
	console.log(req.body);
	if (req.body.profileName){
		var options = req.body
		keystone.list('Profile').model.find(function(err, profiles){
			if(err){
				console.log(err);
			}
			var results = [];
			console.log(profiles);
			for (var i=0;i<profiles.length;i++){
				if (match(profiles[i], options)){
					results.push(profiles[i]);
				}
			}
			res.send(JSON.stringify(results));
		})
	}
	else{
		user.populate('profiles', function (err, doc) {
		if (err) console.log(err);
		keystone.list('Profile').model.find()
			.where('_id').in(doc.profiles)
			.exec(function(err, profiles){
				if (err) console.log(err);
				res.send(JSON.stringify(profiles));
			});
		});		
	}
};