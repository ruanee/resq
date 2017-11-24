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
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
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
  var cnt = message.Content
  if (cnt === 'hehe') {
    // 回复屌丝(普通回复)
    res.reply('呵呵');
  } else if (cnt === '呵呵') {
  	res.reply('hehe');
  } else if (cnt === 'text') {
    //你也可以这样回复text类型的信息
    res.reply({
      content: 'https://github.com/ruanee',
      type: 'text'
    });
//  } else if (cnt === '刷题') {
//    // 回复一段音乐
//    res.reply([
//      {
//        title: '全屏答题',
//        description: '选择题',
//        picurl: 'https://wx2.sinaimg.cn/mw690/69be932aly1fkjcji86cuj20qo0zkdm8.jpg',
//        url: 'http://ruanee.hk1.mofasuidao.cn/exam?FromUserName='+fromUserName
//      }
//    ]);
  } else {
    // 回复高富帅(图文回复)
    res.reply([
      {
        title: '必过考题',
        description: '经常练习',
        picurl: 'https://wx2.sinaimg.cn/mw690/69be932aly1flcae8n6zzj20qo0zkgwc.jpg',
        url: 'http://ruanee.hk1.mofasuidao.cn?FromUserName='+fromUserName
      }
    ]);
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
