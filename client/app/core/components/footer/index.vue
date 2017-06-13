<template lang="pug">
	footer.footer-3.text-center-xs.space--xs
		.container
			.row
				.col-sm-6
					img.logo(alt='Image', src='~images/logo-dark.png')
					ul.list-inline.list--hover
						li
							a(href='#')
							span.type--fine-print Get Started
						li
							a(href='#')
								span.type--fine-print help@stack.io
				.col-sm-6.text-right.text-center-xs
					ul.social-list.list-inline.list--hover
						li
							a(href='#')
								i.socicon.socicon-google.icon.icon--xs
						li
							a(href='#')
								i.socicon.socicon-twitter.icon.icon--xs
						li
							a(href='#')
								i.socicon.socicon-facebook.icon.icon--xs
						li
							a(href='#')
								i.socicon.socicon-instagram.icon.icon--xs
			.row
				.col-sm-6
					p.type--fine-print
						| Supercharge your web workflow
				.col-sm-6.text-right.text-center-xs
					span.type--fine-print
						| ©
						span.update-year
						|  Stack Inc.
					a.type--fine-print Privacy Policy
					a.type--fine-print Legal
			// end of row
		// end of container

</template>

<script>

	export default {

	};

</script>

<style lang="scss">
</style>
