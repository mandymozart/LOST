var keystone = require('keystone');
var Types    = keystone.Field.Types;

/**
 * Profile Model
 */

var Profile = new keystone.List('Profile');

Profile.add({
    user  : { type: Types.Relationship, ref: 'User', index: true },
    name  : { type: String, required: true, index: true },
    about : {
                brief    : { type: Types.Html, wysiwig: true, height: 50 },
                extended : { type: Types.Html, wysiwig: true, height: 300}
            },
    genres : { type: Types.TextArray },
    type  : { type: Types.Select, options:'Artist, Venue, Organiser'},
    subtype : {type: String},
    negotiations : { type: Types.Relationship, ref: 'Negotiation', many:true },
    proposals : {type: Types.Relationship, ref: 'Proposal', many:true}
    //TODO socialLinks    : {type : undefined }
    //TODO souncloudLinks : {type : undefined }
    //TODO videoLinks     : {type : undefined }
    //TODO ...
});



//registration
Profile.register();
