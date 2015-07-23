var keystone = require('keystone');
var _        = require('underscore');

//var lists = {
//	genres         : ['Rock','Pop','Classic','Deep House','Hip Hop',
//			          'Experimental','Techno','Acid House', 'Trance'],
//	profileTypes   : ['Artist', 'Venue', 'Organiser'],
//	artistTypes    : ['Solo Performer', 'Band', 'Magician', 'Orchestra'],
//	venueTypes     : ['Concert Hall', 'Live Hall', 'Club', 'Open Air', 'Bar'],
//	organiserTypes : ['Live', 'Club', 'Festival', 'Avant Garde']
//}

var lists = {
	artistTypes : ['Band', 'Solo Musician','DJ','VJ','Performer','Movie Maker'],
	venueTypes : [],
	organiserTypes : [],
	genres : ['african','experimental','blues','latin american','country','asian','electronic','folk','hip hop','jazz','pop','r&b','rock','ska','footage','cgi','mapping','interactive','classic','contemporary','freestyle','butoh','spoken words','puppeteer','circus','performance art','fiction','documentary','music videos'],
	splitgenres : {
		'Band' : ['african','experimental','blues','latin american','country','asian','electronic','folk','hip hop','jazz','pop','r&b','rock','ska'],
		'Solo Musician' : ['african','experimental','blues','latin american','country','asian','electronic','folk','hip hop','jazz','pop','r&b','rock','ska'],
		'DJ' : ['african','experimental','blues','latin american','country','asian','electronic','folk','hip hop','jazz','pop','r&b','rock','ska'],
		'VJ' : ['footage','cgi','mapping','interactive'],
		'Performer' :  ['classic','contemporary','freestyle','butoh','spoken words','puppeteer','circus','performance art'],
		'Movie Maker' : ['fiction','documentary','music video']
	}
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