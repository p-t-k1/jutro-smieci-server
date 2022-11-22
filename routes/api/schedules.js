var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var Schedule = mongoose.model('Schedule');
var auth = require('../auth');
const jwt_decode = require("jwt-decode");

//pobierz harmonogram z podanego id lokalizacji
router.post('/getById', function(req, res, next){
    console.log(req.body)
    Schedule.findOne({obszar : req.body.id}).populate('obszar').populate('firma', 'nazwa').then(function(schedule){
        if(!schedule){ return res.sendStatus(404); }

        return res.json({schedule});
    }).catch(next);
});

//edytuj harmonogram o podanym id
router.put('/edit', auth.required, function(req, res, next){
    Schedule.findById(req.body.id).then(function(schedule){
        if(!schedule){ return res.sendStatus(401); }

        // only update fields that were actually passed...
        if(typeof req.body.wywozy !== 'undefined'){
            schedule.wywozy = req.body.wywozy;
        }

        return schedule.save().then(function(){
            return res.sendStatus(200)
        });
    }).catch(next);
});

//utworz nowy harmonogram w bazie danych
router.post('/addNew', auth.required, function(req, res, next){
    console.log(req.body)
    let companyToken = auth.getTokenFromHeader(req);
    let decodedToken = jwt_decode(companyToken);
    let companyId = decodedToken.id

    let schedule = new Schedule();

    schedule.obszar = req.body.areaId;
    schedule.firma = companyId;
    schedule.wywozy = req.body.wywozy;

    schedule.save().then(function(){
        return res.sendStatus(200)
    }).catch(next);
});



module.exports = router;
