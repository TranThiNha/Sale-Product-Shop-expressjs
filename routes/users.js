var express = require('express');
var router = express.Router();
var passport = require('passport');
var session = require('express-session');
var validator = require('express-validator');
router.use(session({secret:'mysupersecret',resave:false, saveUninitialized:false}));


router.use(passport.initialize());
router.use(passport.session());
router.use(validator());
//Cau hinh ejs
require('../config/passport');
var Product = require('../models/product')

router.get("/",isLoggedIn, function(req,res,next){
    res.render('users',{users: req.app.locals.users,layout: "layout_admin.hbs",user: req.app.locals.currentUser});

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
