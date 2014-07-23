'use strict';


var passport = require('passport');
var auth = require('../lib/auth');
var dustHelper = require('../lib/dustHelper');
module.exports = function(app) {

	app.get('/', auth.isAuthenticated(), function(req, res) {
		res.render('index', {
			title: '慧宝科技'
		});
	});

	app.get('/login', function(req, res) {
		res.render('login', {
			title: '请登陆',
			message: req.flash('error')
		});
	});
	app.post('/login', function(req, res) {

		passport.authenticate('local-login', {
			successRedirect: req.session.goingTo || '/',
			failureRedirect: '/login',
			failureFlash: true
		})(req, res);

	});


	app.get('/logout', auth.isAuthenticated(), function(req, res) {
		req.logout();
		req.session.roleMenuTree = null;
		res.redirect('/');
	});

	app.get('/theme/:theme', auth.isAuthenticated(), function(req, res) {
		req.session.theme = req.params.theme;
		res.redirect('/');
	});

	app.get('/createStatic', function(req, res, next) {
		dustHelper.render(res, 'index', {}, function(err, html) {
			if (err) {
				return next(err);
			}
			console.log(html);
			res.render('system/branches/index');
		});
	})
};