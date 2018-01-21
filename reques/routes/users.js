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
	
	  var sql = "select id,row_number() OVER(ORDER BY user_name) seq,user_name username,status,type,roles,descrip from public.users where active='T' ";
	  var params =[], idx = 1;
	  if(data.types) {
		  params.push(data.types);
		  sql = sql + "and type=$" + idx++;
	  }
	  if(data.usernames) {
		  params.push(data.usernames);
		  sql = sql + "and user_name=$" + idx++;
	  }
	  if(data.descrips) {
		  params.push(data.descrips);
		  sql = sql + "and descrip like '%'||$" + idx++ +"||'%'";
	  }
	  sql = sql + " order by mod_date desc limit 30";
	
	db.query2(sql, params, function(error, rows) {
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
	if(!data.id) {
		dback.msg='参数不对';
		res.jsonp(dback);
	}
	req.sessionStore.destroy(data.id,function(err) {
		if(err) {
			dback.msg='Error Happens';
		} else {
			dback.msg='成功了';
		}
		res.jsonp(dback);
	})
});
router.get('/show', function(req, res, next) {
	var data = log.save(req, 'user')
	var dback = log.common(req);
	dback.title='Profile';
	if(!data.id || data.id.trim() == '') {
		res.redirect('/users/new');
		return;
	}
	db.query2("select id,user_name username,status,roles,type,descrip from public.users where id =$1 ", [data.id], function(error, rows) {
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
	db.query2("UPDATE public.users set status= $2, roles=$3,mod_date=$4,type=$5,descrip=$6 where id=$1",
			[data.id, data.status, data.roles, new Date(), data.type, data.descrip], function(error, rows) {
		if(data.username) {
			var uu = globals.userData[data.username];
			if(uu) {
				uu.status=data.status;
				uu.roles=data.roles;
				uu.type=data.type;
			}
			
			if(data.status != 'Active') {
				var store = req.sessionStore, sessions = store.sessions;
				for (var p in sessions) {
					var ses = JSON.parse(sessions[p]);
					if(data.username == ses.user) {
						store.destroy(p,function(err) {
							if(err) {
							}
						})
					}
				}
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
	console.log(data.password);
	var pass = crypto.createHmac('sha256', data.password).update(globals.hashKey).digest('hex');
	console.log(pass);
	db.query2("UPDATE public.users set password= $1,mod_date=$2 where user_name=$3",
			[pass, new Date(), data.username], function(error, rows) {
		console.log(data.username);
		if(data.username) {
			var uu = globals.userData[data.username];
			if(uu) {
				uu.password=pass;
			}
			console.log(uu);
		}
		res.jsonp(dback);
		return;
	});
	
});
router.get('/menu', function(req, res, next) {
	var data = log.save(req, 'menu')
	res.render('menu', { title: 'Menu' });
});
router.get('/menus', function(req, res, next) {
	var data = log.save(req, 'menu')
	console.log(data);
	var dback = {};
	dback.data=globals.menus;
	dback.itemsCount=globals.menus.length;
	res.jsonp(dback);
});
router.post('/menus', function(req, res, next) {
	var data = log.save(req, 'menu')
//	var dback = {};
//	dback.data=globals.menus;
//	dback.itemsCount=globals.menus.length;
	res.jsonp(data);
});
router.put('/menus', function(req, res, next) {
	var data = log.save(req, 'menu')
	console.log(data);
	console.log(req.body);
//	var dback = {};
//	dback.data=globals.menus;
//	dback.itemsCount=globals.menus.length;
	res.jsonp(data);
});
router.get('/new', function(req, res, next) {
	var data = log.save(req, 'user')
	res.render('sign', { title: 'Profile' });
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
		res.render('sign', dback);
		return;
	}
	
	if(!data.stauts) {
		data.stauts = 'Active';
	}
	db.query2("select 1 from public.users where user_name=$1 ", [data.username], function(error, rows) {
		if(rows && rows.length > 0) {
			dback.message = "用户名已经存在";
			res.render('sign', dback);
		} else {
			db.asyncInsert("INSERT INTO public.users(id, type, status, user_name, password, create_date, mod_date,active) VALUES (uuid_generate_v4(), 'Test', $1, $2, $3, now(), now(),'T') ON CONFLICT (id) DO UPDATE SET password=EXCLUDED.password,status=EXCLUDED.status,active=EXCLUDED.active, mod_date=EXCLUDED.mod_date",
					[data.stauts, data.username, crypto.createHmac('sha256', data.password).update(globals.hashKey).digest('hex')]);
			globals.userData[data.username]={type:'Test',roles:'',stauts:data.stauts,password:crypto.createHmac('sha256', data.password).update(globals.hashKey).digest('hex')};
			res.redirect('/login');
		}
	})
});

module.exports = router;
