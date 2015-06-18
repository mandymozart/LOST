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
	var user = req.user;
	
	if (req.body.profileSearch){  //profile search	
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
	else if (req.body.populateNegotiations){ //populate negotiations
		var p_id = req.body.profile._id;
		keystone.list('Profile').model.find()
			.where('_id', p_id)
			.populate('negotiations')
			.populate('proposals')
			.exec(function(err, profiles){
				var p = profiles[0];
				function populateNegotiationMessages(cb){
					async.each(p.negotiations,
						function(n, callback){
							n.populate('messages , receiver , sender', function(err, doc){
								//console.log(doc);
								callback();
							})
						},
						function done(err){
							cb();
						})	
				}
				function populateProposals(cb){
					async.each(p.proposals,
						function(pr, callback){
							pr.populate('sender', function(err, doc){
								callback();
							})
						},
						function done(err){
							cb();
						})
				}
				populateNegotiationMessages(function(){
					populateProposals(function(){
						res.send(p);
					})
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
		var Proposal = keystone.list('Proposal').model;
		var proposal = Proposal();
		proposal.set({
			sentDate:dt,
			proposedDate:req.body.proposedDate,
			sender:req.body.profile._id
		});
		//console.log(proposal);
		proposal.save();
		var pids = _.map(req.body.profiles, function(p){
			return p._id;
		});
		keystone.list('Profile').model.find({
    		'_id': { $in: pids }
		}, function(err, docs){
     		docs.forEach(function(doc){
     			doc.proposals.push(proposal._id);
     			console.log(doc);
     			doc.save();
     		})
     		res.sendStatus(200);
		});
	}
	else if (req.body.acceptProposal){
		//create negotiation
		var Negotiation = keystone.list('Negotiation').model;
		var negotiation = Negotiation();
		negotiation.set({
			date         : req.body.proposal.proposedDate,
    		sender       : req.body.proposal.sender._id,
    		receiver     : req.body.profile._id,
    		description  : "",
    		messages     : [],
    		currentOffer : "offer gage",
   			status       : "open"
		})
		negotiation.save();
		//console.log(negotiation);
		//add negotiation to profiles
		keystone.list('Profile').model.find({
			'_id': { $in: [ req.body.profile._id, req.body.proposal.sender._id ] }
		},function(err, docs){
			var p = undefined;
			_.each(docs, function(d){
				if (d._id == req.body.profile._id){
					p = d;
					var index = -1;
					for (var i=0;i<d.proposals.length;i++){
						if (d.proposals[i]._id == req.body.proposal._id){
							index = i;
							break;
						}
					}
					d.proposals.splice(index, 1);
				}
				d.negotiations.push(negotiation._id);
				d.save();
				//console.log(d);
			});
			p.populate('proposals , negotiations', function(err, doc){
				function populateNegotiationMessages(cb){
					async.each(doc.negotiations,
						function(n, callback){
							n.populate('messages , receiver , sender', function(err, doc){
								callback();
							})
						},
						function done(err){
							cb();
						})	
				}
				function populateProposals(cb){
					async.each(doc.proposals,
						function(pr, callback){
							pr.populate('sender', function(err, doc){
								callback();
							})
						},
						function done(err){
							cb();
						})
				}
				populateNegotiationMessages(function(){
					populateProposals(function(){
						res.send(doc);
					})
				})
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