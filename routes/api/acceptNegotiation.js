var keystone = require('keystone');
var _        = require('underscore');
var async    = require('async');

exports = module.exports = function(req, res) {

	var callback = function(p, n){
		if (n.state == 'open'){
			n.state = p._id == n.sender ? 'sender_accepted' : 'receiver_accepted'
			n.save()
			res.send(n)
		}
		else if (n.state == 'sender_accepted'){
			if (p._id == n.receiver){
				n.state = 'closed'
				n.save()
				res.send(n)
			}
		}
		else if (n.state == 'receiver_accepted'){
			if (p._id == n.sender){
				p.state = 'closed'
				n.save()
				res.send(n)
			}
		}
		else{
			res.send(n)
		}
	}

	keystone.list('Profile').model.find()
		.where('_id', req.body.profile._id)
		.exec(function(err0, profiles){
			if (err0) console.log(err0)
			keystone.list('Negotiation').model.find()
				.where('_id', req.body.negotiation._id)
				.exec(function(err1, negotiations){
					if (err1) console.log(err1)
					callback(profiles[0], negotiations[0])
				})
		})
}