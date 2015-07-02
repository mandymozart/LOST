var keystone = require('keystone');
var Types    = keystone.Field.Types;

var NegotiationMessage = new keystone.List('NegotiationMessage');

NegotiationMessage.add({
	date    : {type : Types.Date},
	content : {type : String},
	sender  : {type : Types.Relationship, ref:'Profile'}
});

NegotiationMessage.relationship({ref:'Negotiation', path:'messages'})

NegotiationMessage.register();