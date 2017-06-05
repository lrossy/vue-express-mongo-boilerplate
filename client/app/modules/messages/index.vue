<template>
<div class="container">
	<div class="main-container">
		<!--<div v-html="this.$options.filters.prettyJSON(messages)"></div>-->

		<h2 class="title">{{  _('Messages') }}</h2>
		<section v-for="message of messages" :key="message.code" class="space--xs blog-article-wide">
			<div class="container">
				<div class="row">
					<div class="cta cta--horizontal text-center-xs">
						<div class="col-sm-4">
							<h4>{{ message.updatedAt }}</h4>
						</div>
						<div class="col-sm-5">
							<p class="lead">
								{{ message.subject }}
							</p>
						</div>
						<div class="col-sm-3 text-right text-center-xs">
							<router-link :to="{ name:'message_conversation', params:{messageID:message.code}}" class="btn btn-default type-uppercase">
									<span>
													{{ "Contact User" | i18n }}
									</span>
							</router-link>
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
				model: null
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
			...mapActions("messages", [
				"getRows",
				"loadMoreRows",
				"changeSort",
				"changeViewMode"
			]),

			markdown(content) {
				if (content)
					return marked(content);
			},

			createdAgo(post) {
				return this._("CreatedAgoByName", { ago: Vue.filter("ago")(post.createdAt), name: post.author ? post.author.fullName : "" } );
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



</style>
