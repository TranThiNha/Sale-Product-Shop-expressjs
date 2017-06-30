var express = require('express');
var router = express.Router();



router.get('/',function(req, res, next) {

	var message = req.query.message;
	var active = req.query.active;

	if (active == "change_password"){

	}

  	res.render('confirm_email',{message: message});
});


module.exports = router;
