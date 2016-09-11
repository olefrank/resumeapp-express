var express = require('express');
var router = express.Router();
var scrape = require('../data/scrapes');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', scrape: scrape });
});

module.exports = router;
