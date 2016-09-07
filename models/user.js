var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var User = new Schema({
  username: { type: String, unique: true, required: true },
  password: String,
  OauthId: String,
  OauthToken: String,
  status: String,
  firstname: { type: String, default: '' },
  lastname: { type: String, default: '' },
  admin:   { type: Boolean, default: false },
  email: { type: String, default: '' },
  userpic: { type: String, default: '' },
  dateOfBirth: { type: Date },
  friends: { type: [Schema.Types.ObjectId], ref: 'User' }
}, { timestamps: true });

User.methods.getName = function() {
  return (this.firstname + ' ' + this.lastname);
};

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);