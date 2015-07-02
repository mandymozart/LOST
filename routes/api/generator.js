var keystone = require('keystone');
var _        = require('underscore');

var User = keystone.list('User').model;
var Profile = keystone.list('Profile').model;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

exports = module.exports = function(req, res){
	var n = req.body.n;
	var user = req.user;
	console.log(req.body);
	for (var i=0;i<n;i++){
		var p = new Profile();
		var gs = [];
		var genres = ['Rock','Pop','Classic','Deep House','Hip Hop','Experimental','Techno','Acid House'];
		var ngs = getRandomInt(4);
		for (var j=0;j<ngs;j++){
			var gi = getRandomInt(genres.length);
			if (gs.indexOf(gi) == -1)
				gs.push(genres[gi]);
		}
		var t = "";
		if (i%3 == 0){
			t = "Artist"
		}
		else if (i%3 == 1){
			t = "Venue"
		}
		else{
			t = "Organiser"
		}
		var zip = getRandomInt(1000);
		var u = new User();
		u.set({
			name: 'TestUser:'+i,
			email: 'TestUser'+i+'@email.com',
			password: '1234'
		});
		u.save();
		p.set({
			user  : u._id,
    		name  : "TestProfile:"+i,
    		about : "description",
    		genres : gs,
    		type  : t,
    		subtype : "subtype",
    		negotiations : [],
    		zip: zip,
    		creationDate: new Date(),
    		state : "published"
		});
		p.save();
		u.profiles.push(p._id);
		u.save();		
	}
	res.send("created profiles");
}