var auth = require('basic-auth');

//var admins = {
//  'xg':'pass','test':'123'
//};


module.exports = function(req, res, next) {
	console.log("auth==============>" + req.url);
	console.log("auth==============>" + JSON.stringify(req.session));
	if (req.url =="/" || req.url.indexOf("/login") >= 0 || req.url.indexOf('wechat?signature') >= 0) {
		return next();
	}
	if(!req.session.user) {
		res.redirect('/login');
		return;
	}
//	var user = auth(req);
//	if (!user || !admins[user.name] || admins[user.name] !== user.pass) {
//		res.set('WWW-Authenticate', 'Basic realm="example"');
//		return res.status(401).send();
//	}
	return next();
};