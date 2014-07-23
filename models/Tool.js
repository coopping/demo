/**
 * New node file
 */
 "use strict";
var mongoose = require('mongoose');

var toolSchema = new mongoose.Schema({
	name : String,
	type : String,
	describe : String,
	path : String
});

module.exports = mongoose.model('Tool', toolSchema);