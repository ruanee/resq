var express = require('express');
var router = express.Router();
const db = require('../db')

/* GET users listing. */
router.get('/', function(req, res, next) {
	db.query2("select row_number() OVER(ORDER BY user_name) seq,user_name username,status,to_char(mod_date,'yyyy-MM-dd') mod_date from public.users where active='T' and status ='Active'", [], function(error, rows) {
		res.render('users', { title: 'Users' , rows: rows});
	})
//	res.sendFile('weiui.html')
});

module.exports = router;
