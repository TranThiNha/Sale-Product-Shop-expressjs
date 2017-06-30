var express = require('express');
var router = express.Router();



router.get('/',function(req, res, next) {

	var type = req.query.type;

	var date_type;
	var month_type;
	var year_type;
	var day = req.query.day;
	var month = req.query.month;
	var year = req.query.year;

	var result_list = [];

	if (type=="date"){
		date_type = "date";
	}
	if (type == "month"){
		month_type = "month";
	}
	if (type == "year"){
		year_type = "year";
	}
	var products = [];

	for (i = 0 ; i < req.app.locals.order_list.length; i++){
		/*if (type =="date" &&  req.app.locals.order_list[i].time.getDay() = day && req.app.locals.order_list[i].time.getMonth() = month && req.app.locals.order_list[i].time.getYear() = year){

		} else if(type == "month" && req.app.locals.order_list[i].time.getMonth() = month){

		}else if (type == "year" && req.app.locals.order_list[i].time.getYear() = year){

		}*/
	}

  	res.render('statistic',{layout: "layout_admin.hbs" ,user: req.app.locals.currentUser, products: products,type:type, date_type: date_type, month_type: month_type, year_type: year_type});
});


module.exports = router;
