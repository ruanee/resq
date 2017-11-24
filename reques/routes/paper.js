var express = require('express');
var router = express.Router();
var log = require('./log.js');
const globals = require('../globals');
const db = require('../db')
var fs = require('fs'),
    path = require('path');


/* GET home page. */
	router.get('/', function(req, res, next) {
		var data = log.save(req, 'paper'),sum=0, idx=1, s='',s1 = 'CREATE TABLE item_price_pm_',s2=' PARTITION OF item_price_pm2 FOR VALUES FROM ('
//		fs.readFile('F:/work/FE/B2B/sync/pm.txt', {encoding: 'utf-8'}, function(err,data){
//		    if (!err) {
//		    	var lines = data.split("\n");
//		    	var from = 0, to =0;
//		    	for (var i = 0; i < lines.length; i++) {
//			    	var bp=lines[i].split(',')
//			    	if(bp.length > 1 && bp[0] != 'id') {
//			    		if(from == 0) from = bp[0];
//			    		to = bp[0]; // for last one
//				    	sum = sum + parseInt(bp[1]);
//				    	s = s + ",'" + bp[0]+"'";
//				        if(sum >= 100) {
//				        	to = bp[0];
//				        	console.log(s1 + (idx++) +s2+from+') TO ('+to +');');
//				        	sum=0;
//				        	s="";
//				        	from = to;
//				        }
//			    	}
//				}
//		    	console.log(s1 + (idx++) +s2+from+') TO ('+to +');');
//		    } else {
//		        console.log(err);
//		    }
//		});
   		db.pool.connect((err, client, done) => {
		   if (err) throw err
		   client.query("SELECT row_number() OVER(ORDER BY type,create_date desc) seq,id,type,title,to_char(create_date,'yyyy-MM-dd') FROM paper where active='T'  order by type,create_date desc limit 20", 
				   [], (err, result) => {
			    done()
			    if (err) {
			      console.log(err.stack)
			    } else {
//			      console.log(result.rows[0])
			        res.render('papers', { title: '试卷列表' , rows: result.rows});
			    }
		   })
		})
	});
	router.get('/id', function(req, res, next) {
		var data = log.save(req, 'paper')
//		console.log(data)
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
//			      console.log(result.rows[0])
			      res.render('paper', { title: '试卷' , rows: result.rows[0]});
			    }
		   })
		})
	});
	router.get('/generate', function(req, res, next) {
		var data = log.save(req, 'paper')
//		console.log(data)
		if(!data.type) {
			res.render('paper', { title: 'type is required' , rows: {}});
			return;
		}
		db.pool.connect((err, client, done) => {
			if (err) throw err
			client.query("select id,title,code,choices,answer FROM questions where active='T' and type=$1 order by cast(code as integer) ", [data.type], (err, result) => {
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
	router.get('/generate2', function(req, res, next) {
		var data = log.save(req, 'paper')
//		console.log(data)
		db.query2("select distinct type from tempquest where  type not in (select type from paper)", [], function(error, rows) {
			for (var i = 0; i < rows.length; i++) {
//				console.log(rows[i])
				db.query2("select id,title,code,choices,answer,type FROM questions where active='T' and type=$1 order by cast(code as integer) ", [rows[i].type], function(error, rows2) {
					if(rows2 && rows2[0]) {
						var paper = {},questions=[];
						paper.type=rows2[0].type;
						paper.title=rows2[0].type;
						paper.questions=JSON.stringify(rows2);
						log.savePaper(paper);
					}
				})
			}
			res.redirect('/paper');
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
