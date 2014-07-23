/**
 * Created by thinkpad on 14-7-16.
 */

var _caseMian =[{"key":"1","value":"基本法A"},
                {"key":"2","value":"基本法B"}];

var _agentLevel =[{"key":"1","value":"NC"},
                    {"key":"2","value":"AM"},
                    {"key":"3","value":"UM"},
                    {"key":"4","value":"OM"}];

var _education =[{"key":"0","value":"小学及以下"},
                  {"key":"1","value":"初中"},
                  {"key":"2","value":"高中(中专,技校)"},
                  {"key":"3","value":"大专"},
                  {"key":"4","value":"本科"},
                  {"key":"5","value":"研究生"},
                  {"key":"6","value":"硕士"},
                  {"key":"7","value":"博士"},
                  {"key":"8","value":"博士后"}
                  ];

var _agentType = [{"key":"1","value":"专业代理人"},
    {"key":"2","value":"电销代理人"},
    {"key":"3","value":"网销代理人"},
    {"key":"4","value":"银行代理人"},
    {"key":"5","value":"团多代理人"}];


exports.caseMian= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _caseMian.length; i < l; i++) {
            var o = _caseMian[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _caseMian;
}

exports.education= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _education.length; i < l; i++) {
            var o = _education[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _education;
}

exports.agentLevel= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _agentLevel.length; i < l; i++) {
            var o = _agentLevel[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _agentLevel;
}

exports.agentType= function(key){
    if (key) {
        var returnValue = '未定义';
        for (var i = 0, l = _agentType.length; i < l; i++) {
            var o = _agentType[i];
            if (o.key === key) {
                return o.value;
            }
        }
        return returnValue;
    }
    return _agentType;
}
