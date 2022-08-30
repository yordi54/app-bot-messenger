const express = require('express');
const bodyParser = require('body-parser');
const router = require('./routes/index');

const app = express();

//config
app.set('port', 3000 || process.env.PORT);
app.use(bodyParser.json());

//routes
app.use(router);

module.exports = app;