var keystone = require('keystone');
var Types    = keystone.Field.Types;

/*
 * Negotiation Model
 */

var Negotiation = new keystone.List('Negotiation');

Negotiation.add({
    date         : { type: Date },
    sender       : { type: Types.Relationship, ref:'Profile' },
    receiver     : { type: Types.Relationship, ref:'Profile' },
    description  : { type: String },
    //messages     : { type: Types.Relationship, ref:'NegotiationMessage', many:true },
    messages     : { type: Types.TextArray },
    currentOffer : { type: String },
    status       : { type:Types.Select, options: 'open, closed, cancelled', default:'open', index:true}
});

//register

Negotiation.register();
