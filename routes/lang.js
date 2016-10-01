const express = require('express'),
      router = express.Router(),
      config = require('../config/app.config'),
      cookie = config.cookies.locale.name;

router.get('/:lang', function (req, res) {
    var lang = req.params.lang;

    if (lang === 'da' || lang === 'en') {
        var cookieName = req.cookies[cookie];

        if (cookieName !== lang) {
            res.cookie(cookie, lang, {expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 24))});
        }
    }
    // redirect back
    res.redirect('back');
});

module.exports = router;