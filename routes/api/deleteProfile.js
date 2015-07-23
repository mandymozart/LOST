var keystone = require('keystone');
var _        = require('underscore');
var async    = require('async');

exports = module.exports = function(req, res){
	var p = req.body.profile;
	keystone.list('Profile').model.find()
		.where('_id', p._id)
		.remove(function(){
			res.sendStatus(200);
		})	
}