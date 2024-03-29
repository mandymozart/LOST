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
            }
    //TODO socialLinks    : {type : undefined } 
    //TODO souncloudLinks : {type : undefined }
    //TODO videoLinks     : {type : undefined }
    //TODO 
});


//relationships


//registration
Profile.register();
