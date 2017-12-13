var express = require('express');
var router = express.Router();
var log = require('./log.js');
const globals = require('../globals');
const db = require('../db')

router.get('/', function(req, res, next) {
	var data = log.save(req, 'exam'), page = 0;
	var dback = log.common(req);
	dback.data = data;
	dback.title = '考试中';
	if(!data.id) {
		dback.message = '请先选择章节';
	}
	dback.pid = data.id;
	res.render('exam', dback);
});
router.get('/list', function(req, res, next) {
	var data = log.save(req, 'exam'), page = 0;
	var dback = log.common(req);
	dback.title = '章节';
	db.query2("SELECT row_number() OVER(ORDER BY type,chapter,create_date desc) seq,id,type,title,to_char(create_date,'YYYY-MM-DD') createdate FROM paper where active='T' and type=$1 order by type,chapter,create_date desc", [data.type], function(error, rows) {
		dback.rows = rows;
		res.render('chapter', dback);
	})
});
router.get('/user', function(req, res, next) {
	var data = log.save(req, 'exam'), page = 0;
	var dback = log.common(req);
	dback.title = 'Profile';
	db.query2("SELECT row_number() OVER(ORDER BY E.mod_date desc) seq,P.type,P.title,E.paper,E.token,E.page,to_char(E.create_date,'YYYY-MM-DD HH24:MI') createdate,to_char(E.mod_date,'YYYY-MM-DD HH24:MI') moddate,E.user_name username FROM exam E left join paper P on E.paper=P.id where E.user_name=$1 order by E.mod_date desc", [req.session.user], function(error, rows) {
		if(rows.length == 0) {
			dback.rows = [{username: req.session.user}];
		} else {
			dback.rows = rows;
		}
		res.render('profile', dback);
	})
});
router.get('/go', function(req, res, next) {
	var dback = log.common(req);
	dback.title = '考试中';
	var data = log.save(req, 'exam');
//	console.log(data)
	if(!data.id) {
		dback.message = '请先选择章节';
		res.jsonp(dback);
		return;
	}
	var isTestUser = !req.session.user || !globals.userData[req.session.user] || globals.userData[req.session.user].type =='Test';
	if(isTestUser) {
		db.query2("SELECT id,row_number() OVER(ORDER BY type,chapter,create_date desc) seq,type,title, chapter,create_date FROM paper where active='T' and type in (select type from paper where id=$1) order by type,chapter,create_date desc", [data.id], function(error, rows) {
			var needToPurchase = false;
			for (var i = 0; i < rows.length; i++) {
				if(rows[i].id == data.id && rows[i].seq > 4) {
					needToPurchase = true;
					break;
				}
			}
			if(needToPurchase) {
				dback.message = '此章节需要购买';
				res.jsonp(dback);
				return;
			} else {
				exam(req,res,next,dback, data);
			}
		});
	} else {
		exam(req,res,next,dback, data);
	}

});
function exam(req,res,next,dback, data) {
	var page = 0, token ="";
	if(data.page) {
		page= parseInt(data.page)
	}
	token = data.token;
	if(!token || token == ''){
		token = req.session.sessionId;
	}
	if(data.direction == 'next') {
		page = page + 1;
		
		var exm = {}, answ={};
		exm.token = token;
		exm.paper = data.id;
		answ[data.qid]={ans: data.answer, anc:data.anc};
		exm.answer=JSON.stringify(answ);
		exm.user=req.session.user;
		exm.page=page;
		log.saveExam(exm);
	} else if(data.direction == 'prev') {
		page = page - 1;
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
	    client.query("SELECT *,(SELECT answer FROM exam where paper=A.id and token=$1) as uanswer FROM (SELECT id,type,title,jsonb_array_elements(questions) as data FROM paper where id=$2 offset $3 limit 1) A ", [token, data.id, page], (err, result) => {
	    	done()
	    	if (err) {
		      console.log(err.stack)
		      dback.message = '出错了';
		      res.jsonp(dback);
		    } else {
		    	var user = globals.userData[req.session.user];
		      if(result.rows.length == 0) {
		    	  dback.message = 'end';
		      } else if(user && user.roles && user.roles.indexOf(result.rows[0].type) == -1) {
		    	  dback.message = '系统察觉你没有购买此章节';
		      } else {
		    	  dback.message = '';
		    	  dback.rows = result.rows[0];
		      }
		      res.jsonp(dback);
		    }
	    })
	})
}
module.exports = router;
