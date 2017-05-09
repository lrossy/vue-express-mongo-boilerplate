<template lang="pug">
	div.container
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
						button.btn.btn--primary.type--uppercase(type='submit' @click.prevent="updateProfileData") Update Profile
	</template>
<script>

	export default {
		props: [
			"profile"
		],
		methods: {
		updateProfileData(){
			alert("Your data: " + JSON.stringify(this.profile))
		}
	},
		created() {

		}
	};

</script>

<style lang="scss">
</style>
