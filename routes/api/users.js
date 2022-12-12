var mongoose = require('mongoose');
const {sendVerificationEmail} = require("../../utils/mailier");
const secret = require('../../config').secret;
var jwt = require('jsonwebtoken');
const auth = require("../auth");
const jwt_decode = require("jwt-decode");
const moment = require("moment");
var router = require('express').Router();
var User = mongoose.model('User');
var Schedule = mongoose.model('Schedule');

router.post('/setNotification', function (req, res, next) {

    User.findOne({email: req.body.email}).then(async function (user) {
        let isNewUser = !user ? true : false;
        let userEmail = req.body.email;

        let token = jwt.sign({
            email: req.body.email,
            days: req.body.days,
            areaId: req.body.areaId,
            isNewUser: isNewUser
        }, secret)

        // wyslij maila z potwierdzeniem zmiany
        await sendVerificationEmail(userEmail, isNewUser, token)

        return res.send("Gotowe, kliknij w link wysłany na adres email aby potwierdzić")

    }).catch(next);
});

router.get('/verify', async function (req, res, next) {
    let token = req.query.token;
    let decodedToken = jwt.decode(token, secret);
    let getNotificationsDates = async (areaId, days) => {
        let notificationsDates = []
        await Schedule.findOne({obszar: areaId}).then(function (schedule) {
            if (!schedule) {
                return res.sendStatus(404);
            }
            schedule.wywozy.map(element => {
                let formattedDate = moment(new Date(`${element.rok}-${element.miesiac}-${element.dzien}`)).subtract(days.substring(0, 1), 'days').format('DD-MM-YYYY');
                //console.log("formattedDate: " + new Date(formattedDate.split('-').reverse().join('-')))
                //console.log("today: " + new Date(moment().format('MM-DD-YYYY')))
                //console.log(moment(formattedDate.toString()).format('MM-DD-YYYY') >= moment().format('MM-DD-YYYY'))
                if(new Date(formattedDate.split('-').reverse().join('-')) >= new Date(moment().format('MM-DD-YYYY'))) {
                    notificationsDates.push({data: formattedDate, typ: element.typ})
                }
            })
            return notificationsDates
        });
        return await notificationsDates
    }

    if (decodedToken.isNewUser) {
        let user = new User();
        user.email = decodedToken.email
        user.ileWczesniej = decodedToken.days
        user.area = decodedToken.areaId
        user.powiadomienia = await getNotificationsDates(decodedToken.areaId, decodedToken.days)
        user.save().catch((error) => {
                //When there are errors We handle them here
                console.log(error);
        })
    } else {
        User.findOne({email: decodedToken.email}).then(async function (user) {
            user.email = decodedToken.email
            user.ileWczesniej = decodedToken.days
            user.area = decodedToken.areaId
            user.powiadomienia = await getNotificationsDates(decodedToken.areaId, decodedToken.days)
            user.save()
        });
    }


    return res.send("Potwierdzono!")
});

module.exports = router;
