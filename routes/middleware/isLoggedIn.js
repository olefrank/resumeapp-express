"use strict";

// route middleware: make sure user is logged in
module.exports = function(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
};
