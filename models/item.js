// File: ./model/usermodel.js

//Require Mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var cardSchema = new Schema({	
	product_id : String,
	product_name: String,
	number: {type: Number, default: 1},
	product_image: String, 
	product_price: {type: Number, default: 0}
});

module.exports = mongoose.model('item', cardSchema);
