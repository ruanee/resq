var express = require('express');
var router = express.Router();
var log = require('./log.js');
const globals = require('../globals');

/* GET home page. */
router.get('/', function(req, res, next) {
  log.save(req, 'home')
  res.render('index', { title: '刷题测试' });
});

module.exports = router;
