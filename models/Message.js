var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
var crypto = require('crypto');
var jwt = require('jsonwebtoken');
var secret = require('../config').secret;

var MessageSchema = new mongoose.Schema({
    email: {type: String, required: [true, "can't be blank"]},
    tytul: {type: String, required: [true, "can't be blank"]},
    tresc: {type: String, required: [true, "can't be blank"]},
    otwarta: {type: Boolean, default: false},
    obszar: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },
    firma: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },

}, {timestamps: true});

MessageSchema.plugin(uniqueValidator, {message: 'is already taken.'});

mongoose.model('Message', MessageSchema);
