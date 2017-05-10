"use strict";

let logger 		= require("../../../core/logger");
let config 		= require("../../../config");
let C 	 		= require("../../../core/constants");
let E 			= require("../../../core/errors");

let _			= require("lodash");

let User 		= require("./models/user");

module.exports = {
	name: "profile",
	//version: 1,

	settings: {
		//latestVersion: true,
		rest: true,
		ws: true,
		graphql: true,
		permission: C.PERM_LOGGEDIN,
		collection: User,

		hashedIdentity: true,
		modelPropFilter: "code username fullName email avatar passwordLess provider profile socialLinks roles apiKey lastLogin locale status createdAt updatedAt"
	},

	actions: {
		// return my profile with all properties
		get: {
			cache: false, // can't be cached, because it is unique for every account
			defaultMethod: "get",
			handler(ctx) {
				return this.Promise.resolve(ctx)
				.then(ctx => User.findById(ctx.params.$user.id).exec())
				.then(doc => this.toJSON(doc))
				.then(json => this.populateModels(ctx, json));
			}
		},
		update: {
			defaultMethod: "put",
			needModel: true,
			permission: C.PERM_OWNER,
			handler(ctx) {
				return this.Promise.resolve(ctx)
					.then(ctx => this.resolveID(ctx))
					.then(modelID => this.checkModel(modelID, "app:DeviceNotFound"))
					.then(modelID => this.collection.findById(modelID).exec())
					.then(doc => this.checkModelOwner(doc, "id", ctx.params.$user))
					.then(doc => {

										if (ctx.params.fullName != null)
											doc.fullName = ctx.params.fullName;

						return doc.save();
					})
					.then(doc => this.toJSON(doc))
					.then(json => this.populateModels(ctx, json))
					.then((json) => {
						console.log('json',json);
						// console.log('ctx',ctx);
						this.notifyModelChanges(ctx, "updated", json, ctx.params.$user);

						// Clear cached values
						this.clearCache();

						return json;
					});
			}
		},
		// update: {
		// 	defaultMethod: "put",
		// 	needModel: true,
		// 	permission: C.PERM_OWNER,
		// 	handler(ctx) {
		// 		return this.Promise.resolve(ctx)
		// 			.then(ctx => this.resolveID(ctx))
		// 			.then(modelID => this.checkModel(modelID, "app:PostNotFound"))
		// 			.then(modelID => this.collection.findById(modelID).exec())
		// 			.then(doc => this.checkModelOwner(doc, "id", ctx.params.$user))
		// 			.then(doc => {
		// 				if (ctx.params.fullName != null)
		// 					doc.fullName = ctx.params.fullName;
        //
		// 				if (ctx.params.province != null)
		// 					doc.province = ctx.params.province;
        //
		// 				return doc.save();
		// 			})
		// 			.then(doc => this.toJSON(doc))
		// 			.then(json => this.populateModels(ctx, json))
		// 			.then((json) => {
		// 				this.notifyModelChanges(ctx, "updated", json, ctx.params.$user);
        //
		// 				// Clear cached values
		// 				this.clearCache();
        //
		// 				return json;
		// 			});
		// 	}
		// },

		// update: {
		// 	defaultMethod: "put",
		// 	needModel: true,
		// 	handler(ctx) {
		// 		return this.Promise.resolve(ctx)
		// 			.then(ctx => this.resolveID(ctx))
		// 			.then(modelID => this.checkModel(modelID, "app:DeviceNotFound"))
		// 			.then(modelID => this.collection.findById(modelID).exec())
		// 			.then(doc => {
         //                //
		// 				if (ctx.params.fullName != null)
		// 					doc.fullName = ctx.params.fullName;
        //
		// 				if (ctx.params.province != null)
		// 					doc.province = ctx.params.province;
         //                //
		// 				// if (ctx.params.name != null)
		// 				// 	doc.name = ctx.params.name;
         //                //
		// 				// if (ctx.params.description != null)
		// 				// 	doc.description = ctx.params.description;
         //                //
		// 				// if (ctx.params.status != null)
		// 				// 	doc.status = ctx.params.status;
		// 				console.log('doc', doc);
        //
		// 				return doc.save();
		// 			})
		// 			.then(doc => this.toJSON(doc))
		// 			.then(json => this.populateModels(ctx, json))
		// 			.then((json) => {
		// 				this.notifyModelChanges(ctx, "updated", json, ctx.params.$user);
        //
		// 				// Clear cached values
		// 				this.clearCache();
        //
		// 				return json;
		// 			});
		// 	}
		// },
		// update: {
		// 	defaultMethod: "post",
		// 	handler(ctx) {
		// 		// TODO: save profile changes
		// 	}
		// }
	},

	methods: {
	},

	graphql: {

		query: `
			profile: Profile
		`,

		types: `
			type Profile {
				code: String!
				fullName: String
				email: String
				username: String
				passwordLess: Boolean
				provider: String
				profile: SocialProfile
				socialLinks: SocialLinks
				roles: [String]
				verified: Boolean
				apiKey: String
				locale: String
				avatar: String
				createdAt: Timestamp
				updatedAt: Timestamp
				lastLogin: Timestamp
				status: Boolean
			}

			type SocialProfile {
				name: String
				gender: String
				picture: String
				location: String
			}

			type SocialLinks {
				facebook: String
				twitter: String
				google: String
				github: String
			}
		`,

		mutation: `
					profileUpdate(fullName: String!): Profile
		`,

		resolvers: {
			Query: {
				profile: "get"
			},
			Mutation: {
				profileUpdate: "update"
			}
		}
	}

};

/*
## GraphiQL test ##

# Get a person
query getProfile {
  profile {
    ...profileFields
  }
}


fragment profileFields on Profile {
	code
	fullName
	email
	username
	passwordLess
	provider
	profile {
		name
		gender
		picture
		location
	}
	socialLinks {
		facebook
		twitter
		google
		github
	}
	roles
	verified
	apiKey
	locale
	avatar
	createdAt
	updatedAt
	lastLogin
	status
}

*/
