var express = require('express');
var router = express.Router();
var log = require('./log.js');
const globals = require('../globals');
const db = require('../db')

router.get('/', function(req, res, next) {
	res.render('login', { title: '登录' });
});
router.post('/', function(req, res, next) {
	console.log("username==============>" + req.body.username);
	if(req.body.username && globals.users[req.body.username] && globals.users[req.body.username] == req.body.password) {
		req.session.user = req.body.username;
		res.render('index', {username:req.body.username, message:"successfully"});
	}
	res.render('login', { title: '登录', message:"Failed"});
});
module.exports = router;
