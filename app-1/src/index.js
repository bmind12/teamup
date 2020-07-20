const express = require('express');
const bodyParser = require('body-parser');
const usersRoute = require('./routes/users');

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(usersRoute);

app.listen(port);
