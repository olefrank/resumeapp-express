const express = require('express'),
      router = express.Router(),
      config = require('../config/app.config'),
      baseUrl = config.urls.base;

module.exports = function(passport) {

    router.get('/', function (req, res) {
        res.render('login', {message: req.flash('loginMessage'), baseUrl: baseUrl});
    });

    router.post('/', passport.authenticate('local-login', {
        successRedirect: `${baseUrl}/admin`,
        failureRedirect: `${baseUrl}/login`,
        failureFlash: true
    }));

    return router;
};
