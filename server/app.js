const GoogleAssistant = require('google-assistant');
const express = require('express');
const bodyParser = require('body-parser');
const { FileWriter } = require('wav');

const startConversation = require('./assistant.js');
const routes = require('./routes.js');
const dashboard = require('./dashboard.js');
const audio = require('./audio.js');

const { configureUsers } = require('./configuration');
const { setupConfigVar } = require('./configuration');
const { setupAssistant } = require('./assistant');
const { sendTextInput } = require('./assistant');

const app = express();
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);

app.set('views', `${__dirname}/views`);
app.use(bodyParser.json());

app.use(function(req, res, next) {
  const d = new Date();
  const now = d.getHours();
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  if (
    global.config.quietHours !== undefined &&
    (global.config.quietHours.start <= now ||
      global.config.quietHours.end >= now)
  ) {
    console.log(
      `Got a command during quiet hours (start: ${
        global.config.quietHours.start
      }, end: ${global.config.quietHours.end} now: ${now}). Ignoring.`
    );
    res.status(420).send("Dude, chill, it's quiet time!");
    return;
  }
  next();
});

app.use('/', routes);
app.use('/dashboard', dashboard);
app.use('/audio', audio);

// Configure users on first run
configureUsers()
  .then(config => {
    global.config = config;
    app.listen(global.config.port);
    return setupAssistant();
  })
  .catch(e => {
    console.log(e);
  });
