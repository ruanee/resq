var express = require('express');
var router = express.Router();
var log = require('./log.js');
const globals = require('../globals');

/* GET home page. */
router.get('/', function(req, res, next) {
  log.list();
  var data = log.save(req, 'perques')
//  console.log(data)
  res.render('questions', { title: '题目列表' });
});
router.post('/', function(req, res, next) {
//	console.log(req.body)
	var data = log.save(req, 'edit')
	log.saveQuestion(data);
	res.jsonp({message: "Question is updated succesfully", code: data['title']});
});

module.exports = router;
