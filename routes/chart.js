var express = require('express');
var router = express.Router();



router.get('/',function(req, res, next) {

  	res.render('chart',{layout: "layout_admin.hbs" ,user: req.app.locals.currentUser});
});


module.exports = router;
