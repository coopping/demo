"use strict";
var Socket = require('../models/Socket');

var RedisStore = require('socket.io/lib/stores/redis')
	, redis  = require('socket.io/node_modules/redis')
	, pub    = redis.createClient()
	, sub    = redis.createClient()
	, client = redis.createClient()
	, nconf = require('nconf');;
var utils = require('express/node_modules/connect/lib/utils.js');
var cookie = require('express/node_modules/cookie');

var SIO = {
		createNew: function(){
			var _sio = {};
			_sio.init = function(sio) {
				_sio._io = sio;
				sio.configure(function() {
					// sio.enable('browser client minification'); // send
					// minified client
					// sio.enable('browser client etag'); // apply etag caching
					// logic based on version number
					// sio.enable('browser client gzip'); // gzip the file
					sio.set('log level', 1);                    // reduce
																// logging

					// enable all transports (optional if you want flashsocket
					// support, please note that some hosting
					// providers do not allow you to create servers that listen
					// on a port different than 80 or their
					// default port)
					sio.set('transports', ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling']);
					// sio.set('store', store);
					sio.set('store', new RedisStore({
						redisPub : pub
						, redisSub : sub
						, redisClient : client
					}));
					sio.set('authorization', function(data, accept) {
						// check if there's a cookie header
						var cookies = data.headers.cookie;
						
						if (cookies) {
							cookies = cookie.parse(cookies);
							cookies = utils.parseSignedCookies(cookies, nconf.get("middleware").session.secret);
							cookies = utils.parseJSONCookies(cookies);
							data.sessionID = cookies['express.sid'];
						} else {
							// if there isn't, turn down the connection with a
							// message
							// and leave the function.
							return accept('No cookie transmitted.', false);
						}
						// accept the incoming connection
						accept(null, true);
					});
				});
				sio.sockets.on('connection', function(socket) {
					var sid = socket.handshake.sessionID;
					Socket.remove({"sid" : sid}, function(){
						Socket.create({
							socketID : socket.id,
							sid : socket.handshake.sessionID
						}, function(err) {
							if (err) {
								console.log('socket save error! ');
							}
						});
						console.log('A socket with sessionID:%s socketid:%s  connected!', socket.handshake.sessionID, socket.id);
					});
					socket.on('disconnect', function () {
						Socket.remove({"sid" : socket.handshake.sessionID}, function() {
							console.log('socket closed');
						});
				    });
				});
			};
			_sio.io = function() {
				return _sio._io;
			};
			return _sio;
		}
};

module.exports = SIO;
