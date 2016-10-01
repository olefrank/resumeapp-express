"use strict";

const baseUrl = require('../../config/app.config').urls.base;


// route middleware: make sure user is logged in
module.exports = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect(`${baseUrl}/login`);
};
