"use strict";

let uuid  = require('uuid/v4');

/**
 * Generate token/keys
 * We use it to generate registration number
 */
module.exports = function() {
	return uuid.v4();
};
