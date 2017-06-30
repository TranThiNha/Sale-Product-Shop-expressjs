var express = require('express');
var router = express.Router();

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

var flash = require('connect-flash');
router.use(flash());


router.use(function(req,res,next){
    res.locals.login = req.isAuthenticated();

    next();
});


var Account = require('../models/account');

router.get("/",function(req,res,next){

	var token = req.query.token;

	var currentAcc;
	for (i = 0 ; i  < req.app.locals.users.length; i++){


		if (req.app.locals.users[i].token == token && i < req.app.locals.users.length){

			currentAcc = req.app.locals.users[i];			
		}
	}


	if (currentAcc != null){
		Account.findById(currentAcc.id,function (err,acc) {
	         if(err){
	             console.log(err);
	             return;
	         }

	        

	         acc.isActive = true;
	        
	         acc.save(function (err) {
	                  
	              if (err) throw err;
	                  console.log('Account successfully updated!');
	            });
	         
	      });
	}
	
		var message = req.flash('error');
    	res.render("login",{csrfToken: req.csrfToken(), message:message, hasError:message.length > 0,layout:'layout_login.hbs'});

    
});


router.post('/',
    passport.authenticate('local.signin', { 
    	failureRedirect: '/login.html', 
    	failureFlash: true }),
    function(req, res) {	
    	res.redirect('/login_success.html?id='+req.user.id+'&email=' + req.user.email+'&username='+req.user.username+'&role='+req.user.role+'&avatarUrl='+req.user.avatarUrl+'&password='+req.user.password);
});

module.exports = router;
