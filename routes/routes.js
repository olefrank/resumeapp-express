
//var home = require('./routes/index');
//app.use('/', home);

//var express = require('express');
//var router = express.Router();
var scrape = require('../data/scrapes');

module.exports = function(app, passport) {



    // =====================================
    // HOME PAGE (with login links) ========
    // =====================================
    app.get('/', function(req, res, next) {
        res.render('index', { title: 'Express', scrape: scrape, user: req.user });
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



    // ofj: comment in to be able to create users in db
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



    // ofj todo
    // =====================================
    // LOGOUT ==============================
    // =====================================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};



// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}