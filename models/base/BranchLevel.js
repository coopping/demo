"use strict";
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	key		: 	String,
	value	:	String
},{ collection: 'branchLevelBase' });

module.exports = mongoose.model('BranchLevel', schema);