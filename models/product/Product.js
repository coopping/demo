/**
 * Created by thinkpad on 14-6-26.
 */
//险种表
"use strict";
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var productSchema = new mongoose.Schema({
    productCode			:	String,
    productName			:	String,
    productAbbr		    : 	String,
    productType           :   String,
    providerId            :   ObjectId,
    productStatus		    :	String
}, { collection: 'products' });
module.exports = mongoose.model('Product', productSchema);