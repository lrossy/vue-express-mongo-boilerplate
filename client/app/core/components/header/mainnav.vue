<template lang="pug">
	nav#menu1.bar.bar--sm.bar-1.hidden-xs.hiddem-sm
		.container
			.row
				.col-md-1.col-sm-2.hidden-xs
					logo
				.col-md-11.col-sm-12.text-right.text-left-xs.text-left-sm
					.bar__module.menu
						ul.menu-horizontal.text-left
							router-link(tag="li", to="/")
								a(:title="_('Home')")
									span {{ "Home" | i18n }}
							router-link(tag="li", to="/counter")
								a(:title="_('Demo')")
									span {{ "Demo" | i18n }}
							router-link(tag="li", to="/devices")
								a(:title="_('Devices')")
									span {{ "Devices" | i18n }}
							router-link(tag="li", to="/posts")
								a(:title="_('Posts')")
									span {{ "Posts" | i18n }}
							li
								UserBox
								<!--a(href="/logout", :title="_('Logout')")-->
									<!--span {{ "Logout" | i18n }}-->

</template>

<script>
	import Logo from "./logo";
//	import SearchBox from "./search-box";
	import UserBox from "./user-box";

	export default {
		components: {
			Logo,
			UserBox
		},

		props: [
		]

	};

</script>

<style lang="scss">
</style>
