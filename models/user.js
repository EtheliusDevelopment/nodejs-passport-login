"use strict"
//importo mongoose
const mongoose = require ('mongoose');
const bcrypt = require ('bcrypt'); //STEP 11 => STEP 12 compilo la funzione di callback in fondo ( createUser) con i parametri di bcrypt


// STEP 5 COLLEGO DB

const uri = `mongodb+srv://ethelius-dev:juancamilo@cluster0.bymg7.mongodb.net/login?retryWrites=true&w=majority`
mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('db connesso'))
    .catch(err => console.log(err));


// step 6 -CREATE USER SCHEMA

const UserSchema = mongoose.Schema({
    username : {
        type: String,
        index: true
    },
    password : String,
    email : String,
    name : String,
    profileimage : { 
        type : String,
        required : true
    }
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
//STEP 18 creo la funzione getUserById  => STEP 19 creo funzione getUserByUsername
module.exports.getUserById = function (id, callback){
    User.findById(id, callback);
}

//STEP 19 creo function getUserByUsername => STEP 20 creo la funzione comparePassword
module.exports.getUserByUsername = function (username, callback){
    var query = {username : username};
    User.findOne(query, callback);
}

//STEP 20 function comparePassword => STEP 21 creo funzione logout in routes/users
module.exports.comparePassword = function (canditatePassword, hash, callback){
    bcrypt.compare(canditatePassword, hash, function(err, isMatch) {
// importato da documentazione bcrypt-- SOSTITUISCO myPlaintextPassword CON canditatePassword E result nella funzione con isMatch
      callback(null, isMatch)  
    });
}

module.exports.createUser = function (newUser, callback) {
    //STEP 12 configuro bcryptcome da documentazione e sostituisco il valore della variabile myPlaintextPassword con newUser.password
    // STEP 13 => configuro Passport in routes/user.js
const saltRounds = 10;
const myPlaintextPassword = newUser.password;
const someOtherPlaintextPassword = 'not_bacon';

bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(myPlaintextPassword, salt, function(err, hash) {
        // Store hash in your password DB.
        newUser.password = hash;
        newUser.save(callback);
    });
});
    
}

// STEP 6 ritorno a Router/User ed importo lo schema