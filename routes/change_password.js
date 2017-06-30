var express = require('express');
var router = express.Router();
const nodemailer = require('nodemailer');

var Account = require('../models/account');

var transporter = nodemailer.createTransport('smtps://dtphuyen2506%40gmail.com:28051996@smtp.gmail.com');


router.get("/",function(req,res,next){


	var email = req.query.email;
	var received_token = req.query.token;		
	var message = "";
	var check = 0;
	var token ;
	var notify;
	var hidden_email = req.query.hidden_email;

	var newpassword = req.query.newpassword;
	var renewpassword = req.query.renewpassword;


	if (email != null && email != ""){
		for (i = 0 ;i < req.app.locals.users.length; i++){
			if (req.app.locals.users[i].email == email){
				check = 1;
				token = req.app.locals.users[i].token;

				if (received_token != null && received_token != ""){
					if (received_token == token){
						notify = "done";
					}
				}
			}
		}


		if (check == 0){
			message = "No Email is found!";
		} else if (!(received_token != null && received_token != "")){

			let mailOptions = {
			    from: '"Product management Robot" <tranthinha160296@gmail.com>', // sender address
			    to: email, // list of receivers
			    subject: 'okl', // Subject line
			    text: 'Xin chào', // plain text bodyd
			    html: 'http://localhost:3000/change_password.html?email='+email+'&token=' + token // html body
			};
			    transporter.sendMail(mailOptions, (error, info) => {
				    if (error) {
				        return console.log(error);
				    }
			    	console.log('Message %s sent: %s', info.messageId, info.response);
				});

			res.redirect('/confirm_email.html?message=Check email to continue!');
		}
	}else if (newpassword != null && newpassword != "" && hidden_email != null){

		if (newpassword.length < 4){
			message = "Password must have at least 4 character!";
			notify = "done!";
		}
		else if (newpassword != renewpassword){	


			message = "Renew password must be equal to new password!";
			notify = "done!";
		}else{


			Account.findOne({'email': hidden_email}, function(err,user){

				if (err){
					return ;
				}
				else if (!user){
					return ;
				}

				else{

					user.password = user.encryptPassword(newpassword);
				
					user.save(function(err,result){

						if (err){
							return ;
						}	
						console.log("update password success!");
						return ;
					});	
				}
				
				
			});
			res.redirect('/login.html');
		}
	}
	
	


	res.render('change_password',{message:message, notify: notify,email: email});

    
	
});


module.exports = router;
