"use strict";

let config 	= require("../../../config");
let logger 	= require("../../../core/logger");
let path 	= require("path");

module.exports = function(app, db, service) {

	// Index page
	app.get("/", function(req, res) {
		if (req.user != null)
			res.render("main", {
				user: req.user
			});
		else
			res.render("index", {
				socialAuth: checkAvailableSocialAuth()
			});
	});

	/**
		* Check what social API are configured. We only show
		* this social buttons on login # signup pages
		*/
	function checkAvailableSocialAuth() {
		// set social options
		let social = {};

		if (config.authKeys) {
			if (config.authKeys.google && config.authKeys.google.clientID)
				social.google = true;

			if (config.authKeys.facebook && config.authKeys.facebook.clientID)
				social.facebook = true;

			if (config.authKeys.github && config.authKeys.github.clientID)
				social.github = true;

			if (config.authKeys.twitter && config.authKeys.twitter.clientID)
				social.twitter = true;
		}

		if (Object.keys(social).length > 0)
			return social;

		return null;
	}


	// Handle health check routes
	require("./health")(app, db);

	// Handle account routes
	require("./account")(app, db);

	// Handle Auth routes
	require("./auth")(app, db);

	// Load services routes
	//require("../applogic/routeHandlers")(app, db);
	//let services = require("../../../core/services");
	//services.registerRoutes(app, db);

	// Handle Graphql request
	require("./graphql")(app, db, service);

	// Handle errors
	require("./errors")(app, db);
};
