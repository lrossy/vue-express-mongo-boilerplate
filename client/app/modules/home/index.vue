<template lang="pug">
	.container
		h3 Drone Lookup Service
		.boxed.boxed--lg.bg--white.text-left
			form.form--horizontal(v-on:submit.prevent="onSubmit")
				.col-sm-8
					input(type='text', v-model='searchTerm' name='search', placeholder='Type drone registration number here')
				.col-sm-4
					button.btn.btn--primary.type--uppercase(type='submit') Search
		.col-sm-12(v-if="searched")
			a.block(v-if="searchResults.length > 0")
				.feature.feature-1.boxed.boxed--border
					.col-sm-10
						h6.type--uppercase.color--primary {{ searchResults[0].manufacturer }} - {{ searchResults[0].model }}
						h5 Class: {{ searchResults[0].class }}
						p
							| num_engines: {{searchResults[0].num_engines}}
						p
							|	engine_type: {{searchResults[0].engine_type}}
					.col-sm-2
						<!--a.btn.btn&#45;&#45;secondary.type&#45;&#45;uppercase(@click:"'/messages/new'" v-bind:href="'/messages/new'") Contact User-->
						router-link( :to="{ name:'message', params:{craftID:searchResults[0].code}}", class="btn btn-default type-uppercase")
							span {{ "Contact User" | i18n }}
			a.block(v-else)
				p.lead
					span No results found



</template>

<script>
//	import { mapGetters, mapActions } from "vuex";
import Service from "../../core/service";
import toastr from "../../core/toastr";

let service = new Service("crafts");

	export default {

		data(){
			return {
				counter: 0,
				searchTerm: "test",
				searchResults: [],
				searched: false
			}
		},
		methods: {
			getRows: function () {
//				alert(this.searchTerm)
				return service.rest("find", { term: this.searchTerm }).then((data) => {
						if (data.length == 0){
							this.searched = true;
							this.searchResults = [];
						}
						else{
							//alert(data.length);
							this.searched = true;
							this.searchResults = data;
						}
			}).catch((err) => {
					toastr.error(err.message);
			}).then(() => {

			});
			},
			onSubmit: function(e) {
	//				alert('test');
				this.counter++;
				this.getRows();
	//				this.newWorkorder.push(this.newWorkorder);
			}
	}
	};

</script>

<style lang="scss" scoped>
	@import "../../../scss/themes/blurred/_variables.scss";

	.container {
	}

	section {
		&:not(:last-child) {
			margin-bottom: 40px;
		}

		> h2 {
			font-size: 1.5rem;
			margin-bottom: 20px;
			padding: 8px 10px;

			background-color: rgba(darken($backgroundColor, 10%), 0.6);
			border: 1px solid darken($backgroundColor, 8%);
			border-radius: 8px;

			.number {
				color: #888;
			}

			.text {
				margin-left: 4px;
				font-weight: $fontLight;
				text-transform: uppercase;
			}

			clear: both;

		} // .title

	} //. section

	.buttons {
		margin-bottom: 20px;
	}

	.list {
		> * {
			margin-bottom: 20px;
		}
	}

	.panels {
		align-items: flex-start;
		.panel, .card {
			margin: 20px;
		}

		.card {
			max-width: 350px;
		}
	}

	.colors {
		$boxSize: 150px;

		.box {
			width: $boxSize;
			height: $boxSize + 20px;

			border: 1px solid darken($backgroundColor, 10%);
			border-radius: 6px;

			margin: 5px 20px;
			padding: 2px;

			.caption {
				float: left;
				width: 100%;
				text-align: center;
			}

			.main {
				float: left;
				width: 100%;
				height: $boxSize - 60px;
			} // .main

			.light {
				float: left;
				width: 50%;
				height: 30px;

			} // .light

			.dark {
				float: right;
				width: 50%;
				height: 30px;

			} // .dark

			.code {
				float: left;
				width: 100%;
				position: relative;
				margin-top: 5px;

				&:after {
					position: absolute;
					top: 0; bottom: 0;
					left: 0; right: 0;
					margin: auto;
					width: 100%;
					text-align: center;
					font-family: "Consolas";
					color: White;
				}
			} // .code

			$colors: $color1, $color2, $color3, $color4, $color5;

			$colors-light: $color1-light, $color2-light, $color3-light, $color4-light, $color5-light;
			$colors-dark: $color1-dark, $color2-dark, $color3-dark, $color4-dark, $color5-dark;

			@for $i from 1 through 5 {

				$c: nth($colors, $i);

				&.box#{$i} {
					.main { background-color: $c; }
					.light { background-color: nth($colors-light, $i); }
					.dark { background-color: nth($colors-dark, $i); }
					.code:after {	content: "" + $c; }

				} // box

			} // for

		} // .box

	} // .colors
</style>
