let config = require('./config')

let http = require('http'),
    path = require('path'),
    methods = require('methods'),
    express = require('express'),
    bodyParser = require('body-parser'),
    session = require('express-session'),
    cors = require('cors'),
    passport = require('passport'),
    errorhandler = require('errorhandler'),
    mongoose = require('mongoose');
    cron = require("node-cron");

let isProduction = config.stage === 'production';

// Create global app object
const app = express();

app.use(cors());

// Normal express config defaults
app.use(require('morgan')('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(require('method-override')());
app.use(express.static(__dirname + '/public'));

app.use(session({ secret: 'conduit', cookie: { maxAge: 60000 }, resave: false, saveUninitialized: false  }));

if (!isProduction) {
  app.use(errorhandler());
}

mongoose.connect(config.databaseUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
}, (error) => {
  if (error) {
    console.error(error);
  }
  else {
    console.info('Connection with database established');
  }
});

require('./models/User');
require('./models/Area');
require('./models/Company');
require('./models/Message');
require('./models/Schedule');
require('./config/passport');
const {notificationsToSend, numberOfNotificationsToSend, numberOfNotificationsToSendToday, sendTodaysNotifications} = require("./utils/notifications");

app.use(require('./routes'));

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (!isProduction) {
  app.use(function(err, req, res, next) {
    console.log(err.stack);

    res.status(err.status || 500);

    res.json({'errors': {
      message: err.message,
      error: err
    }});
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({'errors': {
    message: err.message,
    error: {}
  }});
});

// scheduling a task with node-cron
cron.schedule("*/15 * * * * *", async function () {
  console.log("\n---------------------");
  console.log("Liczba wszystkich powiadomień do rozesłania: " + await numberOfNotificationsToSend());
  console.log("Liczba powiadomień do rozesłania dzisiaj: " + await numberOfNotificationsToSendToday());
  await sendTodaysNotifications();
});

// finally, let's start our server...
let server = app.listen(config.port, function(){
  console.log('Listening on port ' + server.address().port);
});
