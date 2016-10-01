"use strict"

const express = require('express'),
      router = express.Router(),
      db = require('../db'),
      strings = require('../data/strings'),
      isLoggedIn = require('./middleware/isLoggedIn'),
      isAuthorized = require('./middleware/isAuthorized'),
      updateSchema = require('./helpers/updateSchema'),
      CustomError = require('./custom-error'),
      models = require('../models');


router.get('/', isLoggedIn, function (req, res, next) {

    db.getResume()
        .then(function(data) {

            // render in template
            res.render('admin', {
                educations      : data.education,
                experiences     : data.experience,
                languages       : data.language,
                projects        : data.project,
                skills          : data.skill,
                volounteerings  : data.volounteering,
                profile         : data.profile,
                strings         : strings,
                user            : req.user
            });
        })

        // ofj: todo error handling
        .catch(function(err) {
            console.log(err);
        });
});

router.put('/', [isLoggedIn, isAuthorized], function (req, res, next) {
    let msg;
    const data = req.body;
    const section = data.section;
    const _id = data._id;

    if (!section || !_id) {
        msg = strings.messages.id_undefined.da;
        return next(new CustomError(msg, 500));
    }

    // get model
    const model = models[section];

    // find
    model.findById(_id, function (err, result) {
        if (err) {
            msg = strings.messages.id_not_found.da;
            return next(new CustomError(msg, 500));
        }

        // update
        if (result) {
            Object.keys(data).forEach(function (key) {
                result[key] = data[key];
            });
        }

        // save
        result.save(function (err) {
            if (err) {
                msg = strings.messages.something_went_wrong.da;
                console.log(err); // ofj: use proper logger
                return next(new CustomError(msg, 500));
            }
            msg = strings.messages.save_successful.da;
            return next(new CustomError(msg, 200));
        });
    });
});

router.post('/', [isLoggedIn, isAuthorized], function (req, res, next) {
    let msg;
    const data = req.body;
    const section = data.section;

    if (!section) {
        msg = strings.messages.id_undefined.da;
        return next(new CustomError(msg, 500));
    }

    // get model
    const schema = models[section];
    const updated = updateSchema(schema, data);

    // save in db
    db.save(updated)
        .then(function(data) {
            return next(new CustomError(data, 200));
        })
        .catch(function(err) {
            console.log(err); // ofj: use proper logger
            return next(new CustomError(err, 500));
        });
});

router.delete('/', [isLoggedIn, isAuthorized], function (req, res, next) {
    let msg;
    const data = req.body;
    const section = data.section;
    const _id = data._id;

    if (!section || !_id) {
        msg = strings.messages.id_undefined.da;
        return next(new CustomError(msg, 500));
    }

    // get model
    const model = models[section];

    // delete in db
    db.delete(model, _id)
        .then(function(data) {
            console.log("i then", data);
            return next(new CustomError(data, 200));
        })
        .catch(function(err) {
            console.log("i catch", err);
            console.log(err); // ofj: use proper logger
            return next(new CustomError(err, 500));
        });
});

module.exports = router;
