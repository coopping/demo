"use strict";
var system = require('./baseCode/system');
var biz = require('./baseCode/biz');
var agent = require('./baseCode/agent');

var _agreementType = [{"key":"1","value":"寿险"},
    {"key":"2","value":"财险"} ];


exports.agreementType = function (key) {
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _agreementType.length; i < l; i++) {
            var o = _agreementType[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _agreementType;
};



exports.agentstatus     =     biz.agentstatus;
exports.channel          =    biz.channel;
exports.chargemode       =    biz.chargemode;
exports.contractStatus  =    biz.contractStatus;
exports.idtype           =    biz.idtype;
exports.insuretype      =    biz.insuretype;
exports.providerType    =    biz.providerType;
exports.premiumpreiod   =    biz.premiumpreiod;
exports.relations       =    biz.relations;
exports.sex              =    biz.sex;
exports.usageTypes      =    biz.usageTypes;
exports.vehicleTypes    =    biz.vehicleTypes;

exports.caseMain        =    agent.caseMian;
exports.education        =    agent.education;
exports.agentLevel       =    agent.agentLevel;
exports.agentType       =    agent.agentType;

exports.userType = system.userType;
exports.branchLevel = system.branchLevel;
exports.branchType = system.branchType;
exports.branchTypeLevel = system.branchTypeLevel;
exports.valid = system.valid;
exports.menuLevel = system.menuLevel;
