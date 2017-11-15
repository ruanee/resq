var express = require('express');
var router = express.Router();
var log = require('./log.js');
const globals = require('../globals');
const db = require('../db')

/* GET home page. */
	router.get('/', function(req, res, next) {
		var data = log.save(req, 'paper')
   		db.pool.connect((err, client, done) => {
		   if (err) throw err
		   client.query("SELECT row_number() OVER(ORDER BY type,create_date desc) seq,id,type,title,to_char(create_date,'yyyy-MM-dd') FROM paper where active='T'  order by type,create_date desc limit 20", 
				   [], (err, result) => {
			    done()
			    if (err) {
			      console.log(err.stack)
			    } else {
			      console.log(result.rows[0])
			        res.render('papers', { title: '试卷列表' , rows: result.rows});
			    }
		   })
		})
	});
	router.get('/id', function(req, res, next) {
		var data = log.save(req, 'paper')
		console.log(data)
		if(!data.id) {
			res.render('paper', { title: '试卷' , rows: {}});
			return;
		}
   		db.pool.connect((err, client, done) => {
		   if (err) throw err
		   client.query("SELECT * FROM paper where id=$1", [data.id], (err, result) => {
			    done()
			    if (err) {
			      console.log(err.stack)
			    } else {
			      console.log(result.rows[0])
			      res.render('paper', { title: '试卷' , rows: result.rows[0]});
			    }
		   })
		})
	});
	router.get('/generate', function(req, res, next) {
		var data = log.save(req, 'paper')
		console.log(data)
		if(!data.type) {
			res.render('paper', { title: 'type is required' , rows: {}});
			return;
		}
		db.pool.connect((err, client, done) => {
			if (err) throw err
			client.query("select id,title,code,choices,answer FROM questions where active='T' and type=$1", [data.type], (err, result) => {
				done()
				if (err) {
					console.log(err.stack)
				} else {
			        if(result.rows.length == 0) {
						res.render('paper', { title: 'no questions found' , rows: {}});
			    	    return;
			        }
					console.log(result.rows[0])
					var paper = {},questions=[], rows = result.rows;
					paper.type=data.type;
					paper.title=data.type;
//					for (var i = 0; i < rows.length; i++) {
//						var jso = {};
//						jso.id = rows[i].id;
//						jso.title = rows[i].title;
//						jso.choices = rows[i].choices;
////						var answer = {};
////						for(var p in rows[i].answer) {
////							answer[p] = rows[i].answer[p];
////						}
//						jso.answer = rows[i].answer;
//						questions.push(jso);
//					}
					paper.questions=JSON.stringify(rows);
					
					log.savePaper(paper);
					
//					res.render('papers', { title: '试卷列表' , rows: rows});
					res.redirect('/paper');
				}
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
