var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var multer  =   require('multer');


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

var Account = require('../models/account');


var avatarUrl = "";


var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, 'uploads/');
  },
  filename: function (req, file, callback) {
  	avatarUrl = "/"+file.originalname;
    callback(null,  file.originalname);
  }
});

var upload = multer({ storage : storage });


/* GET home page. */
router.use(function(req,res,next){
    res.locals.login = req.isAuthenticated();

    next();
});

router.get("/",isLoggedIn,function(req,res,next){


		var order_list = [];
		for (i = 0 ; i < req.app.locals.order_list.length; i++) {
			if (req.app.locals.order_list[i].user_email == req.app.locals.currentUser.email){
				order_list.push(req.app.locals.order_list[i]);
			}
		}

	    res.render('user_profile', {csrfToken: req.csrfToken(),user:req.app.locals.currentUser,order_list: order_list});

});

router.post('/',upload.array('avatar',1), function (req, res) {

	var message = "";
	var username = req.body.username;
	var email = req.body.email;
	var gender = req.body.gender;
	var old_password = req.body.old_password;
	var new_password = req.body.new_password;

	console.log("**********name = "+ username);

	if (old_password  != null && old_password != ""){

		if (!req.app.locals.currentUser.validPassword(old_password)){
			message = "Password is not correct!";
		}else{
			if (new_password.length < 4 || new_password == null){
				message = "Password must have at least 4 characters!";
			}else{
				Account.findOne({'email': req.app.locals.currentUser.email}, function(err,user){

					if (err){
						return ;
					}
					else if (!user){
						return ;
					}

					else{

						user.password = user.encryptPassword(new_password);
						user.username = username;
						user.gender = gender;
						if (avatarUrl != ""){
							user.avatarUrl = avatarUrl;
						}
						user.save(function(err,result){

							if (err){
								return ;
							}	
							console.log("update password success!");
							return ;
						});	
					}
					
					
				});
			}
		}		
	}else if (username != null && username != ""){

		Account.findOne({'email': req.app.locals.currentUser.email}, function(err,user){

				if (err){
					return ;
				}
				else if (!user){
					return ;
				}

				else{
					user.username = username;
					user.gender = gender;
					if (avatarUrl != ""){
							user.avatarUrl = avatarUrl;
						}

					req.app.locals.currentUser = user;
					user.save(function(err,result){

						if (err){
							return ;
						}	
						console.log("update password success!");
						return ;
					});	
				}
				
				
			});
	}

	if (message != ""){
		res.render('user_profile', {csrfToken: req.csrfToken(),user:req.app.locals.currentUser, message: message});
	}else{
		res.redirect('/user_profile.html');
	}

    
});



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
