var express = require('express');
var router = express.Router();
var log = require('./log.js');
const globals = require('../globals');
const db = require('../db')

/* GET home page. */
router.get('/', function(req, res, next) {
  var data = log.save(req, 'perques')
  var dback = log.clone(data,req);
  dback.title='题目列表';
//  console.log(data)
//  console.log(log.listQuestions())
//  var ques = log.listQuestions();
  var sql = "SELECT row_number() OVER(ORDER BY mod_date desc) seq,id,title,titlepic,type,chapter,class,code,choices,answer,to_char(mod_date,'YYYY-MM-DD') FROM questions where active='T' ";
  var params =[], idx = 1;
  if(data.types) {
	  params.push(data.types);
	  sql = sql + "and type=$" + idx++;
  }
  if(data.chapters) {
	  params.push(data.chapters);
	  sql = sql + "and chapter=$" + idx++;
  }
  if(data.titles) {
	  params.push(data.titles);
	  sql = sql + "and title like '%'||$" + idx++ +"||'%'";
  }
  sql = sql + " order by mod_date desc limit 30";
  db.query2(sql, params, function(err, rows) {
	    if (err) {
	      console.log(err.stack)
	    } else {
	      dback.rows = rows
	      res.render('questions', dback);
	    }
  });
});
router.post('/', function(req, res, next) {
//	console.log(req.body)
	var data = log.save(req, 'edit')
//	log.saveQuestion(data);
	if(!data.id) {
		data.id = log.guid();
	}
	
	db.asyncInsert('insert into questions(id, type, title, code, choices, answer,active, create_date, mod_date,titlepic,chapter,class) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12) ON CONFLICT (id) DO UPDATE SET type=EXCLUDED.type,chapter=EXCLUDED.chapter,class=EXCLUDED.class,title=EXCLUDED.title, titlepic=EXCLUDED.titlepic, choices=EXCLUDED.choices, answer=EXCLUDED.answer, mod_date=EXCLUDED.mod_date', 
		[data.id,data.type,data.title,data.code,JSON.stringify(data.choices),JSON.stringify(data.answer),data.active,new Date(),new Date(),data.titlepic,data.chapter,data.class])
	res.jsonp({message: "Question is saved/updated succesfully", code: data['title']});
});
router.delete('/', function(req, res, next) {
	console.log(req.body)
	var data = log.save(req, 'delete')
	log.deleteQuestion(data);
	res.jsonp({message: "Question is deleted", code: data['title']});
});

module.exports = router;
