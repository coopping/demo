/**
 * Created by thinkpad on 14-6-24.
 */
"use strict";
var mongoose = require("mongoose");
var ObjectId = mongoose.Schema.Types.ObjectId;
var updatedTimestamp = require('mongoose-updated_at');

var AgentBrokerSchema =new mongoose.Schema({
    //基本信息：
    agentType            :      {type:String,required:true},    //代理人类型：（专业，电销，网销，银保，团多）
    agentName            : 	 {type:String,required:true},    //姓名：
    agentCode            :      {type:String,required:true},    //工号（后台自动生成）
    education            :      {type:String},                   //学历：
    idType              :      {type:String},                   //证件类型：
    idNo                 :      {type:String,required:true},    //证件号码：
    sex                  :      {type:String},                   //性别：
    birthday             :     {type:Date},                     //出生日期：
    contractMobile      :     {type:String,required:true},    //手机号码：
    telephone           :      {type:String},                   //联系电话：
    address             :      {type:String},                   //联系地址：
    email               :      {type:String},                    //电子邮箱：
    signingTime        :      {type:Number,default:1},                    //签约次数：

    //组织信息：
    caseMain            :     {type:String},   // 基本法：（A版，B版）
    branchCode           :     {type:String},   //机构
    agentLevel          :     {type:String,required:true},//入司职级：(NC,AM,UM,OM)
    signingDate         :     {type:Date},    //入司日期：
    agentStatus         :     {type:String,required:true},    //状态：（离职，在职）
    //证书信息：
    certificateNo     :         {type:String},//证书号：
    startDate         :         {type:Date},//生效日期：
    endDate           :         {type:Date},//截止日期：

    //其他字段：
    quitDate            :          {type:Date},//离职日期：
    promotionDate      :          {type:Date}//晋升日期：
},{ collection: 'agentbroker' });

AgentBrokerSchema.plugin(updatedTimestamp);

AgentBrokerSchema.pre('save', function (next) {
    var errMsg = {};
    var self = this;

    //证件号
    if(self.idNo ===''){
        errMsg.idNo='请输入证件号';
    }else{
        if(self.idType ===''){
            errMsg.aidtype="请选择证件类型";
            errMsg.idNo='请输入证件号';
        }else{
            if(self.idType=='1'){
                if (!validator.IsIdCardNo(self.idType)) {
                    errMsg.idNo = '身份证不正确';
                }
            }
        }
    }

    if(self.sex===''){
        errMsg.asex='请选择代理人性别';
    }

    if(self.telephone ===''&& self.contractMobile === ''){
        errMsg.contractmobile='代理人手机号码和电话至少填写一个';
    }else{
        if(self.contractmobile !=''){
            if (!validator.isMobile(self.contractmobile)) {
                errMsg.contractmobile = '手机号码格式不正确';
            };
        }
        if(self.telephone!=''){
            if (!validator.isTeleNO(self.telephone)) {
                errMsg.telephone = '电话格式不正确';
            };
        }
    }

    if(self.address===''){
        errMsg.address='请输入投保人地址';
    }

    if(self.caseMain===''){
        errMsg.prelations='请选择基本法';
    }

    if(self.signingDate===''){
        errMsg.insurename='请输入入司日期';
    }

    if(self.agentLevel===''){
        errMsg.relations='请选择入司职级';
    }

    if(self.agentstatus===''){
        errMsg.relations='请选择签约状态';
    }

    if(self.branchCode===''){
        errMsg.relations='请选择所属机构';
    }

});

module.exports = mongoose.model('AgentBroker', AgentBrokerSchema);