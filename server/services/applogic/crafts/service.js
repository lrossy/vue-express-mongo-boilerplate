"use strict";

let logger 		= require("../../../core/logger");
let config 		= require("../../../config");
let C 	 		= require("../../../core/constants");
let E 			= require("../../../core/errors");

let _			= require("lodash");

let Craft 		= require("./models/craft");

module.exports = {
	name: "crafts",
	//version: 1,

	settings: {
		//latestVersion: true,
		rest: true,
		ws: true,
		graphql: true,
		permission: C.PERM_LOGGEDIN,
		collection: Craft,

		hashedIdentity: true,
		modelPropFilter: "code registration_id manufacturer model serial_number class max_takeoff_w num_engines engine_type",

		modelPopulates: {
			"author": "persons.model"
		}
	},

	actions: {
		list: {
			cache: false,
			defaultMethod: "get",
			handler(ctx) {
				let filter = {};

				filter.user_id =ctx.params.$user.id;

				//check if admin
				if (ctx.params.$user.roles.indexOf(C.ROLE_ADMIN) !== -1){
					delete filter.user_id;
				}
				// if (ctx.params.filter == "my"){
				// 	filter.user_id =ctx.params.$user.id;
				// }
				// else if (ctx.params.author != null)
				// 	filter.user_id = ctx.params.author;

				// console.log('filter',filter)
				let query = this.collection.find(filter);

				return this.applyFilters(query, ctx).exec()
					.then(docs => this.toJSON(docs))
					.then(json => this.populateModels(ctx, json));
			}
		},

		// return a model by ID
		get: {
			cache: {
				keys: [ "code" ]
			},
			defaultMethod: "get",
			needModel: true,
			handler(ctx) {
				return this.Promise.resolve(ctx)
				.then(ctx => ctx.call(this.name + ".model", { code: ctx.params.code }))
				.then(model => this.checkModel(model, "app:DeviceNotFound"))
				// .then(model => this.checkModelOwner(model, "user_id", ctx.params.$user))
				.then(doc => this.toJSON(doc))
				.then(json => this.populateModels(ctx, json));
			}
		},
		model: {
			cache: false,
			publish: false,
			populate: true,
			handler(ctx) {
				return this.resolveModel(ctx);
			}
		},

		create: {
			defaultMethod: "post",
			handler(ctx) {
				return this.Promise.resolve(ctx)
				.then(() => {
					let craft = new Craft({
						registration_id: ctx.params.registration_id,
						manufacturer: ctx.params.manufacturer,
						model: ctx.params.model,
						serial_number: ctx.params.serial_number,
						class: ctx.params.class,
						max_takeoff_w: ctx.params.max_takeoff_w,
						num_engines: ctx.params.num_engines,
						engine_type: ctx.params.engine_type,
						user_id: ctx.params.$user.id
					});

					return craft.save();
				})
				.then(doc => this.toJSON(doc))
				.then(json => this.populateModels(ctx, json))
				.then(json => {

				this.notifyModelChanges(ctx, "created", json, ctx.params.$user);

					// Clear cached values
					this.clearCache();

					return json;
				});
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
				.then(doc => this.checkModelOwner(doc, "user_id", ctx.params.$user))
				.then(doc => {

					if (ctx.params.registration_id != null)
						doc.registration_id = ctx.params.registration_id;

					if (ctx.params.manufacturer != null)
						doc.manufacturer = ctx.params.manufacturer;

					if (ctx.params.model != null)
						doc.model = ctx.params.model;

					if (ctx.params.serial_number != null)
						doc.serial_number = ctx.params.serial_number;

					if (ctx.params.class != null)
						doc.class = ctx.params.class;

					if (ctx.params.max_takeoff_w != null)
						doc.max_takeoff_w = ctx.params.max_takeoff_w;

					if (ctx.params.num_engines != null)
						doc.num_engines = ctx.params.num_engines;

					if (ctx.params.engine_type != null)
						doc.engine_type = ctx.params.engine_type;

					return doc.save();
				})
				.then(doc => this.toJSON(doc))
				.then(json => this.populateModels(ctx, json))
				.then((json) => {
					this.notifyModelChanges(ctx, "updated", json, ctx.params.$user);

					// console.log('ctx',ctx);
					console.log('ctx.params',ctx.params);
					// Clear cached values
					this.clearCache();

					return json;
				});
			}
		},

		remove: {
			defaultMethod: "delete",
			needModel: true,
			permission: C.PERM_OWNER,
			handler(ctx) {
				return this.Promise.resolve(ctx)
				.then(ctx => ctx.call(this.name + ".model", { code: ctx.params.code }))
				.then(model => this.checkModel(model, "app:DeviceNotFound"))
				.then(model => this.checkModelOwner(model, "user_id", ctx.params.$user))
				.then(model => {
					return this.collection.remove({ _id: model.id }).then(() => model);
				})
				.then(doc => this.toJSON(doc))
				.then(json => this.populateModels(ctx, json))
				.then((json) => {
					this.notifyModelChanges(ctx, "removed", json, ctx.params.$user);

					// Clear cached values
					this.clearCache();

					return json;
				});
			}
		},

		find: {
			cache: true,
			defaultMethod: "get",
			handler(ctx) {
				let filter = {};

				// filter.user_id =ctx.params.$user.id;
				//
				// //check if admin
				// if (ctx.params.$user.roles.indexOf(C.ROLE_ADMIN) !== -1){
				// 	delete filter.user_id;
				// }
				// if (ctx.params.filter == "my"){
				// 	filter.user_id =ctx.params.$user.id;
				// }
				// else if (ctx.params.author != null)
				// 	filter.user_id = ctx.params.author;

				// console.log('filter',filter)
				// let query = this.collection.find(filter);
				let query = this.collection.find({
					"serial_number": ctx.params.term
				});
				return this.applyFilters(query, ctx).exec()
					.then(docs => this.toJSON(docs))
					.then(json => this.populateModels(ctx, json));
			}
		}

	},

	// Event listeners
	events: {

		// "crafts.created"(	ctx ) {
		// 	// console.log('socketID',ctx);
        //
		// 	const payload = {
        //
		// 	};
		// 	this.broker.emit("socket.emit.client", {
		// 		socketID,
		// 		event: "crafts.created",
		// 		payload
		// 	});
		// }
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
			crafts(limit: Int, offset: Int, sort: String): [Craft]
			craft(code: String): Craft
		`,

		types: `
			type Craft {
				code: String!
					user_id: Person!
				registration_id: String
				manufacturer: String
				model: String
				serial_number: String
				class: String
				max_takeoff_w: String
				engine_type: String
				num_engines: Int
			}
		`,

		mutation: `
			craftCreate(registration_id: String!, manufacturer: String, model: String, serial_number: String, class: String, max_takeoff_w: String, engine_type: String, num_engines: Int): Craft
			craftUpdate(code: String!, registration_id: String!, manufacturer: String, model: String, serial_number: String, class: String, max_takeoff_w: String, engine_type: String, num_engines: Int): Craft
			craftRemove(code: String!): Craft
		`,

		resolvers: {
			Query: {
				crafts: "list",
				craft: "get"
			},

			Mutation: {
				craftCreate: "create",
			 craftUpdate: "update",
				craftRemove: "remove"
			}
		}
	}

};

/*
## GraphiQL test ##

# Find all devices
query getDevices {
  devices(sort: "lastCommunication", limit: 5) {
    ...deviceFields
  }
}

# Create a new device
mutation createDevice {
  deviceCreate(name: "New device", address: "192.168.0.1", type: "raspberry", description: "My device", status: 1) {
    ...deviceFields
  }
}

# Get a device
query getDevice($code: String!) {
  device(code: $code) {
    ...deviceFields
  }
}


query getDevice($code: String!) {craft(code: $code) {...deviceFields}}

# Update an existing device
mutation updateDevice($code: String!) {
  deviceUpdate(code: $code, address: "127.0.0.1") {
    ...deviceFields
  }
}

# Remove a device
mutation removeDevice($code: String!) {
  deviceRemove(code: $code) {
    ...deviceFields
  }
}

fragment deviceFields on Device {
    code
    address
    type
    name
    description
    status
    lastCommunication
}

*/
