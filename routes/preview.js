var express = require('express');
var router = express.Router();

var Product = require('../models/product')
var Comment = require('../models/comment')


/* GET home page. */
router.get('/', function(req, res, next) {

	var id = req.query.id
	var action = req.query.action;
	var product;

	var summary = req.query.summary;
	var	comment = req.query.comment;
	var username = req.query.username;

	var search_key = req.query.search_key;
	var filter = req.query.filter;


	if (search_key != null){
		var data = [];
		if (filter == "All"){

			console.log("******************zo all");

			for (i = 0 ; i < req.app.locals.data.length ; i++){
				if (req.app.locals.data[i].name.indexOf(search_key) >= 0 || req.app.locals.data[i].description.indexOf(search_key) >= 0){
					data.push(req.app.locals.data[i]);
				}
			}

		}else if (filter == "Price"){
			for (i = 0 ; i < req.app.locals.data.length ; i++){
				if (req.app.locals.data[i].price == Number(search_key)){
					data.push(req.app.locals.data[i]);
				}
			}

		}else{

			for (i = 0 ; i < req.app.locals.data.length ; i++){
				if (req.app.locals.data[i].category == filter && (req.app.locals.data[i].name.indexOf(search_key) >= 0 || req.app.locals.data[i].description.indexOf(search_key) >= 0)){
					data.push(req.app.locals.data[i]);
				}
			}

		}

		res.render('index', { title:"ProductManagement", data: data });
	}
	else{
		if (id != null){	

			var comments = [];

			Product.findById(id,function (err,_product) {
			   if(err){
				   console.log(err);
				   return;
			   }    

			    product = _product
	 		    
	 		    var reviewNumber = _product.reviewNumber;
	 		    console.log("************reviewNumber: "+ reviewNumber);
			    _product.reviewNumber = reviewNumber + 1;
	 		   _product.save(function(err){  
				            if (err){
				           console.log(err);
				           return;
				       }
				   });
	 		    for (i = 0 ; i < product.comments.length ; i++){

					Comment.findById(product.comments[i],function (err,comment) {
					   if(err){
						   console.log(err);
						   return;
					   }

					   comments.push(comment);

					});  

	 		    }

	 		    res.render('preview', { title: 'Detail Product', product: product, comments: comments});

	  			if (action == "add_to_card"){
					req.app.locals.cards.push(product);
				}

				if (summary != null){

					var item = new Comment({username: username, summary: summary, comment: comment});

					comments.push(item);

				       item.save(function(err){  
				            if (err){
				           console.log(err);
				           return;
				       }
				   });
				
					_product.comments.push(item.id);
					_product.save(function(err){  
				            if (err){
				           console.log(err);
				           return;
				       }
				   });
				}
			});





		}else{
			res.render('preview', { title: 'Detail Product',user:req.app.locals.currentUser}); 
		}

	}

	



});



module.exports = router;
