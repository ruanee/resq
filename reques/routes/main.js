var express = require('express');
var router = express.Router();
var log = require('./log.js');
const globals = require('../globals');

/* GET home page. */
//router.get('/', function(req, res, next) {
//  log.save(req, 'home')
//  res.render('index', { title: 'quiz', username:req.session.user });
//});
router.get('/', function(req, res, next) {
	log.save(req, 'home');
	var dback = log.common(req);
	dback.title='小刚微知';
	var idx=0, arr=[];
	var user = req.session && req.session.user ? globals.userData[req.session.user] : null;
	if(req.session && req.session.user != 'admin' && user) {
		for (var i = 0; i < globals.menus.length; i++) {
			var menu = globals.menus[i];
			if(user.roles && user.roles.indexOf(menu.type) == -1) continue;
			buildMenu(arr, menu, idx++);
		}
	} else {
		for (var i = 0; i < globals.menus.length; i++) {
			var menu = globals.menus[i];
			buildMenu(arr, menu, idx++);
		}
	}
	dback.menus=arr;
	res.render('main', dback);
});
function buildMenu(arr, menu, idx) {
	menu.url='/exam/list?type='+menu.type;
	if(idx % 2 == 0) {
		menu.src="data:image/gif;base64,R0lGODlhAQABAIABAAJ12AAAACwAAAAAAQABAAACAkQBADs=";
	} else {
		menu.src="data:image/gif;base64,R0lGODlhAQABAIABAADcgwAAACwAAAAAAQABAAACAkQBADs=";
	}
	arr.push(menu);
}
module.exports = router;
