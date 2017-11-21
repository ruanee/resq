const db = require('../db')
const globals = require('../globals');
var url = require('url');

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}
exports.replaceAll = function (str, find, replace) {
	  var find = find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
	  return str.replace(new RegExp(find, 'g'), replace);
}
exports.guid = function()  {
  return guid();
}
exports.list = function() {
	const { rows } = db.query('SELECT url,request_date,params FROM request_log order by request_log desc limit 5', [])
};
exports.save = function(req, type) {
	var data = buildParams(req, type);
	db.asyncInsert('insert into request_log(id,url,params,"type",request_date) values ($1,$2,$3,$4,$5) ON CONFLICT (id) DO UPDATE SET url=EXCLUDED.url, params=EXCLUDED.params, type=EXCLUDED.type, request_date=EXCLUDED.request_date', 
			[data['__id'],req.method +" "+req.baseUrl+req.url,data, type,new Date()])
	return data;
};
exports.update = function(id, status, message) {
	if(id) {
		db.query('insert into request_log(id,status, msg) values ($1,$2,$3) ON CONFLICT (id) DO UPDATE SET status=EXCLUDED.status,msg=EXCLUDED.msg', [id, status, message])
	}
};
exports.listQuestions = function() {
	return db.querySync("SELECT title,code,choices,create_date FROM questions where active='T' order by type,create_date desc limit 5", [])
};
exports.saveQuestion = function(data) {
	if(!data.id) {
		data.id = guid();
	}
	console.log(data)
	db.asyncInsert('insert into questions(id, type, title, code, choices, answer,active, create_date, mod_date) values ($1,$2,$3,$4,$5,$6,$7,$8,$9) ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title, type=EXCLUDED.type, code=EXCLUDED.code, choices=EXCLUDED.choices, answer=EXCLUDED.answer,active=EXCLUDED.active, mod_date=EXCLUDED.mod_date', 
			[data.id,data.type,data.title,data.code,data.choices,data.answer,data.active,new Date(),new Date()])
	return data;
};
exports.deleteQuestion = function(data) {
	if(!data.id) {
		return data;
	}
	console.log(data)
	db.asyncInsert("update questions set active='F',mod_date=$1 where id=$2", [new Date(),data.id])
	return data;
};
exports.savePaper = function(data) {
	if(!data.id) {
		data.id = guid();
	}
	console.log(data)
	db.asyncInsert('insert into paper(id, type, title, questions,active, create_date, mod_date) values ($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (id) DO UPDATE SET title=EXCLUDED.title,type=EXCLUDED.type, questions=EXCLUDED.questions,active=EXCLUDED.active, mod_date=EXCLUDED.mod_date', 
			[data.id,data.type,data.title,data.questions,'T',new Date(),new Date()])
	return data;
};
exports.saveExam = function(data) {
	if(!data.id) {
		data.id = guid();
	}
	console.log(data)
	db.asyncInsert('insert into exam(paper, answer, token, user_name, create_date, mod_date) values ($1,$2,$3,$4,$5,$6) ON CONFLICT (paper,token) DO UPDATE SET answer=exam.answer || EXCLUDED.answer::jsonb, mod_date=EXCLUDED.mod_date', 
			[data.paper,data.answer,data.token,'who',new Date(),new Date()])
			return data;
};
function buildParams(req, type) {
	var data = {};
	if(req.method == 'POST' || req.method == 'DELETE') {
		data = req.body
	} else {
		data = req.params
	}
	var arg = url.parse(decodeURI(req.url),true).query;
	for(var p in arg) {
		data[p] = arg[p];
	}
//	data['__code'] = getCode(data, type);
	data['__id'] = guid();
	return data;
}
function getCode(data, type) {
	var code = "";
	if(type == globals.QUEUE_SUBMIT_SO) {
		code = data["Order Number"];
	} else if(type == globals.QUEUE_SUBMIT_QUOTATION) {
		code = data["Quote Number"];
	}
	return code;
}