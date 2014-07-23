"use strict";
var http = require('http');
var rest = require('../lib/rest');
var nconf = require('nconf');
var pagination = nconf.get('pagination');
var Provider = require('../models/product/Provider');
module.exports = function(app) {
	app.get('/books', function(req, res, next) {
		var page = 1;
		if (req.query.page) {
			page = req.query.page;
		}
		console.log(page);
		var options = rest.getOption('/apis/book?format=json' + '&offset=' + (page - 1) * 2 + '&max=2', 'GET');
		var result = '';
		var req = http.request(options, function(response) {
			//console.log('STATUS: ' + res.statusCode);
			//console.log('HEADERS: ' + JSON.stringify(res.headers));
			response.setEncoding('utf8');
			response.on('data', function(chunk) {
				result = result + chunk;
			});
			response.on('end', function() {
				var resultObject = JSON.parse(result);
				var model = {
					title: '书目',
					books: resultObject.books,
					page: page,
					pageCount: resultObject.total / 2 + resultObject.total % 2
				};
				res.render('books/index', model);
			});
		});

		// write data to request body
		req.end();
	});
	app.post('/books/create', function(req, res, nex) {
		var book = req.body.book;
		var result = '';
		var options = rest.getOption('/apis/book?format=json', 'POST');
		var req = http.request(options, function(response) {
			//console.log('HEADERS: ' + JSON.stringify(response.headers));
			response.on('data', function(chunk) {
				result = result + chunk;
			});
			response.on('end', function() {
				res.redirect('/books');
			});
		});
		// write data to request body
		req.write(JSON.stringify(book));
		req.end();
	});

	app.post('/books/query', function(req, res, nex) {
		var page = 1;

		var book = req.body.book;
		if (book.title) {
			var result = '';
			var options = rest.getOption('/apis/book/findByTitle?format=json', 'POST');
			var req = http.request(options, function(response) {
				//console.log('HEADERS: ' + JSON.stringify(response.headers));
				response.on('data', function(chunk) {
					result = result + chunk;
				});
				response.on('end', function() {
					var books = JSON.parse(result);
					var model = {
						title: '书目',
						book: book,
						books: books
					};
					res.render('books/index', model);
				});
			});
			// write data to request body
			req.write(JSON.stringify(book));
			req.end();
		} else {
			res.redirect('/books');
		}

	});
};