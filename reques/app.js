var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var wechat = require('wechat');
var config = {
  checkSignature: true // 可选，默认为true。由于微信公众平台接口调试工具在明文模式下不发送签名，所以如要使用该测试工具，请将其设置为false
};

var index = require('./routes/index');
var users = require('./routes/users');

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
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);

app.use(express.query());
app.use('/wechat', wechat(config, function (req, res, next) {
  // 微信输入信息都在req.weixin上
  var message = req.weixin;
  console.log(message)
  var cnt = message.Content
  if (cnt === 'hehe') {
    // 回复屌丝(普通回复)
    res.reply('呵呵');
  } else if (cnt === '呵呵') {
  	res.reply('hehe');
  } else if (cnt === 'text') {
    //你也可以这样回复text类型的信息
    res.reply({
      content: 'text object',
      type: 'text'
    });
  } else if (cnt === '刷题') {
    // 回复一段音乐
    res.reply({
      content: '1. 下面哪些是Thread类的方法（） \r\n A start()       B run()       C exit()       D getPriority()',
      type: 'text'
    });
  } else {
    // 回复高富帅(图文回复)
    res.reply([
      {
        title: '精选30道Java笔试题解答',
        description: '都是一些非常非常基础的题',
        picurl: 'https://wx2.sinaimg.cn/mw690/69be932aly1flcae8n6zzj20qo0zkgwc.jpg',
        url: 'http://www.cnblogs.com/lanxuezaipiao/p/3371224.html'
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
