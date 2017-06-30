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

router.get("/", isLoggedIn,function(req,res,next){
  var index = req.query.index;
    res.render('detail_user',{ csrfToken: req.csrfToken(),index: index,layout: "layout_admin.hbs",user: req.app.locals.users[index]});

});

router.post('/',upload.array('avatar',1), function (req, res) {

  var requestBody = req.body;

  var index = req.body.index;

  var id = req.app.locals.users[index]

  var item = new Account({username: requestBody.username, email: requestBody.email,role: requestBody.role, gender: requestBody.gender,avatarUrl: avatarUrl});

  req.app.locals.users[index] = item;

  Account.findById(id,function (err,acc) {
         if(err){
             console.log(err);
             return;
         }
         if (acc){
            acc.username = item.username;
             acc.email = item.email;
             acc.gender  = item.gender;
             acc.role = item.role;
             acc.avatarUrl = item.avatarUrl;
            
             acc.save(function (err) {
                      
                  if (err) throw err;
                      console.log('Account successfully updated!');
                    });

         }
         

         
      });

    res.redirect('/users.html');

});





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
