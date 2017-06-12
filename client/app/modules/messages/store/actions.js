import Vue from "vue";
import toastr from "../../../core/toastr";
import Service from "../../../core/service";
import { LOAD, LOAD_MORE, ADD, UPDATE, VOTE, UNVOTE, REMOVE,
	NO_MORE_ITEMS, FETCHING, CHANGE_SORT, CHANGE_VIEWMODE, CHANGE_OFFSET } from "./types";

export const NAMESPACE	 	= "/api/messages";

let service = new Service("messages");

export const getRows = function ({commit, state}, loadMore) {
	commit(FETCHING, true);
	commit(CHANGE_OFFSET, 0);

	return service.rest("list", { filter: state.viewMode, sort: state.sort, limit: 10, offset: state.offset }).then((data) => {
		if (data.length == 0){
			commit(loadMore ? LOAD_MORE : LOAD, data);
			// commit(NO_MORE_ITEMS);
		}
		else
			commit(loadMore ? LOAD_MORE : LOAD, data);
	}).catch((err) => {
		toastr.error(err.message);
	}).then(() => {
		commit(FETCHING, false);
	});
};

export const saveRow = function(store, model) {
	service.rest("create", model).then((data) => {
		created(store, data);
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const updateRow = function(store, model) {
	service.rest("update", model).then((data) => {
		updated(store, data);
	}).catch((err) => {
		toastr.error(err.message);
	});
};

export const loadMoreRows = function(context) {
	return getRows(context, true);
};

export const changeSort = function(store, sort) {
	store.commit(CHANGE_SORT, sort);
	getRows(store);
};

export const changeViewMode = function(store, viewMode) {
	store.commit(CHANGE_VIEWMODE, viewMode);
	getRows(store);
};

export const created = function({ commit }, model) {
	commit(ADD, model);
};

export const updated = function({ commit }, model) {
	commit(UPDATE, model);
};

export const removed = function({ commit }, model) {
	commit(REMOVE, model);
};
