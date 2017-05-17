"use strict";

let logger = require("../../../core/logger");
let config = require("../../../config");
let C = require("../../../core/constants");
let E = require("../../../core/errors");

let _ = require("lodash");

let Message = require("./models/message");

module.exports = {
	name: "messages",
	//version: 1,

	settings: {
		//latestVersion: true,
		rest: true,
		ws: true,
		graphql: true,
		permission: C.PERM_LOGGEDIN,
		collection: Message,

		hashedIdentity: true,
		modelPropFilter: "fromUser toUser messages createdAt editedAt",

		modelPopulates: {
			"fromUser": "persons.model",
			"toUser": "persons.model"
		}
	},

	// Exposed actions
	actions: {
		list: {
			cache: {
				keys: [ "limit", "offset", "sort", "filter", "fromUser", "toUser" ]
			},
			defaultMethod: "get",
			handler(ctx) {
				let filter = {};

				if (ctx.params.filter == "recieved"){
					filter.fromUser =ctx.params.$user.id;
				}
				else{
					filter.toUser =ctx.params.$user.id;
				}

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
			permission: C.PERM_LOGGEDIN,
			defaultMethod: "get",
			needModel: true,
			handler(ctx) {
				return this.Promise.resolve(ctx)
					.then(ctx => this.resolveID(ctx))
					.then(modelID => this.checkModel(modelID, "app:PostNotFound"))
					.then(doc => this.toJSON(doc))
					.then(json => this.populateModels(ctx, json));
			}
		},

		model: {
			cache: true,
			publish: false,
			handler(ctx) {
				return this.resolveModel(ctx);
			}
		},

		create: {
			defaultMethod: "post",
			handler(ctx) {
				return this.Promise.resolve(ctx)
					.then(() => {
						let message = new Message({
							fromUser: ctx.params.$user.id,
							toUser: ctx.params.toUser,
							message: ctx.params.$user.id,
							subject: ctx.params.subject,
							messages: [{
								message: ctx.params.message,
								fromUser: ctx.params.$user.id,
								timestamp: Date.now()
							}]
						});
						return message.save();
					})
					.then(doc => this.toJSON(doc))
					.then(json => this.populateModels(ctx, json))
					.then(json => {
						this.notifyModelChanges(ctx, "changed", json, ctx.params.$user);

						// Clear cached values
						this.clearCache();

						return json;
					});
			}
		}
	},

	update: {
		defaultMethod: "put",
		needModel: true,
		permission: C.PERM_LOGGEDIN,
		handler(ctx) {
			return this.Promise.resolve(ctx)
				.then(ctx => this.resolveID(ctx))
				.then(modelID => this.checkModel(modelID, "app:PostNotFound"))
				.then(modelID => this.collection.findById(modelID).exec())
				// .then(doc => this.checkModelOwner(doc, "author", ctx.params.$user))
				.then(doc => {
					// Check user is on voters
					if (doc.fromUser !== ctx.params.$user.id && doc.toUser !== ctx.params.$user.id)
						throw new E.RequestError(E.BAD_REQUEST, C.NO_ACCESS, "You don't have access to this conversation");
					return doc;
				})
				.then(doc => Post.findByIdAndUpdate(doc.id, {
					$push: {
						"messages": {
							fromUser: ctx.params.$user.id,
							message: ctx.params.message,
							timestamp: Date.now()
						}
					}
				}, {
					"new": true
				}))
				.then(doc => this.toJSON(doc))
				.then(json => this.populateModels(ctx, json))
				.then((json) => {
					this.notifyModelChanges(ctx, "updated", json, ctx.params.$user);

					// Clear cached values
					this.clearCache();

					return json;
				});
		}
	},

	// Event listeners
	events: {

	},

	// Service methods
	methods: {

	},

	created() {
		// // Add custom error types
		C.append([
			"NO_ACCESS"
		], "ERR");

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
			posts(limit: Int, offset: Int, sort: String): [Post]
			post(code: String): Post
		`,

		types: `
			type Post {
				code: String!
				title: String
				content: String
				author: Person!
				views: Int
				votes: Int,
				voters(limit: Int, offset: Int, sort: String): [Person]
				createdAt: Timestamp
				createdAt: Timestamp
			}
		`,

		mutation: `
			postCreate(title: String!, content: String!): Post
			postUpdate(code: String!, title: String, content: String): Post
			postRemove(code: String!): Post

			postVote(code: String!): Post
			postUnvote(code: String!): Post
		`,

		resolvers: {
			Query: {
				posts: "list",
				post: "get"
			},

			Mutation: {
				postCreate: "create",
				postUpdate: "update",
				postRemove: "remove",
				postVote: "vote",
				postUnvote: "unvote"
			}
		}
	}
};


/*
## GraphiQL test ##

# Find all posts
query getPosts {
  posts(sort: "-createdAt -votes", limit: 3) {
    ...postFields
  }
}

# Create a new post
mutation createPost {
  postCreate(title: "New post", content: "New post content") {
    ...postFields
  }
}

# Get a post
query getPost($code: String!) {
  post(code: $code) {
    ...postFields
  }
}

# Update an existing post
mutation updatePost($code: String!) {
  postUpdate(code: $code, content: "Modified post content") {
    ...postFields
  }
}

# vote the post
mutation votePost($code: String!) {
  postVote(code: $code) {
    ...postFields
  }
}

# unvote the post
mutation unVotePost($code: String!) {
  postUnvote(code: $code) {
    ...postFields
  }
}

# Remove a post
mutation removePost($code: String!) {
  postRemove(code: $code) {
    ...postFields
  }
}



fragment postFields on Post {
    code
    title
    content
    author {
      code
      fullName
      username
      avatar
    }
    views
    votes
  	voters {
  	  code
  	  fullName
  	  username
  	  avatar
  	}
}

*/
