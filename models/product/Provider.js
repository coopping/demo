/**
 * Created by thinkpad on 14-6-11.
 */
"use strict";
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var providerSchema = new mongoose.Schema({
    name : String,
    abbr : String,
    type : String
}, { collection: 'provider' });

module.exports = mongoose.model('Provider', providerSchema);