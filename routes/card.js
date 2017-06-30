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

/* GET home page. */
router.get('/', function(req, res, next) {

	var index = req.query.index;


	var search_key = req.query.search_key;
	var filter = req.query.filter;


	if (search_key != null){
		var data = [];
		if (filter == "All"){

			console.log("******************zo all");

			for (i = 0 ; i < req.app.locals.data.length ; i++){
				if (req.app.locals.data[i].name.indexOf(search_key) >= 0 || req.app.locals.data[i].description.indexOf(search_key) >= 0){
					data.push(req.app.locals.data[i]);
				}
			}

		}else if (filter == "Price"){
			for (i = 0 ; i < req.app.locals.data.length ; i++){
				if (req.app.locals.data[i].price == Number(search_key)){
					data.push(req.app.locals.data[i]);
				}
			}

		}else{

			for (i = 0 ; i < req.app.locals.data.length ; i++){
				if (req.app.locals.data[i].category == filter && (req.app.locals.data[i].name.indexOf(search_key) >= 0 || req.app.locals.data[i].description.indexOf(search_key) >= 0)){
					data.push(req.app.locals.data[i]);
				}
			}

		}

		res.render('index', { title:"ProductManagement", data: data });
	} else{
		
		if (index != null){
				req.app.locals.cards.splice(index, 1);
		}

		var total_price  = 0 ;
		for (i = 0 ; i < req.app.locals.cards.length; i++){
			total_price += req.app.locals.cards[i].price;
		}

	  res.render('card', { title: 'Card', cards: req.app.locals.cards , total_price: total_price,user:req.app.locals.currentUser });
	}

	
});


var csrf = require('csurf');
var csrfProtection = csrf();
router.use(csrfProtection);

var flash = require('connect-flash');
router.use(flash());

function isLoggedIn(req,res,next){
    if (req.isAuthenticated()){
        return next();
    }
    res.redirect('/login.html');
};


module.exports = router;
