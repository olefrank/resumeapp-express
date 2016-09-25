'use strict';

//var home = require('./routes/index');
//app.use('/', home);

//var express = require('express');
//var router = express.Router();


var resume = require('../data/old/resume');
const strings = require('../data/strings');
const appconfig = require('../config/app.config');
const traverse = require('traverse');
const async = require('async');
const CustomError = require('./custom-error');
const $ = require('jquery');

// models
let education = require('../models/education');
let experience = require('../models/experience');
let language = require('../models/language');
let project = require('../models/project');
let skill = require('../models/skill');
let volounteering = require('../models/volounteering');
let profile = require('../models/profile');


module.exports = function(app, passport) {

    // =====================================
    // HOME PAGE ===========================
    // =====================================
    app.get('/', function(req, res, next) {
        var lang = req.cookies[appconfig.cookies.locale.name] || 'da';

        async.parallel({
            education: function(cb) {
                education.find({}, cb);
            },
            experience: function(cb) {
                experience.find({}, cb);
            },
            language: function(cb) {
                language.find({}, cb);
            },
            project: function(cb) {
                project.find({}, cb);
            },
            skill: function(cb) {
                skill.find({}, cb);
            },
            volounteering: function(cb) {
                volounteering.find({}, cb);
            },
            profile: function(cb) {
                profile.findOne({}, cb);
            }
        }, function(err, results) {
            if (err) {
                console.log(err);
            }

            // convert to json
            var json = JSON.parse(JSON.stringify(results));
            // filter current language
            var filtered = filterLanguage(lang, json);
            // render in template
            res.render('index', {
                educations       : filtered.education,
                experiences      : filtered.experience,
                languages        : filtered.language,
                projects         : filtered.project,
                skills           : filtered.skill,
                volounteerings   : filtered.volounteering,
                profile          : filtered.profile,
                strings          : filterLanguage(lang, strings),
                user             : req.user
            });
        });
    });



    // =====================================
    // ADMIN (protected) ===================
    // =====================================
    app.get('/admin', isLoggedIn, function(req, res) {

        async.parallel({
            education: function(cb){
                education.find({}, cb);
            },
            experience: function(cb){
                experience.find({}, cb);
            },
            language: function(cb){
                language.find({}, cb);
            },
            project: function(cb){
                project.find({}, cb);
            },
            skill: function(cb){
                skill.find({}, cb);
            },
            volounteering: function(cb){
                volounteering.find({}, cb);
            },
            profile: function(cb){
                profile.find({}, cb);
            }
        }, function(err, results){
            if (err) {
                console.log(err);
            }

            res.render('admin', {
                educations      : results.education,
                experiences     : results.experience,
                languages       : results.language,
                projects        : results.project,
                skills          : results.skill,
                volounteerings  : results.volounteering,
                profile         : results.profile[0],
                strings         : strings,
                user            : req.user,
                isAdmin         : true
            });
        });
    });



    app.post('/admin', isLoggedIn, function(req, res) {
        var msg;
        var data = req.body;
        var section = data.section || "";
        var _id = data._id;

        if (!section || !_id) {
            msg = "Oops! Section and/or _id is undefined";
            return next(new CustomError(msg, 500));
        }

        // get model
        var model = getModelForSection(section);

        // find
        model.findById(_id, function(err, result) {
            if (err) {
                msg = "Oops! Item (id:' + _id + ') not found ...";
                return next(new CustomError(msg, 500));
            }

            // update
            if (result) {
                Object.keys(data).forEach(function(key) {
                    result[key] = data[key];
                });
            }

            // save
            result.save(function(err) {
                if (err) {
                    msg = "Oops! Something went wrong...";
                    console.log(err); // ofj: use proper logger
                    return next(new CustomError(msg, 500));
                }
                msg = "Document sucessfully updated";
                console.log(msg); // ofj: use proper logger
                return next(new CustomError(msg, 200));
            });
        });
    });




    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
        res.render('login', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/admin',
        failureRedirect : '/login',
        failureFlash : true
    }));





    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });





    // =====================================
    // LANG (only used to switch language) =
    // =====================================
    app.get('/lang/:lang', function(req, res) {
        var lang = req.params.lang;
        if (lang === 'da' || lang === 'en') {
            var cookieName = req.cookies[appconfig.cookies.locale.name];

            if (cookieName !== lang) {
                res.cookie(appconfig.cookies.locale.name, lang, { expires: new Date(Date.now() + (1000 * 60 * 60 * 24 * 24) ) });
            }
        }
        // redirect back
        res.redirect('back');
    });





    // =====================================
    // SIGNUP ==============================
    // =====================================
    // show the signup form
    //app.get('/signup', function(req, res) {
    //
    //    // render the page and pass in any flash data if it exists
    //    res.render('/', { message: req.flash('signupMessage') });
    //});
    //
    //// process the signup form
    // ofj: uncomment this to be able to create users in db
    //app.post('/signup', passport.authenticate('local-signup', {
    //    successRedirect : '/login', // redirect to the secure profile section
    //    failureRedirect : '/login', // redirect back to the signup page if there is an error
    //    failureFlash : true // allow flash messages
    //}));
};


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/login');
}


function getModelForSection(section) {
    var model;
    switch (section) {
        case "profile":
            model = profile;
            break;
        case "experience":
            model = experience;
            break;
        case "education":
            model = education;
            break;
        case "language":
            model = language;
            break;
        case "project":
            model = project;
            break;
        case "skill":
            model = skill;
            break;
        case "volounteering":
            model = volounteering;
            break;
        default:
            model = null;
    }
    return model;
}


// filter json obj by language
var filterLanguage = function(language, obj) {
    return traverse(obj).map(function (item) {
        if (this.key === language) {
            this.parent.update(item + "");
        }
    });
};
