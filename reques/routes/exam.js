var express = require('express');
var router = express.Router();
var log = require('./log.js');
const globals = require('../globals');
const db = require('../db')

router.get('/', function(req, res, next) {
	var data = log.save(req, 'exam'), page = 0;
	var dback = { title: '考试中', username:req.session.user };
	if(!data.id) {
		dback.message = '请先选择章节';
	}
	dback.pid = data.id;
	res.render('exam', dback);
});
router.get('/list', function(req, res, next) {
	var data = log.save(req, 'exam'), page = 0;
	var dback = { title: '章节', username:req.session.user };
	db.query2("SELECT row_number() OVER(ORDER BY type,chapter,create_date desc) seq,id,type,title,to_char(create_date,'yyyy-MM-dd') createdate FROM paper where active='T' and type=$1 order by type,chapter,create_date desc", [data.type], function(error, rows) {
		dback.rows = rows;
		res.render('chapter', dback);
	})
});
router.get('/go', function(req, res, next) {
	var data = log.save(req, 'exam'), page = 0, token ="";
//	console.log(data)
	var dback = { title: '考试中', username:req.session.user }, first = true;
	if(!data.id) {
		dback.message = '请先选择章节';
		res.jsonp(dback);
		return;
	}
	if(data.page) {
		first = false;
		page= parseInt(data.page)
	}
	token = data.token;
	if(data.direction == 'next') {
		page = page + 1;
		
		var exm = {}, answ={};
		exm.token = token;
		exm.paper = data.id;
		answ[data.qid]={ans: data.answer, anc:data.anc};
		exm.answer=JSON.stringify(answ);
		exm.user=req.session.user;
		log.saveExam(exm);
	} else if(data.direction == 'prev') {
		page = page - 1;
	} else {
		//TODO; generate token for each exam
//		token = data['__id'];
		token = req.session.sessionId;
	}
	if(page < 0) {
		dback.message = 'prevend';
		res.jsonp(dback);
		return;
	}
	dback.page = page;
	dback.token = token;
//	console.log(dback)
	db.pool.connect((err, client, done) => {
    if (err) throw err
    client.query("SELECT *,(SELECT answer FROM exam where paper=A.id and token=$1) as uanswer FROM (SELECT id,title,jsonb_array_elements(questions) as data FROM paper where id=$2 offset $3 limit 1) A ", [token, data.id, page], (err, result) => {
    	done()
    	if (err) {
	      console.log(err.stack)
	      dback.message = '出错了';
	      res.jsonp(dback);
	    } else {
//	      console.log(result.rows[0])
	      if(result.rows.length == 0) {
	    	  dback.message = 'end';
	      } else {
	    	  dback.message = '';
	    	  dback.rows = result.rows[0];
//	    	  if(dback.rows.data.id) {
//	    	   		db.pool.connect((err, client, done) => {
//	    	 		   if (err) throw err
//	    	 		   var ques = {};
//	    	 		   ques[dback.rows.data.id]={};
//	    	 		   ques=JSON.stringify(ques);
//			   		   client.query("SELECT answer FROM exam where paper=$1 and token=$2 and answer @> $3", [data.id, token, ques], (err2, result2) => {
//						    done()
//						    if (err2) {
//						      console.log(err2.stack)
//						    } else {
//						    	console.log(result2.rows[0])
//						    	if(result2.rows.length > 0) {
//						    		var ans = result2.rows[0];
//						    		dback.uanswer = ans[dback.rows.data.id];
////						    		res.jsonp(dback);
////						    		return;
//						    	}
//						    }
//					   })
//	    	 	   })
//	    	  }
	      }
	      res.jsonp(dback);
	    }
    })
})
});
module.exports = router;
