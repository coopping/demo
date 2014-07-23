/**
 * Created by thinkpad on 14-7-16.
 */

var _providerTypeBase =[{"key":"1","value":"产险"},
    {"key":"2","value":"寿险"}];

var _channelBase = [{"key":"1","value":"代理人渠道"},
    {"key":"2","value":"电销渠道"},
    {"key":"3","value":"网销渠道"},
    {"key":"4","value":"银行渠道"},
    {"key":"5","value":"团多渠道"}];

var _agentStatus = [{"key":"1","value":"待签约"},
    {"key":"2","value":"签约"},
    {"key":"3","value":"离职"}];

var _productStatus = [{"key":"1","value":"待审核"},
    {"key":"2","value":"审核通过"},
    {"key":"3","value":"待发布"},
    {"key":"4","value":"已发布"}];

var _premiumperiod = [{"key":"1","value":"年缴"},
    {"key":"2","value":"半年缴"},
    {"key":"3","value":"月缴"},
    {"key":"4","value":"趸缴"}];

var _chargemode = [{"key":"1","value":"现金"},
    {"key":"2","value":"转账"} ];

var _idtype = [{"key":"1","value":"身份证"},
    {"key":"2","value":"护照"},
    {"key":"3","value":"军人证"},
    {"key":"4","value":"出生证"},
    {"key":"5","value":"港澳证"}];

var _relations =[{"key":"1","value":"法定"},
    {"key":"2","value":"本人"},
    {"key":"3","value":"父母"},
    {"key":"4","value":"配偶"},
    {"key":"5","value":"子女"},
    {"key":"6","value":"其他"}];

var _insuretype =[{"key":"1","value":"身故受益人"},
    {"key":"2","value":"期满受益人"}];

var _sex =[{"key":"1","value":"男"},
    {"key":"2","value":"女"},
    {"key":"3","value":"未知"}
];

var _vehicleType =[{"key":"1","value":"轿车"},
    {"key":"2","value":"半挂车"},
    {"key":"3","value":"电车"},
    {"key":"4","value":"全挂车"},
    {"key":"5","value":"货车"},
    {"key":"6","value":"轮式机械"},
    {"key":"7","value":"客车"},
    {"key":"8","value":"摩托车"},
    {"key":"9","value":"农用车"},
    {"key":"10","value":"牵引车"},
    {"key":"11","value":"特种作业专用车"},
    {"key":"12","value":"拖拉机"},
    {"key":"13","value":"专项作业车"},
    {"key":"14","value":"其他"}
];

var _usageType =[{"key":"1","value":"个人自用"},
    {"key":"2","value":"单位自用"},
    {"key":"3","value":"载客营运"},
    {"key":"4","value":"载货营运"},
    {"key":"5","value":"出租营运"},
    {"key":"6","value":"其他"}
];

var _contractStatus =[{"key":"0","value":"录入"},
    {"key":"1","value":"有效"},
    {"key":"2","value":"未承保"},
    {"key":"3","value":"退保"},
    {"key":"4","value":"投保人撤单"},
    {"key":"5","value":"保险公司撤单"},
    {"key":"6","value":"失效"},
    {"key":"7","value":"待续保"},
    {"key":"8","value":"自动垫缴"},
    {"key":"9","value":"犹豫期撤单"},
    {"key":"10","value":"展期"},
    {"key":"11","value":"赔付终止"},
    {"key":"12","value":"保单满期"},
    {"key":"13","value":"借款失效"},
    {"key":"14","value":"保险公司解约"},
    {"key":"15","value":"效力终止"},
    {"key":"16","value":"缴费期满"},
    {"key":"17","value":"转换终止"},
    {"key":"18","value":"复效"},
    {"key":"19","value":"投保人解约"},
    {"key":"20","value":"减额缴清"},
    {"key":"21","value":"豁免保费"},
    {"key":"22","value":"死亡给付"},
    {"key":"23","value":"死亡给付"},
    {"key":"24","value":"死亡给付"},
    {"key":"25","value":"自垫交清"},
    {"key":"26","value":"延期"},
    {"key":"27","value":"其它"}
];

exports.providerType= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _providerTypeBase.length; i < l; i++) {
            var o = _providerTypeBase[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _providerTypeBase;
}

exports.channel= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _channelBase.length; i < l; i++) {
            var o = _channelBase[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _channelBase;
}

exports.agentstatus= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _agentStatus.length; i < l; i++) {
            var o = _agentStatus[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _agentStatus;
}


exports.premiumpreiod= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _premiumperiod.length; i < l; i++) {
            var o = _premiumperiod[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _premiumperiod;
}

exports.chargemode= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _chargemode.length; i < l; i++) {
            var o = _chargemode[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _chargemode;
}
exports.relations= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _relations.length; i < l; i++) {
            var o = _relations[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _relations;
}
exports.idtype= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _idtype.length; i < l; i++) {
            var o = _idtype[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _idtype;
}

exports.insuretype= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _insuretype.length; i < l; i++) {
            var o = _insuretype[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _insuretype;
}

exports.sex= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _sex.length; i < l; i++) {
            var o = _sex[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _sex;
}
exports.vehicleTypes= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _vehicleType.length; i < l; i++) {
            var o = _vehicleType[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _vehicleType;
}

exports.usageTypes= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _usageType.length; i < l; i++) {
            var o = _usageType[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _usageType;
}

exports.contractStatus= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _contractStatus.length; i < l; i++) {
            var o = _contractStatus[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _contractStatus;
}
