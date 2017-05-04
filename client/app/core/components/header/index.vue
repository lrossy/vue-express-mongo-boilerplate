<template lang="pug">
	div.nav-container
		mobile-nav
		main-nav

		<!--//logo.left-->

		<!--.menu-toggle.left(@click="toggleSidebar()")-->
			<!--i.fa.fa-bars-->

		<!--search-box.left-->

		<!--user-box.right-->

</template>

<script>
	import MobileNav from "./mobile";
	import MainNav from "./mainnav";

	export default {
		components: {
			MobileNav,
			MainNav
		},

		props: [
			"toggleSidebar"
		]

	};

</script>

<style lang="scss">
</style>
