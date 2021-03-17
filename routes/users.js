var express = require('express');
var router = express.Router();
//insert REGISTER DATA STEP 2 AFTER VIEW SETUP
const multer = require ('multer');
const upload = multer({dest : './uploads'});              // Handle file uploads
// STEP 14 importo passport e localStrategy
const passport = require ('passport');
const LocalStrategy = require ('passport-local').Strategy;  //STEP 14 importo passport e localstrategy => STEP 15 imposto middleware Passport e LS
const flash = require ('connect-flash');

//STEP 6 importo lo USER SCHEMA ( step 7 compilo l-else in fondo a questa pagina)
const User = require('../models/user')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// Register route
router.get('/register', function(req, res, next) {
  res.render('register',{title : 'Register'});
});

// Login route
router.get('/login', function(req, res, next) {
  res.render('login',{title : 'Login'});
});

// STEP 13 configuro password per il login da documentazione ( sostituisco app con router) / aggiungo il failure redirect e un failurmessage con flash
//=> STEP 14 importo in questo file Passport e LocalStrategy 
router.post('/login',
  passport.authenticate('local', {failureRedirect : '/users/login', failureFlash : ' Invalid User or Password'}),
  function(req, res) {
    // If this function gets called, authentication was successful.
    // `req.user` contains the authenticated user.
    //res.redirect('/users/' + req.user.username); funzione originale
    req.flash('success', 'you are now logged in');
    res.redirect('/')
  });

  //STEP 16  importo da documentazione Passport     => STEP 17 sostiuire il findbyId per il getUserById
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {   // STEP 17 sostiuire il findbyId per il getUserById => STEP 18 vado in module(user e creo la funzione getUserById)
      done(err, user);
    });
  });

  //STEP 15 configuro middlware Passport e local strategy => STEP 16 importo da documentazioneserialize e deserialize
  passport.use(new LocalStrategy(function(username, password, done){
    User.getUserByUsername (username, function(err, user){
      if (err) { return done(err)}
      if (!user) {
        return done (null, false, {message : 'Unknown User'});
        }
      User.comparePassword(password, user.password, function (err, isMatch){
        if (err) return done(err);
        if (isMatch) {
          return done (null, user);
        } else {
          return done (null, false, {message : 'Invalid Password'});
        }
      })
      })
   }));

//insert REGISTER DATA STEP 1 AFTER VIEW SETUP
router.post('/register', upload.single('profileimage'), function(req, res, next) {  // aggiungo upload.single per caricare il file dell-immagine - STEP 3
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const password2 = req.body.password2;
  const profileimage = req.file.filename 


  // FORM  VALIDATOR - STEP 3
  req.checkBody('name', 'Name field is required').notEmpty();
  req.checkBody('email', 'Email field is required').notEmpty();
  req.checkBody('email', 'Email is not valid').isEmail();
  req.checkBody('username', 'UserName field is required').notEmpty();
  req.checkBody('password', 'Password field is required').notEmpty();
  req.checkBody('password2', 'Psswords do not match').equals(req.body.password);

  //Check and Define ERRORS - STEP 4 => STEP 5 ./models/user.js
  const errors = req.validationErrors();
  if (errors) {
    //console.log('Errors')
    res.render('register',{
      errors : errors
    })
  } else {
    //console.log('No Errors')
    //STEP 7 se non ci sono errori genero un nuovo utente STEP 8 flash message ( vedi sotto)
    const newUser = new User({
      name : name,
      email:email,
      username : username,
      password :password,
      profileimage : profileimage
    });

    User.createUser(newUser, function(errors, user){
      if(errors) throw errors;
      console.log(user);
    });
// STEP 8 messaggio flash => STEP 9 index.pug visualizzo il messaggio
req.flash('success', 'you are now registered, and can login')

    res.location('/');
    res.redirect('/');
  }

});

//STEP 21 creo funzione LOGOUT  => STEP 22 proteggo la rotta Member Area per essere visibile solo sotto pwd in routes/index.js

router.get("/logout", function (req, res){
  req.logout();
  req.flash('success', 'You are now logged out')
  res.redirect('/users/login')
})




module.exports = router;
