"use strict";

require("es6-promise/auto");

import Vue from "vue";
//import BootstrapVue from 'bootstrap-vue';

import axios from "axios";
axios.defaults.headers.post["Content-Type"] = "application/json";

import Filters from "./core/filters";
import VueI18Next from "./core/i18next.js";
import VueFormGenerator from "vue-form-generator";
import VueWebsocket from "./core/websocket";

import store from "./core/store";
import App from "./core/App";

//Vue.use(BootstrapVue);
Vue.use(Filters);

Vue.use(VueFormGenerator);
Vue.use(VueWebsocket, null, { autoConnect: false });

//Vue.http.headers.common['X-CSRF-TOKEN'] = $('input[name="csrf"]').val();

// Register i18next localization module. We need to
// wait it before start the application!
Vue.use(VueI18Next, (i18next) => {
	let router = require("./core/router").default; // Load only after i18next initialized

	new Vue({
		el: "#app",
		components: {
			App
		},
		router,
		store,
		render: h => h("app")
	});
});
