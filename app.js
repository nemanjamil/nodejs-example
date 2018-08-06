const express = require("express");
const app = express();
const path = require("path");
const mongoose = require('mongoose');
const passport = require('passport');

var dt = require('./include/dbfile');


//const config  = require('./config/database');
//mongoose.connect(config.database);


const flash = require("connect-flash");
const session = require("express-session");

// load view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug')


// STATIC FOLDER
app.use(express.static('public')); //path.join(__dirname,'pubic');
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist/'));

// Express session middleware
app.use(session({
  secret: 'keyboard dog',
  resave: true,
  saveUninitialized: true,
  // cookie: { secure: true }
}))

app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});


require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function (req, res, next) {
 
  if (req.user) {
    console.log("id : "+req.user.id);
  }
  res.locals.user = req.user || null;
  next();
})


var routers = require('./include/routers')(app);
//let articles = require('./include/routes_new');
//app.use('/articles', articles);
let users = require('./include/users');
app.use('/user', users);

// start server
app.listen(3000, function () {
  console.log('Test On Port 3000');
});