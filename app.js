var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var index = require('./routes/index');
var users = require('./routes/users');
var preview = require('./routes/preview');
var card = require('./routes/card');
var form = require('./routes/form');
var profile = require('./routes/profile');
var table = require('./routes/table');
var edit_form = require('./routes/edit_form');
var login = require('./routes/login');
var signup = require('./routes/signup');
var login_success = require('./routes/login_success');
var user_profile = require('./routes/user_profile');
var order_product = require('./routes/order_product');
var confirm_email = require('./routes/confirm_email');
var users = require('./routes/users');
var logout = require('./routes/logout');
var detail_user = require('./routes/detail_user');
var add_user_form = require('./routes/add_user_form');
var change_password = require('./routes/change_password');
var order_table = require('./routes/order_table');
var detail_order = require('./routes/detail_order');
var chart = require('./routes/chart');
var statistic =require('./routes/statistic');
require('./config/passport');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use("/build", express.static(__dirname + '/build'));
app.use("/vendors", express.static(__dirname + '/vendors'));

app.use('/', index);
app.use('/index.html', index);
app.use('/users.html', users);
app.use('/preview.html', preview);
app.use('/card.html', card);
app.use('/form.html', form);
app.use('/profile.html', profile);
app.use('/table.html', table);
app.use('/edit_form.html', edit_form);
app.use('/login.html',login);
app.use('/signup.html',signup);
app.use('/login_success.html',login_success);
app.use('/user_profile.html',user_profile);
app.use('/order_product.html',order_product);
app.use('/confirm_email.html',confirm_email);
app.use('/users.html', users);
app.use('/logout.html',logout);
app.use('/detail_user.html',detail_user);
app.use('/add_user_form.html',add_user_form);
app.use('/change_password.html',change_password);
app.use('/order_table.html',order_table);
app.use('/detail_order.html',detail_order);
app.use('/chart.html',chart);
app.use('/statistic.html',statistic);
///Set up default mongoose connection
var mongoDB = 'mongodb://127.0.0.1/product_management';
mongoose.connect(mongoDB);

//Get the default connection
var db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Create a UserModel model just by requiring the module in separate file
var Product = require('./models/product')
var Account = require('./models/account');
var Order = require('./models/order');
app.locals.data = [];
app.locals.cards = [];
app.locals.users = [];
app.locals.currentUser;
app.locals.currentId;
app.locals.number_per_page = 10;
app.locals.total_price = 0;
app.locals.product_id_list = [];
app.locals.product_name_list = [];
app.locals.number_each_product_list = [];
app.locals.order_list = [];
Product.find(function(err,docs){
    app.locals.data = docs;
    //console.log(app.locals.data[0].images[0])
});

Order.find(function(err,docs){
  app.locals.order_list = docs;
});

Account.find(function(err,docs){
  app.locals.users = docs;
});


var session = require('express-session');
var passport = require('passport');
var validator = require('express-validator');
app.use(session({secret:'mysupersecret',resave:false, saveUninitialized:false}));


app.use(passport.initialize());
app.use(passport.session());
app.use(validator());
//Cau hinh ejs
require('./config/passport');


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

var csrf = require('csurf');
var csrfProtection = csrf();
app.use(csrfProtection);

var flash = require('connect-flash');
app.use(flash());



module.exports = app;
