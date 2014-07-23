"use strict";
var dust = require('adaro');
var pt = require('path');
var fs = require('fs');
var join = pt.join;
var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;

exports.render = function(res, template, renderData, cb) {
    res.render(template, renderData, function(err, html) {
        if (err) return cb(err);
        var name = new ObjectId();
        var file = join(__dirname + '/../public/html', name.toString() + '.html' );
        fs.writeFile(file, html,  function(err) {
            if (err) return cb(err);
            cb(null, pt.relative(__dirname + '/../public', file));
        });
    })
};