var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var assert = require('assert');

var config = require('./config.js');

var Events = require('./models/events');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUrl);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected
  console.log('Connected correctly to mongodb server');

  // SCHEMAS TESTING --------------------------

  // create a new event
  var newEvent = Events({
    title: 'MegaEvent!!!',
    description: 'Come on in everybody!',
    // eventDate: Date.now,
    ageRestrict: 18,
    place: {
      country: 'Somecountry',
      city: 'Somecity'
    },
    comments: [{
      body: 'The first comment',
      author: 'Jameson' }]
  });

  // add a comment
  newEvent.comments.push({
    body: 'Another stupid comment',
    author: 'Anonymous'
  });

  // save the event
  newEvent.save(function (err) {
    if (err) next(err);
    console.log('Event created!');

    // get all the events
    Events.find({}, function (err, events) {
      if (err) next(err);

      // object of all the events
      // console.log(events);

      // log first event
      console.log(events[0]);

      //clear collection
      db.collection('events').drop(function () {
        db.close();
      });
    });
  });

  // SCHEMAS TESTING --------------------------

});



var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
