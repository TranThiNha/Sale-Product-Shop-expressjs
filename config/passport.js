var passport = require('passport');
var Account = require('../models/account');
var localStrategy = require('passport-local').Strategy;



passport.serializeUser(function(user,done){
	done(null,user.id);
});

passport.deserializeUser(function(id,done){
	Account.findById(id,function(err,user){
		done(err,user);
	});
});

passport.use('local.signup',new localStrategy({
	usernameField:'email',
	passwordField: 'password',
	passReqToCallback: true
},function(req, email, password,done){

	req.checkBody('email','Invalid email!').notEmpty().isEmail();
	req.checkBody('password','Invalid password (length >= 4)!').notEmpty().isLength({min:4});

	var errors = req.validationErrors();

	if (errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});

		return done(null,false,req.flash('error',messages));
	}

	Account.findOne({'email': email}, function(err,user){
		if (err){
			return done(err);
		}
		if (user){
			return done(null,false,{message:'email is already in use.'});
		}
		var newUser = new Account();
		newUser.email = email;
		newUser.password = newUser.encryptPassword(password);
		newUser.username = req.body.username;
		newUser.save(function(err,result){

			if (err){
				return done(err);
			}	
			return done(null,newUser);
		});	
	});
}));


passport.use('local.signin',new localStrategy({
	usernameField:'email',
	passwordField: 'password',
	passReqToCallback: true
},function(req, email, password,done){

	req.checkBody('email','Invalid email!').notEmpty().isEmail();
	req.checkBody('password','Invalid password (length >= 4)!').notEmpty();

	var errors = req.validationErrors();

	if (errors){
		var messages = [];
		errors.forEach(function(error){
			messages.push(error.msg);
		});

		return done(null,false,req.flash('error',messages));
	}

	Account.findOne({'email': email}, function(err,user){
		if (err){
			return done(err);
		}
		if (!user){
			return done(null,false,{message:'No user found!'});
		}

		if (!user.validPassword(password))	{
			return done(null,false,{message:'Wrong password!'});

		}

		if (user.isActive == false){
			return done(null,false,{message:'Account is not active, check mail to active account!'});
		}

		return done(null,user);
	});
}));

