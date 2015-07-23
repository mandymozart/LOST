var keystone = require('keystone')
var _        = require('underscore')
var async    = require('async')

exports = module.exports = function(req, res){
	if (!req.body.negotiation._id) res.send(undefined);

	keystone.list('Profile').model.find({
		'_id': { $in: [ req.body.negotiation.sender._id, req.body.negotiation.receiver._id ] }
	},function(err, docs){
		_.each(docs,function(doc){
			//console.log(doc.negotiations);
			doc.negotiations.splice(doc.negotiations.indexOf(req.body.negotiation._id),1)
			//console.log(doc.negotiations);
		})
		keystone.list('Negotiation').model.find({
			'_id': req.body.negotiation._id
		})
		.remove(function(){
			console.log('removed negotiation')
			res.send(undefined);
		})
	});
}