var auth = require('basic-auth');
const globals = require('../globals');
const db = require('../db')

module.exports = function(req, res, next) {
//	console.log("req.url by auth==============>" + req.url );
	if(!globals.userData) {
		db.query2("select user_name username,password from public.users where active='T' and status ='Active'", [], 
			function(error, rows) {
				if(!error) {
					globals.userData = {};
					for (var i = 0; i < rows.length; i++) {
						var row = rows[i];
						globals.userData[row['username']] = row;
					}
				}
			});
	}
	
	var url = req.url;
	if (url =="/" || url.indexOf("/?") >= 0 || url.indexOf("/captcha") >= 0 || url.indexOf("/users/new") >= 0 
			|| url.indexOf("/login") >= 0 || url.indexOf('wechat?signature') >= 0) {
		return next();
	}
	if(!req.session.user || !globals.userData || globals.userData && !globals.userData[req.session.user]) {
		req.session.referer=req.url;
		res.redirect('/login');
		return;
	}
	
	if (req.session.user != 'admin' 
			&& (url.indexOf("/users") >= 0 || url.indexOf("/paper") >= 0 || url.indexOf("/questions") >= 0) ) {
		console.log(req.session.user +' unauthorized '+url);
	    res.setHeader('Content-Type', 'text/html')
	    res.write('<p>User: ' + req.session.user + '</p>')
	    res.write('<p>It is unauthorized </p>')
	    res.end()
		return;
	}
	return next();
};