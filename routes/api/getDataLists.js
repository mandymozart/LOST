var keystone = require('keystone');
var _        = require('underscore');

var lists = {
	genres         : ['Rock','Pop','Classic','Deep House','Hip Hop',
			          'Experimental','Techno','Acid House', 'Trance'],
	profileTypes   : ['Artist', 'Venue', 'Organiser'],
	artistTypes    : ['Solo Performer', 'Band', 'Magician', 'Orchestra'],
	venueTypes     : ['Concert Hall', 'Live Hall', 'Club', 'Open Air', 'Bar'],
	organiserTypes : ['Live', 'Club', 'Festival', 'Avant Garde']
}

function indexList(l){
	for (var i=0;i<l.length;i++){
		l[i] = {
			id : i,
			label : l[i]
		}
	}
}

//indexList(lists.genres);
//indexList(lists.profileTypes);
//indexList(lists.artistTypes);
//indexList(lists.venueTypes);
//indexList(lists.organiserTypes);

exports = module.exports = function(req, res){

	res.send(JSON.stringify(lists));
}