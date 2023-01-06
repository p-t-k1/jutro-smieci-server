let mongoose = require('mongoose');
let router = require('express').Router();
let passport = require('passport');
let User = mongoose.model('User');
let Area = mongoose.model('Area');
let Company = mongoose.model('Company');
let Schedule = mongoose.model('Schedule');
let auth = require('../auth');


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
