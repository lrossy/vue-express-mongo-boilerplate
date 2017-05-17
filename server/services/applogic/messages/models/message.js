"use strict";

// let ROOT 			= "../../../../";
let config    		= require("../../../../config");
let logger    		= require("../../../../core/logger");

let db	    		= require("../../../../core/mongo");
let mongoose 		= require("mongoose");
let Schema 			= mongoose.Schema;
let hashids 		= require("../../../../libs/hashids")("messages");
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

let MessageSchema = new Schema({
	fromUser: {
		type: Number,
		ref: "User"
	},
	toUser: {
		type: Number,
		ref: "User"
	},
	craft:{
		type: Number,
		ref: "Craft"
	},
	subject: {
		type: String,
		trim: true
	},
	messages:[
		{
			message: {
				type:String,
				trim: true
			},
			fromUser: {
				type: Number,
				ref: "User"
			},
			timestamp: {
				type: Date
			},
			images: [
				{
					description: {
						type: String,
						trim: true
					},
					url: {
						type: String,
						trim: true
					}
				}
			],
			read:{
				type: Boolean,
				default: false
			}
		}
	],
	editedAt: {
		type: Date
	},
	metadata: {}
}, schemaOptions);

MessageSchema.virtual("code").get(function() {
	return this.encodeID();
});

MessageSchema.plugin(autoIncrement.plugin, {
	model: "Message",
	startAt: 1
});

MessageSchema.methods.encodeID = function() {
	return hashids.encodeHex(this._id);
};

MessageSchema.methods.decodeID = function(code) {
	return hashids.decodeHex(code);
};

let Message = mongoose.model("Message", MessageSchema);


module.exports = Message;
