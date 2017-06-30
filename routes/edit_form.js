
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



/* GET home page. */
router.use(function(req,res,next){
    res.locals.login = req.isAuthenticated();

    next();
});

var Product = require('../models/product');


router.get('/',isLoggedIn, function(req, res, next) {
  //Index of current user to edit
  var index = req.query.index;

  if (typeof index !== 'undefined') {
      //Pass a user data to handlebars at index
    res.render('edit_form', { csrfToken: req.csrfToken(),index:index,title: '1412477', username: 'Đoàn Hiếu Tâm', product: req.app.locals.data[index] , layout: "layout_admin.hbs", user: req.app.locals.currentUser });
  }
  else {
    res.render('edit_form', {csrfToken: req.csrfToken(), title: '1412477', username: 'Đoàn Hiếu Tâm',user: req.app.locals.currentUser});
  }
});

router.post('/', function (req, res) {
  //Get index from the query. This is index of selected user to save

  var action = req.query.action;

  console.log("*******action: "+ action);

    var id = req.body._id;
    var name = req.body.name;
    var description = req.body.description;
    var price = req.body.price;
    var weight = req.body.weight;
    var category = req.body.category;
    
    var colors = [];

    var index = req.body.index;

   
    
    if (req.body.colors != null){
        colors = req.body.colors.split(",") 
    }
     

    console.log("***********index= "+index);
        console.log("***********name= "+name);


    Product.findById(id,function (err,product) {

         if(err){
             console.log(err);
             return;
         }
         
         if (product){

           product.name = name;
           product.description = description;
           product.price  = price;
           product.weight = weight;
           product.category = category;
           product.colors = colors;
           

            req.app.locals.data[index] = product;
            product.save(function (err) {
                    
                if (err) throw err;
                    console.log('product successfully updated!');
                  });
         }
        

         
      });

    res.redirect('/table.html');
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

