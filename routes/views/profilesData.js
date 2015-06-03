var keystone = require('keystone');
var _        = require('underscore');

function match(p, options){
	var res = 
		(p.name.indexOf(options.profileName) > -1) &&
		((p.type == options.profileType)) &&
		(!p.subtype || (p.subtype == options.subtype)) &&
		(p.genres.indexOf(options.genre) > -1);
	return res;
}

exports = module.exports = function(req, res){
	var user = req.user;
	if (req.body.profileName){  //profile search
		var options = req.body
		keystone.list('Profile').model.find(function(err, profiles){
			if(err){
				console.log(err);
			}
			var results = [];
			for (var i=0;i<profiles.length;i++){
				if (match(profiles[i], options)){
					results.push(profiles[i]);
				}
			}
			res.send(JSON.stringify(results));
		})
	}
	else if (req.body.populateNegotiations){ //populate negotiations
		var p_id = req.body.profile._id;
		keystone.list('Profile').model.find()
			.where('_id', p_id)
			.exec(function(err, profiles){
				var p = profiles[0];
				p.populate('negotiations', function(err,doc){
					res.send(JSON.stringify(doc.negotiations));
				})
			})
	}
	else if (req.body.saveProfile){ //save profile
		var p = req.body.profile;
		if (p._id){
		keystone.list('Profile').model.find()
			.where('_id', p._id)
			.exec(function(err, profiles){
				if (err) res.send(404)
				var pdb = profiles[0];
				pdb.set(p);
				pdb.save();
				console.log(pdb);
				res.send(p);
			})
		}
		else{
			var PM = keystone.list('profiles').model;
			var pdb = new PM();
			pdb.set(p);
			pdb.set({user:req.user._id});
			req.user.profiles.push(pdb._id);
			req.user.save();
			pdb.save();
			res.send(pdb);
		}
	}
	else if (req.body.populateNegotiationMessages){ //populate Negotiation Messages
		var n_id = req.body.negotiation._id;
		keystone.list('Negotiation').model.find()
			.where('_id', n_id)
			.exec(function(err, negotiations){
				var n = negotiations[0];
				n.populate('messages, sender, receiver', function(err, doc){
					res.send(JSON.stringify(doc));
				})
			})
	}
	else{ // user profiles
		user.populate('profiles', function (err, doc) {
			if (err) console.log(err);
			res.send(JSON.stringify(doc.profiles));
		});		
	}
};