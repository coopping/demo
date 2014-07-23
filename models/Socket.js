"use strict";
var mongoose = require('mongoose');

var socketSchema = new mongoose.Schema({
	socketID : String,
	sid : String,
});


module.exports = mongoose.model('Socket', socketSchema);