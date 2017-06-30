// File: ./model/usermodel.js

//Require Mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
	
	name : String,
	description: String,
	price: {type: Number, default: 0},
	weight: {type: Number, default: 0},
	category: String, //index of category list 
	colors: [String],
	images: [String],
	reviewNumber:{type: Number, default: 0},
	saleNumber:{type: Number,default: 0},
	comments: [String]
});

module.exports = mongoose.model('product', productSchema);
