import Vue from "vue";
import toastr from "../../../core/toastr";
import { LOAD, ADD, SELECT, CLEAR_SELECT, UPDATE, REMOVE, FETCHING, NO_MORE_ITEMS, LOAD_MORE } from "./types";
import axios from "axios";

export const NAMESPACE = "/api/crafts";

export const selectRow = ({ commit }, row, multiSelect) => {
	commit(SELECT, row, multiSelect);
};

export const clearSelection = ({ commit }) => {
	commit(CLEAR_SELECT);
};

export const getRows = function ({commit, state}, loadMore) {
	commit(FETCHING, true);
	return service.rest("list", { filter: state.viewMode, sort: state.sort, limit: 10, offset: state.offset }).then((data) => {
		if (data.length == 0)
			commit(NO_MORE_ITEMS);
		else
			commit(loadMore ? LOAD_MORE : LOAD, data);
	}).catch((err) => {
		toastr.error(err.message);
	}).then(() => {
		commit(FETCHING, false);
	});
};

export const downloadRows = ({ commit }) => {
	axios.get(NAMESPACE).then((response) => {
		let res = response.data;
		console.log('res',res);
		if (res.status == 200 && res.data)
			commit(LOAD, res.data);
		else
			console.error("Request error!", res.error);

	}).catch((response) => {
		console.error("Request error!", response.statusText);
	});

};

export const saveRow = ({ commit }, model) => {
	axios.post(NAMESPACE, model).then((response) => {
		let res = response.data;

		if (res.status == 200 && res.data)
			created({ commit }, res.data, true);
	}).catch((response) => {
		if (response.data.error)
			toastr.error(response.data.error.message);
	});
};

export const created = ({ commit }, row, needSelect) => {
	commit(ADD, row);
	if (needSelect)
		commit(SELECT, row, false);
};

export const updateRow = ({ commit }, row) => {
	axios.put(NAMESPACE + "/" + row.code, row).then((response) => {
		let res = response.data;
		if (res.data)
			commit(UPDATE, res.data);
	}).catch((response) => {
		if (response.data.error)
			toastr.error(response.data.error.message);
	});
};

export const updated = ({ commit }, row) => {
	commit(UPDATE, row);
};

export const removeRow = ({ commit }, row) => {
	axios.delete(NAMESPACE + "/" + row.code).then((response) => {
		commit(REMOVE, row);
	}).catch((response) => {
		if (response.data.error)
			toastr.error(response.data.error.message);
	});
};

export const removed = ({ commit }, row) => {
	commit(REMOVE, row);
};
