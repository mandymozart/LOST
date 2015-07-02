var keystone = require('keystone');
var _        = require('underscore');


exports = module.exports = function(req, res){
	var n = req.body.negotiation;
	keystone.list('Negotiation').model.find()
		.where('_id', n._id)
		.populate('messages')
		.exec(function(err, docs){
			if (err) console.log(err);
			res.send(docs[0]);
		});
}