var keystone = require('keystone');
var Types    = keystone.Field.Types;

/**
 * Profile Model
 */

var Profile = new keystone.List('Profile', {
    autokey : { path:'slug', from:'name', unique:true }

Profile.add({
    user  : { type: Types.Relationship, ref: 'User', index: true },
    name  : { type: String, required: true, index: true },
    about : {
                brief    : { type: Types.Html, wysiwig: true, height: 50 },
                extended : { type: Types.Html, wysiwig: true, height: 300} 
            },
    //TODO socialLinks    : {type : undefined } 
    //TODO souncloudLinks : {type : undefined }
    //TODO videoLinks     : {type : undefined }
    //TODO 
});

Profile.add({
    user            : { type: Types.Relationship, ref: 'User', index: true },
    name            : { type: String, required: true, index: true },
    about           : { type: Types.Html, wysiwig: true, height: 300 },
    genres          : { type: Types.TextArray },
    type            : { type: Types.Select, options:'Artist, Venue, Organiser'},
    subtype         : { type: String },
    negotiations    : { type: Types.Relationship, ref: 'Negotiation', many:true },
    proposals       : { type: Types.Relationship, ref: 'Proposal', many:true },
    
    state           : { type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true },

    zip             : { type: String, required: true, initial: true },
    socialLinks     : { type: Types.TextArray },
    soundcloundId   : { type: Number },
    image           : { type: Types.CloudinaryImage },
    creationDate    : { type: Types.Date },
    favourites      : { type: Types.Relationship, ref: 'Profile', many:true },
    called          : { type: Types.Relationship, ref: 'Profile', many:true },

    tours           : { type: Types.Relationship, ref: 'Tour', many:true }    
});

//registration
Profile.register();
