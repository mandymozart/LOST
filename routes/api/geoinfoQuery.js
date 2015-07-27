var keystone = require('keystone');
var _        = require('underscore');
var async    = require('async');

exports = module.exports = function(req, res){
	keystone.list('GeoInfo').model.find()
		.where(req.body)
		.exec(function(err,docs){
			res.send(docs)
		})
}