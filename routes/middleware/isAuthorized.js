"use strict";

const strings = require('../../data/strings');
const CustomError = require('../custom-error');


// route middleware: make sure user is permitted to perform action
module.exports = function(req, res, next) {
    // guest user not permitted
    if (req.user && req.user.local.role === 'guest') {
        var msg = strings.messages.not_allowed.da;
        return next(new CustomError(msg, 403));
    }
    else return next();
};
