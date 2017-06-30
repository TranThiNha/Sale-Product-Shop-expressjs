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


router.get('/',isLoggedIn, function(req, res, next) {
	

  	res.render('order_table',{ title: '1412477',user: req.app.locals.currentUser ,data:req.app.locals.order_list, layout: "layout_admin.hbs"});

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
