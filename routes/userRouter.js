var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var Verify    = require('./verify');

/* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

router.route('/')
.get(Verify.verifyOrdinaryUser, function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) return next(err);
    res.json(users);
  });
})
;

router.post('/register', function(req, res) {
  User.register(new User({ username : req.body.username }), req.body.password, function(err, user) {
    if (err) return res.status(500).json({err: err});
    if(req.body.firstname) user.firstname = req.body.firstname;
    if(req.body.lastname) user.lastname = req.body.lastname;

    user.save(function(err,user) {
      passport.authenticate('local')(req, res, function() {
        return res.status(200).json({status: 'Registration Successful!'});
      });
    });
  });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    // console.log(req.body);
    // console.log(user);
    if (err) return next(err);
    if (!user) return res.status(401).json({ err: info });

    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
        
      // var token = Verify.getToken(user);
      var token = Verify.getToken({ "username": user.username, "_id": user._id, "admin": user.admin });
      res.status(200).json({
        status: 'Login successful!',
        success: true,
        userid: user._id,
        token: token
      });
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({ status: 'Bye!' });
});

// router.get('/facebook', passport.authenticate('facebook'), function(req, res){});

// router.get('/facebook/callback', function(req, res, next) {
//   passport.authenticate('facebook', function(err, user, info) {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       return res.status(401).json({err: info});
//     }
//     req.logIn(user, function(err) {
//       if (err) {
//         return res.status(500).json({err: 'Could not log in user'});
//       }
//       var token = Verify.getToken(user);
//       res.status(200).json({status: 'Login successful!', success: true, token: token});
//     });
//   })(req, res, next);
// });

router.route('/:userId/friends')
.get(Verify.verifyOrdinaryUser, function(req, res, next) {
  User.findById(req.params.userId, function(err, user) {
    if (err) return next(err);
    res.json(user.friends);
  });
})

.post(Verify.verifyOrdinaryUser, function(req, res, next) {
  User.findById(req.params.userId, function(err, user) {
    if (err) return next(err);
    user.friends.push(req.body);
    user.save(function(err, user) {
      if (err) return next(err);
      console.log('Added new friend!');
      res.json(user);
    });    
  });
})
;

router.route('/:userId')
.get(Verify.verifyOrdinaryUser, function(req, res, next) {
  User.findById(req.params.userId, function(err, user) {
    if (err) return next(err);
    // console.log(user);
    if (req.params.userId != req.decoded._id) {
      var err = new Error('You are not authorized to perform this operation!');
      err.status = 403;
      return next(err);
    }    
    res.json(user);
  });
})

.put(Verify.verifyOrdinaryUser, function(req, res, next) {
  User.findById(req.params.userId, function(err, user) {
    if (err) return next(err);
    if (req.params.userId != req.decoded._id) {
      var err = new Error('You are not authorized to perform this operation!');
      err.status = 403;
      return next(err);
    }
    // update fields from req.body
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.email = req.body.email;
    user.status = req.body.status;

    user.save(function (err, user) {
      if (err) return next(err);
      console.log('User updated!');
      res.json(user);
    });    
  });
})
;

module.exports = router;
