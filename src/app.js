require('dotenv').config();
require('pretty-error').start();

const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');

const app = express();

const session = require('./libs/session')(app);
const { passport } = require('./libs/passport');
const usersRoute = require('./routes/users');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan('dev'));
app.use(usersRoute);

module.exports = app;
