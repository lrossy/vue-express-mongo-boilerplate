<template lang="pug">
	div
		page-menu()
		page-header(:toggle-sidebar="toggleSidebar")

		// sidebar(:minimized="miniSidebar")

		section.app-main(:class="{ miniSidebar: miniSidebar }")
			router-view(keep-alive)
</template>

<script>
	import Vue from "vue";

	import PageHeader from "./components/header/index";
	import PageMenu from "./components/menu/index";
	import Sidebar from "./components/sidebar/index";

	import Service from "./service";

	import { mapActions, mapGetters } from "vuex";

	export default {

		/**
		 * Create websocket connection to the root namespace
		 */
		//mixins: [ MixinsIO() ],

		/**
		 * Load sub-components
		 */
		components: {
			PageHeader,
			PageMenu,
			Sidebar
		},

		/**
		 * Create app data object
		 *
		 * TODO: move to vuex state
		 */
		data() {
			return {
				wsReconnecting: false,
				miniSidebar: false
			};
		},

		watch: {
			$lng() {
				console.log("Language updated");
				this.update(this);
			}
		},

		/**
		 * Socket handlers. Every property is an event handler
		 */
		socket: {

			events: {
				/**
				 * Send welcome message after connect
				 */
				connect() {
					console.log("Websocket connected to " + this.$socket.nsp);

					if (this.wsReconnecting)
						// Reload browser if connection established after disconnect
						window.location.reload(true);
					else
						this.$socket.emit("welcome", "Hello! " + navigator.userAgent);
				},

				disconnect() {
					console.log("Websocket disconnected from " + this.$socket.nsp);
					this.wsReconnecting = true;
				},

				error(err) {
					console.error("Websocket error!", err);
				}
			}
		},

		methods: {
			...mapActions("session", [
				"getSessionUser"
			]),

			update: function(vm) {
				if (vm == null)
					return;

				let i = vm._watchers.length;
				while (i--)
					vm._watchers[i].update(true);

				let children = vm.$children;
				i = children.length;
				while (i--)
					this.update(children[i]);
			},

			toggleSidebar() {
				this.miniSidebar = !this.miniSidebar;
			}
		},

		/**
		 * Application created
		 */
		created() {
			this.$socket.open();
			console.log("App started!");
			window.app = this;

			this.getSessionUser();

			// debug
			window.postService = new Service("posts", this);
			window.counterService = new Service("counter", this);
			window.deviceService = new Service("device", this);

		}
	};
</script>

<style lang="scss">
	@import "../../scss/style.scss";

</style>
