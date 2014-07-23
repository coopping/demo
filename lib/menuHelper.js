"use strict";
var Menu = require('../models/system/Menu');
var Role = require('../models/system/Role');
var _menuTree = [];
var menuTree = function() {
    if (_menuTree.length > 0) {
        return;
    }
    console.log('初始化菜单树');
    Menu.find({
        levelId: '1'
    }).
    sort('sortKey').
    exec(
        function(err, menus) {
            menus.forEach(function(menu) {
                var mInfo = {};
                mInfo.subs = [];
                mInfo.menu = menu;
                getMenuInfo(mInfo, function(err, menuInfo) {
                    if (err) {
                        return console.log('err:%s', err);
                    }
                    _menuTree.push(menuInfo);
                });
            });
        });
}
menuTree();
function getMenuInfo(mInfo, cb) {
    mInfo.menu.children(function(err, children) {
        if (err) {
            return cb(err)
        }
        for (var i = 0, l = children.length; i < l; i ++) { 
            var mi = {};
            mi.subs = [];
            mi.menu = children[i];
            getMenuInfo(mi, function(err, m1){
                mInfo.subs.push(m1);
            })
        }
        cb(null, mInfo);
    });
    
}

exports.menuTree = (function() {
    return _menuTree;
})();
exports.getRoleMenuTree = function(roles, cb) {
    Role.find({
        code: {
            $in: roles
        }
    }, function(err, roles) {
        var _roleMenuTree = [];
        if (err) {
            return cb(err);
        }
        for (var i = 0, l = roles.length; i < l; i++) {
            for (var ii = 0, ll = _menuTree.length; ii < ll; ii++) {
                if (roles[i].menus.indexOf(_menuTree[ii].menu._id) >= 0) {
                    _roleMenuTree.push(_menuTree[ii]);
                }
            }
        }
        cb(null, _roleMenuTree);
    });
};
exports.refresh = function() {
    _menuTree = [];
    menuTree();
};