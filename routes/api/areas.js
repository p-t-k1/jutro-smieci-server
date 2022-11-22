var mongoose = require('mongoose');
var router = require('express').Router();
var passport = require('passport');
var Area = mongoose.model('Area');
var auth = require('../auth');
var jwt_decode = require('jwt-decode');

router.get('/getCompanyAreas', auth.required, function(req, res, next){
    let companyToken = auth.getTokenFromHeader(req);
    let decodedToken = jwt_decode(companyToken);

    Area.find({firma: decodedToken.id}).populate('firma', 'nazwa').then(function(areas){
        if(!areas){ return res.sendStatus(401); }
        return res.send(areas);
    }).catch(next);
});

router.post('/addNew', auth.required, function(req, res, next){
    console.log(req.body)
    let companyToken = auth.getTokenFromHeader(req);
    let decodedToken = jwt_decode(companyToken);
    let companyId = decodedToken.id

    let area = new Area();

    area.miejscowosc = req.body.miejscowosc;
    area.ulica = req.body.ulica;
    area.kodpocztowy = req.body.kodpocztowy;
    area.komentarz = req.body.komentarz;
    area.firma = companyId;

    area.save().then(function(){
        return res.json({area: area.toAuthJSON()});
    }).catch(next);
});

router.delete('/delete', auth.required, function(req, res, next){
    let companyToken = auth.getTokenFromHeader(req);
    let decodedToken = jwt_decode(companyToken);

    let companyId = decodedToken.id
    var areaId = req.query.areaId;

    Area.findById(areaId).then(function(area){
        if (!area) { return res.sendStatus(401); }

        if(area.firma == companyId){
            area.remove();
            return res.sendStatus(200);
        }
    }).catch(next);
});

router.put('/edit', auth.required, function(req, res, next){
    Area.findById(req.body.id).then(function(area){
        if(!area){ return res.sendStatus(401); }

        // only update fields that were actually passed...
        if(typeof req.body.ulica !== 'undefined'){
            area.ulica = req.body.ulica;
        }
        if(typeof req.body.komentarz !== 'undefined'){
            area.komentarz = req.body.komentarz;
        }
        if(typeof req.body.miejscowosc !== 'undefined'){
            area.miejscowosc = req.body.miejscowosc;
        }
        if(typeof req.body.kodpocztowy !== 'undefined'){
            area.kodpocztowy = req.body.kodpocztowy;
        }

        return area.save().then(function(){
            return res.sendStatus(200)
        });
    }).catch(next);
});

router.get('/', function(req, res, next){
    Area.find({}).populate('firma', 'nazwa').then(function(areas){
        if(!areas){ return res.sendStatus(401); }

        return res.send(areas);
    }).catch(next);
});


module.exports = router;
