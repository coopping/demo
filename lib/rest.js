"use strict";
var extend = require('util')._extend;
var nconf = require('nconf');
var apiServerConfig = nconf.get("apiServer");
var parentOptions = {
	host : apiServerConfig.host,
	port : apiServerConfig.port,
	//path : '/apis/books?format=json',
	//method : 'GET',
	headers : {
		'accept' : '*/*',
		'content-type' : "application/json"
	}
};
exports.getOption = function(path, method) {
	var option = extend({}, parentOptions);
	option.path = path;
	option.method = method;
	return option;
};