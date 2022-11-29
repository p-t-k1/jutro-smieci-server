var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var Message = mongoose.model('Message');
var auth = require('../auth');
var jwt_decode = require('jwt-decode');

router.post('/addNew', function(req, res, next){

    let message = new Message();
    message.firma = req.body.area.firma._id;
    message.obszar = req.body.area._id;
    message.email = req.body.email;
    message.tytul = req.body.title;
    message.tresc = req.body.message;

    message.save().then(function(){
        return res.sendStatus(200);
    }).catch(next);

});

router.get('/getCompanyMessages', auth.required, function(req, res, next){
    let companyToken = auth.getTokenFromHeader(req);
    let decodedToken = jwt_decode(companyToken);

    Message.find({firma: decodedToken.id}).populate('obszar').then(function(messages){
        if(!messages){ return res.sendStatus(401); }
        return res.send(messages);
    }).catch(next);
});

router.get('/getCompanyMessagesAmount', auth.required, function(req, res, next){
    let companyToken = auth.getTokenFromHeader(req);
    let decodedToken = jwt_decode(companyToken);

    Message.count({firma: decodedToken.id, otwarta: false}).then(function(messages){
        if(!messages){ return res.send({amount: 0}); }
        return res.send({amount: messages});
    }).catch(next);
});

router.delete('/delete', auth.required, function(req, res, next){
    let companyToken = auth.getTokenFromHeader(req);
    let decodedToken = jwt_decode(companyToken);

    let companyId = decodedToken.id
    let messageId = req.query.messageId;

    Message.findById(messageId).then(function(message){
        if (!message) { return res.sendStatus(401); }

        if(message.firma == companyId){
            message.remove();
            return res.sendStatus(200);
        }
    }).catch(next);
});

router.post('/open', auth.required, function(req, res, next){

    let messageId = req.query.messageId;
    Message.findById(messageId).then(function (message){
        if(message.otwarta == false) {
            message.otwarta = true;
            message.save();
            return res.sendStatus(200);
        }
    }).catch(next);

});



module.exports = router;
