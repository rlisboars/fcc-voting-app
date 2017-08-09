require('dotenv').config();

var express = require('express');
var app = express();
var port = process.env.PORT || 3001;
var mongoose = require('mongoose');
var passport = require('passport');

var morgan = require('morgan');
var bodyParser = require('body-parser');

var configDB = require('./config/database');

mongoose.connect(configDB.url);

require('./config/passport')(passport);

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.static('../client' + '/build'));

app.set('view engine', 'ejs');

// Passport configuration
app.use(passport.initialize());
// ----------------------

require('./app/routes')(app, passport);

app.listen(port);
console.log('Server started on port ' + port + '.');
