var express = require('express');
var router = express.Router();

/* GET home page. */   // rotta di default
/* router.get('/', function(req, res, next) {
  res.render('index', { title: 'Members' });
}); */

// STEP 22 proteggo rotta affinche sia visibile solo sotto login  => STEP 23 creo la funzione ensureAuthenticated
router.get('/', ensureAuthenticated, function(req, res, next) {
  res.render('index', { title: 'Members' });
});

//STEP 23 creo funzione ensureAuthenticated  == > STEP 24 faccio visualizzare pagine secondo autenticazione App.js

function ensureAuthenticated (req, res, next) {
  if (req.isAuthenticated()){             //isAuthenticated e una funzione Passport.js
    return next();
  } else{
  res.redirect('/users/login')
}}



module.exports = router;
