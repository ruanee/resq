var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var wechat = require('wechat');
var path = require('path');
var auth = require('./auth');
var session = require('express-session');
var svgCaptcha = require('svg-captcha');
var fileUpload = require('express-fileupload');
var parseXlsx = require('excel');
var compression = require('compression');
var db = require('./db');
var log = require('./routes/log.js');

var config = {
  token: 'xinshui',
  appid: 'wx00ad3e22984ee70b',
  encodingAESKey: 'wCRhH2d913fTmWjENXirLU2Z0ECYguFYwvoLds5Ii1x',
  checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};
var index = require('./routes/main');
var users = require('./routes/users');
var perques = require('./routes/perquestion');
var questions = require('./routes/questions');
var paper = require('./routes/paper');
var exam = require('./routes/exam');
var login = require('./routes/login');
var imp = require('./routes/import');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(compression({filter: shouldCompress}))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload({  limits: { fileSize: 5 * 1024 * 1024 },safeFileNames: true}));
app.use(cookieParser());
app.use(session({
  rolling: true,
  resave:true,
  saveUninitialized: false,
  secret: 'keyboard cat', 
  cookie: { maxAge: 30 * 60 * 1000 }
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'files')));
app.use(auth);

app.use('/', index);
app.use('/users', users);
app.use('/perques', perques);
app.use('/questions', questions);
app.use('/paper', paper);
app.use('/exam', exam);
app.use('/login', login);
app.use('/import', imp);

app.get('/captcha', function (req, res) {
	var captcha = svgCaptcha.create({noise: 3,color:true,background: '#CCFFFF'});
	req.session.captcha = captcha.text;
	
	res.type('svg');
	res.status(200).send(captcha.data);
});

app.use(express.query());
app.use('/wechat', wechat(config, function (req, res, next) {
  // 微信输入信息都在req.weixin上
  var message = req.weixin;
  console.log(message)
   var fromUserName=message.FromUserName
  //console.log(req)
  //console.log(req.wechat_token)
   if (message && message.MsgType == 'text') {
	  var cnt = message.Content
	  if (cnt === '呵呵' || cnt === '购买' || cnt === '采购' || cnt === '升级' || cnt.toLowerCase() === 'purchase') {
     	    res.reply([
	      	      {
	      	        title: '欢迎来到我的小店',
	      	        description: '购买后，请先注册，然后发帐号名给老板，多谢',
	      	        picurl: 'https://mmbiz.qpic.cn/mmbiz_jpg/0Anic82Ccs0uqKSH6Hrf5jUzlDh4fBCCQ3lK9sSCYib8gvuTib0gjViauTr4JXlU4glIcKE1CO4j6GiaG60PcNBetzw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1',
	      	        url: 'https://weidian.com/?userid=1291725186'
	      	      }
	      	    ]);
	  } else if (cnt === '呵呵') {
	  	res.reply('hehe');
	  } else if (cnt === 'text') {
	    res.reply({
	      content: 'https://github.com/ruanee',
	      type: 'text'
	    });
	  } else {
	    res.reply([
	      {
	        title: '软件，技术，笔试',
	        description: '经常练习',
	        picurl: 'https://mmbiz.qpic.cn/mmbiz_jpg/0Anic82Ccs0uqKSH6Hrf5jUzlDh4fBCCQ3lK9sSCYib8gvuTib0gjViauTr4JXlU4glIcKE1CO4j6GiaG60PcNBetzw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1',
	        url: 'http://www.diandianguo.net?FromUserName='+fromUserName
	      }
	    ]);
	  }
   } else if (message && message.Event) {
       switch (message.Event) {
           case 'subscribe':
	       	    res.reply([
	      	      {
	      	        title: '多谢关注',
	      	        description: '我爱刷题',
	      	        picurl: 'https://mmbiz.qpic.cn/mmbiz_jpg/0Anic82Ccs0uqKSH6Hrf5jUzlDh4fBCCQ3lK9sSCYib8gvuTib0gjViauTr4JXlU4glIcKE1CO4j6GiaG60PcNBetzw/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1',
	      	        url: 'http://www.diandianguo.net?FromUserName='+fromUserName
	      	      }
	      	    ]);
               break;
           case 'unsubscribe':    //取消关注
               break;
           default:
               res.reply({
                   content: 'O(∩_∩)O~',
                   type: 'text'
               });
               break;
       }
   } 
}));
app.post('/upload2', function(req, res, next) {
	if (!req.files)
		return res.status(400).send('No files were uploaded.');

	// The name of the input field (i.e. "sampleFile") is used to retrieve the
	// uploaded file
	let titlePng = req.files.png;

	try {
		// db.asyncInsert('delete from tempquest',[])
		var id = log.guid()+'.png';
		// Use the mv() method to place the file somewhere on your server
		var filePath = path.join(__dirname, 'public')+'/files/pic/'+id;
		titlePng.mv(filePath, function(err) {
			if (err)
				return res.status(500).send(err);

			res.jsonp({ title : '成功', file: id});
		});
	} catch(e) {
		console.error(e)
	}
});
app.post('/upload', function(req, res, next) {
  if (!req.files)
    return res.status(400).send('No files were uploaded.');

  // The name of the input field (i.e. "sampleFile") is used to retrieve the
  // uploaded file
  let sampleFile = req.files.sampleFile;

  try {
    db.asyncInsert('delete from tempquest',[])
    
    // Use the mv() method to place the file somewhere on your server
    var filePath = path.join(__dirname, 'public')+'/files/abc.xlsx';
    sampleFile.mv(filePath, function(err) {
      if (err)
        return res.status(500).send(err);
      parseXlsx(filePath, '1', function(err, data) {
        if(err) throw err;
        //console.log(data)
        var idx = 1;
        for(var i =0;i<data.length; i++) {
          if(data[i][1].trim() == '') continue;
          console.log(i)
          var col = 0;
          var len = data[i].length
          db.asyncInsert('insert into tempquest(type,chapter,code,class,answer,title,item1,item2,item3,item4,item5,item6,item7,item8,item9,create_date) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)', 
            [req.body.type,req.body.chapter,(idx++) + '',data[i][col++].trim(),data[i][col++].trim(),data[i][col++],(len>= 3 ? data[i][col++] : ''),(len>= 4 ? data[i][col++] : ''),(len>= 5 ? data[i][col++] : ''),(len>= 6 ? data[i][col++] : ''),(len>= 7 ? data[i][col++] : ''),(len>= 8 ? data[i][col++] : ''),(len>= 9 ? data[i][col++] : ''),(len>= 10 ? data[i][col++] : ''),(len>= 11 ? data[i][col++] : ''),new Date()]) 
        }
      });
      res.render('import', { title : '导入' });
    });
  } catch(e) {
    console.error(e)
  }
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
function shouldCompress (req, res) {
  if (req.headers['x-no-compression']) {
    return false
  }
  var encoding = res.getHeader('Content-Encoding') || '';
  if (encoding.indexOf('gzip') != -1 || encoding.indexOf('deflate') != -1) {
	  return true
  }
 
  return compression.filter(req, res)
}
module.exports = app;
