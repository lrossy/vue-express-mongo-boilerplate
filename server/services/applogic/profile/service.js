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
		modelPropFilter: "code username fullName firstName lastName middleInitial suffix phone location email avatar passwordLess provider profile socialLinks roles apiKey lastLogin locale status createdAt updatedAt"
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

						if (ctx.params.firstName != null)
							doc.firstName = ctx.params.firstName;
						if (ctx.params.lastName != null)
							doc.lastName = ctx.params.lastName;
						if (ctx.params.middleInitial != null)
							doc.middleInitial = ctx.params.middleInitial;
						if (ctx.params.suffix != null)
							doc.suffix = ctx.params.suffix;
						if (ctx.params.phone != null)
							doc.phone = ctx.params.phone;

						if (ctx.params.location.country != null)
							doc.location.country = ctx.params.location.country;
						if (ctx.params.location.address != null)
							doc.location.address = ctx.params.location.address;
						if (ctx.params.location.address2 != null)
							doc.location.address2 = ctx.params.location.address2;
						if (ctx.params.location.city != null)
							doc.location.city = ctx.params.location.city;
						if (ctx.params.location.province != null)
							doc.location.province = ctx.params.location.province;
						if (ctx.params.location.zip != null)
							doc.location.zip = ctx.params.location.zip;


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
		}
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
				firstName: String
				lastName: String
				middleInitial: String
				suffix: String
				phone: String
				location: Location
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

			type Location {
				country: String
				address: String
				address2: String
				city: String
				province: String
				zip: String
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
