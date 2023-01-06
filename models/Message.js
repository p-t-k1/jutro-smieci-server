let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');
let crypto = require('crypto');
let jwt = require('jsonwebtoken');
let secret = require('../config').secret;

let MessageSchema = new mongoose.Schema({
    email: {type: String, required: [true, "can't be blank"]},
    tytul: {type: String, required: [true, "can't be blank"]},
    tresc: {type: String, required: [true, "can't be blank"]},
    otwarta: {type: Boolean, default: false},
    obszar: { type: mongoose.Schema.Types.ObjectId, ref: 'Area' },
    firma: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },

}, {timestamps: true});

MessageSchema.plugin(uniqueValidator, {message: 'is already taken.'});

mongoose.model('Message', MessageSchema);
