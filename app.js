// extern modules
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');

//local modules
var authenticate = require('./authenticate');
var config = require('./config.js');

//models
var Event = require('./models/event');
var User = require('./models/user');

// connection to db
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoUrl);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
  // we're connected
  console.log('Connected correctly to mongodb server');

  // DB seeding --------------------------

  // clear collections
  db.collection('events').drop(function () {});
  db.collection('users').drop(function () {});

  // create the Admin user
  User.register(new User({ username: "admin", admin: true, firstname: "Admin", lastname: "Admin", status: "@work" }), "password", function(err, user) {
    user.save(function(err,user) {
      // console.log(user);
    });
  });

  User.register(new User({ username: "steve", firstname: "Steve", lastname: "Jobs", status: "Great things in business are never done by one person. They're done by a team of people." }), "password", function(err, user) {
    user.save(function(err,user) {
    // console.log(user);
    });
  });

  User.register(new User({ username: "harvey", firstname: "Harvey", lastname: "Specter", status: "I don't pave the way for people... people pave the way for me." }), "password", function(err, user) {
    user.save(function(err,user) {
      // console.log(user);
    });
  });

  User.register(new User({ username: "albert", firstname: "Albert", lastname: "Einstein", status: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe." }), "password", function(err, user) {
    user.save(function(err,user) {

      // create a new event
      var event1 = Event({
        title: 'Moonlight Beach Party',
        description: 'When the sun, the beach, food and fun people get together, you cannot help but have a good time and make a ton of new friends.\
                      \nJoin us at the Moonlight Beach Party!',
        eventDate: new Date(Date.now() + 50 * 24*3600*1000),
        createdBy: user._id,
        ageRestrict: 18,
        place: {
          country: 'Somecountry',
          city: 'Somecity'
        },
        comments: [{
          body: 'The first comment', 
          postedBy: user._id}],
      });

      // add a comment
      event1.comments.push({
        body: 'Another stupid comment',
        postedBy: user._id
      });

      // save the event
      event1.save(function (err) {
        if (err) return next(err);
        console.log('Event created!');
        // get all the events
        // Event.find({}, function (err, events) {
        //   if (err) return next(err);
        // });
      });

    });
  });    

  User.register(new User({ username: "mark", firstname: "Mark", lastname: "Twain", status: "If you tell the truth, you don't have to remember anything." }), "password", function(err, user) {
    user.save(function(err,user) {

      // create an event
      Event.create({
        title: '8th Annual Bark in the Park',
        description: 'We hope you will join us for the 8th Annual Bark in the Park. There will be guest speakers and coaches, food, games, and shelter pups to play with!',
        eventDate: new Date(Date.now() + 27 * 24*3600*1000),
        createdBy: user._id
      });      

    });
  }); 

    //   db.close();

  // DB seeding --------------------------

});

var index = require('./routes/index');
var userRouter = require('./routes/userRouter');
var eventRouter = require('./routes/eventRouter');

var app = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'images/favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// passport init
app.use(passport.initialize());

//serving static data in folder
// app.use(express.static(path.join(__dirname, 'public')));

// development Angular folder (client-side)
if (app.get('env') === 'development') {
  // This will change in production since we'll be using the dist folder
  // This covers serving up the index page
  // app.use(express.static(path.join(__dirname, 'client/.tmp')));
  app.use(express.static(path.join(__dirname, 'client/app')));
  app.use(express.static(path.join(__dirname, 'client')));
}

// production Angular folder (client-side)
if (app.get('env') === 'production') {
  // changes it to use the optimized version for production
  app.use(express.static(path.join(__dirname, 'client/dist')));  
}

app.use('/', index);
app.use('/users', userRouter);
app.use('/events', eventRouter);

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
  console.log("we're now in the development mode");

  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
if (app.get('env') === 'production') {
  console.log("we're now in the production mode");

  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: {}
    });
  });
}


module.exports = app;
