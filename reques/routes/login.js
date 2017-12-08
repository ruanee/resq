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
	var dback = {title: '登录'};
	const hash = crypto.createHmac('sha256', req.body.password).update(globals.hashKey).digest('hex');
//	console.log(hash);
	if(uname && globals.userData && globals.userData[uname] && globals.userData[uname]["password"] == hash) {
		
		// protect only one user per login
		try {
			var sid= req.sessionID, store = req.sessionStore;
			if(sid && store) {
				var sessions = store.sessions, times = 0;
				for ( var p in sessions) {
					var ses = JSON.parse(sessions[p]);
					if(sid != p && ses.user == uname && ses.sessionId) {
						times++;
					}
				}
				if(times >= 1 && uname !='test') {
					dback.message = "您的账号已经在别的地方登陆了!";
					res.render('login', dback);
					return;
				}
			}
		} catch(e) {
			
		}
		
		req.session.user = uname;
		req.session.sessionId=log.guid();
//		var refer = req.session.referer;
//		if(refer && refer.indexOf("css.map") == -1 && refer.indexOf("favicon") == -1) {
//			res.redirect(req.session.referer);
//		} else {
			res.redirect('/');
//		}
		return;
	}
	dback.message = "用户名或者密码错误!";
	res.render('login', dback);
});
module.exports = router;
