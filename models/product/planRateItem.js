/**
 * Created by thinkpad on 14-6-26.
 */
 "use strict";
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var planreateitemSchema = new mongoose.Schema({
    productid     :  { type:ObjectId, ref:'Product'},
    planratemainid :  ObjectId,
    channelid    :String,
    premiumMode : String,
    premiumperiod : Number,
    policyyearstart  :Number,
    policyyearend  :Number,
    govstandardrate:Number,
    prostandardrate:Number,
    valuepremrate:Number,
    AgencyFeeRate:Number,
    CommissionRate:Number
}, { collection: 'planrateitems' });
module.exports = mongoose.model('Planrateitem', planreateitemSchema);