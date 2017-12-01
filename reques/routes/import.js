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
	res.render('import', {
		title : '导入'
	});
});

module.exports = router;
