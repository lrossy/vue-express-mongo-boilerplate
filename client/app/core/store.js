import Vue from "vue";
import Vuex from "vuex";

import session from "../modules/session/store";
import devices from "../modules/devices/store";
import crafts from "../modules/crafts/store";
import posts from "../modules/posts/store";
import messages from "../modules/messages/store";
import counter from "../modules/counter/store";
import profile from "../modules/profile/store";

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		session,
		counter,
		devices,
		crafts,
		posts,
		messages,
		profile
	}
});
