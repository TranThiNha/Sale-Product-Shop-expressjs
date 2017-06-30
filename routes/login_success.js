var express = require('express');
var router = express.Router();
var Account = require('../models/account')

router.get("/",function(req,res,next){

	var id = req.query.id;
	var email = req.query.email;
	var username = req.query.username;
	var role = req.query.role;
	var avatarUrl = req.query.avatarUrl;
	var password = req.query.password;

	req.app.locals.currentId = id;

	req.app.locals.currentUser = new Account({username: username, avatarUrl:avatarUrl ,email:email ,role:role, password: password});


	if (role == 'USER'){
		res.redirect('/user_profile.html');
	}else{
		res.redirect('/table.html');
}
    
	
});

module.exports = router;
