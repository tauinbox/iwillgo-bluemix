// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  body:  {
    type: String,
    required: true
  },
  author:  {
    type: String
  }
}, {
    timestamps: true
});

var placeSchema = new Schema({
  country: {
    type: String
  },
  city: {
    type: String
  }
});

var eventSchema = new Schema({
    title: {
        type: String,
        required: true
        // unique: true
    },
    description: {
        type: String,
        required: true
    },
    createdBy: {
      type: [Schema.Types.ObjectId]
    },
    eventDate: {
      type: Date
    },
    ageRestrict: {
      type: Number,
      default: 0
    },
    joined: {
      type: [Schema.Types.ObjectId]
    },
    place: {
      type: [placeSchema]
    },
    comments: [commentSchema]
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Events = mongoose.model('Event', eventSchema);

// make this available to our Node applications
module.exports = Events;
