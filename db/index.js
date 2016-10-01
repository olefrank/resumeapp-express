"use strict";

const config = require('../config/db.config');
const models = require('../models');
const mongoose = require('mongoose');
const Promise = require('bluebird');
const strings = require('../data/strings');
const customError = require('../routes/custom-error');


// connect to database
mongoose.connect(config.url, function(err) {
    if (err) {
        msg = strings.messages.db_connection_error.da;
        return next(new customError(msg, 500));
    }
});


// get all resume data
exports.getResume = function() {
    return Promise
        .all([
            models.education.find({}),
            models.experience.find({}),
            models.language.find({}),
            models.project.find({}),
            models.skill.find({}),
            models.volounteering.find({}),
            models.profile.findOne({})
        ])
        .spread(function(education, experience, language, project, skill, volounteering, profile) {
            return {
                volounteering   : volounteering,
                education       : education,
                experience      : experience,
                language        : language,
                project         : project,
                skill           : skill,
                profile         : profile
            };
        });
};

exports.save = function(element) {
    let msg;
    return new Promise(function(resolve, reject) {
        element.save(function (err) {
            if (err) {
                msg = strings.messages.something_went_wrong.da;
                reject(msg);
            }
            else {
                msg = strings.messages.save_successful.da;
                resolve(msg);
            }
        });
    });
};

exports.delete = function(model, id) {
    let msg;
    return new Promise(function(resolve, reject) {
        model.findByIdAndRemove(id, function (err) {
            if (err) {
                msg = strings.messages.id_not_found.da;
                console.log("i reject", err);
                reject(msg);
            }
            else {
                msg = strings.messages.delete_successful.da;
                console.log("i resolve", msg);
                resolve(msg);
            }
        });
    });
};