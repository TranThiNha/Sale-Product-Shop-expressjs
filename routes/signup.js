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
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
/*let transporter = nodemailer.createTransport({
    host: 'smtp.example.com',
    port: 465,
    secure: true, // secure:true for port 465, secure:false for port 587
    auth: {
        user: 'username@example.com',
        pass: 'userpass'
    }
});
*/
var transporter = nodemailer.createTransport('smtps://dtphuyen2506%40gmail.com:28051996@smtp.gmail.com');
// setup email data with unicode symbols


// send mail with defined transport object


router.use(function(req,res,next){
    res.locals.login = req.isAuthenticated();
    next();
});

router.get("/",function(req,res,next){
    var message = req.flash('error');
    res.render("signup",{csrfToken: req.csrfToken(), message:message, hasError:message.length > 0,layout:'layout_login.hbs'});
});



router.post('/',
    passport.authenticate('local.signup', { 
    	failureRedirect: '/signup.html', 
    	failureFlash: true }),
    function(req, res) {

        req.app.locals.users.push(req.user);
        
    	let mailOptions = {
		    from: '"Product management Robot" <tranthinha160296@gmail.com>', // sender address
		    to: req.user.email, // list of receivers
		    subject: 'okl', // Subject line
		    text: 'Xin chào', // plain text bodyd
		    html: 'http://localhost:3000/login.html?token=' + req.user.token // html body
		};
		    transporter.sendMail(mailOptions, (error, info) => {
		    if (error) {
		        return console.log(error);
		    }
		    console.log('Message %s sent: %s', info.messageId, info.response);
		});


        var message = "Please, check email to active account!";    

    	res.redirect('/confirm_email.html?message='+message);
});


module.exports = router;
