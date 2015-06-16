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
		p.set({
			user  : user._id,
    		name  : "TestProfile"+i,
    		about : {
                brief    : "brief description",
                extended : "extended description"
            },
    		genres : gs,
    		type  : t,
    		subtype : "subtype",
    		negotiations : []
		})
		console.log(p)
		p.save();
		user.profiles.push(p._id);
	}
	res.send("created profiles");
}