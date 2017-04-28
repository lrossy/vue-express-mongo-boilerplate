"use strict";

let pkg 	= require("../../package.json");

module.exports = {
	app: {
	},

	db: {
		uri: process.env.MONGO_URI || "mongodb://192.168.2.32/" + pkg.config.dbName,
		options: {
			user: process.env.MONGO_USERNAME || "",
			pass: process.env.MONGO_PASSWORD || ""
		}
	}
};
