"use strict";
(function(dust) {

    //Create a helper called 'formatDate'
    dust.helpers.security = function(chunk, context, bodies, params) {

        //Retrieve the date value from the template parameters.
        var user = dust.helpers.tap(params.user, chunk, context);
        var roles = dust.helpers.tap(params.roles, chunk, context);
        var allowed = dust.helpers.tap(params.allowed, chunk, context);
        var branches = dust.helpers.tap(params.branches, chunk, context);
        var body = bodies.block;
        //Parse the date object using MomentJS
        allowed = allowed.replace(/ /g, '');
        var wanted = allowed.split(',');
        for (var i = 0, l = wanted.length; i < l; i ++) {
            if (roles.indexOf(wanted[i]) >= 0) {
                return body(chunk, context);
            }
        }
        return chunk;
    };

})(typeof exports !== 'undefined' ? module.exports = require('dustjs-helpers') : dust);