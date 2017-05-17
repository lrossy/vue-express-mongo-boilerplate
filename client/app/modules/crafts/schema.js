import Vue from "vue";
import moment from "moment";
import { classTypes } from "./types";
import { validators } from "vue-form-generator";

import { find } from "lodash";

let _ = Vue.prototype._;

module.exports = {

	id: "crafts",
	title: "Crafts",

	table: {
		multiSelect: true,
		paginated: true,
		columns: [
			{
				title: _("ID"),
				field: "code",
				align: "left",
				formatter(value, model) {
					return model ? model.code : "";
				}
			},
			{
				title: "Class",
				field: "class",
				formatter(value) {
					let type = find(classTypes, (type) => type.id == value);
					return type ? type.name : value;
				}
			},
			{
				title: "Registration ID",
				field: "registration_id"
			},
			{
				title: "Manufacturer",
				field: "manufacturer"
			},
			{
				title: "Model",
				field: "model"
			},
			{
				title: "Serial Number",
				field: "serial_number"
			},
			{
				title: "Max Takeoff Weight",
				field: "max_takeoff_w"
			},
			{
				title: "Num Engines",
				field: "num_engines"
			},
			{
				title: "Engine Type",
				field: "engine_type"
			}
		]

	},

	form: {
		fields: [
			{
				type: "input",
				inputType: "text",
				label: _("ID"),
				model: "code",
				readonly: true,
				disabled: true,
				multi: false,
				get(model) {
					if (model.code)
						return model.code;
					else
						return _("willBeGenerated");
				}
			},
			{
				type: "select",
				label: "Class",
				model: "class",
				required: true,
				values: classTypes,
				default: "rotor_craft",
				validator: validators.required

			},
			{
				type: "input",
				inputType: "text",
				label: "Full Legal Name of UA Manufacturer or Builder",
				model: "manufacturer",
				featured: true,
				required: true,
				placeholder: _("DeviceName"),
				validator: validators.string
			},
			{
				type: "input",
				inputType: "text",
				label: "UA Model Designation",
				model: "model",
				featured: false,
				required: true,
				validator: validators.string
			},
			{
				type: "input",
				inputType: "text",
				label: "UA Serial Number",
				model: "serial_number",
				placeholder: "serial_number",
				validator: validators.string
			},
			{
				type: "input",
				inputType: "text",
				label: "UA Maximum Takeoff Weight",
				model: "max_takeoff_w",
				placeholder: "",
				validator: validators.string
			},
			{
				type: "input",
				inputType: "text",
				label: "Number of engines",
				model: "num_engines",
				placeholder: "",
				validator: validators.string
			},
			{
				type: "input",
				inputType: "text",
				label: "Engine type",
				model: "engine_type",
				placeholder: "",
				validator: validators.string
			}
		]
	},

	options: {
		searchable: true,


		enableNewButton: true,
		enabledSaveButton: true,
		enableDeleteButton: true,
		enableCloneButton: false,

		validateAfterLoad: false, // Validate after load a model
		validateAfterChanged: false, // Validate after every changes on the model
		validateBeforeSave: true // Validate before save a model
	},

	events: {
		onSelect: null,
		onNewItem: null,
		onCloneItem: null,
		onSaveItem: null,
		onDeleteItem: null,
		onChangeItem: null,
		onValidated(model, errors, schema) {
			if (errors.length > 0)
				console.warn("Validation error in page! Errors:", errors, ", Model:", model);
		}
	},

	resources: {
		addCaption: _("AddNewDevice"),
		saveCaption: _("Save"),
		cloneCaption: _("Clone"),
		deleteCaption: _("Delete")
	}

};
