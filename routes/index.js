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

var Product = require('../models/product');

/* GET home page. */
router.use(function(req,res,next){
    res.locals.login = req.isAuthenticated();

    next();
});

/* GET home page. */
router.get('/', function(req, res, next) {
	var category = req.query.category;
	var data = []
	var number_of_page = [];
	var search_key = req.query.search_key;
	var filter = req.query.filter;
	
	var page = 1;
	if (category != null && category != ""){

		if (category == "top10"){
			
		    for (var k = 0; k < req.app.locals.data.length -1; k++) {
		        
		        for (l = k + 1; l < req.app.locals.data.length; l++) {
		            if (req.app.locals.data[k].saleNumber < req.app.locals.data[l].saleNumber) {
		                var temp = req.app.locals.data[k];
		                req.app.locals.data[k] = req.app.locals.data[l];
		                req.app.locals.data[l] = temp;
		            }
		        }

		    }

		    for (i = 0; i< 10 && i < req.app.locals.data.length ; i++){
		        	data.push(req.app.locals.data[i]);
		        }
		           


		}else{
			category = category.replace(/\_/g,' ');	


			for (i = 0 ; i < req.app.locals.data.length ; i++){
				if (req.app.locals.data[i].category == category){
					data.push(req.app.locals.data[i])
				}
			}
		}

		
	}else if (search_key != null){

		if (filter == "All"){


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

	}else{

		data = req.app.locals.data
	}

	var total_product = data.length;

	if (req.query.number_per_page != null){
			req.app.locals.number_per_page = req.query.number_per_page;
		}

		for (i = 1 ; i < total_product / req.app.locals.number_per_page + 1 ; i++){
			number_of_page.push(i);
		}

	if (req.query.page_number != null && req.query.page_number != ""){
		page = req.query.page_number;
	}			
	
	var data_on_page = [];

	for (i = req.app.locals.number_per_page * (page - 1) ; (i < data.length) && ( i< req.app.locals.number_per_page * page) ; i++){
		data_on_page.push(data[i]);
	}
	
  	res.render('index', { title:"ProductManagement",user:req.app.locals.currentUser,  data: data_on_page ,category: category,number_of_page:number_of_page,number_per_page: req.app.locals.number_per_page });
});


var csrf = require('csurf');
var csrfProtection = csrf();
router.use(csrfProtection);

var flash = require('connect-flash');
router.use(flash());

function isLoggedIn(req,res,next){
	if (req.app.locals.currentUser != null){
		if (req.isAuthenticated()){
	        return next();
	    }
	}
    
    res.redirect('/login.html');
};


module.exports = router;
