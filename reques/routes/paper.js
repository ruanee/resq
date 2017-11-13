var express = require('express');
var router = express.Router();
var log = require('./log.js');
const globals = require('../globals');
const db = require('../db')

/* GET home page. */
router.get('/', function(req, res, next) {
  var data = log.save(req, 'paper')
//  console.log(data)
   db.pool.connect().then(client => {
	    return client.query("SELECT row_number() OVER(ORDER BY type,create_date desc) seq,id,code,questions,to_char(create_date,'yyyy-MM-dd') FROM paper where active='T'  order by type,create_date desc limit 5", [])
      .then(result => {
        client.release()
        console.log(JSON.stringify(result.rows))
        res.render('papers', { title: '试卷列表' , rows: result.rows});
      })
      .catch(e => {
        client.release()
        console.log(err.stack)
      })
  })

});
router.get('/id', function(req, res, next) {
	  var data = log.save(req, 'paper')
	//  console.log(data)
	   db.pool.connect().then(client => {
		    return client.query("SELECT * FROM paper where id=$1", [req.params])
	      .then(result => {
	        client.release()
	        console.log(JSON.stringify(result.rows))
	        res.render('paper', { title: '试卷' , rows: result.rows});
	      })
	      .catch(e => {
	        client.release()
	        console.log(err.stack)
	      })
	  })

	});
	router.post('/', function(req, res, next) {
//		console.log(req.body)
		var data = log.save(req, 'edit')
		log.saveQuestion(data);
		res.jsonp({message: "Question is saved/updated succesfully", code: data['title']});
	});
	router.delete('/', function(req, res, next) {
		console.log(req.body)
		var data = log.save(req, 'delete')
		log.deleteQuestion(data);
		res.jsonp({message: "Question is deleted", code: data['title']});
	});

module.exports = router;
