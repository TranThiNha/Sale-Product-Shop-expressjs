// File: ./model/usermodel.js

//Require Mongoose
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
	
	username : String,
	summary: String,
	comment: String,
	date:{ type: Date, default: Date.now }

});

module.exports = mongoose.model('comment', productSchema);
