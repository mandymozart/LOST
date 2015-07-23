var keystone = require('keystone');
var _        = require('underscore');
var async    = require('async');

exports = module.exports = function(req, res){
	//req.body must contain a profile object
	//console.log(req.body);
	var p_id = req.body.profile._id; // profile to populate
	
	keystone.list('Profile').model.find()
		.where('_id', p_id)
		.populate('negotiations')
		.populate('proposals')
		.exec(function(err, profiles){
			var p = profiles[0];
			
			//populates the negotiation messages in each p.negotiation then executes cb()
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
			//populates the every proposal in p.proposals then executes cb()
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
					//send populated profile to user
					res.send(p);
				})
			})		
		})
}