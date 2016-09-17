var express = require('express');
var router = express.Router();
var resume = require('../data/resume');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', resume: resume });
});

module.exports = router;
