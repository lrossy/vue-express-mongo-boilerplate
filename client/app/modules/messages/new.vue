<template>
<div class="container">
	<div class="main-container">
		<section class="bg--secondary space--sm conversation">
			<div class="container">
				<div class="row">
					<div class="col-md-4 col-md-push-8">
						<div class="boxed boxed--lg boxed--border" data-scroll-class="180px:pos-fixed">
								<!--<img alt="avatar" src="img/avatar-round-2.png" class="image&#45;&#45;sm" />-->
								<!--<span class="h5">Abigail Stanley</span>-->
							<ul>
								<li>Manufacturer: <strong>{{ craft.manufacturer}}</strong></li>
								<li>Model: <strong>{{ craft.model}}</strong></li>
								<li>Serial number: <strong>{{ craft.serial_number}}</strong></li>
								<li>Class: <strong>{{ craft.class}}</strong></li>
								<li>Max takeoff weight: <strong>{{ craft.max_takeoff_w}}</strong></li>
								<li>Num Engines: <strong>{{ craft.num_engines}}</strong></li>
							</ul>
							<hr>
							<div class="text-block">
								<ul class="menu-vertical">
									<router-link tag="li" to="/messages">
										<a :title="Messages">
											<span>
												{{ "All Conversations" | i18n }}
											</span>
										</a>
									</router-link>
								</ul>
							</div>
						</div>
					</div>
					<div class="col-md-8 col-md-pull-4">
						<div class="conversation__head boxed boxed--lg bg--primary">
							<h4>{{ subject }}</h4>
							<!--<span>14th March, 2017, 1:08pm</span>-->
							<div class="conversation__avatar">
								<!--<img alt="Image" src="img/avatar-round-1.png" />-->
                                    <!--<span>-->
                                        <!--<em>by</em>-->
                                        <!--<a href="#">Anne Brady</a>-->
                                    <!--</span>-->
							</div>
						</div>
						<div class="conversation__reply boxed boxed--border">
							<form>
								<div class="row">
									<div class="col-xs-12">
										<div class="newMessageForm">
											<vue-form-generator :schema='schema' :model='model' :options='{}' :multiple="false" ref="form" :is-new-model="true"></vue-form-generator>

										</div>
									</div>
									<div class="col-sm-4">

										<button type="submit" class="btn" @click="sendMessage">{{ _("Reply") }}</button>
									</div>
								</div>
							</form>
						</div>
					</div>
				</div>
				<!--end of row-->
			</div>
			<!--end of container-->
		</section>
	</div>

</div>
</template>

<script>
	import Vue from "vue";
	import marked from "marked";
	import axios from "axios";


	import toast from "../../core/toastr";
	import { cloneDeep, find } from "lodash";
	import { validators, schema as schemaUtils } from "vue-form-generator";

	import { mapGetters, mapActions } from "vuex";
	import toastr from "../../core/toastr";
	import Service from "../../core/service";
	let service = new Service("messages");

	export default {

		computed: {
			...mapGetters("session", [
				"me"
			]),
			subject: function () {
				return 'Message craft owner for S\\N: ' + this.craft.serial_number;
				//this.firstName + ' ' + this.lastName
			}
		},

		/**
		 * Set page schema as data property
		 */
		data() {
			return {
				id: 'test',
				craft:{},
				model: null,
				isNewModel: false,
				schema: {
					fields: [
						{
							type: "input",
							inputType: "text",
							label: "ID",
							model: "code",
							readonly: true,
							disabled: true
						},
						{
							type: "input",
							inputType: "text",
							label: "Subject",
							model: "subject",
							featured: true,
							required: true,
							placeholder: "Subject",
							validator: validators.string
						},
						{
							type: "textArea",
							label: "Message",
							model: "content",
							featured: true,
							required: true,
							rows: 10,
							placeholder: "Enter message to craft owner",
							validator: validators.string
						}
					]
				}
			};
		},

		/**
		 * Socket handlers. Every property is an event handler
		 */
		socket: {

			prefix: "messages.",

			events: {
				/**
				 * New device added
				 * @param  {Object} res Device object
				 */
				/*
				We don't use it because we don't know where to add it to the page (filter, sort..etc)
				created(res) {
					this.created(res.data);
					toast.success(this._("PostNameAdded", res), this._("PostAdded"));
				},*/

				/**
				 * Post updated
				 * @param  {Object} res Post object
				 */
				updated(res) {
					this.updated(res.data);
					toast.success(this._("PostNameUpdated", res), this._("PostUpdated"));
				},

				/**
				 * Post removed
				 * @param  {Object} res Post object
				 */
				removed(res) {
					this.removed(res.data);
					toast.success(this._("PostNameDeleted", res), this._("PostDeleted"));
				}
			}
		},

		methods: {
				getCraft: function(){
					return axios.get("/api/crafts/" + this.$route.params.craftID).then((response) => {
						let res = response.data;
					if (res.status == 200 && res.data){
						this.craft = res.data;
					}
					else{
						console.error("Request error!", res.error);
					}
				}).catch((response) => {
						console.error("Request error!", response.statusText);
				});

				},
			sendMessage() {
				if (this.$refs.form.validate()) {

					this.saveMessage(this.model);
					this.cancelMessage();
				} else {
					this.focusFirstErrorInput();
				}
			},
			focusFirstInput() {
				this.$nextTick(() => {
					let el = document.querySelector(".newMessageForm .form-control:nth-child(1):not([readonly]):not(:disabled)");
				if (el)
					el.focus();
			});
			},
			focusFirstErrorInput() {
				this.$nextTick(() => {
					let el = document.querySelector(".newMessageForm .form-group.error .form-control");
				if (el)
					el.focus();
			});
			},
			newMessage() {
				this.model = schemaUtils.createDefaultObject(this.schema);
				this.model.code = this.craft.code;
//				alert(JSON.stringify(this.model));

				this.focusFirstInput();
			},
			cancelMessage() {
//				this.model.subject = null;
//				this.model.content = null;
				this.model = schemaUtils.createDefaultObject(this.schema);
				this.model.code = this.craft.code;
			},
			saveMessage(model){

				service.rest("create", model).then((data) => {
					//redirect to the conversation

					alert(JSON.stringify(data));
				this.$router.push('/messages/conversation/' + data.code);
			}).catch((err) => {
					toastr.error(err.message);
			});
			}

		},

		/**
		 * Call if the component is created
		 */
		created() {
			this.getCraft().then(res => {
				this.newMessage();
			});



		}
	};
</script>

<style lang="scss" scoped>


</style>
