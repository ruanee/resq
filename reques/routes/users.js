var express = require('express');
var router = express.Router();
const db = require('../db')
const crypto = require('crypto');
const globals = require('../globals');

/* GET users listing. */
router.get('/', function(req, res, next) {
	db.query2("select row_number() OVER(ORDER BY user_name) seq,user_name username,status,to_char(mod_date,'yyyy-MM-dd') mod_date from public.users where active='T' and status ='Active'", [], function(error, rows) {
		res.render('users', { title: 'Users' , rows: rows});
	})
//	res.sendFile('weiui.html')
});

router.post('/', function(req, res, next) {
	var data = log.save(req, 'user')
	db.asyncInsert("INSERT INTO public.users(id, type, status, user_name, password, create_date, mod_date,active) VALUES (uuid_generate_v4(), 'test', $1, $2, $3, now(), now(),'T') ON CONFLICT (id) DO UPDATE SET password=EXCLUDED.password,status=EXCLUDED.status,active=EXCLUDED.active, mod_date=EXCLUDED.mod_date",
			[data.stauts, data.username, crypto.createHmac('sha256', data.password).update(globals.hashKey).digest('hex')])
	res.render('users', { title: 'Users'});
});

module.exports = router;
