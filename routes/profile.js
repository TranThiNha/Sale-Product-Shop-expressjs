var express = require('express');
var router = express.Router();

var multer  =   require('multer');


var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var validator = require('express-validator');
router.use(session({secret:'mysupersecret',resave:false, saveUninitialized:false}));


router.use(passport.initialize());
router.use(passport.session());
router.use(validator());
//Cau hinh ejs
require('../config/passport');


/* GET home page. */
router.use(function(req,res,next){
    res.locals.login = req.isAuthenticated();

    next();
});


var avatarUrl = "";


var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads/');
  },
  filename: function (req, file, callback) {
    avatarUrl = "/"+file.originalname;
    callback(null,  file.originalname);
  }
});

var upload = multer({ storage : storage });
var Account = require('../models/account')


router.get('/',isLoggedIn, function(req, res, next) {
  res.render('profile', { title: '1412477', username: 'Đoàn Hiếu Tâm', data: req.app.locals.data , layout: "layout_admin.hbs" ,user: req.app.locals.currentUser});

});


router.post('/',upload.array('avatar',1), function (req, res) {

  var requestBody = req.body;

  var index = req.query.index;

  console.log("*****************username: "+ requestBody.username);

  var item = new Account({username: requestBody.username, email: requestBody.email,role: requestBody.role, gender: requestBody.gender,avatarUrl: avatarUrl});

  var id = req.app.locals.currentId;

  console.log("*****************id: "+ id);

  Account.findById(id,function (err,acc) {
         if(err){
             console.log(err);
             return;
         }
         
         acc.username = item.username;
         acc.email = item.email;
         acc.gender  = item.gender;
         acc.role = item.role;
         acc.avatarUrl = item.avatarUrl;
        
         acc.save(function (err) {
                  
              if (err) throw err;
                  console.log('Account successfully updated!');
                });

         
      });

    res.redirect('/table.html');

});



var csrf = require('csurf');
var csrfProtection = csrf();
router.use(csrfProtection);

var flash = require('connect-flash');
router.use(flash());

function isLoggedIn(req,res,next){
    if (req.app.locals.currentUser != null){
    if (req.isAuthenticated() && req.app.locals.currentUser.role == 'ADMIN'){
           return next();
      }
  }
    res.redirect('/login.html');
};
module.exports = router;
