"use strict";

import Vue from "vue";
import VueRouter from "vue-router";

import Home from "../modules/home";
import Counter from "../modules/counter";
import Devices from "../modules/devices";
import Crafts from "../modules/crafts";
import Posts from "../modules/posts";
import Messages from "../modules/messages";
import Profile from "../modules/profile";

Vue.use(VueRouter);

export default new VueRouter({
	mode: "hash",
	routes: [
		{ path: "/", component: Home },
		{ path: "/devices", component: Devices },
		{ path: "/crafts", component: Crafts },
		{ path: "/posts", component: Posts },
		{ path: "/messages", component: Messages },
		{ path: "/counter", component: Counter },
		{ path: "/profile", component: Profile }
		// { path: "/users", component: User, meta: { needRole: "admin" } },
		//{ path: "*", component: NotFound }
	]
});
