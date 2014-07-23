"use strict";
var auth = require('../../lib/auth');
var menuHelper = require('../../lib/menuHelper');
var Role = require('../../models/system/Role');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var auth = require('../../lib/auth');
module.exports = function(app) {
	app.get('/system/auth/roles', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		Role.paginate({}, page, 10, function(err, pageCount, roles) {
			if (err) {
				return next(err);
			}
			var model = {
				title: '角色列表',
				roles: roles,
				page: page,
				pageCount: pageCount,
				showMessage: req.flash('showMessage')
			};
			res.render('system/roles/index', model);
		}, {
			sortBy: {
				createdAt: -1
			}
		});
	});

	app.post('/system/auth/roles/add', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var role = req.body.role;
		console.log(role);
		var roleModel = new Role(role);
		roleModel.save(function(err) {
			if (err) {
				var model = {
					role: role
				};
				res.locals.err = err;
				res.locals.view = 'system/roles/index';
				res.locals.model = model;
				return next();
			}
			req.flash('showMessage', '创建成功');
			res.redirect('/system/auth/roles');
		});
	});

	app.get('/system/auth/roles/:id/load', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		console.log(id);
		Role.findById(new ObjectId(id), function(err, role) {
			if (err) {
				return next(err);
			}
			res.json(role);
		});
	});
	app.post('/system/auth/roles/:id/save', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		var roleInput = req.body.role;
		console.log(roleInput);
		Role.findById(new ObjectId(id), function(err, role) {
			if (err) {
				return next(err);
			}
			for (var o in roleInput) {
				role[o] = roleInput[o];
			}
			role.save(function(err, role) {
				if (err) {
					var model = {
						role: roleInput
					};
					res.locals.err = err;
					res.locals.view = 'system/roles';
					res.locals.model = model;
					return next(); //调用下一个错误处理middlewear
				}
				req.flash('showMessage', '修改成功');
				res.redirect('/system/auth/roles');
			});
		});
	});
	app.get('/system/auth/roles/:id/delete', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		Role.findByIdAndRemove(new ObjectId(id), function(err, role) {
			if (err) {
				return next(err);
			}
			res.json({
				message: 'OK'
			});
		});
	});
	app.get('/system/auth/roles/:id/addMenus', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		var model = {};
		var menuTree = menuHelper.menuTree;

		Role.findById(new ObjectId(id), 'name menus', function(err, role) {
			if (err) {
				return next(err);

			}
			for (var i = 0, l = menuTree.length; i < l; i++) {
				var menuInfo = menuTree[i];
				if (role.menus.indexOf(new ObjectId(menuInfo.menu.id)) >=0 ){
					menuInfo.selected = true;
				}
			}
			model.title = '分配角色（' + role.name + '）菜单';
			model.menuTree = menuTree;
			model.role = role;
			res.render('system/roles/addMenus', model);
		});

	});

	app.get('/system/auth/roles/:id/applyMenu/:menuId', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		var menuId = req.params.menuId;
		console.log(11111111);
		Role.findById(new ObjectId(id), function(err, role) {
			if (err) {
				return next(err);
			}
			var position = role.menus.indexOf(new ObjectId(menuId));
			console.log('position:%i', position);
			var selected = false;
			if (position >= 0) {
				//从role.menus中删除该菜单
				role.menus.splice(position, 1);
				selected = false;
			} else {
				//增加该菜单到role.menus中
				role.menus.push(new ObjectId(menuId));
				selected = true;
			}
			role.save(function(err) {
				if (err) {
					return next(err);
				}
				res.json({
					message: '更新成功',
					selected: selected
				});
			});
		});
	});
};