var keystone = require('keystone');
var Types    = keystone.Field.Types;

/*
 * Proposal Model
 */

var Proposal = new keystone.List('Proposal');

Proposal.add({
	sentDate     : { type: Date },
	proposedDate : { type: Date },
	sender       : { type: Types.Relationship, ref:'Profile' }
});

Proposal.register();

