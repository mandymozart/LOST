/**
 * This file is where you define your application routes and controllers.
 * 
 * Start by including the middleware you want to run for every request;
 * you can attach middleware to the pre('routes') and pre('render') events.
 * 
 * For simplicity, the default setup for route controllers is for each to be
 * in its own file, and we import all the files in the /routes/views directory.
 * 
 * Each of these files is a route controller, and is responsible for all the
 * processing that needs to happen for the route (e.g. loading data, handling
 * form submissions, rendering the view template, etc).
 * 
 * Bind each route pattern your application should respond to in the function
 * that is exported from this module, following the examples below.
 * 
 * See the Express application routing documentation for more information:
 * http://expressjs.com/api.html#app.VERB
 */

var keystone = require('keystone'),
	middleware = require('./middleware'),
	importRoutes = keystone.importer(__dirname);

// Common Middleware
keystone.pre('routes', middleware.initLocals);
keystone.pre('render', middleware.flashMessages);

// Import Route Controllers
var routes = {
	views: importRoutes('./views'),
    auth: importRoutes('./auth'),
	api:  importRoutes('./api')
};

// Setup Route Bindings
exports = module.exports = function(app) {
	
	// Views
	app.get('/', routes.views.index);
	app.get('/blog/:category?', routes.views.blog);
	app.get('/blog/post/:post', routes.views.post);
	app.all('/contact', routes.views.contact);
	//app.all('/calendar', routes.views.calendar);
	app.get('/calendar', middleware.requireUser, routes.views.calendar);
	app.get('/profiles', middleware.requireUser, routes.views.profiles);


	app.get('/generator', middleware.requireAdmin, routes.views.generator);

    // Session
    app.all('/join', routes.views.session.join);
    app.all('/signin', routes.views.session.signin);
    app.get('/signout', routes.views.session.signout);
    app.all('/forgot-password', routes.views.session['forgot-password']);
    app.all('/reset-password/:key', routes.views.session['reset-password']);

    // Authentication
    app.all('/auth/confirm', routes.auth.confirm);
    //app.all('/auth/app', routes.auth.app);
    app.all('/auth/:service', routes.auth.service);

	// API
	app.post('/profilesData', middleware.requireUser, routes.views.profilesData);

	app.get('/api/getDataLists', middleware.requireUser, routes.api.getDataLists);
	app.get('/api/getUserProfiles', middleware.requireUser, routes.api.getUserProfiles);
	app.post('/api/generator', middleware.requireAdmin, routes.api.generator);
	app.post('/api/populateProfile', middleware.requireUser, routes.api.populateProfile);
	app.post('/api/saveProfile', middleware.requireUser, routes.api.saveProfile);
	app.post('/api/profileSearch',middleware.requireUser, routes.api.profileSearch);
	app.post('/api/sendProposal', middleware.requireUser, routes.api.sendProposal);
	app.post('/api/sendNegotiationMessage', middleware.requireUser, routes.api.sendNegotiationMessage);
	app.post('/api/acceptProposal', middleware.requireUser, routes.api.acceptProposal);
	app.post('/api/submitNegotiationOffer', middleware.requireUser, routes.api.submitNegotiationOffer);
	app.post('/api/populateNegotiationMessages', middleware.requireUser, routes.api.populateNegotiationMessages);
	app.post('/api/deleteProfile', middleware.requireUser, routes.api.deleteProfile);
	app.post('/api/acceptNegotiation', middleware.requireUser, routes.api.acceptNegotiation);
	app.post('/api/rejectNegotiation', middleware.requireUser, routes.api.rejectNegotiation);
	// NOTE: To protect a route so that only admins can see it, use the requireUser middleware:
	// app.get('/protected', middleware.requireUser, routes.views.protected);
	
};
