'use strict';
module.exports = function () {
    return function (req, res, next) {
        if (req.session.theme) {
            res.locals.theme = req.session.theme;
        } else {
            res.locals.theme = '';
        }
        
        next();
    };
};