const express = require('express'),
      router = express.Router(),
      config = require('../config/app.config');

module.exports = function(passport) {

    router.post('/', passport.authenticate('local-signup', {
        successRedirect: '/login',
        failureRedirect: '/',
        failureFlash: false
    }));

    return router;
};
