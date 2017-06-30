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

var csrf = require('csurf');
var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.use(function(req,res,next){
    res.locals.login = req.isAuthenticated();

    next();
});

var Account = require('../models/account')
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

router.get('/',isLoggedIn,function(req, res, next) {
  res.render('add_user_form', { csrfToken: req.csrfToken(), title: '1412477', layout: "layout_admin.hbs",user: req.app.locals.currentUser });
});


router.post('/',upload.single('avatar'), function (req, res) {
   
  var requestBody = req.body;

  var item = new Account({username: requestBody.username, email: requestBody.email, gender: requestBody.gender, role: requestBody.role, avatarUrl: avatarUrl, password: requestBody.password});

        req.app.locals.users.push(item)

             item.save(function(err){  
                  if (err){
                 console.log(err);
                 return;
             }

          });  

          res.redirect('/users.html');
});


var flash = require('connect-flash');
router.use(flash());

function isLoggedIn(req,res,next){

  if (req.app.locals.currentUser){
    if (req.isAuthenticated() && req.app.locals.currentUser.role == 'ADMIN'){
        return next();
    }
  }

    
    res.redirect('/login.html');
};
  
module.exports = router;
