var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */

var User = new keystone.List('User');

var deps = {
    github: { 'services.github.isConfigured': true }, //TODO: remove once save
    facebook: { 'services.facebook.isConfigured': true },
    google: { 'services.google.isConfigured': true },
    twitter: { 'services.twitter.isConfigured': true }
}

User.add({
	name: { type: Types.Name, required: true, index: true },
	email: { type: Types.Email, initial: true, required: true, index: true },
	password: { type: Types.Password, initial: true, required: true },
    profiles: { type: Types.Relationship, ref: 'Profile', many: true},
    resetPasswordKey: { type: String, hidden: true }
}, 'Permissions', {
	isAdmin: { type: Boolean, label: 'Can access Keystone', index: true },
	isPremium: { type: Boolean, label: 'Is Premium User', index:true }
}, 'Services', {
    services: {
        github: { //TODO: remove once save
            isConfigured: { type: Boolean, label: 'GitHub has been authenticated' },

            profileId: { type: String, label: 'Profile ID', dependsOn: deps.github },

            username: { type: String, label: 'Username', dependsOn: deps.github },
            avatar: { type: String, label: 'Image', dependsOn: deps.github },

            accessToken: { type: String, label: 'Access Token', dependsOn: deps.github },
            refreshToken: { type: String, label: 'Refresh Token', dependsOn: deps.github }
        },
        facebook: {
            isConfigured: { type: Boolean, label: 'Facebook has been authenticated' },

            profileId: { type: String, label: 'Profile ID', dependsOn: deps.facebook },

            username: { type: String, label: 'Username', dependsOn: deps.facebook },
            avatar: { type: String, label: 'Image', dependsOn: deps.facebook },

            accessToken: { type: String, label: 'Access Token', dependsOn: deps.facebook },
            refreshToken: { type: String, label: 'Refresh Token', dependsOn: deps.facebook }
        },
        google: {
            isConfigured: { type: Boolean, label: 'Google has been authenticated' },

            profileId: { type: String, label: 'Profile ID', dependsOn: deps.google },

            username: { type: String, label: 'Username', dependsOn: deps.google },
            avatar: { type: String, label: 'Image', dependsOn: deps.google },

            accessToken: { type: String, label: 'Access Token', dependsOn: deps.google },
            refreshToken: { type: String, label: 'Refresh Token', dependsOn: deps.google }
        },
        twitter: {
            isConfigured: { type: Boolean, label: 'Twitter has been authenticated' },

            profileId: { type: String, label: 'Profile ID', dependsOn: deps.twitter },

            username: { type: String, label: 'Username', dependsOn: deps.twitter },
            avatar: { type: String, label: 'Image', dependsOn: deps.twitter },

            accessToken: { type: String, label: 'Access Token', dependsOn: deps.twitter },
            refreshToken: { type: String, label: 'Refresh Token', dependsOn: deps.twitter }
        }
    }
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



/**
 * Registration
 */

User.defaultColumns = 'name, email, isAdmin';
User.register();
