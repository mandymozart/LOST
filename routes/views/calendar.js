var keystone = require('keystone');
var async    = require('async');

exports = module.exports = function(req, res){
	var view   = new keystone.View(req, res);
	var locals = res.locals;

	locals.section = 'calendar';

	locals.data = {
		events : []
	};

	view.on('init', function(next){
		locals.data.events = keystone.list('User').model.find({ _id : req._id }).calendarEvents;
	});

	view.render('calendar');
}