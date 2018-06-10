/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    https = require('https'),
    http = require('http'),
    path = require('path'),
    fs = require('fs');

var app = express();
var assert = require('assert-plus');
var util = require('util');
var port = 8000;
// Then we'll pull in the database client library
var MongoClient = require("mongodb").MongoClient;
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');
var mongoose = require('mongoose');
var dbConfig = require('./config/dbconfig');
// app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').renderFile);

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));
var flash = require('connect-flash');
var session = require('express-session');
// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Connect Flash
app.use(flash());
app.enable('trust proxy');
// Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();

});

routes.init(app);
// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

var uri = dbConfig.uri

mongoose.connect(uri,
    {
        poolSize: 2,
        promiseLibrary: global.Promise
    }
)

// If the connection throws an error
mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
});


// Start listening on the port
var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});
