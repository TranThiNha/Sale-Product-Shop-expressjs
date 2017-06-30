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

var Order = require('../models/order');
var Product = require('../models/product');

/* GET home page. */
router.use(function(req,res,next){
    res.locals.login = req.isAuthenticated();

    next();
});

router.get('/',isLoggedIn,function(req, res, next) {

	var done = false;
	var order;
	if (req.query.number_list != "" && req.query.number_list != null){
		req.app.locals.number_each_product_list = req.query.number_list.split(',');
		for (i= 0; i< req.app.locals.cards.length ;i++){

			if (req.app.locals.number_each_product_list[i] != null && req.app.locals.cards[i] != null){

				req.app.locals.product_name_list.push(req.app.locals.cards[i].name);

				req.app.locals.total_price += req.app.locals.cards[i].price * Number(req.app.locals.number_each_product_list[i]);

				req.app.locals.product_id_list.push(req.app.locals.cards[i].id); 
			}
			    
		} 

		order = new Order({total_price:req.app.locals.total_price, product_name_list: req.app.locals.product_name_list,number_each_product_list: req.app.locals.number_each_product_list});

	} else {
		var name = req.query.name;
		var email = req.query.email;
		var address = req.query.address;
		var telephone = req.query.telephone;



		order = new Order({user_email:req.app.locals.currentUser.email, prodct_id_list:req.app.locals.product_id_list,total_price:req.app.locals.total_price,username: name,email: email, address:address,telephone:telephone, product_name_list: req.app.locals.product_name_list,number_each_product_list: req.app.locals.number_each_product_list});
		order.save(function(err){  
				            if (err){
				           console.log(err);
				           return;
				       }

				    });


		for (j= 0;  j < req.app.locals.product_id_list.length ;j++){

			var number = req.app.locals.number_each_product_list[j];
		    Product.findById(req.app.locals.product_id_list[j],function (err,product) {

		         if(err){
		             console.log(err);
		             return;
		         }
		         
		         if (product){

		         	var saleNumber = product.saleNumber;

		         	console.log("j="+j+"********number: "+ number);

		         	if (number != null){
		         		product.saleNumber = Number(saleNumber) + Number(number);		           

			            product.save(function (err) {
			                    
			                if (err) throw err;
			                    console.log('product successfully updated!');
			                  });
			         	}
		         
		         }
		        

		         
		      });
		}

		req.app.locals.data = [];

		Product.find(function(err,docs){
		    req.app.locals.data = docs;
		    //console.log(app.locals.data[0].images[0])
		});

		req.app.locals.order_list.push(order);

		req.app.locals.total_price = 0;
		req.app.locals.cards = [];
		req.app.locals.product_id_list = [];
		req.app.locals.number_each_product_list =[];
		req.app.locals.product_name_list = [];


		done = true;
	}
	
	
			   

  res.render('order_product', { title: '1412477', user:req.app.locals.currentUser, done: done,order: order });
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
