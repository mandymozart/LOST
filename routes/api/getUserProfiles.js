var keystone = require('keystone');
var _        = require('underscore');
var async    = require('async');

exports = module.exports = function(req, res){
	var user = req.user;
	user.populate('profiles', function (err, doc) {
		if (err) console.log(err);
		res.send(JSON.stringify(doc.profiles));
	});	
}