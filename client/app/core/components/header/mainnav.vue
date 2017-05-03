<template lang="pug">
	nav#menu1.bar.bar--sm.bar-1.hidden-xs.hiddem-sm
		.container
			.row
				.col-md-1.col-sm-2.hidden-xs
					.bar__module
						router-link(tag="a", to="/")
							img.logo.logo-dark(alt='logo', src='/app/images/logo-dark.png')
							img.logo.logo-light(alt='logo', src='/app/images/logo-light.png')
					// end module
				.col-md-11.col-sm-12.text-right.text-left-xs.text-left-sm
					.bar__module.menu
						ul.menu-horizontal.text-left
							router-link(tag="li", to="/" class="dropdown")
								a(:title="_('Home')")
									span {{ "Home" | i18n }}
							router-link(tag="li", to="/counter" class="dropdown")
								a(:title="_('Demo')")
									span {{ "Demo" | i18n }}
							router-link(tag="li", to="/devices" class="dropdown")
								a(:title="_('Devices')")
									span {{ "Devices" | i18n }}
							router-link(tag="li", to="/posts" class="dropdown")
								a(:title="_('Posts')")
									span {{ "Posts" | i18n }}
							li
								a(href="/logout", :title="_('Logout')")
									span {{ "Logout" | i18n }}

</template>

<script>

	export default {

	};

</script>

<style lang="scss">
</style>
