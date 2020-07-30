require('dotenv').config();
require('pretty-error').start();

const express = require('express');
const bodyParser = require('body-parser');
const usersRoute = require('./routes/users');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(usersRoute);

module.exports = app;
