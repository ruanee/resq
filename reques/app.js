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

var config = {
  token: 'xinshui',
  appid: 'wx00ad3e22984ee70b',
  encodingAESKey: 'wCRhH2d913fTmWjENXirLU2Z0ECYguFYwvoLds5Ii1x',
  checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};

var index = require('./routes/index');
var users = require('./routes/users');
var perques = require('./routes/perquestion');
var questions = require('./routes/questions');
var paper = require('./routes/paper');
var exam = require('./routes/exam');
var login = require('./routes/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  resave: false, // don't save session if unmodified
  saveUninitialized: false, // don't create session until something stored
  secret: 'keyboard cat', cookie: { maxAge: 7200000 }
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
	  if (cnt === 'hehe') {
     	    res.reply([
	      	      {
	      	        title: '刷刷刷',
	      	        description: '我爱刷题',
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
	        url: 'http://ruanee.hk1.mofasuidao.cn?FromUserName='+fromUserName
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
	      	        url: 'https://weidian.com/?userid=1291725186'
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

module.exports = app;
