/**
 * Created by thinkpad on 14-6-24.
 */
/**
 * Created by thinkpad on 14-6-24.
 */
/**
 * Created by thinkpad on 14-6-24.
 */
 "use strict";
var mongoose = require("mongoose");
var updatedTimestamp = require('mongoose-updated_at');
var ObjectId = mongoose.Schema.Types.ObjectId;
var validator = require('../../lib/validator');
var Error = mongoose.Error;
var premiumSchema =new mongoose.Schema({
    createDate          :{type:Date,default:Date.now()},
    createUserId        :{type:ObjectId},
    updateDate          :{type:Date,default:Date.now()},
    updateUserId        :{type:ObjectId},
    contractNo          :{type:String},
    contractId          :{type:ObjectId},
    providerId          :{type:String},
    productId           :{type:String},
    productName        :{type:String},
    channelType         :{type:String},
    contractStatus      :{type:String},
    effectiveDate       :{type:Date},
    approveDate         :{type:Date},
    premiumMode         :{type:String},
    PremiumPeriod       :{type:String},
    policyYear          :{type:Number},
    faceaMout           :{type:Number},
    totalModalPrem      :{type:Number},
    initialChargeMode   :{type:String},
    renewalChargeMode   :{type:String},
    agencyfee           :{type:Number},
    valuePrem           :{type:Number},
    commisstionPrem  :{type:Number}
},{ collection: 'premiums' });
premiumSchema.plugin(updatedTimestamp);
module.exports = mongoose.model('Premium', premiumSchema);