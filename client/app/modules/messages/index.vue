<template>
<div class="container">
	<div class="main-container">
		<h2 class="title">{{  _('Messages') }}</h2>
		<section class="space--xs blog-article-wide">
			<div class="container">
				<div class="row">
					<div class="cta cta--horizontal text-center-xs">
						<div class="col-sm-4">
							<h4>24th February 2017</h4>
						</div>
						<div class="col-sm-5">
							<p class="lead">
								Building an enduring online audience
							</p>
						</div>
						<div class="col-sm-3 text-right text-center-xs">
							<a class="btn type--uppercase" href="#">
                                    <span class="btn__text">
                                        Read Article
                                    </span>
							</a>
						</div>
					</div>
				</div>
				<!--end of row-->
			</div>
			<!--end of container-->
		</section>
		<section>
			<div class="container">
				<div class="row">
					<div class="col-sm-12">
						<div class="pagination">
							<div class="col-xs-6">
								<a class="type--fine-print" href="#">&laquo; Older Posts</a>
							</div>
							<div class="col-xs-6 text-right">
								<a class="type--fine-print" href="#">Newer Posts &raquo;</a>
							</div>
						</div>
					</div>
				</div>
				<!--end of row-->
			</div>
			<!--end of container-->
		</section>
	</div>
</div>
</template>

<script>
	import Vue from "vue";
	import marked from "marked";
	import toast from "../../core/toastr";
	import { cloneDeep, find } from "lodash";
	import { validators, schema as schemaUtils } from "vue-form-generator";

	import { mapGetters, mapActions } from "vuex";

	export default {

		computed: {
			...mapGetters("messages", [
				"messages",
				"hasMore",
				"fetching",
				"sort",
				"viewMode"
			]),
			...mapGetters("session", [
				"me"
			])
		},

		/**
		 * Set page schema as data property
		 */
		data() {
			return {
				showForm: false,
				isNewPost: false,
				model: null,
				schema: {
					fields: [
						{
							type: "input",
							inputType: "text",
							label: this._("Title"),
							model: "title",
							featured: true,
							required: true,
							placeholder: this._("TitleOfPost"),
							validator: validators.string
						},
						{
							type: "textArea",
							label: this._("Content"),
							model: "content",
							featured: true,
							required: true,
							rows: 10,
							placeholder: this._("ContentOfPost"),
							validator: validators.string
						}
					]
				}
			};
		},

		/**
		 * Socket handlers. Every property is an event handler
		 */
		socket: {

			prefix: "posts.",

			events: {
				/**
				 * New device added
				 * @param  {Object} res Device object
				 */
				/*
				We don't use it because we don't know where to add it to the page (filter, sort..etc)
				created(res) {
					this.created(res.data);
					toast.success(this._("PostNameAdded", res), this._("PostAdded"));
				},*/

				/**
				 * Post updated
				 * @param  {Object} res Post object
				 */
				updated(res) {
					this.updated(res.data);
					toast.success(this._("PostNameUpdated", res), this._("PostUpdated"));
				},

				voted(res) {
					this.updated(res.data);
					toast.success(this._("PostNameVoted", res), this._("PostUpdated"));
				},

				unvoted(res) {
					this.updated(res.data);
					toast.success(this._("PostNameUnvoted", res), this._("PostUpdated"));
				},

				/**
				 * Post removed
				 * @param  {Object} res Post object
				 */
				removed(res) {
					this.removed(res.data);
					toast.success(this._("PostNameDeleted", res), this._("PostDeleted"));
				}
			}
		},

		methods: {
			...mapActions("posts", [
				"getRows",
				"loadMoreRows",
				"changeSort",
				"changeViewMode",
				"vote",
				"unVote",
				"saveRow",
				"updateRow",
				"removeRow",
				"updated",
				"removed"
			]),

			markdown(content) {
				if (content)
					return marked(content);
			},

			iVoted(post) {
				if (post)
					return find(post.voters, (user) => user.code == this.me.code) != null;
			},

			toggleVote(post) {
				if (this.iVoted(post))
					this.unVote(post);
				else
					this.vote(post);
			},

			lastVoters(post, count = 5) {
				if (post.voters && post.voters.length > 0) {
					let voters = cloneDeep(post.voters).reverse().slice(0, 5);
					return voters;
				}
				return [];
			},

			createdAgo(post) {
				return this._("CreatedAgoByName", { ago: Vue.filter("ago")(post.createdAt), name: post.author ? post.author.fullName : "" } );
			},

			editedAgo(post) {
				if (post.editedAt)
					return this._("EditedAgo", { ago: Vue.filter("ago")(post.editedAt) } );
			},

			newPost() {
				this.model = schemaUtils.createDefaultObject(this.schema);
				this.showForm = true;
				this.isNewPost = true;

				this.focusFirstInput();
			},

			editPost(post) {
				this.model = cloneDeep(post);
				this.showForm = true;
				this.isNewPost = false;
				this.focusFirstInput();
			},

			focusFirstInput() {
				this.$nextTick(() => {
					let el = document.querySelector(".postForm .form-control:nth-child(1):not([readonly]):not(:disabled)");
					if (el)
						el.focus();
				});
			},

			focusFirstErrorInput() {
				this.$nextTick(() => {
					let el = document.querySelector(".postForm .form-group.error .form-control");
					if (el)
						el.focus();
				});
			},

			isMyPost(post) {
				if (post)
					return post.author.code == this.me.code;
			},

			editable(post) {
				if (post)
					return this.isMyPost(post) || this.me.roles.indexOf("admin") !== -1;
			},

			savePost() {
				if (this.$refs.form.validate()) {
					if (this.isNewPost)
						this.saveRow(this.model);
					else
						this.updateRow(this.model);

					this.cancelPost();
				} else {
					this.focusFirstErrorInput();
				}
			},

			cancelPost() {
				this.showForm = false;
				this.model = null;
			},

			deletePost(post) {
				this.removeRow(post);
			}

		},

		/**
		 * Call if the component is created
		 */
		created() {
			this.getRows();
		}
	};
</script>

<style lang="scss" scoped>

	@import "../../../scss/themes/blurred/_variables.scss";
	@import "../../../scss/common/_mixins.scss";

	.container {
	}

	.header {
		margin: 1rem;
	}

	.postForm {

		@include bgTranslucentDark(0.2);

		margin: 1rem;

		.buttons {
			padding: 0.5em;
		}

	} // .postForm

	ul.posts {
		margin: 1rem 0rem;
		padding: 0;
		list-style: none;

		li {
			position: relative;
			margin: 1.0rem 0;
			padding: 0.5rem 0.5rem;
			font-size: 1.1rem;

			.media {
				background-color: rgba($color1, 0.5);
				transition: background-color .2s ease;
				&:hover {
					background-color: rgba($color1, 0.8);
				}
			}

			.votes {

				.count {
					font-weight: 300;
					font-size: 3.0em;
					margin: 1.5rem 0 2.0rem 0;
				}

				.thumb {
					cursor: pointer;
					font-size: 2.0em;

					&:hover {
						color: $headerTextColor;
					}

				}

				&.voted {
					.thumb {
						color: $successColor;

						&:hover {
							color: lighten($successColor, 10%);
						}
					}
				}

			} // .votes

			.voters {
				margin: 0 1em;
				img {
					margin: 0 0.4em;
					width: 32px;
					height: 32px;
					border-radius: $avatarRadius;
				}
			}

			.media-content {
				overflow-x: auto;

				h3 {
					margin: 0 0 0.5em 0;
				}

			}
		}
	}


	/* Transition styles */
/*
	.post-transition {
		transition: opacity .5s ease;
	}

	.post-enter {
		opacity: 0;
	}

	.post-leave {
		opacity: 0;
		position: absolute !important;
	}
*/
	.post-move {
		transition: transform .5s cubic-bezier(.55,0,.1,1);
	}



</style>
