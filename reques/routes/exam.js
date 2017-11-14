var express = require('express');
var router = express.Router();
var log = require('./log.js');
const globals = require('../globals');
const db = require('../db')

router.get('/', function(req, res, next) {
	var data = log.save(req, 'exam'), page = 0;
	console.log(data)
	if(!data.id) {
		res.render('exam', { title: '考试中' });
		return;
	}
	if(data.page) {
		page=data.page
	}
	if(data.direction == 'next') {
		page = page + 1;
	} else if(data.direction == 'prev') {
		page = page - 1;
	}
	if(page < 0) {
		res.render('exam', {  title: '考试中', message: '不能再往前了' });
	}
	db.pool.connect((err, client, done) => {
    if (err) throw err
    client.query("SELECT id,title,jsonb_array_elements(questions) FROM paper where id=$1 offset $2 limit 1 ", [data.id, page], (err, result) => {
	    done()
	    if (err) {
	      console.log(err.stack)
	      res.render('exam', {  title: '考试中', message: '出错了' });
	    } else {
	      console.log(result.rows[0])
	      if(result.rows.length == 0) {
	    	  res.render('exam', {  title: '考试中', message: '结束了' });
	      } else{
	    	  res.render('exam', { title: '考试中' , rows: result.rows[0]});
	      }
	    }
    })
})
});
module.exports = router;
