var express = require('express');
var router = express.Router();
const db = require('../db')
const crypto = require('crypto');
const globals = require('../globals');
var log = require('./log.js');

/* GET users listing. */
router.get('/', function(req, res, next) {
	var data = log.save(req, 'user')
	var dback = log.common(req);
	dback.title='Users';
	db.query2("select id,row_number() OVER(ORDER BY user_name) seq,user_name username,status,roles from public.users where active='T' ", [], function(error, rows) {
		dback.rows = rows
		res.render('users', dback);
	})
});
router.get('/sessions', function(req, res, next) {
	var data = log.save(req, 'sessions')
	var dback = log.common(req);
	dback.title='sessions';
	dback.users=data.users;
	var sid= req.sessionID, store = req.sessionStore, idx=1;
	var sessions = store.sessions, rows=[];
	for (var p in sessions) {
		var row ={};
		var ses = JSON.parse(sessions[p]);
		if(data.users) {
			if(data.users!=ses.user) continue;
		}
		
		row.seq=idx++;
		row.user=ses.user;
		row.id=p;
		row.expires=ses.cookie.expires;
		row.isExpired=new Date(ses.cookie.expires) > (new Date());
		rows.push(row);
	}
	dback.rows=rows;
	res.render('sessions', dback);
});
router.get('/sessions/destroy', function(req, res, next) {
	var data = log.save(req, 'sessions')
	var dback = log.common(req);
	dback.msg='';
	var sid= req.sessionID, store = req.sessionStore, idx=1;
	var sessions = store.sessions;
	for (var p in sessions) {
		if(p == data.id) {
			sessions[p].destroy(function(err) {
				if(err) {
					dback.msg='Error Happens';
				}
				dback.msg='Success';
				res.jsonp(dback);
			})
		}
	}
});
router.get('/show', function(req, res, next) {
	var data = log.save(req, 'user')
	var dback = log.common(req);
	dback.title='Profile';
	if(!data.id || data.id.trim() == '') {
		res.redirect('/users/new');
		return;
	}
	db.query2("select id,user_name username,status,roles,type from public.users where id =$1 ", [data.id], function(error, rows) {
		if(rows.length == 0) {
			res.redirect('/login');
			return;
		}
		var arr = [];
		for (var i = 0; i < globals.menus.length; i++) {
			var menu = globals.menus[i];
			if(rows[0].roles && rows[0].roles.indexOf(menu.type) > -1) {
				menu.checked='yes';
			} else {
				menu.checked='no';
			}
			arr.push(menu);
		}
		dback.row = rows[0];
		dback.menus = arr;
		res.render('userDetail', dback);
	})
});
router.post('/update', function(req, res, next) {
	var data = log.save(req, 'user')
	if(!data.id || data.id.trim() == '') {
		res.redirect('/login');
		return;
	}
	db.query2("UPDATE public.users set status= $1, roles=$2,mod_date=$3,type=$4 where id=$5",
			[data.status, data.roles, new Date(), data.type, data.id], function(error, rows) {
		if(data.username) {
			var uu = globals.userData[data.username];
			if(uu) {
				uu.status=data.status;
				uu.roles=data.roles;
				uu.type=data.type;
			}
		}
		res.redirect('/users');
	});
	
});
router.post('/pass', function(req, res, next) {
	var data = log.save(req, 'user')
	var dback = log.common(req);
	dback.message = "";
	if(!req.session.user) {
		dback.message = "请登录";
	}
	if(!data.password) {
		dback.message = "输入密码";
	}
	if(req.session.user != 'admin') {
		if(data.username != req.session.user) {
			dback.message = "用户名不对";
		}
		if(data.password != data.password2) {
			dback.message = "密码不匹配";
		}
		if(!data.cpassword) {
			dback.message = "请输入当前密码";
		}
		if(crypto.createHmac('sha256', data.cpassword).update(globals.hashKey).digest('hex') != globals.userData[req.session.user].password) {
			dback.message = "当前密码不正确";
		}
	} else {
		
	}
	if(dback.message) {
		res.jsonp(dback);
		return;
	}
	db.query2("UPDATE public.users set password= $1,mod_date=$2 where user_name=$3",
			[crypto.createHmac('sha256', data.password).update(globals.hashKey).digest('hex'), new Date(), data.username], function(error, rows) {
		if(data.username) {
			var uu = globals.userData[data.username];
			if(uu) {
				uu.password=crypto.createHmac('sha256', data.password).update(globals.hashKey).digest('hex');
			}
		}
		res.jsonp(dback);
		return;
	});
	
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
	if(!data.password || data.password != data.password2) {
		dback.message = "密码不匹配";
	}
	if(!data.username || data.username == null || data.username.trim() == '') {
		dback.message = "用户名不能为空";
	}
	if(data.username.length < 5 || data.username.length > 20 || data.password.length < 5 || data.password.length > 20) {
		dback.message = "用户名或者密码长度不符合规则";
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
			db.asyncInsert("INSERT INTO public.users(id, type, status, user_name, password, create_date, mod_date,active) VALUES (uuid_generate_v4(), 'Test', $1, $2, $3, now(), now(),'T') ON CONFLICT (id) DO UPDATE SET password=EXCLUDED.password,status=EXCLUDED.status,active=EXCLUDED.active, mod_date=EXCLUDED.mod_date",
					[data.stauts, data.username, crypto.createHmac('sha256', data.password).update(globals.hashKey).digest('hex')]);
			globals.userData[data.username]={type:'Test',roles:'',stauts:data.stauts,password:crypto.createHmac('sha256', data.password).update(globals.hashKey).digest('hex')};
			res.redirect('/login');
		}
	})
});

module.exports = router;
