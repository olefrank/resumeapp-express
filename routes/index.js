const express = require('express'),
      router = express.Router(),
      baseUrl = require('../config/app.config').urls.base;

module.exports = function(passport) {

    router.use('/', require('./root'));
    router.use(baseUrl, require('./resume'));
    router.use(`${baseUrl}/login`, require('./login')(passport));
    router.use(`${baseUrl}/logout`, require('./logout'));
    router.use(`${baseUrl}/admin`, require('./admin'));
    router.use(`${baseUrl}/lang`, require('./lang'));
    router.use(`${baseUrl}/templates`, require('./templates'));

    return router

};
