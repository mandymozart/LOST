var keystone = require('keystone');
var Types    = keystone.Field.Types;

var Event = keystone.List('Event');

Event.add({
	date : { type:Date },
	description : { type:String},
	artist : { type:Types.Relationship, ref:'Profile' },
	venue : { type:Types.Relationship, ref:'Profile'}
})

Event.register();