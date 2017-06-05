"use strict";

let logger 		= require("../../../core/logger");
let config 		= require("../../../config");
let C 	 		= require("../../../core/constants");
let E 			= require("../../../core/errors");

let _			= require("lodash");

let User 		= require("./models/user");

module.exports = {
	name: "persons",
	//version: 1,

	settings: {
		//latestVersion: true,
		rest: true,
		ws: true,
		graphql: true,
		permission: C.PERM_LOGGEDIN,
		collection: User,

		hashedIdentity: true,
		modelPropFilter: "code username fullName avatar"
	},

	// Exposed actions
	actions: {

		model: {
			cache: true,
			publish: false,
			handler(ctx) {
				return this.resolveModel(ctx);
			}
		}
	},

	// Event listeners
	events: {

	},

	// Service methods
	methods: {

	},

	created() {
		// this.logger.info("Service created!");
	},

	started() {
		// this.logger.info("Service started!");
	},

	stopped() {
		// this.logger.info("Service stopped!");
	},

	graphql: {

		query: `
			person(code: String): Person
		`,

		types: `
			type Person {
				code: String!
				fullName: String
				username: String
				roles: [String]
				avatar: String
				lastLogin: Timestamp

				posts(limit: Int, offset: Int, sort: String): [Post]
			}
		`,
		//				posts(limit: Int, offset: Int, sort: String): [Post]

		mutation: `
		`,

		resolvers: {
			Query: {
				person: "model"
			},

			Person: {

				posts(person, args, context) {
					let ctx = context.ctx;
					let author = User.schema.methods["decodeID"](person.code);
					return context.broker.call("posts.list", { author });
				}
			}
		}
	}
};

/*
## GraphiQL test ##

# Get a person
query getPerson {
  person(code: "O5rNl5Bwnd") {
    ...personFields
  }
}


fragment personFields on Person {
  code
  fullName
  username
  roles
  avatar
  lastLogin

  posts(sort: "-createdAt") {
    code
    title
  }
}

*/
