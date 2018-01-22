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
	var data = log.save(req, 'paper')
	var dback = log.common(req, data);
	dback.title='导入';
	dback.menus = globals.menus;
	res.render('import',dback);
});

module.exports = router;
