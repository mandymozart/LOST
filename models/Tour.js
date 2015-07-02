var keystone = require('keystone');
var Types    = keystone.Field.Types;

var Tour = new keystone.List('Tour');

Tour.add({
	profile : { type:Types.Relationship, ref: 'Profile' },
});

Tour.register();