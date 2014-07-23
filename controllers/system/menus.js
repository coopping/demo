"use strict";
var Menu = require('../../models/system/Menu');
var menuHelper = require('../../lib/menuHelper');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var auth = require('../../lib/auth');
module.exports = function(app) {
	app.get('/system/menus', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		var condition = {url:{$ne:'/'}};
		if (req.query.parentId) {
			condition.parentId = new ObjectId(req.query.parentId);
		} else {
			condition.levelId = '1';
		}
		Menu.paginate(condition, page, 10, function(err, pageCount, menus) {
			if (err) {
				return next(err);
			}
			var model = {
					title : '菜单列表',
					isAdmin : true,
					menus : menus,
					page : page,
					pageCount : pageCount,
					showMessage : req.flash('showMessage')
				};
			res.render('system/menus/index', model);
		}, { sortBy : { sortKey : 1 } });		
	});
	
	app.get('/system/menus/add', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var model = {};
		model.menu = {levelId : '1'};
		model.title = '新增一级菜单';
		model.parent = {url : '/', fullUrl: '/'};
		res.render('system/menus/add', model);		
	});
	app.post('/system/menus/add', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		//找到根菜单
		var menu = req.body.menu;
		Menu.findOne({url:'/'}, function(err, root){
			if (err) {
				return next(err);
			}
			if (!root) {
				res.locals.showErrorMessage = ['菜单的根节点还没有建立，请联系管理员！'];
				var model = {
					menu : menu,
					parent : {url : '/', fullUrl: '/'}
				};
				return res.render('system/menus/add', model);				
			}
			var parent = root;
			var menuModel = new Menu(menu);
			menuModel.parentId = parent.id;
			menuModel.parentUrl = parent.url;
			menuModel.fullUrl = menuModel.url
			menuModel.save(function(err){
				if (err) {
					var model = {
							menu : menu,
							parent : parent
					};
					res.locals.err = err;
					res.locals.view = 'system/menus/add';
					res.locals.model = model;
					return next();			
				}
				req.flash('showMessage', '创建成功');
				res.redirect('/system/menus');
				//rebuild菜单树结构，在返回页面后执行
				Menu.rebuildTree(root, 1, function(){
					console.log('rebuild tree for % sucess', root.url);
				});
				//刷新菜单树缓存
				menuHelper.refresh();
			});
		});
	});
	
	app.get('/system/menus/:parentId/addSub', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var parentId = req.params.parentId;
		Menu.findById(new ObjectId(parentId), 'fullUrl url levelId', function(err, parent){
			if (err) {
				return next(err);
			}
			var model = {
					title : '新增菜单',
					isAdmin : true,
					menu  : {levelId : (new Number(parent.levelId) + 1).toString()},
					parent : parent
				};
			console.log('model:%s', JSON.stringify(model));
			res.render('system/menus/addSub', model);						
		});
	});	
	app.post('/system/menus/:parentId/addSub', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var parentId = req.params.parentId;
		Menu.findById(new Object(parentId), function(err, parent){
			var menuInput = req.body.menu;
			menuInput.parentId = parent.id;
			menuInput.parentUrl = parent.fullUrl;
			var menuModel = new Menu(menuInput);
			menuModel.save(function(err, menu){
				if(err) {
					var model = {
							menu : menuInput,
							parent : parent
					};
					res.locals.err = err;
					res.locals.view = 'system/menus/addSub';
					res.locals.model = model;
					return next();//调用下一个错误处理middlewear
				} 
				req.flash('showMessage', '创建成功');
				//res.redirect('/system/menus/'+parentId +'/down');	
				res.redirect('/system/menus?parentId=' + parent.parentId);			
				Menu.rebuildTree(parent, parent.lft, function(){
					console.log('rebuild tree for % sucess', parent.url);
				});
				//刷新菜单树缓存
				menuHelper.refresh();
			});				
		});			
	});	
	
	
	app.get('/system/menus/:id/edit', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		console.log(id);
		Menu.findById(new ObjectId(id), function(err, menu) {
			if (err) {
				return next(err);
			}
			Menu.findById(menu.parentId, 'fullUrl', function(err, parent){
				if(err) {
					return next(err);
				}
				if (!parent) {
					parent = {url:'/'};
				}
				console.log(parent);
				var model = {
					title : '编辑菜单信息',
					isAdmin : true,
					menu : menu,
					parent : parent,
					showMessage : req.flash('showMessage')
				};			
				res.render('system/menus/edit', model);
			});
		});		
	});
	app.post('/system/menus/:id/edit', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		var newMenu = req.body.menu;
		Menu.findByIdAndUpdate(new ObjectId(id), newMenu, function(err, menu) {
			if (err) {
				newMenu.id = id;
				var model = {
					menu: newMenu,
					parent: req.body.parent
				};
				res.locals.err = err;
				res.locals.view = 'system/menus/edit';
				res.locals.model = model;
				return next(); //调用下一个错误处理middlewear
			}
			console.log(menu);
			req.flash('showMessage', '修改成功');
			res.redirect('/system/menus/' + menu.id + '/edit');
			//刷新菜单树缓存
			menuHelper.refresh();
		});
	});
	
	app.get('/system/menus/:id/down', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		var id = req.params.id;
		Menu.findById(new ObjectId(id), function(err, menu){
			if (err){
				return next(err)
			}
			var condition = {
				lft: {
					$gt: menu.lft
				},
				rgt: {
					$lt: menu.rgt
				}
			};
			condition.levelId = (new Number(menu.levelId) + 1).toString();
			Menu.paginate(condition, page, 10, function(err, pageCount, menus){
				var model = {
						title : '菜单列表',
						isAdmin : true,
						menus : menus,
						page : page,
						pageCount : pageCount,
						showMessage : req.flash('showMessage')
					};			
				res.render('system/menus/index', model);
			}, { sortBy : { sortKey : 1 } });								
		});
	});

	app.get('/system/menus/:id/up', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		var id = req.params.id;
		Menu.findById(new ObjectId(id), function(err, menu) {
			if (err) {
				return next(err)
			}
			res.redirect('/system/menus?parentId=' + menu.parentId);
		});
	});
	
	app.get('/system/menus/return', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next){
		var id = req.query.id;
		Menu.findById(new ObjectId(id), 'parentId', function(err, menu) {
			if (err) {
				return next(err);
			}
			res.redirect('/system/menus?parentId=' + menu.parentId);
		});
	});

	app.get('/system/menus/:id/delete', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		Menu.findById(new ObjectId(id), function(err, menu) {
			if (err) {
				return next(err);
			}
			Menu.findById(menu.parentId, function(err, parent) {
				if (err) {
					return err;
				}
				Menu.remove({
					lft: {
						$gt: menu.lft
					},
					rgt: {
						$lt: menu.rgt
					},
					parentId: {
						$ne: menu.parentId
					}
				}, function(err) {
					if (err) {
						return next(err);
					}
					menu.remove(function(err, menu) {
						if (err) {
							return next(err);
						}
						res.json({
							message: 'OK'
						});
						Menu.rebuildTree(parent, parent.lft, function() {
							console.log('rebuild tree for % sucess', parent.url);
						});
					});
				});
			});
		});
	});
};
