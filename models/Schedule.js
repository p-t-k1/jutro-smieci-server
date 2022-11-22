var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

var ScheduleSchema = new mongoose.Schema({
  obszar: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },
  firma: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
  wywozy: [{
      dzien: { type: Number , required: true},
      miesiac: { type: Number , required: true},
      rok: { type: Number , required: true},
      typ: { type: String , required: true},
  }]
}, {timestamps: true});

ScheduleSchema.plugin(uniqueValidator, {message: 'is already taken.'});

mongoose.model('Schedule', ScheduleSchema);
