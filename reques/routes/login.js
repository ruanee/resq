var express = require('express');
var router = express.Router();
var log = require('./log.js');
const globals = require('../globals');
const db = require('../db')
const crypto = require('crypto');

router.get('/', function(req, res, next) {
	res.render('login', { title: '登录' });
});
router.get('/logout', function(req, res, next) {
	console.log('==========================> logout');
	req.session.destroy();
	res.redirect('/login');
});
router.post('/', function(req, res, next) {
	var uname = req.body.username;
	const hash = crypto.createHmac('sha256', req.body.password).update('miaomiao').digest('hex');
	console.log(hash);
	if(uname && globals.userData && globals.userData[uname] && globals.userData[uname]["password"] == hash) {
		req.session.user = uname;
		req.session.sessionId=log.guid();
		res.render('index', {username:uname, message:"successfully"});
		return;
	}
	res.render('login', { title: '登录', message:"用户名或者密码错误!"});
});
module.exports = router;