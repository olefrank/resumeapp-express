const express = require('express'),
      router = express.Router();

module.exports = function(passport) {

    router.use('/', require('./resume'));
    router.use('/login', require('./login')(passport));
    router.use('/logout', require('./logout'));
    router.use('/admin', require('./admin'));
    router.use('/lang', require('./lang'));
    router.use('/templates', require('./templates'));

    return router

};
