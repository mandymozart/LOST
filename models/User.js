var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
    profiles: { type: Types.Relationship, ref: 'Profile', many: true}
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
	isPremium: { type: Boolean, label: 'Is Premium User', index:true }
});

// Provide access to Keystone
User.schema.virtual('canAccessKeystone').get(function() {
	return this.isAdmin;
});
User.schema.virtual('isPremiumUser').get(function() {
	return this.isPremium;
});

User.schema.methods.getProfiles = function(callback){
	this.populate('posts', function (err, doc) {
  		callback(doc);
	});
}


/**
 * Relationships
 */

User.relationship({path:'profiles', ref:'Profile', refPath:'User'});

/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();
