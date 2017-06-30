var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var randomstring = require("randomstring");



var accountSchema = mongoose.Schema({
	username : String,
	avatarUrl: {type:String, default: '/images/puppy.jpg'},
	email: String,
	gender:{type:String, default: 'Female'},
	role: {type: String, default: 'USER'},
	isActive: {type: Boolean, default: false},
	token: {type: String, default: randomstring.generate()},
	password: String
});


accountSchema.methods.encryptPassword = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5),null);
};	


accountSchema.methods.validPassword = function(password){
	return bcrypt.compareSync(password,this.password);
};



module.exports = mongoose.model('Account', accountSchema);