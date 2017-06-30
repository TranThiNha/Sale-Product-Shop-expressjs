
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
var csrf = require('csurf');
var csrfProtection = csrf();
router.use(csrfProtection);

var flash = require('connect-flash');
router.use(flash());

router.use('/login.html',notLoggedIn,function(req,res,next){
    next();
});

router.get("/",function(req,res,next){
    req.logout();
    req.app.locals.total_price = 0;
	req.app.locals.cards = [];
	req.app.locals.product_id_list = [];
	req.app.locals.number_each_product_list =[];
	req.app.locals.product_name_list = [];
    res.redirect('/login.html');
});

function notLoggedIn(req,res,next){
    if (!req.isAuthenticated()){
        return next();
    }
    res.redirect('/');
};

module.exports = router;
