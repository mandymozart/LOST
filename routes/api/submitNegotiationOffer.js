var keystone = require('keystone');
var _        = require('underscore');
var async    = require('async');

exports = module.exports = function(req, res){
	console.log(req.body);
	keystone.list('Negotiation').model.find()
		.where('_id', req.body.negotiation._id)
		.populate('messages')
		.populate('sender')
		.populate('receiver')
		.exec(function(err, doc){
			doc = doc[0];
			doc.currentOffer = req.body.offer;
			doc.save();
			console.log(doc);
			res.send(doc);
		})
}