const mongoose = require("mongoose");
const moment = require("moment");
const {sendNotification} = require("./mailier");
let User = mongoose.model('User');

async function numberOfNotificationsToSend() {
  let count = 0;
  await User.find({}).then(async function (users) {
    users.map(user => {
      count += user.powiadomienia.length;
    })
  });
  return count
}

async function numberOfNotificationsToSendToday() {
  let count = 0;
  await User.find({}).then(async function (users) {
    users.map(user => {
      user.powiadomienia.map(powiadomienie => {
        if(moment().format("DD-MM-YYYY") == powiadomienie.data){
          count += 1;
        }
      })
    })
  });
  return count
}

async function sendTodaysNotifications() {
  await User.find({}).then(async function (users) {
    users.map(async user => {
      let userId = user._id
      let types = []
      let ids = []
      let ileWczesniej = user.ileWczesniej
      user.powiadomienia.map(async powiadomienie => {
        if (moment().format("DD-MM-YYYY") == powiadomienie.data) {
          types.push(powiadomienie.typ)
          ids.push(powiadomienie._id)
        }
      })
      if (types.length != 0) {
        // wyslij powiadomienie na email
        await sendNotification(user.email, types, ileWczesniej)

        // usun powiadomienie z bazy
        await User.update(
            {_id: userId},
            {$pull: {powiadomienia:{_id:{$in: ids}}}}
        )
      }
    })
  });
}


exports.numberOfNotificationsToSend = numberOfNotificationsToSend;
exports.numberOfNotificationsToSendToday = numberOfNotificationsToSendToday;
exports.sendTodaysNotifications = sendTodaysNotifications;
