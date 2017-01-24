var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var flash = require('connect-flash');
var session = require('express-session');

var index = require('./routes/index');
var users = require('./routes/users');

var topic = require('./routes/topic');

//管理员
var admin = require('./routes/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:'zheshiyigemima',
  cookie:{
    maxAge:1000*60*60,
    path:'/'
  },
  resave: false,  
  saveUninitialized: true
}));

app.use(flash());

//设置信息
app.use(function(req,res,next){
	//全局对象
  res.locals.errMsg= req.flash('errMsg');
  res.locals.errPwd= req.flash('errPwd');
	res.locals.newPwd= req.flash('newPwd');
	res.locals.user = req.session.user;
	next();
})

app.use('/', index);
app.use('/users', users);
app.use('/topic',topic);
app.use('/admin',function(req,res,next){
  //检查
  if(!req.session.user){
    res.redirect('/');
    //终止
    
  }else if(req.session.user.level!=1){
    res.redirect('/');
    return;
  }
  next();
},admin);

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