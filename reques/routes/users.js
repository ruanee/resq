var express = require('express');
var router = express.Router();
const db = require('../db')
const crypto = require('crypto');
const globals = require('../globals');
var log = require('./log.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
	var data = log.save(req, 'user')
	db.query2("select row_number() OVER(ORDER BY user_name) seq,user_name username,status,to_char(mod_date,'yyyy-MM-dd') mod_date from public.users where active='T' ", [], function(error, rows) {
		res.render('users', { title: 'Users' , rows: rows});
	})
//	res.sendFile('weiui.html')
});
router.get('/show', function(req, res, next) {
	var data = log.save(req, 'user')
	if(!data.id || data.id.trim() == '') {
		res.redirect('/login');
		return;
	}
	db.query2("select user_name username,status,to_char(mod_date,'yyyy-MM-dd') mod_date from public.users where id =$1 ", [data.id], function(error, rows) {
		if(rows.length == 0) {
			res.redirect('/login');
			return;
		}
		res.render('user', { title: 'Profile' , username: rows[0].username, status: rows[0].status });
	})
//	res.sendFile('weiui.html')
});
router.get('/new', function(req, res, next) {
	var data = log.save(req, 'user')
	res.render('user', { title: 'Profile' });
});
router.get('/reset', function(req, res, next) {
	globals.userData=null;
	res.jsonp({message: "Users are reset"});
});
router.post('/new', function(req, res, next) {
	var data = log.save(req, 'user')
	console.log(data.password);
	console.log(crypto.createHmac('sha256', data.password).update(globals.hashKey).digest('hex'));
	var dback = {title: 'Profile'};
	if(!data.captcha || !req.session.captcha || (data.captcha.toLowerCase() != req.session.captcha.toLowerCase())) {
		dback.message = "验证码不匹配";
	}
	if(data.password != data.password2) {
		dback.message = "密码不匹配";
	}
	if(!data.username || data.username == null || data.username.trim() == '') {
		dback.message = "用户名不能为空";
	}
	if(dback.message) {
		dback.username=data.username;
		res.render('user', dback);
		return;
	}
	
	if(!data.stauts) {
		data.stauts = 'Active';
	}
	db.query2("select 1 from public.users where user_name=$1 ", [data.username], function(error, rows) {
		if(rows && rows.length > 0) {
			dback.message = "用户名已经存在";
			res.render('user', dback);
		} else {
			db.asyncInsert("INSERT INTO public.users(id, type, status, user_name, password, create_date, mod_date,active) VALUES (uuid_generate_v4(), 'test', $1, $2, $3, now(), now(),'T') ON CONFLICT (id) DO UPDATE SET password=EXCLUDED.password,status=EXCLUDED.status,active=EXCLUDED.active, mod_date=EXCLUDED.mod_date",
					[data.stauts, data.username, crypto.createHmac('sha256', data.password).update(globals.hashKey).digest('hex')]);
			res.redirect('/login');
		}
	})
});

module.exports = router;
