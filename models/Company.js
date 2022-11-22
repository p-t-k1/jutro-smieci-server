var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

var CompanySchema = new mongoose.Schema({
  nazwa: {type: String, required: [true, "can't be blank"]},
  email: {type: String, lowercase: true, unique: true, required: [true, "can't be blank"], match: [/\S+@\S+\.\S+/, 'is invalid'], index: true},
  hash: {type: String, required: [true, "can't be blank"]},
  salt: {type: String, required: [true, "can't be blank"]},
  obszary: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Area' }],
  wywozy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Schedule' }],
}, {timestamps: true});

CompanySchema.plugin(uniqueValidator, {message: 'is already taken.'});

CompanySchema.methods.generateJWT = function() {
  var today = new Date();
  var exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return jwt.sign({
    id: this._id,
    nazwa: this.nazwa,
    exp: parseInt(exp.getTime() / 1000),
  }, secret);
};

CompanySchema.methods.toAuthJSON = function(){
  return {
    nazwa: this.nazwa,
    token: this.generateJWT(),
  };
};

CompanySchema.methods.validPassword = function(password) {
  var hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return this.hash === hash;
};


mongoose.model('Company', CompanySchema);
