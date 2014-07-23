'use strict';

var cluster = require('cluster');
var os = require('os');
var numCPUs = os.cpus().length;

//if (cluster.isMaster) {
//	for ( var i = 0; i < numCPUs; i++) {
//		cluster.fork();
//	}
//	cluster.on('death', function(worker) {
//		console.log('Worker ' + worker.pid + ' died.');
//	});
//} else {
	var kraken = require('kraken-js'),
		db = require('./lib/database'),
	    passport = require('passport'),
	    auth = require('./lib/auth'),
	    flash = require('connect-flash'),
	    User = require('./models/system/User'),
	    errorMessages = require('./lib/middlewear/errorMessages'),
	    _app = {};
	var showMenuMiddleware = require('./lib/middlewear/showMenu');
	var specialization = require('./lib/middlewear/specialization');
	require('./lib/helper-dateFormat');
	require('./lib/helper-baseCode');
	require('./lib/helper-security');
	_app.configure = function configure(nconf, next) {
	    // Async method run on startup.
		// Configure the database
		db.config(nconf.get('databaseConfig'));
		passport.use('local-signup', auth.localSignup());
		passport.use('local-login', auth.localStrategy());
		
		// used to serialize the user for the session
		passport.serializeUser(function(user, done) {
			done(null, user.id);
		});
		// used to deserialize the user
		passport.deserializeUser(function(id, done) {
			User.findById(id, function(err, user) {
				done(err, user);
			});
		});
	    next(null);
	};
	
	
	_app.requestStart = function requestStart(app) {
		//app.use(errorMessages());
	};
	_app.requestBeforeRoute = function requestBeforeRoute(app) {
	    // Run before any routes have been added.
		app.use(passport.initialize());  //Use Passport for authentication
		app.use(passport.session());     //Persist the user in the session
		app.use(flash());                //Use flash for saving/retrieving error messages for the user
		app.use(specialization());
		app.use(auth.injectUser);        //Inject the authenticated user into the response context
		app.use(showMenuMiddleware());   //用于确定该显示什么菜单
	};
	
	
	_app.requestAfterRoute = function requestAfterRoute(app) {
		app.use(errorMessages());
	};
	
	
	if (require.main === module) {
	    kraken.create(_app).listen(function (err, server) {
	        if (err) {
	            console.error(err.stack);
	        }
	        //global.socketio = require('socket.io').listen(server);
	    	//var SIO = require('./lib/sio');
	    	//var sio = SIO.createNew();
	    	//sio.init(global.socketio);
	    });   
	}
//}
//module.exports = _app;
