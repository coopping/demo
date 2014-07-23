/**
 * Created by thinkpad on 14-6-23.
 */
 "use strict";
var mongoose = require("mongoose");
var updatedTimestamp = require('mongoose-updated_at');
var ObjectId = mongoose.Schema.Types.ObjectId;
var validator = require('../../lib/validator');
var Error = mongoose.Error;
var BizAcceptSchema =new mongoose.Schema({
    createDate			:  {type:Date, default: Date.now  },
    createUserId		:  {type:ObjectId ,required:true},
    updateDate			:  {type:Date, default: Date.now },
    updateUserId		:  {type:ObjectId ,required:true},
    acceptBranchId	    :  {type:String,required:true},
    acceptUserId		:  {type:ObjectId ,required:true},
    acceptDate			:  {type: Date, default: Date.now },
    acceptStatus      :  {type:String,default:'AcceptStatus_A'},
    agentCode         :  {type:String},
    agentIdNo          :  {type:String},
    customerIdNo       :  {type:String},
    providerCode       :  {type:String},
    providerId         :  {type:ObjectId,ref:'Provider'},
    acceptNum          :  {type:Number},
    agentId            :   {type:ObjectId},
    agentName          :   {type:String},
    applicationNo     :   {type:String,required:true},
    contractId         :  {type:ObjectId}
},{ collection: 'bizaccepts' });

BizAcceptSchema.plugin(updatedTimestamp);

BizAcceptSchema.pre('save', function (next) {
    var errMsg = {};
    var self = this;

    if (!validator.IsIdCardNo(self.agentIdNo)) {
        //key为页面上输入元素的id,value为错误信息
        errMsg.agentIdNo = '代理人身份证格式不正确';
    };

    if (!validator.IsIdCardNo(self.customerIdNo)) {
        errMsg.customerIdNo = '客户身份证格式不正确';
    };

    if (!validator.IsMoney(self.acceptNum)) {
        errMsg.acceptNum = '保费格式不争取，最多有两位小数';
    };

    if (!validator.checkno(self.applicationNo)) {
        errMsg.applicationNo = '投保单号不能包括汉子，特殊符号';
    };

    if (Object.keys(errMsg).length > 0) {
        var err = new Error(JSON.stringify(errMsg));
        next(err);
    } else {
        next();
    }
});

module.exports = mongoose.model('BizAccept', BizAcceptSchema);