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
		var dback = log.common(req);
		dback.title='试卷列表';
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
		   client.query("SELECT row_number() OVER(ORDER BY type,chapter,create_date desc) seq,id,type,chapter,to_char(create_date,'yyyy-MM-dd') FROM paper where active='T'  order by type,chapter,create_date desc limit 30", 
				   [], (err, result) => {
			    done()
			    if (err) {
			      console.log(err.stack)
			    } else {
//			      console.log(result.rows[0])
			    	dback.rows = result.rows
			        res.render('papers', dback);
			    }
		   })
		})
	});
	router.get('/id', function(req, res, next) {
		var data = log.save(req, 'paper')
		var dback = log.common(req);
		dback.title='paper';
		dback.rows = {};
//		console.log(data)
		if(!data.id) {
			res.render('paper', dback);
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
		    	  dback.rows = result.rows[0];
			      res.render('paper', dback);
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
					paper.questions=JSON.stringify(rows);
					
					log.savePaper(paper);
					res.redirect('/paper');
				}
			})
		})
	});
	router.get('/generate2', function(req, res, next) {
		var data = log.save(req, 'paper')
//		console.log(data)
		var sql = " insert into questions(id, type,chapter,class,code, title, choices, answer,active, create_date, mod_date)";
		sql = sql + " (select uuid_generate_v4(),type,chapter,class,code,title, jsonb_object('{A,B,C,D,E,F,G,H,I}'::text[],ARRAY[item1,item2,item3,item4,item5,item6,item7,item8,item9]) choices,";
		sql = sql + "    jsonb_object('{ans,explain}'::text[],ARRAY[answer,explains]) answers,'T',now(),now()";
		sql = sql + "    from public.tempquest where title!='﻿title' and (type,chapter) not in (select distinct type,chapter from questions where active='T'))";
		db.query2(sql,[],function(){
			db.query2("select distinct type,chapter from questions where active='T' and (type,chapter) not in (select type,chapter from paper where active='T')", [], function(error, rows) {
				for (var i = 0; i < rows.length; i++) {
					console.log(rows[i].type +";"+rows[i].chapter)
					db.query2("select id,title,titlepic,code,choices,answer,type,chapter,class FROM questions where active='T' and type=$1 and chapter=$2 order by cast(code as integer) ", [rows[i].type,rows[i].chapter], function(error, rows2) {
						if(rows2 && rows2[0]) {
							console.log(rows2[0])
							var paper = {},questions=[];
							paper.chapter=rows2[0].chapter;
							paper.type=rows2[0].type;
							paper.title=rows2[0].chapter;
							paper.questions=JSON.stringify(rows2);
							log.savePaper(paper);
						}
					})
				}
				res.redirect('/paper');
			})
		});

	});
	router.post('/', function(req, res, next) {
//		console.log(req.body)
		var data = log.save(req, 'edit')
		if(data.id) {
		}
		res.jsonp({message: "Paper is saved/updated succesfully", code: data['title']});
	});
	router.delete('/', function(req, res, next) {
		var data = log.save(req, 'delete')
		if(data.id) {
			db.asyncInsert("update paper set active='F',mod_date=$1 where id=$2", [new Date(),data.id])
		}
		res.jsonp({message: "Paper is deleted", code: data['title']});
	});

module.exports = router;
