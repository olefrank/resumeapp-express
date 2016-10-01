const express = require('express'),
      router = express.Router(),
      db = require('../db'),
      strings = require('../data/strings'),
      cookie = require('../config/app.config').cookies.locale.name,
      filterLanguage = require('./helpers/filterLanguage');


router.get('/', function (req, res, next) {
    var lang = req.cookies[cookie] || 'da';

    db.getResume()
        .then(function(data) {
            // convert to json
            var json = JSON.parse(JSON.stringify(data));

            // filter current language
            var filtered = filterLanguage(lang, json);

            // render in template
            res.render('index', {
                educations      : filtered.education,
                experiences     : filtered.experience,
                languages       : filtered.language,
                projects        : filtered.project,
                skills          : filtered.skill,
                volounteerings  : filtered.volounteering,
                profile         : filtered.profile,
                strings         : filterLanguage(lang, strings),
                user            : req.user
            });
        })

        // ofj: todo error handling
        .catch(function(err) {
            console.log(err);
        });
});


module.exports = router;
