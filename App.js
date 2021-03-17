var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const bodyParser = require ('body-parser');
const favicon = require ('serve-favicon');      // const configurate da me
const session = require ('express-session');
const passport = require ('passport');
const LocalStrategy = require ('passport-local').Strategy
const multer = require ('multer');
const upload = multer({dest : './uploads'});              // Handle file uploads
const expressValidator = require ('express-validator');
const flash = require ('connect-flash');
const bcrypt = require ('bcrypt'); //STEP 10 => STEP 11 importo il modulo anche nel model user di mongoose
const mongoose = require ('mongoose');
const dotenv = require ('dotenv');

dotenv.config({path: './config/config.env'});

var app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');





// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Handle Sessions
app.use(session({
    secret : 'secret',
    saveUninitialized : true,
    resave : true

}))

//Passport Configuration
app.use(passport.initialize());
app.use(passport.session())

//Validator - Legacy - da aggiornare
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
        , root    = namespace.shift()
        , formParam = root;
  
      while(namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param : formParam,
        msg   : msg,
        value : value
      };
    }
  }));

  //Express - Messages FLash
app.use(require('connect-flash')());
app.use(function (req, res, next) {
res.locals.messages = require('express-messages')(req, res);
next();
});

// STEP 24 creo Variabile globale per riconoscere gli users  => STEP 25 applico logica hide alla view in includes/header.pug
app.get('*', function (req, res, next){
  res.locals.user = req.user || null;
  next();
})

//Handle Routers
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
