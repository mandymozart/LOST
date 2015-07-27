var keystone = require('keystone');
var Types    = keystone.Field.Types;


var GeoInfo = new keystone.List('GeoInfo');

GeoInfo.add({
	countrycode : { type:String },
	name : { type:String },
	zip : { type:String },
	city : { type:String},
	geolocation : { 
		lat : { type:Number },
		lon : { type:Number }
	}
});

GeoInfo.register();
