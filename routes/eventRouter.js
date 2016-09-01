var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
var Event = require('../models/event');

var Verify = require('./verify');

var eventRouter = express.Router();

eventRouter.use(bodyParser.json());

eventRouter.route('/')
.get(function(req, res, next) {
  Event.find({}, function(err, events) {
    if (err) return next(err);
    res.json(events);
  });
})

.post(Verify.verifyOrdinaryUser, function(req, res, next) {
  req.body.createdBy = req.decoded._id;
  Event.create(req.body, function(err, event) {
    if (err) return next(err);
    console.log('Event created!');
    // var id = event._id;
    // res.writeHead(200, {'Content-Type': 'text/plain'});
    // res.end('Added the event with id: ' + id);
    res.json(event);
  });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Event.remove({}, function(err, resp) {
    if (err) return next(err);
    res.json(resp);
  });
});

//////////////////////////////////////////////

eventRouter.route('/:eventId')
.get(Verify.verifyOrdinaryUser, function(req, res, next) {
  Event.findById(req.params.eventId, function(err, event) {
    if (err) return next(err);
    res.json(event);
  });
})

// .put(Verify.verifyOrdinaryUser, function(req, res, next) {
//   Event.findByIdAndUpdate(req.params.eventId, {$set: req.body}, {new: true}, function(err, event) {
//     if (err) return next(err);
//     res.json(event);
//   });
// })
.put(Verify.verifyOrdinaryUser, function(req, res, next) {
  Event.findById(req.params.eventId, function(err, event) {
    if (err) return next(err);
    if (event.id(req.params.eventId).createdBy != req.decoded._id) {
      var err = new Error('You are not authorized to perform this operation!');
      err.status = 403;
      return next(err);
    }
    event.save(function (err, event) {
      if (err) return next(err);
      console.log('Event updated!');
      res.json(event);
    });    
  });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Event.findByIdAndRemove(req.params.eventId, function(err, resp) {        
    if (err) return next(err);
    res.json(resp);
  });
});

//////////////// HANDLING COMMENTS (nested object) /////////////////////

eventRouter.route('/:eventId/comments')
.get(Verify.verifyOrdinaryUser, function(req, res, next) {
  Event.findById(req.params.eventId, function(err, event) {
    if (err) return next(err);
    res.json(event.comments);
  });
})

// I've kept ability for ordinary users to leave their comments :)
.post(Verify.verifyOrdinaryUser, function(req, res, next) {
  Event.findById(req.params.eventId, function(err, event) {
    if (err) return next(err);
    event.comments.push(req.body);
    event.save(function(err, event) {
      if (err) return next(err);
      console.log('Updated Comments!');
      res.json(event);
    });
  });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Event.findById(req.params.eventId, function(err, event) {
    if (err) return next(err);
    for (var i = (event.comments.length - 1); i >= 0; i--) {
      event.comments.id(event.comments[i]._id).remove();
    }
    event.save(function(err, result) {
      if (err) return next(err);
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end('Deleted all comments!');
    });
  });
});

/////////// HANDLING PARTICULAR COMMENT (nested object) ////////////////

eventRouter.route('/:eventId/comments/:commentId')
.get(Verify.verifyOrdinaryUser, function(req, res, next) {
  Event.findById(req.params.eventId, function(err, event) {
    if (err) return next(err);
    res.json(event.comments.id(req.params.commentId));
  });
})

.put(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  // We delete the existing commment and insert the updated
  // comment as a new comment
  Event.findById(req.params.eventId, function(err, event) {
    if (err) return next(err);
    event.comments.id(req.params.commentId).remove();
    event.comments.push(req.body);
    event.save(function(err, event) {
      if (err) return next(err);
      console.log('Updated Comments!');
      res.json(event);
    });
  });
})

.delete(Verify.verifyOrdinaryUser, Verify.verifyAdmin, function(req, res, next) {
  Event.findById(req.params.eventId, function(err, event) {
    event.comments.id(req.params.commentId).remove();
    event.save(function (err, resp) {
      if (err) return next(err);
      res.json(resp);
    });
  });
});

module.exports = eventRouter;