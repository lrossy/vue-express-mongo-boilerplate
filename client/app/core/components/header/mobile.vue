<template lang="pug">
	.bar.bar--sm.visible-xs
		.container
			.row
				.col-xs-3.col-sm-2
					a(href='index.html')
						img.logo.logo-dark(alt='logo', src='~images/logo-dark.png')
						img.logo.logo-light(alt='logo', src='~images/logo-light.png')
				.col-xs-9.col-sm-10.text-right
					a.hamburger-toggle(href='#', data-toggle-class='#menu1;hidden-xs')
						i.icon.icon--sm.stack-interface.stack-menu
			// end of row
		// end of container
	// end bar
</template>

<script>

	export default {

	};

</script>

<style lang="scss">
</style>
