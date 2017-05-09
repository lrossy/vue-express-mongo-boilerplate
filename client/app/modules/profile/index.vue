<template lang="pug">
	.container
		.row
			.col-md-4
				.boxed.boxed--lg.boxed--border
					.text-block.text-center
						img.image--sm(alt='avatar', :src="profile.avatar")
						span.h5 Lucas Banks
						span {{ profile.roles[0] }}
						span.label {{ profile.roles[0] }}
					.text-block
						ul.menu-vertical
							li
								a(v-on:click="toggleProfileMenu('profile')") Profile
							li
								a(v-on:click="toggleProfileMenu('email')") Email Notifications
							li
								a(v-on:click="toggleProfileMenu('pwd')") Password
			.col-md-8
				.boxed.boxed--lg.boxed--border
					#account-profile.account-tab(v-if="submenu === 'profile'")
						h4 Profile
							form
								.row
									.col-sm-6
										label Real Name:
										input(type='text', name='name', :value="profile.username")
									.col-sm-6
										label Display Name:
										input(type='text', name='display-name', :value="profile.fullName")
									.col-sm-12
										label Email Address:
										input(type='email', name='email', :value="profile.email")
									.col-sm-12
										label Province:
										input(type='text', name='province', :value="profile.province")
									.col-sm-12
										label.switch
											input(type='checkbox', name='public-profile')
											.slider.round
										span Allow my profile to be viewable by guests
									.col-md-3.col-sm-4
										button.btn.btn--primary.type--uppercase(type='submit') Save Profile
					#account-notifications.account-tab(v-if="submenu === 'email'")
						h4 Email Notifications
							p Select the frequency with which you'd like to recieve product summary emails:
							form
								.row
									.boxed.bg--secondary.boxed--border
										.col-xs-4.text-center
											.input-radio
												label Never
												.inner
												input.validate-required(type='radio', name='frequency', value='never')
										.col-xs-4.text-center
											.input-radio.checked
												label Weekly
												.inner
												input.validate-required(type='radio', name='frequency', value='weekly')
										.col-xs-4.text-center
											.input-radio
												label Monthly
												.inner
												input.validate-required(type='radio', name='frequency', value='monthly')
										.col-md-4.col-sm-5
											button.btn.btn--primary.type--uppercase(type='submit') Save Preferences
					#account-password.account-tab(v-if="submenu === 'pwd'")
						h4 Password
							p Passwords must be at least 6 characters in length.
							form
								.row
									.col-xs-12
										label Old Password:
										input(type='password', name='old-password')
									.col-sm-6
										label New Password:
										input(type='password', name='new-password')
									.col-sm-6
										label Retype New Password:
										input(type='password', name='new-password-confirm')
									.col-md-3.col-sm-4
										button.btn.btn--primary.type--uppercase(type='submit') Save Password
				hr.full
		pre(v-html="this.$options.filters.prettyJSON(profile)")
</template>

<script>
	import Service from "../../core/service";

	import { mapGetters, mapActions } from "vuex";

	export default {
		computed: mapGetters("profile", [
			"profile"
		]),

		data(){
			return {
				submenu: 'profile'
			}
		},
		methods: {
			toggleProfileMenu: function (submenu) {
				// `this` inside methods points to the Vue instance
				this.submenu = submenu;
			},
			...mapActions("profile", [
				"getProfile"
			])
		},

		created() {
			this.$service = new Service("profile", this);

			// Get my profile
			this.getProfile();
		}
	};

</script>

<style lang="scss">


	.menu-vertical li a {
		color: #4a90e2;
	}

	/* The switch - the box around the slider */
	.switch {
		position: relative;
		display: inline-block;
		width: 60px;
		height: 34px;
	}

	/* Hide default HTML checkbox */
	.switch input {display:none;}

	/* The slider */
	.slider {
		position: absolute;
		cursor: pointer;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: #ccc;
		-webkit-transition: .4s;
		transition: .4s;
	}

	.slider:before {
		position: absolute;
		content: "";
		height: 26px;
		width: 26px;
		left: 4px;
		bottom: 4px;
		background-color: white;
		-webkit-transition: .4s;
		transition: .4s;
	}

	input:checked + .slider {
		background-color: #2196F3;
	}

	input:focus + .slider {
		box-shadow: 0 0 1px #2196F3;
	}

	input:checked + .slider:before {
		-webkit-transform: translateX(26px);
		-ms-transform: translateX(26px);
		transform: translateX(26px);
	}

	/* Rounded sliders */
	.slider.round {
		border-radius: 34px;
	}

	.slider.round:before {
		border-radius: 50%;
	}
</style>
