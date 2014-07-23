"use strict";
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	key		: 	String,
	value	:	String
},{ collection: 'branchTypeLevelBase' });

module.exports = mongoose.model('BranchTypeLevel', schema);