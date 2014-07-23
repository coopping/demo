"use strict";
var Tool = require('../models/Tool'),
	auth = require('../lib/auth');

var formidable = require('kraken-js/node_modules/formidable');
var pt = require('path');
var fs = require('fs');
var join = pt.join;
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var nconf = require('nconf');
var dir = nconf.get("uploadDir"); 
module.exports = function (app) {
	
	app.get('/tools', function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		Tool.paginate({}, page, 10, function(err, pageCount, tools) {
			if (err) {
				return next(err);
			}
			//console.log('pageCount:%s', pageCount);
			var model = {
					title : '工具',
					tools : tools,
					page : page,
					isAdmin : function() {
						return null;
					},
					pageCount : pageCount
				};
			if (req.user && req.user.role === 'admin') {
				model.isAdmin = true;
			} else {
				model.isAdmin = false;
			}
			
			res.render('tools/index', model);
		});
	});
	
	app.get('/upload', auth.isAuthenticated('admin'), function(req, res) {
		res.render('tools/upload', {
			title : '上载',
			edit : 'false',
			host : req.headers.proxy_host?req.headers.proxy_host:req.headers.host
		});
	});
	app.post('/upload', auth.isAuthenticated('admin'), function(req, res, next) {
		// var file = req.files.tool.file;
		// var name = req.body.tool.name || file.name;
		// var type = req.body.tool.type;
		// var path = join(dir, file.name);
		// console.log(path);
		var file = req.files['tool[file]'];
		var name = req.body['tool[name]'] || file.name;
		var type = req.body['tool[type]'];
		var path = join(dir, file.name);
		// console.log(util.inspect({fields: fields, files: files}));
		var describe = req.body['tool[describe]'];
		// console.log('describe:%s', describe);
		fs.rename(file.path, path, function(err) {
			if (err) {
				return next(err);
			}
			Tool.create({
				name : name,
				type : type,
				path : file.name,
				describe : describe
			}, function(err) {
				if (err) {
					return next(err);
				}
				var host = req.headers.proxy_host?req.headers.proxy_host:req.headers.host;
				console.log(host);
				res.redirect('http://' + host + '/tools');
			});
		});
	});
	
	app.get('/tool/:id/download', function(req, res, next) {
		var id = req.params.id;
		Tool.findById(new ObjectId(id), function(err, tool) {
			if (err) {
				return next(err);
			}
			var path = join(dir, encodeURIComponent(tool.path));
			var filename = pt.resolve(path);
			var userAgent = (req.headers['user-agent']||'').toLowerCase();
			if (userAgent.indexOf('firefox') >= 0) {
				path = join(dir, tool.path);
				filename = pt.resolve(path);
				res.setHeader('Content-Disposition', 'attachment; filename*="utf8\'\'' + new Buffer(tool.name).toString('base64') + '"');
			} else {
				res.setHeader('Content-Disposition', 'attachment;filename="' + new Buffer(tool.name).toString('binary') + '"');
			}
			res.download(filename);
		});
	});
};