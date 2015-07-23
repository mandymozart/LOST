var keystone = require('keystone');
var _        = require('underscore');
var async    = require('async');

exports = module.exports = function(req, res){
	var dt   = new Date(); // current date, ie. sent date
	var n_id = req.body.negotiation._id; // the belonging negotiation
	var p_id = req.body.profile._id;  // sender id
	var msg  = req.body.message; // the msg to add to the negotiation
	keystone.list('Negotiation').model.find()
		.where('_id', n_id)
		.populate('sender')
		.populate('receiver')
		.populate('messages')
		.exec(function(err, negotiations){
			var n = negotiations[0];
			if (n.status == 'cancelled'){
				res.send({
					err : true,
					message : 'You cannot send messages in a declined negotiation!'
				});
				return;
			}
			var NegotiationMessage = keystone.list('NegotiationMessage').model;
			var negotiationMessage = NegotiationMessage();
			negotiationMessage.set({
				sender:p_id,
				date:dt,
				content:msg
			})
			negotiationMessage.save()
			n.messages.push(negotiationMessage._id);
			n.save();
			res.send(n);
		})
}