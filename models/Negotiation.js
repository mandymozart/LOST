var keystone = require('keystone');
var Types    = keystone.Field.Types;

/*
 * Negotiation Model
 */


var Negotiation = new keystone.List('Negotiation');

Negotiation.add({
    date : { type: Date },
    requestingProfile : { type: Types.Relationship, ref:'Profile' },
    respondingProfile : { type: Types.Relationship, ref:'Profile' },
    description : { type: String }
});

//register

Negotiation.register();
