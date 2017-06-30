var express = require('express');
var router = express.Router();
var multer  =   require('multer');

var passport = require('passport');
var flash = require('connect-flash');
router.use(flash());
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

var Product = require('../models/product')
	var image_list = []

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads/');
  },
  filename: function (req, file, callback) {
  	image_list.push("/"+file.originalname);
    callback(null,  file.originalname);
  }
});

var upload = multer({ storage : storage });



router.get('/',isLoggedIn, function(req, res, next) {
  res.render('form', { csrfToken: req.csrfToken(),title: '1412477', username: 'Đoàn Hiếu Tâm' ,layout: "layout_admin.hbs",user: req.app.locals.currentUser });
});


router.post('/',upload.array('image1',4), function (req, res) {
   
	var requestBody = req.body;
	var colors  = []

  var images = [];
  for (j = image_list.length - 1; j > image_list.length - 5 ; j --){
    images.push(image_list[j]);
  }

  if (req.body.color != null){
    colors = req.body.color.split(',');
  }

	var item = new Product({name: requestBody.name, description: requestBody.description, price: requestBody.price, weight: requestBody.weight, category: requestBody.category, colors: colors, images:images, comments:[]});

				req.app.locals.data.push(item)

			       item.save(function(err){  
			            if (err){
			           console.log(err);
			           return;
			       }

			    });  

			    res.redirect('/table.html');
});




var flash = require('connect-flash');
router.use(flash());

function isLoggedIn(req,res,next){
    if (req.isAuthenticated() && req.app.locals.currentUser.role == 'ADMIN'){
        return next();
    }
    res.redirect('/login.html');
};


module.exports = router;
