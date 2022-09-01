const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/index');

const app = express();

//config
app.set('port',process.env.PORT || 8000);
app.use(bodyParser.json());

//routes
app.use(router);

module.exports = app;