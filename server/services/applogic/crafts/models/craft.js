"use strict";

// let ROOT 			= "../../../../";
let config    		= require("../../../../config");
let logger    		= require("../../../../core/logger");

let db	    		= require("../../../../core/mongo");
let mongoose 		= require("mongoose");
let Schema 			= mongoose.Schema;
let hashids 		= require("../../../../libs/hashids")("crafts");
let autoIncrement 	= require("mongoose-auto-increment");

let schemaOptions = {
	timestamps: true,
	toObject: {
		virtuals: true
	},
	toJSON: {
		virtuals: true
	}
};

let CraftSchema = new Schema({
	user_id: {
		type: Number,
		required: "Please fill in a user_id",
		ref: "User"
	},
	registration_id: {
		type: String,
		trim: true
	},
	manufacturer: {
		type: String,
		trim: true
	},
	model: {
		type: String,
		trim: true
	},
	serial_number: {
		type: String,
		trim: true
	},
	class: {
		type: String,
		trim: true
	},
	max_takeoff_w: {
		type: String,
		trim: true
	},
	num_engines: {
		type: Number,
		default: 0
	},
	engine_type: {
		type: String,
		trim: true
	},
	metadata: {}

}, schemaOptions);

CraftSchema.virtual("code").get(function() {
	return this.encodeID();
});

CraftSchema.plugin(autoIncrement.plugin, {
	model: "Craft",
	startAt: 1
});

CraftSchema.methods.encodeID = function() {
	return hashids.encodeHex(this._id);
};

CraftSchema.methods.decodeID = function(code) {
	return hashids.decodeHex(code);
};

let Craft = mongoose.model("Craft", CraftSchema);

module.exports = Craft;
