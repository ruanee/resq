var express = require('express');
var router = express.Router();
var log = require('./log.js');
const globals = require('../globals');

/* GET home page. */
router.get('/', function(req, res, next) {
  log.list();
  var data = log.save(req, 'paper')
//  console.log(data)
  res.render('questions2', { title: '题目列表' });
});
router.post('/', function(req, res, next) {
//	console.log(req.body)
	var data = log.save(req, 'paper edit')
//	log.saveQuestion(data);
	res.jsonp({message: "Paper is updated succesfully", code: data['title']});
});

module.exports = router;
