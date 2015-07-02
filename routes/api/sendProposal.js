var keystone = require('keystone');
var _        = require('underscore');
var async    = require('async');

exports = module.exports = function(req, res){
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