<template lang="pug">
	div
		admin-page(:schema="schema", :rows="crafts")

		pre(v-html="this.$options.filters.prettyJSON(crafts)")

</template>

<script>
	import Vue from "vue";
	import AdminPage from "../../core/DefaultAdminPage.vue";
	import schema from "./schema";
	import toast from "../../core/toastr";
	import axios from "axios";

//	import { mapGetters, mapActions } from "vuex";

	export default {

		components: {
			AdminPage: AdminPage
		},

//		computed: mapGetters("crafts", [
//			"crafts",
//			"selected"
//		]),

		/**
		 * Set page schema as data property
		 */
		data() {
			return {
				crafts: ['test'],
				schema
			};
		},

		/**
		 * Socket handlers. Every property is an event handler
		 */
		socket: {

			prefix: "crafts.",

			events: {
				/**
				 * New device added
				 * @param  {Object} res Device object
				 */
				created(res) {
					this.created(res.data);
					toast.success(this._("DeviceNameAdded", res), this._("DeviceAdded"));
				},

				/**
				 * Device updated
				 * @param  {Object} res Device object
				 */
				updated(res) {
					this.updated(res.data);
					toast.success(this._("DeviceNameUpdated", res), this._("DeviceUpdated"));
				},

				/**
				 * Device removed
				 * @param  {Object} res Response object
				 */
				removed(res) {
					this.removed(res.data);
					toast.success(this._("DeviceNameDeleted", res), this._("DeviceDeleted"));
				}
			}
		},

//		methods: {
//			...mapActions("crafts", [
//				"downloadRows",
//				"created",
//				"updated",
//				"removed",
//				"selectRow",
//				"clearSelection",
//				"saveRow",
//				"updateRow",
//				"removeRow"
//			])
//		},

		/**
		 * Call if the component is created
		 */
		created() {
			// Download rows for the page
			//this.downloadRows();
//		axios.get(`http://jsonplaceholder.typicode.com/posts`)
//			.then(response => {
//			// JSON responses are automatically parsed.
//			this.posts = response.data
//	})
//	.catch(e => {
//			this.errors.push(e)
//	})

		axios.get('/api/crafts')
			.then((response) => {
					if (response.status == 200 && response.data){
				//todo: wtf
				this.crafts = response.data.data;
				}
					else{
						console.error("Request error!", res.error);
			}
	}).catch((response) => {
			console.error("Request error!", response.statusText);
	});
		}
	};
</script>
