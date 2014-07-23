 "use strict";
/**
 * Created by thinkpad on 14-6-26.
 */

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var planratemainSchema = new mongoose.Schema({
    productid     : { type:ObjectId, ref:'Product'},
    planRateVersion : '1',
    createuId   :ObjectId,
    createdAt   : Date,
    updateuId   : ObjectId,
    updatedAt   :  Date,
    basedate    : String,
    startDate   :Date,
    endDate     :Date,
    Branchcode  :String
}, { collection: 'planratemains' });
module.exports = mongoose.model('Planratemain', planratemainSchema);

