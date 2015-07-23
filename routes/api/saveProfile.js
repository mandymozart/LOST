var keystone = require('keystone');
var _        = require('underscore');
var async    = require('async');

exports = module.exports = function(req, res){
	var p = req.body.profile;
	if (p._id){
	keystone.list('Profile').model.find()
		.where('_id', p._id)
		.exec(function(err, profiles){
			if (err) res.send(404);
			var pdb = profiles[0];
			pdb.set(p);
			pdb.set({user:req.user._id});
			pdb.save();
			//console.log(pdb);
			res.send(pdb);
		})
	}
	else{
		//console.log('creating new profile');
		var PM = keystone.list('Profile').model;
		var pdb = new PM();
		pdb.set(p);
		pdb.set({user:req.user._id});
		req.user.profiles.push(pdb._id);
		req.user.save();
		//console.log(pdb);
		pdb.save();
		res.send(pdb);
	}
}