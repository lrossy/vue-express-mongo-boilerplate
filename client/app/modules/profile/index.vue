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
						edit-profile-form(:profile="profile")
					#account-notifications.account-tab(v-if="submenu === 'email'")
						h4 Email Notifications
							p Select the frequency with which you'd like to recieve product summary emails:
							form
								.row
									.btn-group(data-toggle="buttons")
											label.btn.active Never
												input(type='radio', name='frequency', value='never')
												.inner
											label.btn Weekly
												.inner
												input.validate-required(type='radio', name='frequency', value='weekly')
											label.btn Monthly
												.inner
												input.validate-required(type='radio', name='frequency', value='monthly')
								.row
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

	import EditProfileForm from './EditProfileForm.vue'
	import Service from "../../core/service";

	import { mapGetters, mapActions } from "vuex";


	export default {
		components: {
			EditProfileForm
		},

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
	label input[type="radio"] ~ i.fa.fa-circle-o{
		color: #c8c8c8;    display: inline;
	}
	label input[type="radio"] ~ i.fa.fa-dot-circle-o{
		display: none;
	}
	label input[type="radio"]:checked ~ i.fa.fa-circle-o{
		display: none;
	}
	label input[type="radio"]:checked ~ i.fa.fa-dot-circle-o{
		color: #7AA3CC;    display: inline;
	}
	label:hover input[type="radio"] ~ i.fa {
		color: #7AA3CC;
	}
	div[data-toggle="buttons"] label.active{
		color: #7AA3CC;
	}

	div[data-toggle="buttons"] label {
		display: inline-block;
		padding: 6px 12px;
		margin-bottom: 0;
		font-size: 14px;
		font-weight: normal;
		line-height: 2em;
		text-align: left;
		white-space: nowrap;
		vertical-align: top;
		cursor: pointer;
		background-color: none;
		border: 0px solid
		#c8c8c8;
		border-radius: 3px;
		color: #c8c8c8;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		-o-user-select: none;
		user-select: none;
	}

	div[data-toggle="buttons"] label:hover {
		color: #7AA3CC;
	}

	div[data-toggle="buttons"] label:active, div[data-toggle="buttons"] label.active {
		-webkit-box-shadow: none;
		box-shadow: none;
	}
</style>
