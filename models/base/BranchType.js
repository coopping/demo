"use strict";
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
	key		: 	String,
	value	:	String
},{ collection: 'branchTypeBase' });

module.exports = mongoose.model('BranchType', schema);