const express = require("express");
const bodyParser = require("body-parser");
const registerRoute = require("./routes/register");

const port = 3000;
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(registerRoute);

app.listen(port);
