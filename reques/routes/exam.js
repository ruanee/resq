var express = require('express');
var router = express.Router();
var log = require('./log.js');
const globals = require('../globals');
const db = require('../db')

router.get('/', function(req, res, next) {
	var data = log.save(req, 'exam'), page = 0;
	var dback = { title: '考试中' };
	if(!data.id) {
		dback.message = '请先选择章节';
	}
	res.render('exam', dback);
});
router.get('/go', function(req, res, next) {
	var data = log.save(req, 'exam'), page = 0;
	console.log(data)
	var dback = { title: '考试中' }, first = true;
	if(!data.id) {
		res.jsonp(dback);
		return;
	}
	if(data.page) {
		first = false;
		page= parseInt(data.page)
	}
	if(data.direction == 'next') {
		page = page + 1;
	} else if(data.direction == 'prev') {
		page = page - 1;
	}
	if(page < 0) {
		dback.message = 'prevend';
		res.jsonp(dback);
		return;
	}
	dback.page = page;
	console.log(dback)
	db.pool.connect((err, client, done) => {
    if (err) throw err
    client.query("SELECT id,title,jsonb_array_elements(questions) as data FROM paper where id=$1 offset $2 limit 1 ", [data.id, page], (err, result) => {
	    done()
	    if (err) {
	      console.log(err.stack)
	      dback.message = '出错了';
	      res.jsonp(dback);
	    } else {
	      console.log(result.rows[0])
	      if(result.rows.length == 0) {
	    	  dback.message = 'end';
	      } else{
	    	  dback.message = '';
	    	  dback.rows = result.rows[0];
	      }
	      res.jsonp(dback);
	    }
    })
})
});
module.exports = router;
