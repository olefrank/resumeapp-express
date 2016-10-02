"use strict";

const appconfig     = require('./config/app.config');
const express       = require('express');
const path          = require('path');
const favicon       = require('serve-favicon');
const cookieParser  = require('cookie-parser');
const bodyParser    = require('body-parser');
const passport      = require('passport');
const flash         = require('connect-flash');
const toastr        = require('express-toastr');
const morgan        = require('morgan');
const session       = require('express-session');
const moment        = require('moment');
const cacheBust     = require('cache-busted');
const app           = express();

// cache buster
cacheBust.handler(app);



// set moment locale 'danish'
require('moment/locale/da');


// make variables available in templates
app.locals.moment = moment;
app.locals.config = {
    baseUrl: appconfig.urls.base,
    colors: appconfig.colors
};


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');


// static routes
app.use('/lib/bootstrap', express.static(path.join(__dirname,'/node_modules/bootstrap/dist/')));
app.use('/lib/jquery', express.static(path.join(__dirname,'/node_modules/jquery/dist')));
app.use('/lib/font-awesome', express.static(path.join(__dirname,'/node_modules/font-awesome/')));
app.use('/lib/moment', express.static(path.join(__dirname,'/node_modules/moment/')));
app.use('/lib/toastr', express.static(path.join(__dirname,'/node_modules/toastr/build/')));


app.use(favicon(path.join(__dirname, 'public/images', 'favicon.ico')));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// passport and session (required)
require('./config/passport')(passport);
app.use(session({ secret: appconfig.session.secret })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash());


// routes
app.use(require('./routes')(passport));


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


module.exports = app;
