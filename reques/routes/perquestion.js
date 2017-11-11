var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('perques', { title: '单页面刷' });
});

module.exports = router;
