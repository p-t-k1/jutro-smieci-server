var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var User = mongoose.model('User');
var Area = mongoose.model('Area');
var Company = mongoose.model('Company');
var Schedule = mongoose.model('Schedule');
var auth = require('../auth');


router.post('/login', function(req, res, next){
  if(!req.body.user.email){
    return res.status(422).json({errors: {email: "can't be blank"}});
  }

  if(!req.body.user.password){
    return res.status(422).json({errors: {password: "can't be blank"}});
  }

  passport.authenticate('local', {session: false}, function(err, company, info){
    if(err){ return next(err); }

    if(company){
      company.token = company.generateJWT();
      return res.json({user: company.toAuthJSON()});
    } else {
      return res.status(422).json(info);
    }
  })(req, res, next);
});


module.exports = router;
