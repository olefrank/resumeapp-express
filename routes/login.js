const express = require('express'),
      router = express.Router(),
      config = require('../config/app.config');

module.exports = function(passport) {

    router.get('/', function (req, res) {
        res.render('login', {message: req.flash('loginMessage')});
    });

    router.post('/', passport.authenticate('local-login', {
        successRedirect: `/admin`,
        failureRedirect: `/login`,
        failureFlash: true
    }));

    return router;
};
