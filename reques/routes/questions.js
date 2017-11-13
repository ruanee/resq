var express = require('express');
var router = express.Router();
var log = require('./log.js');
const globals = require('../globals');
const db = require('../db')

/* GET home page. */
router.get('/', function(req, res, next) {
  var data = log.save(req, 'perques')
//  console.log(data)
//  console.log(log.listQuestions())
//  var ques = log.listQuestions();
   db.pool.connect().then(client => {
    return client.query("SELECT row_number() OVER(ORDER BY create_date desc) seq,id,title,code,choices,answer,to_char(create_date,'yyyy-MM-dd') FROM questions where active='T'  order by type,create_date desc limit 5", [])
      .then(result => {
        client.release()
        console.log(result.rows[0])
        res.render('questions', { title: '题目列表' , rows: result.rows, rowstr: JSON.stringify(result.rows)});
      })
      .catch(e => {
        client.release()
        console.log(err.stack)
      })
  })

});
router.post('/', function(req, res, next) {
//	console.log(req.body)
	var data = log.save(req, 'edit')
	log.saveQuestion(data);
	res.jsonp({message: "Question is updated succesfully", code: data['title']});
});
router.delete('/', function(req, res, next) {
	console.log(req.body)
	var data = log.save(req, 'delete')
	log.deleteQuestion(data);
	res.jsonp({message: "Question is deleted", code: data['title']});
});

module.exports = router;
