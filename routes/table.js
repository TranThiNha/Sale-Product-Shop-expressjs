var express = require('express');
var router = express.Router();

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


var Product = require('../models/product')

/* GET home page. */
router.get('/',isLoggedIn, function(req, res, next) {

	var indexs = req.query.indexs;

	//Get query action
	var action = req.query.action;

	if (action == 'delete'){

		var indexsArray = [];
		indexsArray = indexs.split(',');

			for (i = 0; i < indexsArray.length ; i++){

			if (req.app.locals.data[indexsArray[i]] != null){
				var _id = req.app.locals.data[indexsArray[i]]._id.toString();

			    Product.findOneAndRemove({_id:_id}, function(err) {
			      if (err) throw err;
			      console.log(err);

			      // we have deleted the user
			      console.log('product deleted!');


			    });
				req.app.locals.data.splice(indexsArray[i], 1);
			}

			
		}


		
	}

  res.render('table', { title: '1412477', username: 'Đoàn Hiếu Tâm', data: req.app.locals.data , layout: "layout_admin.hbs" ,user: req.app.locals.currentUser});
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
