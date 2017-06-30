var express = require('express');
var router = express.Router();

var Item = require('../models/item');
var Product = require('../models/product');
var Order = require('../models/order');

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

	var index = req.query.index;
	var status = req.query.status;
	var order = [];
	var items = [];

	if (index != null){
		order = req.app.locals.order_list[index];

		var product_id_list = req.app.locals.order_list[index].prodct_id_list;
		var number_each_product_list = req.app.locals.order_list[index].number_each_product_list;

		for (i= 0 ; i < product_id_list.length; i++){

			 Product.findById(product_id_list[i],function (err,product) {
		         if(err){
		             console.log(err);
		             return;
		         }        
		         if (product){
		         	var total_product_price = 0;// product.price * (number_each_product_list[i]);


		         	var item = new Item({product_id: product.id, number:  number_each_product_list[i],product_image:product.images[0], product_name: product.name,product_price: product.price });

		         	items.push(item);
		         }

		                  
     		 });

		}
	}

	if(status != null && status != ""){
		Order.findById(req.app.locals.order_list[index].id,function (err,order) {
		         if(err){
		             console.log(err);
		             return;
		         }        
		         order.status = status;

		         req.app.locals.order_list[index] = order;

		         order.save(function(err){  
			            if (err){
				           console.log(err);
				           return;
				       }

				    });  		                  
     		 });

		res.redirect('/order_table.html');
	}
	


  	res.render('detail_order',{order: req.app.locals.order_list[index], index: index, layout: "layout_admin.hbs" ,user: req.app.locals.currentUser,items: items,total:req.app.locals.order_list[index].total_price });
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
