// File: ./model/usermodel.js

//Require Mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
		prodct_id_list: [String],
		product_name_list: [String],
		number_each_product_list:[String],
		total_price: {type:Number, default: 0},
		status: {type: String, default: "not delivery"},
		username: String,
		user_email: String,
		email: String,
		address: String,
		telephone: String,
		time:{ type: Date, default: Date.now }
});

module.exports = mongoose.model('order', orderSchema);
