var keystone = require('keystone');
var _        = require('underscore');

function match(p, options){
	var res = true;
	//filter by name
	res = res && (options.profileName == "") || (p.name.toLowerCase().indexOf(options.profileName.toLowerCase()) > -1)
	//filter by genres
	var containsGenres = false;
	for (var i=0; i<options.genres.length; i++){
		containsGenres = containsGenres || (p.genres.indexOf(options.genres[i]) > -1)
	}
	res = res && (containsGenres || options.genres.length == 0);
	//filter by profile type
	res = res && options.profileType == p.type;
	//filter by profile subtype
	//res = res && options.profileSubtype == p.subtype;
	//return
	return res;
}

exports = module.exports = function(req, res){
	var user = req.user;
	
	if (req.body.profileSearch){  //profile search	
		var options = req.body;
		keystone.list('Profile').model.find(function(err, profiles){
			if(err){
				console.log(err);
			}
			console.log('num profiles:' + profiles.length);
			var results = [];
			for (var i=0;i<profiles.length;i++){
				if (match(profiles[i], options)){
					results.push(profiles[i]);
				}
			}
			console.log('num results:' + results.length);
			res.send(JSON.stringify(results));
		})
	}
	else if (req.body.populateNegotiations){ //populate negotiations
		var p_id = req.body.profile._id;
		keystone.list('Profile').model.find()
			.where('_id', p_id)
			.exec(function(err, profiles){
				var p = profiles[0];
				p.populate('negotiations, proposals', function(err,doc){
					doc.negotiations.forEach(function(n){
						var nms = [];
						for (var i=0;i<n.messages.length;i++){
							nms.push(JSON.parse(n.messages[i]));
						}
						n.messages = nms;
					})
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
			var PM = keystone.list('Profile').model;
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
			.populate('sender')
			.populate('receiver')
			.exec(function(err, negotiations){
				var n = negotiations[0];
				res.send(JSON.stringify(n));
			})
	}
	else if (req.body.sendNegotiationMessage){ // send negotiation message
		var dt   = new Date();
		var n_id = req.body.negotiation._id;
		var p_id = req.body.profile._id;
		var msg  = req.body.message;
		keystone.list('Negotiation').model.find()
			.where('_id', n_id)
			.exec(function(err, negotiations){
				var n = negotiations[0];
				n.messages.push(JSON.stringify({
					sender:p_id,
					date:dt,
					message:msg
				}));
				n.save();
				res.send(JSON.stringify(n));
			})
	}
	else if (req.body.sendProposal){
		var dt = new Date();
		var proposal = new keystone.list('Proposal').model;
		proposal.set({
			sentDate:dt,
			proposedDate:req.body.proposedDate,
			sender:req.body.profile
		});
		proposal.save();
		var pids = _.map(req.body.profiles, function(p){
			return p._id;
		});
		keystone.list('Profile').model.find({
    		'_id': { $in: pids }
		}, function(err, docs){
     		docs.forEach(function(doc){
     			doc.proposals.push(proposal._id);
     			doc.save();
     		})
		});
	}
	else{ // user profiles
		user.populate('profiles', function (err, doc) {
			if (err) console.log(err);
			res.send(JSON.stringify(doc.profiles));
		});		
	}
};