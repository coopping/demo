"use strict";
var Branch = require('../../models/system/Branch');
var BranchCounter = require('../../models/system/BranchCounter');
var baseCode = require('../../lib/baseCode');
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var auth = require('../../lib/auth');
module.exports = function(app) {
	app.get('/system', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		res.redirect('/system/branches');
	});
	app.get('/system/branches', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		var parent = 'top';
		if (req.query.parent) {
			parent = req.query.parent;
		}
		var condition = {
			parent: parent
		};

		auth.branchCondition(condition, req.user, 'code');
		//查询各个总公司
		Branch.paginate(condition, page, 10, function(err, pageCount, branches) {
			if (err) {
				return next(err);
			}
			var model = {
				title: '机构列表',
				isAdmin: true,
				branches: branches,
				page: page,
				pageCount: pageCount,
				showMessage: req.flash('showMessage')
			};
			res.render('system/branches/index', model);
		}, {
			sortBy: {
				code: 1
			}
		});
	});

	app.get('/system/branches/add', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var model = {};
		model.branch = {
			levelId: '0'
		};
		res.render('system/branches/add', model);
	});
	app.post('/system/branches/add', auth.isAuthenticated('ROLE_ADMIN'), function(req, res, next) {
		var branchInput = req.body.branch;
		branchInput.parent = 'top';
		branchInput.status = '1';
		var branchModel = new Branch(branchInput);
		branchModel.save(function(err, branch) {
			if (err) {
				var model = {
					branch: branchInput
				};
				res.locals.err = err;
				res.locals.view = 'system/branches/add';
				res.locals.model = model;
				console.log(err);
				next(); //调用下一个错误处理middlewear
			} else {
				req.flash('showMessage', '创建成功');
				res.redirect('/system/branches');
			}
		});
	});
	app.get('/system/branches/:parentId/addSub', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
		var parentId = req.params.parentId;
		Branch.findById(new ObjectId(parentId), 'name code levelId', function(err, parent) {
			if (err) {
				return next(err);
			}
			var model = {
				title: '新增机构',
				isAdmin: true,
				branch: {
					levelId: (new Number(parent.levelId) + 1).toString()
				},
				parent: {
					abbrName: parent.name + '-' + parent.code,
					code: parent.code,
					id: parent.id
				}
			};
			res.render('system/branches/addSub', model);
		});
	});

	app.post('/system/branches/:parentId/addSub', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
		var parentId = req.params.parentId;
		var parent = req.body.parent;
		parent.id = parentId;
		var branchInput = req.body.branch;
		branchInput.parent = parent.code;
		branchInput.status = '1';
		//添加其它信息省略
		//...
		BranchCounter.getNextSeq(parent.code, branchInput.levelId, function(err, nextSeq) {
			if (err) {
				next(err);
			} else {
				branchInput.code = parent.code + nextSeq;
				var branchModel = new Branch(branchInput);
				branchModel.save(function(err, branch) {
					if (err) {
						var model = {
							branch: branchInput,
							parent: parent
						};
						res.locals.err = err;
						res.locals.view = 'system/branches/addSub';
						res.locals.model = model;
						next(); //调用下一个错误处理middlewear
					} else {
						Branch.findByIdAndUpdate(new ObjectId(parentId), {
							$push: {
								subs: branch.code
							}
						}, function(err, parent) {
							if (err) {
								next(err);
							} else {
								req.flash('showMessage', '创建成功');
								res.redirect('/system/branches?parent=' + parent.parent);
							}
						});
					}
				});
			}
		});
	});

	app.get('/system/branches/:id/edit', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		Branch.findById(new ObjectId(id), function(err, branch) {
			if (err) {
				return next(err);
			}
			Branch.findOne({
				code: branch.parent
			}, 'abbrName code', function(err, parent) {
				console.log(parent);
				var model = {
					title: '编辑机构信息',
					isAdmin: true,
					branch: branch,
					parent: parent ? parent : branch,
					showMessage: req.flash('showMessage')
				};
				res.render('system/branches/edit', model);
			});
		});
	});
	app.post('/system/branches/:id/edit', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		Branch.findOne({
			_id: new ObjectId(id)
		}, function(err, branch) {
			if (!err) {
				var newBranch = req.body.branch;
				for (var o in newBranch) {
					branch[o] = newBranch[o];
				}
				branch.save(function(err, branch) {
					if (err) {
						newBranch.id = id;
						var model = {
							branch: newBranch,
							parent: {
								id: req.body.parentId,
								abbrName: req.body.parentAbbr
							}
						};
						res.locals.err = err;
						res.locals.view = 'system/branches/edit';
						res.locals.model = model;
						console.log(err);
						next(); //调用下一个错误处理middlewear
					} else {
						req.flash('showMessage', '修改成功');
						res.redirect('/system/branches/' + branch.id + '/edit');
					}
				});
			}
		});
	});
	app.get('/system/branches/:id/down', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		var id = req.params.id;
		Branch.findOne({
			_id: new ObjectId(id)
		}, function(err, branch) {
			if (err) {
				next(err)
			} else {
				var condition = {};
				condition.parent = branch.code;
				condition.levelId = (new Number(branch.levelId) + 1).toString();
				Branch.paginate(condition, page, 10, function(err, pageCount, branches) {
					var model = {
						title: '机构列表',
						isAdmin: true,
						branches: branches,
						page: page,
						pageCount: pageCount,
						showMessage: req.flash('showMessage')
					};
					res.render('system/branches/index', model);
				}, {
					sortBy: {
						code: 1
					}
				});
			}
		});
	});
	app.get('/system/branches/:id/up', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		var id = req.params.id;
		Branch.findById(new ObjectId(id), function(err, branch) {
			if (err) {
				return next(err)
			}
			Branch.findOne({
				code: branch.parent
			}, function(err, parent) {
				if (err) {
					return next(err)
				}
				res.redirect('/system/branches?parent=' + parent.parent);
			});
		});
	});

	app.get('/system/branches/return', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
		var id = req.query.id;
		console.log(id);
		Branch.findById(new ObjectId(id), 'parent', function(err, branch) {
			if (err) {
				return next(err);
			}
			res.redirect('/system/branches?parent=' + branch.parent);
		});
	});
	app.get('/system/branches/:id/delete', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
		var id = req.params.id;
		console.log(id);
		Branch.findById(new ObjectId(id), function(err, branch) {
			if (err) {
				return next(err);
			}
			//从parent的subs中删掉
			Branch.findOneAndUpdate({
				code: branch.parent
			}, {
				$pull: {
					subs: branch.code
				}
			}, function(err, parent) {
				if (err) {
					return next(err);
				}
				//删除子节点
				Branch.remove({
					code: new RegExp('^' + branch.code)
				}, function(err) {
					if (err) {
						return next(err);
					}
					//删除自身
					branch.remove(function(err) {
						if (err) {
							return next(err);
						}
						res.json({
							message: 'OK'
						});
					});
				});
			});
		});
	});


	app.get('/system/branches/getBranches', auth.isAuthenticated('ROLE_ADMIN, ROLE_BRANCH_ADMIN'), function(req, res, next) {
		var level = req.query.level;
		var parent = req.query.parent;
		var condition = {};
		if (level) {
			condition.levelId = level;
		}
		if (parent) {
			condition.parent = parent;
		}
		auth.branchCondition(condition, req.user, 'code');
		Branch.find(condition).
		select('code name').
		sort('code').
		exec(function(err, branches) {
			if (err) {
				return next(err);
			}
			res.json({
				message: 'ok',
				branches: branches
			});
		});
	});
};