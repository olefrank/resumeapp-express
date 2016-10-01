const express = require('express');
const router = express.Router();
const baseUrl = require('../config/app.config').urls.base;


router.get('/', function (req, res, next) {
    res.redirect(baseUrl);
});

module.exports = router;
