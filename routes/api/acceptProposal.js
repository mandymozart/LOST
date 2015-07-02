var keystone = require('keystone');
var _        = require('underscore');
var async    = require('async');

exports = module.exports = function(req, res){
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
