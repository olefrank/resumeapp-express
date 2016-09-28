"use strict";

const appconfig = require('./config/app.config');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const moment = require('moment');
require('moment/locale/da');
const mongoose = require('mongoose');
const passport = require('passport');
const flash    = require('connect-flash');
const toastr    = require('express-toastr');
const morgan       = require('morgan');
const session      = require('express-session');
const configDB = require('./config/database.js');
const app = express();

// connect to our database
mongoose.connect(configDB.url);

// pass passport for configuration
require('./config/passport')(passport);

// to use moment in templates
app.locals.moment = moment;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// static routes
app.use('/lib/bootstrap', express.static(path.join(__dirname,'/node_modules/bootstrap/dist/')));
app.use('/lib/jquery', express.static(path.join(__dirname,'/node_modules/jquery/dist')));
app.use('/lib/font-awesome', express.static(path.join(__dirname,'/node_modules/font-awesome/')));
app.use('/lib/moment', express.static(path.join(__dirname,'/node_modules/moment/')));
app.use('/lib/toastr', express.static(path.join(__dirname,'/node_modules/toastr/build/')));

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// required for passport
app.use(session({ secret: appconfig.session.secret })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());


require('./routes/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});

//// development error handler
//// will print stacktrace
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.send(err.message);
//    //res.render('error', {
//    //  message: err.message,
//    //  error: err
//    //});
//  });
//}
//
//// production error handler
//// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//  res.status(err.status || 500);
//  res.send(err.message);
//  //res.render('error', {
//  //  message: err.message,
//  //  error: {}
//  //});
//});


module.exports = app;
