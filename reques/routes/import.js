var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
//  console.log(data)
	res.render('import', { title: '导入' });
});

module.exports = router;
