
//var home = require('./routes/index');
//app.use('/', home);

//var express = require('express');
//var router = express.Router();
var resume = require('../data/resume');
var strings = require('../data/strings');
const appconfig = require('../config/app.config');
const traverse = require('traverse');


module.exports = function(app, passport) {


    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res, next) {
        var lang = req.cookies[appconfig.cookies.locale.name] || 'da';
        res.render('index', {
            title: 'Express',
            resume: filterLanguage(lang, resume),
            strings: filterLanguage(lang, strings),
            user: req.user
        });
    });



    // =====================================
    // LOGIN ===============================
    // =====================================
    // show the login form
    app.get('/login', function(req, res) {
        // render the page and pass in any flash data if it exists
        res.render('login', { message: req.flash('loginMessage') });
    });

    // process the login form
    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/admin', // redirect to the secure profile section
        failureRedirect : '/login', // redirect back to the signup page if there is an error
        failureFlash : true // allow flash messages
    }));



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



    // =====================================
    // PROFILE SECTION =====================
    // =====================================
    // we will want this protected so you have to be logged in to visit
    // we will use route middleware to verify this (the isLoggedIn function)
    app.get('/admin', isLoggedIn, function(req, res) {
        res.render('admin', {
            user : req.user // get the user out of session and pass to template
        });
    });



    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

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

};



// filter json obj by language
var filterLanguage = function(language, obj) {
    return traverse(obj).map(function (item) {
        if (this.key === language) {
            this.parent.update(item);
        }
    });
};



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/login');
}
