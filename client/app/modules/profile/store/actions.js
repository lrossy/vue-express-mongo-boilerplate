import Vue from "vue";
import toastr from "../../../core/toastr";
import { UPDATE } from "./types";
import axios from "axios";


export const NAMESPACE = "/api/profile";

import Service from "../../../core/service";
let service = new Service("profile");

export const getProfile = function ({ commit }) {
	service.rest("get").then((data) => {
		commit("UPDATE", data);
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const updateProfile = function(store, model) {
	service.rest("update", model).then((data) => {
		updated(store, data);
	}).catch((err) => {
		toastr.error('here' + err.message);
	});
};
export const updated = function({ commit }, model) {
	commit(UPDATE, model);
};
