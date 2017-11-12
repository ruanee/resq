var auth = require('basic-auth');

var admins = {
  'xg':'pass','test':'123'
};


module.exports = function(req, res, next) {

  var user = auth(req);
  if (!user || !admins[user.name] || admins[user.name] !== user.pass) {
    res.set('WWW-Authenticate', 'Basic realm="example"');
    return res.status(401).send();
  }
  return next();
};