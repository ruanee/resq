var express = require('express');
var router = express.Router();
var log = require('./log.js');
const globals = require('../globals');
const db = require('../db')
var fs = require('fs'),
    path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
	// console.log(data)
	var dback = log.common(req);
	dback.title='导入';
	res.render('import',dback);
});

module.exports = router;
