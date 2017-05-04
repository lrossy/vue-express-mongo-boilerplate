<template lang="pug">
	.user-box(v-if="me").dropdown

		.user-info.dropdown-toggle(type='button', data-toggle='dropdown')
			span.username {{ me.fullName }}
			span.caret
		user-dropdown(:visible="expandedUserMenu")

		<!--.notification-box.right-->
			<!--ul.icons-->
				<!--li(@click="toggleNotifications()", :class=" { active: notifications.length > 0 }")-->
					<!--i.fa.fa-bell-o-->
					<!--span {{ notifications.length }}-->
					<!--.ring-->

				<!--li(@click="toggleMessages()", :class=" { active: messages.length > 0 }")-->
					<!--i.fa.fa-envelope-o-->
					<!--span {{ messages.length }}-->
					<!--.ring-->
			<!---->
			<!--notifications-dropdown(:visible="expandedNotifications")-->
			<!--messages-dropdown(:visible="expandedMessages")-->


</template>

<script>
	import UserDropdown from "./dropdowns/user";
	import NotificationsDropdown from "./dropdowns/notifications";
	import MessagesDropdown from "./dropdowns/messages";

	import { mapActions, mapGetters } from "vuex";

	export default {
		computed: mapGetters("session", [
			"me",
			"notifications",
			"messages"
		]),

		components: {
			UserDropdown,
			NotificationsDropdown,
			MessagesDropdown
		},

		data() {
			return {
				expandedUserMenu: false,
				expandedNotifications: false,
				expandedMessages: false
			};
		},

		methods: {

			toggleUserMenu() {
				this.expandedUserMenu = !this.expandedUserMenu;
				if (this.expandedUserMenu) {
					this.expandedMessages = false;
					this.expandedNotifications = false;
				}
			},

			toggleMessages() {
				this.expandedMessages = !this.expandedMessages;
				if (this.expandedMessages) {
					this.expandedUserMenu = false;
					this.expandedNotifications = false;
				}
			},

			toggleNotifications() {
				this.expandedNotifications = !this.expandedNotifications;
				if (this.expandedNotifications) {
					this.expandedMessages = false;
					this.expandedUserMenu = false;
				}
			}

		}

	};

</script>

<style lang="scss">
</style>
