"use strict";
var Branch = require('../models/system/Branch');
var _branchTree = [];
var branchTree = function() {
    if (_branchTree.length > 0) {
        return;
    }
    console.log('初始化机构树');
    Branch.find({
        parent: 'top',
        levelId: '0'
    }).
    //sort('sortKey').
    exec(
        function(err, branches) {
            //console.log(11111);
            //console.log(branches);
            branches.forEach(function(branch) {
                var info = {};
                info.code = branch.code;
                info.name = branch.name;
                info.children = []
                getChildren(info, function(err, branch) {
                    if (err) {
                        return console.log('err:%s', err);
                    }
                    _branchTree.push(branch);
                });
            });

        });

}
branchTree();

function getChildren(info, cb) {
    Branch.find({
        parent: info.code
    }, function(err, branches) {
        if (err) {
            return cb(err);
        }
        branches.forEach(function(branche) {
            var b = {};
            b.code = branche.code;
            b.name = branche.name;
            b.children = [];
            getChildren(b, function(err, b1) {
                info.children.push(b1);
            });
        });
        cb(null, info);
    })


    // mInfo.menu.children(function(err, children) {
    //     if (err) {
    //         return cb(err)
    //     }
    //     for (var i = 0, l = children.length; i < l; i ++) { 
    //         var mi = {};
    //         mi.subs = [];
    //         mi.menu = children[i];
    //         getMenuInfo(mi, function(err, m1){
    //             mInfo.subs.push(m1);
    //         })
    //     }
    //     cb(null, mInfo);
    // });

}

exports.branchTree = (function() {
    return _branchTree;
})();
exports.refresh = function() {
    _menuTree = [];
    branchTree();
};

function _getUserOprBranches(oprBranches, branch) {
    var node = {};
    node.id = branch.code;
    node.text = branch.name;
    node.children = [];
    node.state = {
        opened: false
    };
    if (oprBranches.indexOf(branch.code) >= 0 || oprBranches.indexOf('ALL') >= 0) {
        node.state.selected = true;
    }
    for (var i = 0, l = branch.children.length; i < l; i++) {
        node.children.push(_getUserOprBranches(oprBranches, branch.children[i]));
    }
    return node;
}


exports.getUserOprBranches = function(user, oprBranches, branchTree) {
    var userBranches = [];
    var currentUerOprBranches = user.oprBranches;
    console.log(oprBranches);
    branchTree.forEach(function(branch) {

        if (currentUerOprBranches.indexOf(branch.code) >= 0 || currentUerOprBranches.indexOf('ALL') >= 0) {
            userBranches.push(_getUserOprBranches(oprBranches, branch));
        }
    });
    return userBranches;
};

function getOprBranches(branches) {
    var result = [];
    for (var i = 0, l = branches.length; i < l; i++) {
        var tempb = branches[i]
        var dropFlag = 0;
        for (var ii = 0, ll = result.length; ii < ll; ii++) {
            var tempR = result[ii];
            //son of result
            if (tempb.indexOf(tempR) == 0) {
                dropFlag = 1;
                break;
            } else if (tempR.indexOf(tempb) == 0) { //ancestor of result
                result[ii] = tempb;
                dropFlag = 1;
            }
        }
        if (dropFlag == 0) {
            result.push(tempb);
        }
        dropFlag = 0;
    }
    result.sort();
    var uniqueResult = [];
    for (var i = 0; i < result.length; i++) {
        var tempb = result[i];
        if (result[i] == uniqueResult[uniqueResult.length - 1]) {
            continue;
        }
        uniqueResult.push(tempb);
    }
    return uniqueResult;
}
exports.getOprBranches = getOprBranches;