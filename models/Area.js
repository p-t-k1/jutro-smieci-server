let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');
let secret = require('../config').secret;

let AreaSchema = new mongoose.Schema({
  miejscowosc: {type: String, required: [true, "can't be blank"]},
  ulica: {type: String, required: [true, "can't be blank"]},
  kodpocztowy: {type: String, required: [true, "can't be blank"]},
  komentarz: {type: String, required: [true, "can't be blank"]},
  firma: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
}, {timestamps: true});

AreaSchema.plugin(uniqueValidator, {message: 'is already taken.'});

AreaSchema.methods.toAuthJSON = function(){
  return {
    miejscowosc: this.miejscowosc,
    ulica: this.ulica,
    kodpocztowy: this.kodpocztowy,
    komentarz: this.komentarz,
    firma: this.firma,
  };
};

mongoose.model('Area', AreaSchema);
